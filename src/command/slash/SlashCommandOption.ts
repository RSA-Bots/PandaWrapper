import type { SlashCommandChoice, SlashCommandOptionType } from "../../types";

export class SlashCommandOption {
	name: string;
	description: string;
	type: SlashCommandOptionType;
	choices: SlashCommandChoice[] | undefined;
	required = false;

	constructor(name: string, description: string, type: SlashCommandOptionType) {
		this.name = name;
		this.description = description;
		this.type = type;
	}

	setChoices(choices: SlashCommandChoice[]): this {
		this.choices = choices;
		return this;
	}

	addChoice(name: string, value: string): this {
		return this.addFullChoice({ name, value });
	}

	addFullChoice(newChoice: SlashCommandChoice): this {
		if (this.choices) {
			let found = false;

			for (const choice of this.choices) {
				if (choice.name === newChoice.name) {
					found = true;
				}
			}

			if (!found) this.choices.push(newChoice);
		}

		return this;
	}

	setRequired(): this {
		this.required = true;
		return this;
	}
}
