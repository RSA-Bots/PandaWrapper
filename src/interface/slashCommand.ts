import type { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface SlashCommand {
	name: string;
	data: ApplicationCommandData;
	callback: (interaction: CommandInteraction) => void;
	guildId?: string;
}
