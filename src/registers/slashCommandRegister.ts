import { registerSlashCommandInteraction } from "../interactions/interactionHandler";
import { addGlobalPayload, addGuildPayload, getHasPushed } from "../interactions/payloadHandler";
import type SlashCommand from "../interface/slashCommand";

export function registerSlashCommand(slashCommand: SlashCommand): void {
	const commandName = slashCommand.commandName;
	const commandData = slashCommand.commandData;
	const callback = slashCommand.commandCallback;
	const guildId = slashCommand.guildId;

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
