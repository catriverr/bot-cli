import { Colors, EmbedBuilder, Message } from "discord.js";
import { BotCommand } from "../../src/defs.js";
import ioutils from '../../util/prefs.js';

export default new class test extends BotCommand {
    public name: string = `hi`; public description: string = `hi again`;
    public async run(args: string[], message: Message): Promise<void> { ioutils.put(`test command is working`); message.reply({embeds: [new EmbedBuilder({color: Colors.Blurple, description: `test [bot-cli response from vps ic36o8, auto-generated]`})]}); return void 0; };
};