import type { ClientEvents } from "discord.js";

export default interface ClientEvent<K extends keyof ClientEvents> {
	eventName: K;
	/* Should this event only hook once? */
	once: boolean;
	eventCallback: (...args: ClientEvents[K]) => void;
}
