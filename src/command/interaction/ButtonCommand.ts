import { MessageButton, MessageButtonStyle, MessageButtonStyleResolvable } from "discord.js";
import type { ButtonCallback } from "../../types";
import { BaseCommand } from "../BaseCommand";

export class ButtonCommand extends BaseCommand {
	private callback: ButtonCallback | undefined;
	private style: MessageButtonStyleResolvable = "PRIMARY";
	private label: string;
	private disabled = false;

	constructor(name: string) {
		super(name);
		this.label = name;
	}

	setCallback(callback: ButtonCallback): this {
		this.callback = callback;
		return this;
	}

	setStyle(style: MessageButtonStyle): this {
		this.style = style;
		return this;
	}

	setDisabled(): this {
		this.disabled = true;
		return this;
	}

	setLabel(label: string): this {
		this.label = label;
		return this;
	}

	getCallback(): ButtonCallback | undefined {
		return this.callback;
	}

	getButtonObject(): MessageButton {
		return new MessageButton()
			.setCustomId(this.getName())
			.setStyle(this.style)
			.setLabel(this.label)
			.setDisabled(this.disabled);
	}
}
