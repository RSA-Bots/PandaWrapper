import type { ApplicationCommandData, CommandInteraction, Snowflake } from "discord.js";
import { registerSlashCommandInteraction } from "../interactions/interactionHandler";
import { addGlobalPayload, addGuildPayload, getHasPushed } from "../interactions/payloadHandler";

export function registerSlashCommand(
	commandName: string,
	commandData: ApplicationCommandData,
	callback: (interaction: CommandInteraction) => void,
	guildId?: Snowflake
): void {
	if (commandName.toLowerCase() != commandName) {
		console.warn("commandName must be lowercase.");
		return;
	}

	if (getHasPushed()) {
		console.warn("Tried to load command after payload push.");
		return;
	}
	if (guildId) {
		addGuildPayload(guildId, commandData);
	} else {
		addGlobalPayload(commandData);
	}
	registerSlashCommandInteraction(commandName, callback);
}
