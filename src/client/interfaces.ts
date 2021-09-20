import type {
	ApplicationCommandData,
	ApplicationCommandPermissionData,
	CommandInteraction,
	ContextMenuInteraction,
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
}

export { ContextCommand, SlashCommand };
