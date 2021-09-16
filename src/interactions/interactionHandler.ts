import type { CommandInteraction } from "discord.js";
import { getClient } from "../client/client";

const slashCommands: { [index: string]: (interaction: CommandInteraction) => void } = {};

export function registerSlashCommandInteraction(
	commandName: string,
	callback: (interaction: CommandInteraction) => void
): void {
	slashCommands[commandName] = callback;
}

export function initializeInteractionEvent(): void {
	getClient().on("interactionCreate", interaction => {
		if (interaction.isCommand()) {
			const callback = slashCommands[interaction.commandName];
			if (callback) {
				callback(interaction);
			}
		}
	});
}
