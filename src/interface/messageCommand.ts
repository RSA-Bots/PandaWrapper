import type { Message } from "discord.js";

export interface MessageCommand {
	name: string;
	callback: (message: Message, args: string[]) => void;
}
