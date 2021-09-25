import type { CommandPermission } from "../types";

export class BaseCommand {
	name: string;
	permissions: CommandPermission[] | undefined;

	constructor(name: string) {
		this.name = name;
	}

	setPermissions(permissions: CommandPermission[]): this {
		this.permissions = permissions;
		return this;
	}

	addPermission(id: string, type: "ROLE" | "USER", permission: boolean): this {
		const permissionData: CommandPermission = { id, type, permission };

		let found = false;

		if (this.permissions) {
			for (const permission of this.permissions) {
				if (permission.id === id) {
					found = true;
				}
			}
			if (!found) this.permissions.push(permissionData);
		} else {
			this.permissions = [permissionData];
		}

		return this;
	}

	removePermission(id: string): this {
		const newPermissions: CommandPermission[] = [];

		if (this.permissions) {
			for (const permission of this.permissions) {
				if (permission.id != id) {
					newPermissions.push(permission);
				}
			}
		}

		this.permissions = newPermissions;

		return this;
	}

	getPermissions(): CommandPermission[] | undefined {
		return this.permissions;
	}
}
