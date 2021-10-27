<div align="center"><h1> PandaWrapper </h1></div>

[![ci](https://github.com/RSA-Bots/PandaWrapper/actions/workflows/ci.yml/badge.svg)](https://github.com/RSA-Bots/PandaWrapper/actions/workflows/ci.yml)

[![npm version](https://badge.fury.io/js/pandawrapper.svg)](https://badge.fury.io/js/pandawrapper)
[![Version](https://img.shields.io/badge/npm_beta-v0.1.0--beta.12a-yellow.svg)](https://badge.fury.io/js/pandawrapper)
[![NPM Downloads](https://img.shields.io/npm/dt/pandawrapper.svg)](https://www.npmjs.com/package/pandawrapper)

[![Version](https://img.shields.io/badge/Github_Master-v0.0.0-red.svg)](https://github.com/RSA-Bots/PandaWrapper/tree/master)
[![Version](https://img.shields.io/badge/Github_Develop-v0.1.0--beta.12a-yellow.svg)](https://github.com/RSA-Bots/PandaWrapper/tree/develop)
[![Version](https://img.shields.io/badge/Discord.js_Version-v13.1-brightgreen.svg)](https://discord.js.org)

Welcome to `PandaWrapper`, a Discord.JS wrapper in TypeScript.

<hr>
<div align="center"><h1>Examples</h1></div>

## Empty Bot
This will create a bot with a `prefix` of `eb?`. (ex: `eb?ping`)

```ts
import { WrappedClient } from "pandawrapper";

const client = new WrappedClient("eb?");

// Remember to catch the error that may arise from a failed login.
client.login("token").catch(console.error.bind(console));
```

## Ping `MessageCommand`
This will create a simple `ping` message command. (ex: `eb?ping`)

```ts
import { WrappedClient } from "pandawrapper";

const client = new WrappedClient("eb?");

// All commands are builders, so you can chain them on the same line.
const pingMessageCommand = new MessageCommand("ping").setCallback(async message => message.reply("Pong!"));

client.registerMessageCommand(pingMessageCommand);
// Remember to catch the error that may arise from a failed login.
client.login("token").catch(console.error.bind(console));
```

## Managing `MessagePermissions` of a `MessageCommand`
This will create and add permissions to the pre-existing `ping` message command.

```ts
import { WrappedClient } from "pandawrapper";

const client = new WrappedClient("eb?");

// All commands are builders, so you can chain them on the same line.
const pingMessageCommand = new MessageCommand("ping").setCallback(async message => message.reply("Pong!"));

// When handling permissions, you can define them all in one go
const pingPermissions: MessagePermissions = {
	allowed: new Set(["memberRoleId"]);
};
pingMessageCommand.setPermissions(pingPermissions);

// or separately.
pingMessageCommand.addDenied("someRoleIdThatCannotUsePing");

client.registerMessageCommand(pingMessageCommand);
// Remember to catch the error that may arise from a failed login.
client.login("token").catch(console.error.bind(console));
```

## Basic `SlashCommand` Example
This will create a `SlashCommand` version of the `ping` command. (ex: `/ping`)

```ts
import { WrappedClient } from "pandawrapper";

const client = new WrappedClient("eb?");

// Remember: All commands are builders, so you can chain them on the same line.
const pingSlashCommand = new SlashCommand("ping", "Pong!")
	.setCallback(async interaction => interaction.reply("Pong!"))
	.setGlobal(false)
	.setGuildId("yourGuildId")
	.addPermission("memberRoleId", "ROLE", true);

client.registerCommandObject(pingSlashCommand);
// Remember to catch the error that may arise from a failed login.
client.login("token").catch(console.error.bind(console));
```
