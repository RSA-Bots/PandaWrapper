import type { ClientEvents } from "discord.js";
import { getClient } from "../client/client";

export function registerEvent<K extends keyof ClientEvents>(
	eventName: K,
	once: boolean,
	callback: (...args: ClientEvents[K]) => void
): void {
	const client = getClient();

	if (!client) throw new Error("No client instantiated.");

	if (once) {
		client.once(eventName, callback);
	} else {
		client.on(eventName, callback);
	}
}
