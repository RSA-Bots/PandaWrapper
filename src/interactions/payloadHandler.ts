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

export function pushPayload(guildId?: string): void {
	const client = getClient();

	if (guildId) {
		if (guildPayload[guildId]) {
			const cachedGuild = client.guilds.cache.get(guildId);

			if (!cachedGuild) {
				console.log("Not cached.");
				client.guilds
					.fetch(guildId)
					.then(guild => {
						const commands = guild.commands;
						if (commands) {
							commands.set(guildPayload[guildId]).catch(console.error.bind(console));
						} else {
							console.warn(`Failed to set commands for ${guildId}`);
						}
					})
					.catch(console.error.bind(console));
			} else {
				console.log("Cached.");
				cachedGuild.commands.set(guildPayload[guildId]).catch(console.error.bind(console));
			}
		}
	} else {
		const app = client.application;
		if (!app) throw new Error("Could not fetch ClientApplication.");

		app.commands.set(globalPayload).catch(console.error.bind(console));
	}
}

export function getHasPushed(): boolean {
	return hasPushed;
}
