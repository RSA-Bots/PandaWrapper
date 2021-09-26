import type { ApplicationCommandSubGroupData } from "discord.js";
import type { SubCommand } from "./SubCommand";

export class SubCommandGroup {
	private name: string;
	private description: string;
	private data: ApplicationCommandSubGroupData;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;

		this.data = {
			name: this.name,
			description: this.description,
			type: "SUB_COMMAND_GROUP",
		};
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

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getData(): ApplicationCommandSubGroupData {
		return this.data;
	}
}
