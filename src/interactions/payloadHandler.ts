import type { ApplicationCommandData } from "discord.js";
import { getClient } from "../client/client";

const guildPayload: { [index: string]: ApplicationCommandData[] } = {};
const globalPayload: ApplicationCommandData[] = [];
const hasPushed = false;

export function addGuildPayload(guildId: string, commandData: ApplicationCommandData): void {
	const payload: ApplicationCommandData[] = guildPayload[guildId] ?? [];
	payload.push(commandData);
	guildPayload[guildId] = payload;
}

export function addGlobalPayload(commandData: ApplicationCommandData): void {
	globalPayload.push(commandData);
}

export function pushPayloads(): void {
	const client = getClient();
	const app = client.application;
	if (!app) {
		console.error("Failed to fetch ClientApplication. Not sending global payload.");
	} else {
		app.commands.set(globalPayload).catch(console.error.bind(console));
	}

	client.guilds.cache.forEach(guild => {
		const guildId = guild.id;
		const payload = guildPayload[guildId];

		if (payload) {
			const commands = guild.commands;
			if (commands) {
				commands.set(guildPayload[guildId]).catch(console.error.bind(console));
			} else {
				console.warn(`Failed to set commands for ${guildId}`);
			}
		}
	});
}

export function getHasPushed(): boolean {
	return hasPushed;
}
