import type { ApplicationCommandData, CommandInteraction, Snowflake } from "discord.js";
import { registerSlashCommandInteraction } from "../interactions/interactionHandler";
import { addGuildPayload, getHasPushed } from "../interactions/payloadHandler";

export function registerGlobalSlashCommand(): void {
	console.log("F");
}

export function registerGuildSlashCommand(
	commandName: string,
	commandData: ApplicationCommandData,
	guildId: Snowflake,
	callback: (interaction: CommandInteraction) => void
): void {
	if (getHasPushed()) {
		console.warn("Tried to load command after payload push.");
		return;
	}
	addGuildPayload(guildId, commandData);
	registerSlashCommandInteraction(commandName, callback);
}
