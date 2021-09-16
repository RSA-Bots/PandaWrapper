import { registerContextCommandInteraction } from "../interactions/interactionHandler";
import { addGlobalPayload, addGuildPayload, getHasPushed } from "../interactions/payloadHandler";
import type ContextMenu from "../interface/contextMenu";

export function registerContextMenu(contextMenu: ContextMenu): void {
	const commandName = contextMenu.menuName;
	const commandData = contextMenu.menuData;
	const callback = contextMenu.menuCallback;
	const guildId = contextMenu.guildId;

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
