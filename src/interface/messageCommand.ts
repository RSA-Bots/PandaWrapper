import type { Message, PermissionString, Snowflake } from "discord.js";

export interface MessageCommand {
	name: string;
	callback: (message: Message, args: string[]) => Promise<void>;
	permissions: {
		allowed: Set<Snowflake>;
		denied?: Set<Snowflake>;
		flags?: Set<PermissionString>;
	};
}
