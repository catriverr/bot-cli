import discord from 'discord.js';
import chalk from 'chalk';
import { BotComponent, CliStates, log } from '../src/defs.js';
import { appendFileSync } from "fs";

export class Bot extends BotComponent {
    constructor(state: CliStates) { super(state); };
    public main(): void {
        this.client.on(`messageCreate`, (msg): any => {
            if (msg.content.startsWith(`!kklog`)) return msg.reply(`done`);
        });
    }
};

