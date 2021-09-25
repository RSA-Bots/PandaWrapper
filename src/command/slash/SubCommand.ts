import type { ApplicationCommandSubCommandData } from "discord.js";
import type { SlashCommandOption } from "./SlashCommandOption";

export class SubCommand {
	name: string;
	description: string;
	data: ApplicationCommandSubCommandData;

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

	getData(): ApplicationCommandSubCommandData {
		return this.data;
	}
}
