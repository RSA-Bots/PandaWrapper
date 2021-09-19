import type { ApplicationCommandData, ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export interface SlashCommand {
	name: string;
	data: ApplicationCommandData;
	callback: (interaction: CommandInteraction) => void;
	guildId?: string;
	permissions?: {
		default: boolean;
		permissions: ApplicationCommandPermissionData[];
	};
}
