import { Client, ClientEvents, Intents, Interaction, Message, User } from "discord.js";
import type { ButtonCommand } from "../command/interaction/ButtonCommand";
import { ContextMenuCommand } from "../command/interaction/ContextMenuCommand";
import type { SelectMenuCommand } from "../command/interaction/SelectMenuCommand";
import type { MessageCommand } from "../command/MessageCommand";
import { SlashCommand } from "../command/slash/SlashCommand";
import type { ButtonCallback, ContextMenuCallback, SelectMenuCallback, SlashCommandCallback } from "../types";
import { ClientEvent } from "./ClientEvent";
import { Payload } from "./Payload";

export class WrappedClient {
	private static client: Client;
	private prefix = "!";
	private messageCommands: { [index: string]: MessageCommand } = {};
	private commands: { [index: string]: SlashCommand | ContextMenuCommand | ButtonCommand | SelectMenuCommand } = {};

	constructor(
		prefix?: string,
		intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
	) {
		if (prefix) {
			this.prefix = prefix;
		}

		WrappedClient.client = new Client({ intents });
	}

	static getClient(): Client {
		return WrappedClient.client;
	}

	setPrefix(prefix: string): void {
		this.prefix = prefix;
	}

	getPrefix(): string {
		return this.prefix;
	}

	async login(token: string): Promise<void> {
		await WrappedClient.client.login(token);

		this.registerEvent(
			new ClientEvent("ready", true).setCallback(() => {
				console.log("Client logged in!");
				Payload.pushPayloads();
			})
		);

		this.registerEvent(
			new ClientEvent("messageCreate", false).setCallback(async (message: Message) => {
				const args = message.content.split(" ");
				const command = args.shift();

				if (command && command.startsWith(this.prefix)) {
					const commandData = this.messageCommands[command.substring(this.prefix.length)];

					if (commandData) {
						const author = message.member;
						if (!author) return;
						if (author.user.bot) return;

						const callback = commandData.getCallback();
						if (!callback) return;

						const permissions = commandData.getPermissions();
						if (!permissions) {
							await callback(message, args);
							return;
						}

						const flags = permissions.flags;
						if (flags && author.permissions.toArray().some(perm => flags.has(perm))) {
							await callback(message, args);
							return;
						}

						const allowed = permissions.allowed;
						const denied = permissions.denied;
						if (!allowed && !denied) {
							await callback(message, args);
							return;
						}

						if (denied && author.roles.cache.some(role => denied.has(role.id))) return;
						if (allowed && author.roles.cache.some(role => allowed.has(role.id))) {
							await callback(message, args);
							return;
						}
					}
				}
			})
		);

		this.registerEvent(
			new ClientEvent("interactionCreate", false).setCallback(async (interaction: Interaction) => {
				let callback = undefined;

				if (interaction.isCommand()) {
					callback = this.commands[interaction.commandName].getCallback() as SlashCommandCallback;
					if (callback) {
						await callback(interaction, interaction.options["_hoistedOptions"]);
					}
				}
				if (interaction.isButton()) {
					callback = this.commands[interaction.customId].getCallback() as ButtonCallback;
					if (callback) {
						await callback(interaction);
					}
				}
				if (interaction.isContextMenu()) {
					callback = this.commands[interaction.commandName].getCallback() as ContextMenuCallback;
					if (callback) {
						let target: Message | User | undefined = undefined;

						const guild = interaction.guild;
						if (guild) {
							switch (interaction.targetType) {
								case "USER": {
									const member = guild.members.cache.get(interaction.targetId);
									if (member) target = member.user;
									break;
								}
								case "MESSAGE": {
									const channel = interaction.channel;
									if (channel) target = channel.messages.cache.get(interaction.targetId);
									break;
								}
							}
						}

						await callback(interaction, target);
					}
				}
				if (interaction.isSelectMenu()) {
					callback = this.commands[interaction.customId].getCallback() as SelectMenuCallback;
					if (callback) {
						await callback(interaction, interaction.values);
					}
				}
			})
		);
	}

	registerEvent<K extends keyof ClientEvents>(event: ClientEvent<K>): boolean {
		if (event.callback) {
			if (event.once) {
				console.log(`Registered ${event.name} as once.`);
				WrappedClient.client.once(event.name, event.callback);
			} else {
				console.log(`Registered ${event.name} as on.`);
				WrappedClient.client.on(event.name, event.callback);
			}
		}
		return false;
	}

	registerMessageCommand(command: MessageCommand): boolean {
		if (this.messageCommands[command.getName()]) {
			console.warn(`A command with name [${command.getName()}] already exists.`);
			return false;
		}
		if (!command.getCallback()) {
			console.warn(`${command.getName()} does not have a callback set.`);
			return false;
		}

		this.messageCommands[command.getName()] = command;
		return true;
	}

	registerCommandObject(
		...newCommands: (SlashCommand | ButtonCommand | SelectMenuCommand | ContextMenuCommand)[]
	): boolean {
		for (const command of newCommands) {
			const commandName = command.getName();
			if (this.commands[commandName]) {
				console.warn(`A command with name [${commandName}] already exists.`);
				return false;
			}

			if (!command.getCallback()) {
				console.warn(`${commandName} does not have a callback set.`);
				return false;
			}

			this.commands[commandName] = command;

			if (command instanceof SlashCommand || command instanceof ContextMenuCommand) {
				const guildId = command.getGuildId();

				if (command instanceof ContextMenuCommand) {
					if (guildId) {
						Payload.addGuildPayload(guildId, command.getData(), command.getPermissions());
						return true;
					} else {
						console.warn(
							`Must load a ContextMenu to a guild. [No guildId provided for ${command.getName()}`
						);
						return false;
					}
				} else {
					const guildId = command.getGuildId();
					if (command.getGlobal()) {
						Payload.addGlobalPayload(command.getData());
						return true;
					}
					if (!command.getGlobal() && guildId == undefined) {
						Payload.addExtraGuildPayload(command.getData(), command.getPermissions());
						return true;
					}
					if (guildId != undefined) {
						Payload.addGuildPayload(guildId, command.getData(), command.getPermissions());
						return true;
					}
				}
			}
		}

		return true;
	}
}
