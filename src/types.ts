import type {
	ButtonInteraction,
	ClientEvents,
	CommandInteraction,
	CommandInteractionOption,
	ContextMenuInteraction,
	Message,
	SelectMenuInteraction,
	User,
} from "discord.js";

export type EventCallback<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => void;
export type MessageCallback = (message: Message, args: string[]) => void;
export type MessagePermissions = {
	allowed?: Set<string>;
	denied?: Set<string>;
	flags?: Set<string>;
};
export type SlashCommandCallback = (interaction: CommandInteraction, args: CommandInteractionOption[]) => void;
export type CommandPermission = {
	id: string;
	type: "ROLE" | "USER";
	permission: boolean;
};
export type SlashCommandOptionType =
	| "STRING"
	| "INTEGER"
	| "BOOLEAN"
	| "USER"
	| "CHANNEL"
	| "ROLE"
	| "MENTIONABLE"
	| "NUMBER";
export type SlashCommandChoice = { name: string; value: string };
export type ContextMenuCallback = (interaction: ContextMenuInteraction, target: Message | User | undefined) => void;
export type ButtonCallback = (interaction: ButtonInteraction) => void;
export type SelectMenuCallback = (interaction: SelectMenuInteraction) => void;
