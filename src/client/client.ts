import { Client, Intents, Message } from "discord.js";
import { registerEvent } from "../registers/eventRegister";
import { registerMessageCommand } from "../registers/messageCommandRegister";
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
	if (!instanceClient) throw new Error("Client not instantiated.");

	instanceClient.login(getToken()).catch(console.error.bind(console));
}

function registerEvents(): void {
	registerEvent("ready", true, () => console.log("Client logged in."));
}

function registerMessageCommands(): void {
	registerMessageCommand("ping", (message: Message) => {
		message.reply("PONG!").catch(console.error.bind(console));
	});
	registerMessageCommand("repeat", (message: Message, args: string[]) => {
		if (args.length == 0) {
			message.reply("Not enough args provided.").catch(console.error.bind(console));
		} else {
			message.reply(args[0]).catch(console.error.bind(console));
		}
	});
}

export function initClient(): void {
	const token = getToken();

	if (!token) throw new Error("No token provided.");

	createClient();
	registerEvents();
	registerMessageCommands();
	//registerSlashCommands();
	//registerContextMenus();
	loginClient();
}

export function getClient(): Client {
	if (!instanceClient) throw new Error("Client not instantiated.");

	return instanceClient;
}
