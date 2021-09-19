import {
	Client,
	ClientEvents,
	CommandInteraction,
	ContextMenuInteraction,
	Intents,
	Interaction,
	Message,
} from "discord.js";
import type { ClientEvent } from "../interface/clientEvent";
import type { ContextMenu } from "../interface/contextMenu";
import type { MessageCommand } from "../interface/messageCommand";
import type { SlashCommand } from "../interface/slashCommand";
import { addGlobalPayload, addGuildPayload } from "./payload";

let instanceClient: Client | undefined;
let instancePrefix = "!";
let hasLoggedIn = false;
const messageCommands: { [index: string]: MessageCommand } = {};
const slashCommands: { [index: string]: (interaction: CommandInteraction) => void } = {};
const contextMenus: { [index: string]: (interaction: ContextMenuInteraction) => void } = {};

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
					if (flags && author.permissions.toArray().some(perm => flags.has(perm)))
						messageCommandData
							.callback(message, args)
							.catch(err => message.reply(String(err)).catch(console.error.bind(console)));

					// role check
					const allowed = messageCommandData.permissions.allowed;
					const denied = messageCommandData.permissions.denied;

					const hasPermission = author.roles.cache.some(role => allowed.has(role.id));
					const isDenied = denied == undefined ? false : author.roles.cache.some(role => denied.has(role.id));

					if (isDenied) return;
					if (hasPermission)
						messageCommandData
							.callback(message, args)
							.catch(err => message.reply(err).catch(console.error.bind(console)));
				}
			}
		},
	});

	registerEvent({
		name: "interactionCreate",
		once: false,
		callback: (interaction: Interaction) => {
			if (interaction.isCommand()) {
				const commandCallback = slashCommands[interaction.commandName];

				if (commandCallback != undefined) {
					commandCallback(interaction);
				}
			} else if (interaction.isContextMenu()) {
				const commandCallback = slashCommands[interaction.commandName];

				if (commandCallback != undefined) {
					commandCallback(interaction);
				}
			}
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

function registerSlashCommand(command: SlashCommand): void {
	if (command.name.toLowerCase() != command.name) {
		console.warn("name must be lowercase.");
		return;
	}

	if (command.permissions && command.permissions.permissions.length > 0) {
		command.data.defaultPermission = false;
	}

	if (command.guildId) {
		addGuildPayload(command.guildId, command.data, command.permissions?.permissions);
	} else {
		addGlobalPayload(command.data);
	}
	slashCommands[command.name] = command.callback;
}

function registerContextMenu(command: ContextMenu): void {
	if (command.name.toLowerCase() != command.name) {
		console.warn("name must be lowercase.");
		return;
	}

	if (command.guildId) {
		addGuildPayload(command.guildId, command.data);
	} else {
		addGlobalPayload(command.data);
	}
	contextMenus[command.name] = command.callback;
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
	registerMessageCommand,
	registerSlashCommand,
	registerContextMenu,
};
