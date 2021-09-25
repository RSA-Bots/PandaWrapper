import type { SelectMenuCallback } from "../../types";
import { BaseCommand } from "../BaseCommand";

export class SelectMenuCommand extends BaseCommand {
	callback: SelectMenuCallback | undefined;

	constructor(name: string) {
		super(name);
	}

	setCallback(callback: SelectMenuCallback): this {
		this.callback = callback;
		return this;
	}

	getCallback(): SelectMenuCallback | undefined {
		return this.callback;
	}
}
