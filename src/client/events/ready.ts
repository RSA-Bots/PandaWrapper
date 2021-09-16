import { initializeInteractionEvent } from "../../interactions/interactionHandler";
import { pushPayloads } from "../../interactions/payloadHandler";
import type ClientEvent from "../../interface/clientEvent";
import { registerContextMenus, registerSlashCommands } from "../client";

const readyEvent: ClientEvent<"ready"> = {
	eventName: "ready",
	once: true,
	eventCallback: async () => {
		console.log("Client logged in.");
		await registerSlashCommands();
		await registerContextMenus();
		pushPayloads();
		initializeInteractionEvent();
	},
};

export default readyEvent;
