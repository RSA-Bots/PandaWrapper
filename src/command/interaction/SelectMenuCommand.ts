import { MessageSelectMenu } from "discord.js";
import type { SelectMenuCallback, SelectMenuOption } from "../../types";
import { BaseCommand } from "../BaseCommand";

export class SelectMenuCommand extends BaseCommand {
	private callback: SelectMenuCallback | undefined;
	private placeholder = "Nothing selected.";
	private options: SelectMenuOption[] | undefined;
	private minSelect = 1;
	private maxSelect = 1;

	constructor(name: string) {
		super(name);
	}

	setCallback(callback: SelectMenuCallback): this {
		this.callback = callback;
		return this;
	}

	setPlaceholder(placeholder: string): this {
		this.placeholder = placeholder;
		return this;
	}

	setMinSelect(min: number): this {
		if (min > this.maxSelect) {
			min = this.maxSelect;
		}
		this.minSelect = min;
		return this;
	}

	setMaxSelect(max: number): this {
		if (max < this.minSelect) {
			max = this.minSelect;
		}
		this.maxSelect = max;
		return this;
	}

	addFullOption(option: SelectMenuOption): this {
		if (this.options) {
			let found = false;
			for (const preOption of this.options) {
				if (preOption.label === option.label) found = true;
			}
			if (!found) this.options.push(option);
		} else {
			this.options = [option];
		}
		return this;
	}

	addOption(label: string, description: string, value: string): this {
		return this.addFullOption({ label, description, value });
	}

	getCallback(): SelectMenuCallback | undefined {
		return this.callback;
	}

	getMenuObject(): MessageSelectMenu {
		const menu = new MessageSelectMenu()
			.setCustomId(this.getName())
			.setPlaceholder(this.placeholder)
			.setMinValues(this.minSelect)
			.setMaxValues(this.maxSelect);

		if (this.options && this.options.length > 0) menu.addOptions(this.options);

		return menu;
	}
}
