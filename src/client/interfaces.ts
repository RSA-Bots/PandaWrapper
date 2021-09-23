import type {
	ApplicationCommandData,
	ApplicationCommandPermissionData,
	ButtonInteraction,
	CommandInteraction,
	ContextMenuInteraction,
	Message,
	MessageButton,
	MessageSelectMenu,
	PermissionString,
	SelectMenuInteraction,
	Snowflake,
} from "discord.js";

interface ContextCommand {
	data: ApplicationCommandData;
	callback: (interaction: ContextMenuInteraction) => void;
	guildConfig: {
		global: boolean;
		guildId?: string;
	};
	permissions?: {
		default: boolean;
		permissions: ApplicationCommandPermissionData[];
	};
}

interface CommandButtons {
	button: MessageButton;
	callback: (interaction: ButtonInteraction) => void;
}

interface CommandMenus {
	menu: MessageSelectMenu;
	callback: (interaction: SelectMenuInteraction) => void;
}

interface SlashCommand {
	data: ApplicationCommandData;
	callback: (interaction: CommandInteraction, buttons?: [CommandButtons], selects?: [CommandMenus]) => void;
	guildConfig: {
		global: boolean;
		guildId?: string;
	};
	permissions?: {
		default: boolean;
		permissions: ApplicationCommandPermissionData[];
	};
	messageData?: {
		callback: (message: Message, args: string[]) => void;
		permission: MessagePermissions;
	};
	contextData?: {
		type: "MESSAGE" | "USER";
		callback: (interaction: ContextMenuInteraction) => void;
	};
	buttons?: [CommandButtons];
	selects?: [CommandMenus];
}

interface MessagePermissions {
	allowed: Set<Snowflake>;
	denied?: Set<Snowflake>;
	flags?: Set<PermissionString>;
}

interface MessageCommand {
	name: string;
	callback: (message: Message, args: string[]) => void;
	permissions: MessagePermissions;
}

export { ContextCommand, SlashCommand, MessageCommand };
