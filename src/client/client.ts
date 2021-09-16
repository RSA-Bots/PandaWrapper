import { Client, CommandInteraction, Intents, Message } from "discord.js";
import { initializeInteractionEvent } from "../interactions/interactionHandler";
import { pushPayload } from "../interactions/payloadHandler";
import { registerEvent } from "../registers/eventRegister";
import { registerMessageCommand } from "../registers/messageCommandRegister";
import { registerGuildSlashCommand } from "../registers/slashCommandRegister";
import { getToken } from "../util/config";

let instanceClient: Client | undefined;

function createClient(intents?: number[]): Client {
	if (!intents) {
		intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS];
	}

	instanceClient = new Client({ intents });

	return instanceClient;
}

function loginClient(): void {
	const token = getToken();

	if (!instanceClient) throw new Error("Client not instantiated.");
	if (!token) throw new Error("No token provided.");

	instanceClient.login(token).catch(console.error.bind(console));
}

function registerEvents(): void {
	registerEvent("ready", true, () => {
		console.log("Client logged in.");
		registerSlashCommands();
		//registerContextMenus();
		pushPayload("848412523526488114");
		initializeInteractionEvent();
	});
}

function registerMessageCommands(): void {
	registerMessageCommand("ping", (message: Message) => {
		message.reply("PONG!").catch(console.error.bind(console));
	});
}

function registerSlashCommands(): void {
	registerGuildSlashCommand(
		"test",
		{ name: "test", description: "Hello world!" },
		"848412523526488114",
		(interaction: CommandInteraction) => {
			interaction.reply("F").catch(console.error.bind(console));
		}
	);
}

export function initClient(): void {
	createClient();
	registerEvents();
	registerMessageCommands();
	loginClient();
}

export function getClient(): Client {
	if (!instanceClient) throw new Error("Client not instantiated.");

	return instanceClient;
}
