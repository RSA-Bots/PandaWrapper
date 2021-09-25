import type { ApplicationCommandData, ApplicationCommandPermissionData } from "discord.js";
import { WrappedClient } from ".";

export class Payload {
	private static guildPayload: { [index: string]: ApplicationCommandData[] } = {};
	private static globalPayload: ApplicationCommandData[] = [];
	private static permissions: { [index: string]: ApplicationCommandPermissionData[] } = {};

	static addGuildPayload(
		guildId: string,
		commandData: ApplicationCommandData,
		permissionData?: ApplicationCommandPermissionData[]
	): void {
		const payload = this.guildPayload[guildId] ?? [];
		payload.push(commandData);
		this.guildPayload[guildId] = payload;
		if (permissionData && permissionData.length > 0) {
			this.permissions[commandData.name] = permissionData;
		}
	}

	static addGlobalPayload(commandData: ApplicationCommandData): void {
		this.globalPayload.push(commandData);
		// globalPermissions?
	}

	static pushPayloads(): void {
		const client = WrappedClient.getClient();
		if (!client) throw new Error("No client created.");

		const app = client.application;
		if (!app) throw new Error("Client not logged in, unable to push payloads.");

		app.commands.set(this.globalPayload).catch(console.error.bind(console));

		client.guilds.cache.forEach(guild => {
			const guildId = guild.id;
			const payload = this.guildPayload[guildId];

			if (payload && payload.length > 0) {
				const commands = guild.commands;
				if (commands) {
					commands
						.set(payload)
						.then(loadedCommands => {
							loadedCommands.forEach(command => {
								const perms = this.permissions[command.name];

								if (perms) {
									commands.permissions
										.set({ command: command.id, permissions: perms })
										.catch(console.error.bind(console));
								} else {
									if (!command.defaultPermission) {
										console.warn(
											`No permissions to load for ${command.name}. [Command inaccessible?]`
										);
									}
								}
							});
						})
						.catch(console.error.bind(console));
				}
			}
		});
	}
}
