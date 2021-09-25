import { BaseCommand } from "../BaseCommand";
import type { ButtonCallback } from "../../types";

export class ButtonCommand extends BaseCommand {
	callback: ButtonCallback | undefined;

	constructor(name: string) {
		super(name);
	}

	setCallback(callback: ButtonCallback): this {
		this.callback = callback;
		return this;
	}

	getCallback(): ButtonCallback | undefined {
		return this.callback;
	}
}
