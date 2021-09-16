import type { CommandInteraction } from "discord.js";
import type SlashCommand from "../../interface/slashCommand";

const globalTestSlashCommand: SlashCommand = {
	commandName: "globaltest",
	commandData: { name: "globaltest", description: "Hello world!" },
	commandCallback: (interaction: CommandInteraction) => {
		interaction.reply("A").catch(console.error.bind(console));
	},
};

export default globalTestSlashCommand;
