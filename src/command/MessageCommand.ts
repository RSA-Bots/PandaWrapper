import type { PermissionString } from "discord.js";
import type { MessageCallback, MessagePermissions } from "../types";

export class MessageCommand {
	name: string;
	private callback: MessageCallback | undefined;
	private permissions: MessagePermissions | undefined;

	constructor(name: string) {
		this.name = name;
	}

	setCallback(callback: MessageCallback): this {
		this.callback = callback;
		return this;
	}

	setPermissions(permissions: MessagePermissions): this {
		this.permissions = permissions;
		return this;
	}

	addAllowed(role: string): this {
		if (this.permissions == undefined) {
			this.permissions = {
				allowed: new Set([role]),
			};
		} else {
			if (this.permissions.allowed) {
				this.permissions.allowed.add(role);
			} else {
				this.permissions.allowed = new Set([role]);
			}
		}

		return this;
	}

	removeAllowed(role: string): this {
		if (this.permissions != undefined) {
			if (this.permissions.allowed) {
				this.permissions.allowed.delete(role);
			}
		}

		return this;
	}

	addDenied(role: string): this {
		if (this.permissions == undefined) {
			this.permissions = {
				denied: new Set([role]),
			};
		} else {
			if (this.permissions.denied) {
				this.permissions.denied.add(role);
			} else {
				this.permissions.denied = new Set([role]);
			}
		}

		return this;
	}

	removeDenied(role: string): this {
		if (this.permissions != undefined) {
			if (this.permissions.denied) {
				this.permissions.denied.delete(role);
			}
		}

		return this;
	}

	addFlag(flag: PermissionString): this {
		if (this.permissions == undefined) {
			this.permissions = {
				flags: new Set([flag]),
			};
		} else {
			if (this.permissions.flags) {
				this.permissions.flags.add(flag);
			} else {
				this.permissions.flags = new Set([flag]);
			}
		}

		return this;
	}

	removeFlag(flag: PermissionString): this {
		if (this.permissions != undefined) {
			if (this.permissions.flags) {
				this.permissions.flags.delete(flag);
			}
		}

		return this;
	}

	getCallback(): MessageCallback | undefined {
		return this.callback;
	}

	getPermissions(): MessagePermissions | undefined {
		return this.permissions;
	}
}
