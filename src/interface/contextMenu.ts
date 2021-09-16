import type { ContextMenuInteraction } from "discord.js";

export enum ContextMenuType {
	USER = "USER",
	MESSAGE = "MESSAGE",
}

export default interface ContextMenu {
	menuName: string;
	menuData: { name: string; type: ContextMenuType };
	menuCallback: (interaction: ContextMenuInteraction) => void;
	guildId: string;
}
