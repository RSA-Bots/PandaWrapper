import type { ApplicationCommandData, ContextMenuInteraction } from "discord.js";
import { registerContextCommandInteraction } from "../interactions/interactionHandler";
import { addGlobalPayload, addGuildPayload, getHasPushed } from "../interactions/payloadHandler";

export function registerContextMenu(
	commandName: string,
	commandData: ApplicationCommandData,
	callback: (interaction: ContextMenuInteraction) => void,
	guildId: string
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
	registerContextCommandInteraction(commandName, callback);
}
