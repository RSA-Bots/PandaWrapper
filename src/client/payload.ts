import type { ApplicationCommandData, ApplicationCommandPermissionData } from "discord.js";
import { getClient } from "..";

const guildPayload: { [index: string]: ApplicationCommandData[] } = {};
const globalPayload: ApplicationCommandData[] = [];
const permissionData: { [index: string]: ApplicationCommandPermissionData[] } = {};

function addGuildPayload(
	guildId: string,
	commandData: ApplicationCommandData,
	permissions?: ApplicationCommandPermissionData[]
): void {
	const payload = guildPayload[guildId] ?? [];
	payload.push(commandData);
	guildPayload[guildId] = payload;
	if (permissions && permissions.length > 0) {
		permissionData[commandData.name] = permissions;
	}
}

function addGlobalPayload(commandData: ApplicationCommandData): void {
	globalPayload.push(commandData);
}

function pushPayloads(): void {
	const client = getClient();
	if (!client) throw new Error("No client created.");

	const app = client.application;
	if (!app) throw new Error("Client not logged in. Unable to push payloads.");

	app.commands.set(globalPayload).catch(console.error.bind(console));

	client.guilds.cache.forEach(guild => {
		const guildId = guild.id;
		const payload = guildPayload[guildId];

		if (payload != undefined && payload.length > 0) {
			const commands = guild.commands;
			if (commands) {
				commands
					.set(payload)
					.then(loadedCommands => {
						loadedCommands.forEach(command => {
							const perms = permissionData[command.name];

							if (perms) {
								commands.permissions
									.set({ command: command.id, permissions: perms })
									.catch(console.error.bind(console));
							} else {
								if (command.defaultPermission) {
									console.warn(`No permissions to load for ${command.name}. [Command inaccessible?]`);
								}
							}
						});
					})
					.catch(console.error.bind(console));
			} else {
				console.warn(`Failed to set commands for ${guildId}.`);
			}
		}
	});
}

export { pushPayloads, addGlobalPayload, addGuildPayload };
