import type { ApplicationCommandData } from "discord.js";
import { getClient } from "..";

const guildPayload: { [index: string]: ApplicationCommandData[] } = {};
const globalPayload: ApplicationCommandData[] = [];

function addGuildPayload(guildId: string, commandData: ApplicationCommandData): void {
	const payload = guildPayload[guildId] ?? [];
	payload.push(commandData);
	guildPayload[guildId] = payload;
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
				commands.set(payload).catch(console.error.bind(console));
			} else {
				console.warn(`Failed to set commands for ${guildId}.`);
			}
		}
	});
}

export { pushPayloads, addGlobalPayload, addGuildPayload };
