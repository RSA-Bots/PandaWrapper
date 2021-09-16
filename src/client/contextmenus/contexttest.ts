import type { ContextMenuInteraction } from "discord.js";
import type ContextMenu from "../../interface/contextMenu";
import { ContextMenuType } from "../../interface/contextMenu";

const contextMenuTest: ContextMenu = {
	menuName: "contexttest",
	menuData: { name: "contexttest", type: ContextMenuType.MESSAGE },
	menuCallback: (interaction: ContextMenuInteraction) => interaction.reply("F").catch(console.error.bind(console)),
	guildId: "848412523526488114",
};

export default contextMenuTest;
