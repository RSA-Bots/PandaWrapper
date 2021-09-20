import type {
	ApplicationCommandData,
	ApplicationCommandPermissionData,
	CommandInteraction,
	ContextMenuInteraction,
	Message,
	PermissionString,
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

interface SlashCommand {
	data: ApplicationCommandData;
	callback: (interaction: CommandInteraction) => void;
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
