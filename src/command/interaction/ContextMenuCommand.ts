import type { MessageApplicationCommandData, UserApplicationCommandData } from "discord.js";
import type { ContextMenuCallback } from "../../types";
import { BaseCommand } from "../BaseCommand";

export class ContextMenuCommand extends BaseCommand {
	data: UserApplicationCommandData | MessageApplicationCommandData;
	guildId: string | undefined;
	callback: ContextMenuCallback | undefined;

	constructor(name: string, type: "USER" | "MESSAGE") {
		super(name);
		this.data = {
			name,
			type,
		};
	}

	setCallback(callback: ContextMenuCallback): this {
		this.callback = callback;
		return this;
	}

	setGuildId(guildId: string): this {
		this.guildId = guildId;
		return this;
	}

	getCallback(): ContextMenuCallback | undefined {
		return this.callback;
	}

	getGuildId(): string | undefined {
		return this.guildId;
	}

	getData(): UserApplicationCommandData | MessageApplicationCommandData {
		return this.data;
	}
}
