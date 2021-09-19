import type { ClientEvents } from "discord.js";

export interface ClientEvent<K extends keyof ClientEvents> {
	name: K;
	/* Should this event only hook once? */
	once: boolean;
	callback: (...args: ClientEvents[K]) => void;
}
