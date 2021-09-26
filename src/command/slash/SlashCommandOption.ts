import type { ApplicationCommandChoicesData, ApplicationCommandNonOptionsData } from "discord.js";
import type { SlashCommandChoice, SlashCommandOptionType } from "../../types";

export class SlashCommandOption {
	private name: string;
	private description: string;
	private type: SlashCommandOptionType;
	private choices: SlashCommandChoice[] | undefined;
	private required = false;

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

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getType(): SlashCommandOptionType {
		return this.type;
	}

	getChoices(): SlashCommandChoice[] | undefined {
		return this.choices;
	}

	getRequired(): boolean {
		return this.required;
	}

	toDjsObject(): ApplicationCommandChoicesData | ApplicationCommandNonOptionsData {
		return {
			name: this.getName(),
			description: this.getDescription(),
			type: this.getType(),
			required: this.getRequired(),
			choices: this.getChoices(),
		};
	}
}
