import { ChatInputApplicationCommandData, MessageActionRow, MessageActionRowOptions } from "discord.js";
import type { BuildComponentsData, SlashCommandCallback } from "../../types";
import { BaseCommand } from "../BaseCommand";
import type { SlashCommandOption } from "./SlashCommandOption";
import type { SubCommand } from "./SubCommand";
import type { SubCommandGroup } from "./SubCommandGroup";

export class SlashCommand extends BaseCommand {
	private description: string;
	/* TODO: type safety on mismatched option types */
	private data: ChatInputApplicationCommandData;
	private callback: SlashCommandCallback | undefined;
	private global = false;
	private guildId: string | undefined;

	constructor(name: string, description: string) {
		super(name);
		this.description = description;

		this.data = {
			name,
			description,
			type: "CHAT_INPUT",
			defaultPermission: false,
		};
	}

	setDefaultPermissions(): this {
		this.data.defaultPermission = true;
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
				if (option.name === newOption.getName()) {
					found = true;
				}
			}
			if (!found) this.data.options.push(newOption.toDjsObject());
		} else {
			this.data.options = [newOption.toDjsObject()];
		}

		return this;
	}

	addSubCommand(command: SubCommand): this {
		if (this.data.options) {
			let found = false;
			for (const option of this.data.options) {
				if (option.name === command.getName() && option.type === command.getData().type) {
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
				if (option.name === group.getName() && option.type === group.getData().type) {
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

	buildComponents(
		row1: BuildComponentsData,
		row2?: BuildComponentsData,
		row3?: BuildComponentsData,
		row4?: BuildComponentsData,
		row5?: BuildComponentsData
	): (MessageActionRow | MessageActionRowOptions)[] {
		const componentArray = [];
		componentArray.push(new MessageActionRow().addComponents(row1.slice(0, 4)));
		if (row2 && row2.length > 0) componentArray.push(new MessageActionRow().addComponents(row2.slice(0, 4)));
		if (row3 && row3.length > 0) componentArray.push(new MessageActionRow().addComponents(row3.slice(0, 4)));
		if (row4 && row4.length > 0) componentArray.push(new MessageActionRow().addComponents(row4.slice(0, 4)));
		if (row5 && row5.length > 0) componentArray.push(new MessageActionRow().addComponents(row5.slice(0, 4)));

		return componentArray;
	}
}
