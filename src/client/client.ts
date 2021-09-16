import { Client, ClientEvents, Intents, Message } from "discord.js";
import { readdirSync } from "fs";
import type ClientEvent from "../interface/clientEvent";
import type ContextMenu from "../interface/contextMenu";
import type SlashCommand from "../interface/slashCommand";
import { registerContextMenu } from "../registers/contextMenuRegister";
import { registerEvent } from "../registers/eventRegister";
import { registerMessageCommand } from "../registers/messageCommandRegister";
import { registerSlashCommand } from "../registers/slashCommandRegister";
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

async function registerEvents(): Promise<void> {
	const clientEventPath = "./dist/client/events";
	const eventFiles = readdirSync(clientEventPath).filter(file => file.endsWith(".js"));

	for (const file of eventFiles) {
		const { default: clientEvent } = (await import(`./events/${file}`)) as unknown as {
			default: ClientEvent<keyof ClientEvents>;
		};
		registerEvent(clientEvent);
	}
}

function registerMessageCommands(): void {
	registerMessageCommand("ping", (message: Message) => {
		message.reply("PONG!").catch(console.error.bind(console));
	});
}

export async function registerSlashCommands(): Promise<void> {
	const clientEventPath = "./dist/client/slashcommands";
	const eventFiles = readdirSync(clientEventPath).filter(file => file.endsWith(".js"));

	for (const file of eventFiles) {
		const { default: slashCommand } = (await import(`./slashcommands/${file}`)) as unknown as {
			default: SlashCommand;
		};
		registerSlashCommand(slashCommand);
	}
}

export async function registerContextMenus(): Promise<void> {
	const clientEventPath = "./dist/client/contextmenus";
	const eventFiles = readdirSync(clientEventPath).filter(file => file.endsWith(".js"));

	for (const file of eventFiles) {
		const { default: contextMenu } = (await import(`./contextmenus/${file}`)) as unknown as {
			default: ContextMenu;
		};
		registerContextMenu(contextMenu);
	}
}

export async function initClient(): Promise<void> {
	createClient();
	await registerEvents();
	registerMessageCommands();
	loginClient();
}

export function getClient(): Client {
	if (!instanceClient) throw new Error("Client not instantiated.");

	return instanceClient;
}
