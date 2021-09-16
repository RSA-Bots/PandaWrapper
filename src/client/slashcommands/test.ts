import type { CommandInteraction } from "discord.js";
import type SlashCommand from "../../interface/slashCommand";

const testSlashCommand: SlashCommand = {
	commandName: "test",
	commandData: { name: "test", description: "Hello world!" },
	commandCallback: (interaction: CommandInteraction) => {
		interaction.reply("F").catch(console.error.bind(console));
	},
	guildId: "848412523526488114",
};

export default testSlashCommand;
