import type { ApplicationCommandSubCommandData } from "discord.js";
import type { SlashCommandOption } from "./SlashCommandOption";

export class SubCommand {
	private name: string;
	private description: string;
	private data: ApplicationCommandSubCommandData;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;

		this.data = {
			name: this.name,
			description: this.description,
			type: "SUB_COMMAND",
		};
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

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getData(): ApplicationCommandSubCommandData {
		return this.data;
	}
}
