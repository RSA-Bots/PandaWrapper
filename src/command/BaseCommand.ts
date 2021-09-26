import type { CommandPermission } from "../types";

export class BaseCommand {
	private name: string;
	private permissions: CommandPermission[] | undefined;

	/**
	 *
	 * @param name The name for this command object.
	 */
	constructor(name: string) {
		this.name = name;
	}

	/**
	 *
	 * @param permissions The complete CommandPermission array for the command.
	 * @returns The called instance of the command object.
	 */
	setPermissions(permissions: CommandPermission[]): this {
		this.permissions = permissions;
		return this;
	}

	/**
	 *
	 * @param id The id of the target of the permission change.
	 * @param type The target type of the permission change.
	 * @param permission true if the target should have permission or false if the target should not.
	 * @returns The called instance of the command object.
	 */
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

	/**
	 *
	 * @param id The id of the target that is to be removed from the permissions array.
	 * @returns The called instance of the command object.
	 */
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

	/**
	 *
	 * @returns If permissions has been instantiated, otherwise undefined.
	 */
	getPermissions(): CommandPermission[] | undefined {
		return this.permissions;
	}

	/**
	 *
	 * @returns The name used when creating the BaseCommand object.
	 */
	getName(): string {
		return this.name;
	}
}
