import type { ClientEvents, Message } from "discord.js";
import type ClientEvent from "../interface/clientEvent";
import { getPrefix } from "../util/config";
import { registerEvent } from "./eventRegister";

export function registerMessageCommand(
	commandName: string,
	callback: (message: Message, args: string[]) => void
): void {
	// TODO reassign to pre-existing messageCreate event
	const messageEvent = {
		eventName: "messageCreate",
		once: false,
		eventCallback: (message: Message) => {
			const messageParts = message.content.split(" ");
			const receivedCommand = messageParts.shift();
			const prefix = getPrefix();

			if (!prefix) throw new Error("No prefix defined.");

			const prefixedCommand = `${prefix}${commandName}`.toLowerCase();

			if (prefixedCommand == receivedCommand) callback(message, messageParts);
		},
	} as ClientEvent<keyof ClientEvents>;

	registerEvent(messageEvent);
}
