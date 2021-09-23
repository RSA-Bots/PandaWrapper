import {
	ButtonInteraction,
	Client,
	ClientEvents,
	ContextMenuInteraction,
	Intents,
	Interaction,
	Message,
	SelectMenuInteraction,
} from "discord.js";
import { pushPayloads } from "..";
import type { ClientEvent } from "../interface/clientEvent";
import type { ContextCommand, MessageCommand, SlashCommand } from "./interfaces";
import { addGlobalPayload, addGuildPayload } from "./payload";

let instanceClient: Client | undefined;
let instancePrefix = "!";
let hasLoggedIn = false;
const messageCommands: { [index: string]: MessageCommand } = {};
const slashCommands: { [index: string]: SlashCommand } = {};
const contextMenus: { [index: string]: (interaction: ContextMenuInteraction) => void } = {};
const buttons: { [index: string]: (interaction: ButtonInteraction) => void } = {};
const menus: { [index: string]: (interaction: SelectMenuInteraction) => void } = {};

/**
 *
 * @param prefix A prefix to assign to the bot. (default: "!")
 * @param intents A list of intents to enable on the client. (default: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS])
 * @returns Client that has been created
 */
function createClient(
	prefix?: string,
	intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
): Client {
	if (prefix) instancePrefix = prefix;
	instanceClient = new Client({ intents });

	return instanceClient;
}

/**
 *
 * @param token Required token to login the client
 * @returns Client that has been logged in
 */
function loginClient(token: string): Client {
	if (!instanceClient) throw new Error("No client has been created yet.");
	if (!token) throw new Error("No token provided.");

	instanceClient
		.login(token)
		.then(() => (hasLoggedIn = true))
		.catch(console.error.bind(console));

	registerEvent({
		name: "messageCreate",
		once: false,
		callback: (message: Message) => {
			const args = message.content.split(" ");
			const command = args.shift();

			if (command && command.startsWith(instancePrefix)) {
				const messageCommandData = messageCommands[command.substring(instancePrefix.length)];

				if (messageCommandData != undefined) {
					const author = message.member;
					if (!author) return;

					// flag check
					const flags = messageCommandData.permissions.flags;
					if (flags && author.permissions.toArray().some(perm => flags.has(perm))) {
						messageCommandData.callback(message, args);
						return;
					}

					// role check
					const allowed = messageCommandData.permissions.allowed;
					const denied = messageCommandData.permissions.denied;

					const hasPermission = author.roles.cache.some(role => allowed.has(role.id));
					const isDenied = denied == undefined ? false : author.roles.cache.some(role => denied.has(role.id));

					if (isDenied) return;
					if (hasPermission) {
						messageCommandData.callback(message, args);
						return;
					}
				}
			}
		},
	});

	registerEvent({
		name: "interactionCreate",
		once: false,
		callback: (interaction: Interaction) => {
			if (interaction.isCommand()) {
				const command = slashCommands[interaction.commandName];

				if (command != undefined) {
					command.callback(interaction, command.buttons, command.selects);
				} else {
					interaction
						.reply("No callback has been assigned to this interaction.")
						.catch(console.error.bind(console));
				}
			} else if (interaction.isContextMenu()) {
				const commandCallback = contextMenus[interaction.commandName];

				if (commandCallback != undefined) {
					commandCallback(interaction);
				} else {
					interaction
						.reply("No callback has been assigned to this interaction.")
						.catch(console.error.bind(console));
				}
			} else if (interaction.isButton()) {
				const commandCallback = buttons[interaction.customId];

				if (commandCallback != undefined) {
					commandCallback(interaction);
				} else {
					interaction
						.reply("No callback has been assigned to this interaction.")
						.catch(console.error.bind(console));
				}
			} else if (interaction.isSelectMenu()) {
				const commandCallback = menus[interaction.customId];

				if (commandCallback != undefined) {
					commandCallback(interaction);
				} else {
					interaction
						.reply("No callback has been assigned to this interaction.")
						.catch(console.error.bind(console));
				}
			}
		},
	});

	registerEvent({
		name: "ready",
		once: true,
		callback: () => {
			console.log("Client logged in.");
			pushPayloads();
		},
	});

	return instanceClient;
}

/**
 *
 * @returns a Client or undefined if no client has been created.
 */
function getClient(): Client | undefined {
	return instanceClient;
}

/**
 *
 * @returns the Prefix (default "!")
 */
function getPrefix(): string {
	return instancePrefix;
}

/**
 *
 * @param event
 * @returns EventRegisterResult - Can be used if needing to attempt a register after failing
 */
function registerEvent<K extends keyof ClientEvents>(event: ClientEvent<K>): EventRegisterResult {
	if (!instanceClient) return { status: false, message: `No client to register events to.` };
	if (hasLoggedIn && event.name === "ready")
		return {
			status: false,
			message: `Client has already been logged in. Registration of this event now would render no results.`,
		};

	if (event.once) {
		instanceClient.once(event.name, event.callback);
	} else {
		instanceClient.on(event.name, event.callback);
	}

	return { status: true, message: `Successfully registered ${event.name}` };
}

/**
 *
 * @param command
 */
function registerMessageCommand(command: MessageCommand): void {
	messageCommands[command.name] = command;
}

function registerCommand(command: SlashCommand | ContextCommand): void {
	const name = command.data.name;
	if (name.toLowerCase() != name) {
		console.warn("name must be lowercase.");
		return;
	}

	if (command.permissions && command.permissions.permissions.length > 0) {
		command.data.defaultPermission = false;
	}

	if (command.guildConfig && command.guildConfig.guildId) {
		addGuildPayload(command.guildConfig.guildId, command.data, command.permissions?.permissions);
	} else {
		addGlobalPayload(command.data);
	}

	if (!command.data.type || (command.data.type != "MESSAGE" && command.data.type != "USER")) {
		console.log(`${name} is slash-command`);
		//slash-command
		slashCommands[name] = command as SlashCommand;
	} else if (command.data.type && (command.data.type == "MESSAGE" || command.data.type == "USER")) {
		console.log(`${name} is context-command`);
		//context menu
		contextMenus[name] = command.callback as (interaction: ContextMenuInteraction) => void;
	}
}

function registerSlashCommand(command: SlashCommand): void {
	registerCommand(command);
	if (command.messageData) {
		registerMessageCommand({
			name: command.data.name,
			callback: command.messageData.callback,
			permissions: command.messageData.permission,
		});
	}
	if (command.contextData) {
		registerContextCommand({
			data: { name: command.data.name, type: command.contextData.type },
			callback: command.contextData.callback,
			guildConfig: command.guildConfig,
			permissions: command.permissions,
		});
	}
	if (command.buttons && command.buttons.length > 0) {
		//registerButtons
		for (const buttonRef of command.buttons) {
			if (buttonRef.button.customId) {
				buttons[buttonRef.button.customId] = buttonRef.callback;
			} else {
				console.warn("Could not register button: {}", buttonRef);
			}
		}
	}
	if (command.selects && command.selects.length > 0) {
		//registerMenus
		for (const menuRef of command.selects) {
			if (menuRef.menu.customId) {
				menus[menuRef.menu.customId] = menuRef.callback;
			} else {
				console.warn("Could not register select menu: {}", menuRef);
			}
		}
	}
}

function registerContextCommand(command: ContextCommand): void {
	registerCommand(command);
}

interface EventRegisterResult {
	status: boolean;
	message: string;
}

export {
	createClient,
	loginClient,
	getClient,
	getPrefix,
	registerEvent,
	registerContextCommand,
	registerMessageCommand,
	registerSlashCommand,
};
