import type { ClientEvents } from "discord.js";
import type { EventCallback } from "../types";

/**
 *
 * @typeParam K - The event to register based on discordjs Clients
 * @since v0.1.0
 */
export class ClientEvent<K extends keyof ClientEvents> {
	callback: EventCallback<K> | undefined;
	name: K;
	once: boolean;

	/**
	 *
	 * @param name The name of the event from ClientEvents
	 * @param once Should this event only fire once
	 */
	constructor(name: K, once: boolean) {
		this.name = name;
		this.once = once;
	}

	/**
	 *
	 * @param callback The callback to use when this event is fired by the Client
	 * @returns The ClientEvent
	 */
	setCallback(callback: EventCallback<K>): this {
		this.callback = callback;
		return this;
	}
}
