import type { ApplicationCommandData, CommandInteraction } from "discord.js";

export default interface SlashCommand {
	commandName: string;
	commandData: ApplicationCommandData;
	commandCallback: (interaction: CommandInteraction) => void;
	guildId?: string;
}
