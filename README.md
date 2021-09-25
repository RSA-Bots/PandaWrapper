<div align="center"><h1> PandaWrapper </h1></div>

[![ci](https://github.com/RSA-Bots/PandaWrapper/actions/workflows/ci.yml/badge.svg)](https://github.com/RSA-Bots/PandaWrapper/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/Github_Master-v0.0.0-red.svg)](https://github.com/RSA-Bots/PandaWrapper/tree/master)
[![Version](https://img.shields.io/badge/Github_Develop-v0.0.11-yellow.svg)](https://github.com/RSA-Bots/PandaWrapper/tree/develop)

[![npm version](https://badge.fury.io/js/pandawrapper.svg)](https://badge.fury.io/js/pandawrapper)
[![NPM Downloads](https://img.shields.io/npm/dt/pandawrapper.svg)](https://www.npmjs.com/package/pandawrapper)

Welcome to `PandaWrapper`, a Discord.JS wrapper in TypeScript.

<hr>

<div align="center"><h1>Methods</h1></div>

`createClient(prefix?: string, intents?: bigint[])`
* Creates a `Client` object
* `prefix` defaults to `!`
* `intents` defaults to `[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]`

`loginClient(token: string)`
* Logs in the previously created `Client` with the provided `token`

`getClient()`
* If a `Client` has been instantiated, it will return it; otherwise `undefined` will be returned.

`getPrefix()`
* Returns the `prefix` for the client.

`registerEvent(event: ClientEvent<K>)`
* Attempts to register an event listener
* Will only register events known by DiscordJS
* **PandaWrapper** already handles `ready`, `messageCreate` and `interactionCreate`. If you need to extend the functionality of these events, just register another event. However, command based actions are already handled.

`registerContextCommand(command: ContextCommand)`
* Will register a Context Menu command (right-click action)

`registerMessageCommand(command: MessageCommand)`
* Will register a message command (ex: `!ping`)

`registerSlashCommand(command: SlashCommand)`
* Will register a slash command

<hr>
<div align="center"><h1>Interfaces</h1></div>
<div align="center"><h2>Internal</h2></div>

## CommandButtons
* button: `MessageButton`
* callback: `(interaction: ButtonInteraction) => void`

## CommandMenus
* menu: `MessageSelectMenu`
* callback: `(interaction: SelectMenuInteraction) => void`

## MessagePermissions
* allowed: `Set<Snowflake>`
  * `Set` of allowed Snowflakes (Role based)
* denied?: `Set<Snowflake>`
  * `Set` of denied Snowflakes (Role based)
  * Explicit denial
* flags?: `Set<PermissionString>`
  * `Set` of `PermissionsString`
  * **Will override role checks**

<br>
<div align="center"><h2>External</h2></div>

## SlashCommand
This interface is the bulk implementation, and can handle the creation of `MessageCommand` and `ContextCommand` counterparts.

* data: `ApplicationCommandData`
  * Takes in a DiscordJS `ApplicationCommandData` defining the `SlashCommand`
* callback: `(interaction: CommandInteraction, buttons? [CommandButtons], selects?: [CommandMenus]) => void`
  * Will allow interaction of the defined `buttons` and `selects` within the `interaction` callback.
* guildConfig: `{ global: boolean; guildId?: string; }`
  * `global` - `true` means it is a global `SlashCommand`
  * `guildId` - the guildId to assign the `SlashCommand` to.
* permissions?: `{ default: boolean; permissions: ApplicationCommandPermissionsData[]; }`
  * `default` - If the command is enabled by default.
  * `permissions` - Array of DiscordJS `ApplicationCommandPermissionsData` defining permissions for `ROLE`s and `USER`s
* messageData?: `{ callback: (message: Message, args: string[]) => void; permission: MessagePermissions; }`
  * Will create a message version of the command using the client `prefix`
  * `callback` - Will provide the args without the command
* contextData?: `{type: "MESSAGE" | "USER"; callback: (interaction: ContextMenuInteraction) => void; }`
  * Will create a context menu version of the command
* buttons?: `[CommandButtons]`
  * Will create `Buttons` available to this `SlashCommand`
* selects?: `[CommandMenus]`
  * Will create `Select` (or dropdown menus) available to this `SlashCommand`

## MessageCommand
* name: `string`
* callback: `(message: Message, args: string[]) => void`
  * `callback` - Will provide the args without the command
* permissions: `MessagePermissions`

## ContextComand
* data: `ApplicationCommandData`
  * Takes in a DiscordJS `ApplicationCommandData` defining the `ContextMenu`
* callback: `(interaction: ContextMenuInteraction) => void`
* guildConfig: `{ global: boolean; guildId?: string; }`
  * `global` - `true` means it is a global `ContextMenu`
  * `guildId` - the guildId to assign the `ContextMenu` to.
* permissions?: `{ default: boolean; permissions: ApplicationCommandPermissionsData[]; }`
  * `default` - If the command is enabled by default.
  * `permissions` - Array of DiscordJS `ApplicationCommandPermissionsData` defining permissions for `ROLE`s and `USER`s\

<hr>
<div align="center"><h1>Examples</h1></div>

## Empty Bot
This will create a bot with a `prefix` of `eb?`. (ex: `eb?ping`)

```ts
import { createClient, loginClient }

createClient("eb?");
loginClient(token);
```

## Ping Command
This will create a bot with a `prefix` of `eb?` and a generic `ping` message command. (ex: `eb?ping`)

```ts
import { createClient, loginClient }

createClient("eb?");

registerMessageCommand({
	name: "ping",
	callback: async message => await message.reply("Pong!"),
	permissions: {
		allowed: new Set(["memberRoleId"]),
	}
})

loginClient("token");
```

## Basic `SlashCommand` Example
This will create a slash command version of the `ping` command.

```ts
createClient("eb?");

registerSlashCommand({
	data: {
		name: "ping",
		description: "Example ping command"
	},
	callback: async interaction => await interaction.reply("Pong!"),
	guildConfig: {
		global: false,
		guildId: "guildId"
	}
})

loginClient("token");
```

## `SlashCommand` Example with `MessageCommand`
This will create a slash command version of `ping` with a `MessageCommand` implementation as well, using the `eb?` prefix.

```ts
registerSlashCommand({
	data: {
		name: "ping",
		description: "Example ping command"
	},
	callback: async interaction => await interaction.reply("Pong!"),
	guildConfig: {
		global: false,
		guildId: "guildId"
	},
	messageData: {
		callback: async message => await message.reply("Pong!"),
		permission: {
			allowed: new Set(["memberRoleId"])
		}
	}
})
```
