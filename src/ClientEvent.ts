import type { ClientEvents } from "discord.js";
import type { EventCallback } from "./types";

export class ClientEvent<K extends keyof ClientEvents> {
	callback: EventCallback<K> | undefined;
	name: K;
	once: boolean;

	constructor(name: K, once: boolean) {
		this.name = name;
		this.once = once;
	}

	setCallback(callback: EventCallback<K>): this {
		this.callback = callback;
		return this;
	}

	getCallback(): EventCallback<K> | undefined {
		return this.callback;
	}

	getRate(): boolean {
		return this.once;
	}
}
