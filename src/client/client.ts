import { Client, CommandInteraction, ContextMenuInteraction, Intents, Message } from "discord.js";
import { initializeInteractionEvent } from "../interactions/interactionHandler";
import { pushPayloads } from "../interactions/payloadHandler";
import { registerContextMenu } from "../registers/contextMenuRegister";
import { registerEvent } from "../registers/eventRegister";
import { registerMessageCommand } from "../registers/messageCommandRegister";
import { registerSlashCommand } from "../registers/slashCommandRegister";
import { getToken } from "../util/config";

let instanceClient: Client | undefined;

enum ContextMenuType {
	USER = "USER",
	MESSAGE = "MESSAGE",
}

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
		registerContextMenus();
		pushPayloads();
		initializeInteractionEvent();
	});
}

function registerMessageCommands(): void {
	registerMessageCommand("ping", (message: Message) => {
		message.reply("PONG!").catch(console.error.bind(console));
	});
}

function registerSlashCommands(): void {
	registerSlashCommand(
		"test",
		{ name: "test", description: "Hello world!" },
		(interaction: CommandInteraction) => {
			interaction.reply("F").catch(console.error.bind(console));
		},
		"848412523526488114"
	);

	registerSlashCommand(
		"globaltest",
		{ name: "globaltest", description: "Hello World!" },
		(interaction: CommandInteraction) => {
			interaction.reply("A").catch(console.error.bind(console));
		}
	);
}

function registerContextMenus(): void {
	registerContextMenu(
		"contexttest",
		{ name: "contexttest", type: ContextMenuType.MESSAGE },
		(interaction: ContextMenuInteraction) => {
			interaction.reply("B").catch(console.error.bind(console));
		},
		"848412523526488114"
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
