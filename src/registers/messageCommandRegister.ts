import type { Message } from "discord.js";
import { getPrefix } from "../util/config";
import { registerEvent } from "./eventRegister";

export function registerMessageCommand(
	commandName: string,
	callback: (message: Message, args: string[]) => void
): void {
	// TODO reassign to pre-existing messageCreate event
	registerEvent("messageCreate", false, (message: Message) => {
		const messageParts = message.content.split(" ");
		const receivedCommand = messageParts.shift();
		const prefix = getPrefix();

		if (!prefix) throw new Error("No prefix defined.");

		const prefixedCommand = `${prefix}${commandName}`.toLowerCase();

		if (prefixedCommand == receivedCommand) callback(message, messageParts);
	});
}
