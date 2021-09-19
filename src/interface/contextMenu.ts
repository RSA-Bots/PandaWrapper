import type { ContextMenuInteraction } from "discord.js";

enum ContextMenuType {
	USER = "USER",
	MESSAGE = "MESSAGE",
}

interface ContextMenu {
	name: string;
	data: { name: string; type: ContextMenuType };
	callback: (interaction: ContextMenuInteraction) => void;
	guildId: string;
}

export { ContextMenuType, ContextMenu };
