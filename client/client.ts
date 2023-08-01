import discord from 'discord.js';
import chalk from 'chalk';
import { BotCommand, BotComponent, CliStates, log } from '../src/defs.js';
import { appendFileSync } from "fs";
import ioutils from '../util/prefs.js';

export class Bot extends BotComponent {
    constructor(state: CliStates) { super(state); }; private commands: Map<string, BotCommand> = BotComponent.importCommands(`client/commands`);
    public main(): void {
        this.client.on(`messageCreate`, (msg) => {
            let raw = msg.content.split(` `), cmdname = raw[0].slice(this.state.bot.prefix.length), args = raw.slice(1);
            if (this.commands.has(cmdname)) { this.commands.get(cmdname).setClient(this.client).run(args, msg); }
            else return void 0;
        });
    };
};

