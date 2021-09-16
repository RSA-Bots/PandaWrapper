import type { CommandInteraction, ContextMenuInteraction } from "discord.js";
import { getClient } from "../client/client";

const slashCommands: { [index: string]: (interaction: CommandInteraction) => void } = {};
const contextMenu: { [index: string]: (interaction: ContextMenuInteraction) => void } = {};

export function registerSlashCommandInteraction(
	commandName: string,
	callback: (interaction: CommandInteraction) => void
): void {
	slashCommands[commandName] = callback;
}

export function registerContextCommandInteraction(
	commandName: string,
	callback: (interaction: ContextMenuInteraction) => void
): void {
	contextMenu[commandName] = callback;
}

export function initializeInteractionEvent(): void {
	getClient().on("interactionCreate", interaction => {
		if (interaction.isCommand()) {
			const callback = slashCommands[interaction.commandName];
			if (callback) {
				callback(interaction);
			} else {
				interaction
					.reply(`No command handler found for \`${interaction.commandName}\``)
					.catch(console.error.bind(console));
			}
		} else if (interaction.isContextMenu()) {
			const callback = contextMenu[interaction.commandName];
			if (callback) {
				callback(interaction);
			} else {
				interaction
					.reply(`No command handler found for \`${interaction.commandName}\``)
					.catch(console.error.bind(console));
			}
		}
	});
}
