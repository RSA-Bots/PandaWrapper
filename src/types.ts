import type {
	ButtonInteraction,
	ClientEvents,
	CommandInteraction,
	CommandInteractionOption,
	ContextMenuInteraction,
	Message,
	MessageButton,
	MessageSelectMenu,
	SelectMenuInteraction,
	User,
} from "discord.js";

export type EventCallback<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => Promise<void> | void;
export type MessageCallback = (message: Message, args: string[]) => Promise<Message> | void;
export type MessagePermissions = {
	allowed?: Set<string>;
	denied?: Set<string>;
	flags?: Set<string>;
};
export type SlashCommandCallback = (
	interaction: CommandInteraction,
	args: CommandInteractionOption[]
) => Promise<void> | void;
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
export type SelectMenuCallback = (interaction: SelectMenuInteraction, values: string[]) => void;
export type SelectMenuOption = { label: string; description: string; value: string };
export type BuildComponentsData = [MessageSelectMenu | MessageButton];
