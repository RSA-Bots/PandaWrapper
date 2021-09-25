import type { ChatInputApplicationCommandData } from "discord.js";
import type { SlashCommandCallback } from "../../types";
import { BaseCommand } from "../BaseCommand";
import type { SlashCommandOption } from "./SlashCommandOption";
import type { SubCommand } from "./SubCommand";
import type { SubCommandGroup } from "./SubCommandGroup";

export class SlashCommand extends BaseCommand {
	description: string;
	/* TODO: type safety on mismatched option types */
	data: ChatInputApplicationCommandData;
	callback: SlashCommandCallback | undefined;
	global = false;
	guildId: string | undefined;

	constructor(name: string, description: string) {
		super(name);
		this.description = description;

		this.data = {
			name,
			description,
			type: "CHAT_INPUT",
		};
	}

	setDefaultPermissions(defaultPermission: boolean): this {
		this.data.defaultPermission = defaultPermission;
		return this;
	}

	setCallback(callback: SlashCommandCallback): this {
		this.callback = callback;
		return this;
	}

	setGlobal(global: boolean): this {
		this.global = global;
		return this;
	}

	setGuildId(guildId: string): this {
		this.guildId = guildId;
		return this;
	}

	addOption(newOption: SlashCommandOption): this {
		if (this.data.options) {
			let found = false;
			for (const option of this.data.options) {
				if (option.name === newOption.name) {
					found = true;
				}
			}
			if (!found) this.data.options.push(newOption);
		} else {
			this.data.options = [newOption];
		}

		return this;
	}

	addSubCommand(command: SubCommand): this {
		if (this.data.options) {
			let found = false;
			for (const option of this.data.options) {
				if (option.name === command.name && option.type === command.getData().type) {
					found = true;
				}
			}
			if (!found) this.data.options.push(command.getData());
		} else {
			this.data.options = [command.getData()];
		}

		return this;
	}

	addSubCommandGroup(group: SubCommandGroup): this {
		if (this.data.options) {
			let found = false;
			for (const option of this.data.options) {
				if (option.name === group.name && option.type === group.getData().type) {
					found = true;
				}
			}
			if (!found) this.data.options.push(group.getData());
		} else {
			this.data.options = [group.getData()];
		}

		return this;
	}

	getCallback(): SlashCommandCallback | undefined {
		return this.callback;
	}

	getGuildId(): string | undefined {
		return this.guildId;
	}

	getData(): ChatInputApplicationCommandData {
		return this.data;
	}
}
