import type { ClientEvents } from "discord.js";
import { getClient } from "../client/client";
import type ClientEvent from "../interface/clientEvent";

export function registerEvent(clientEvent: ClientEvent<keyof ClientEvents>): void {
	const eventName = clientEvent.eventName;
	const callback = clientEvent.eventCallback;
	const client = getClient();

	if (!client) throw new Error("No client instantiated.");
	if (eventName === "interactionCreate") {
		console.warn("Please use the corresponding register method for handling interactions.");
		return;
	}

	if (clientEvent.once) {
		client.once(eventName, callback);
	} else {
		client.on(eventName, callback);
	}
}
