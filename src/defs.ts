import { Client, Message } from "discord.js";
import { Preferences } from "../util/prefs.js";
import EventEmitter from "node:events";
import { writeFileSync, appendFileSync } from "fs";
import chalk from "chalk";
import fs from 'fs';

export class CommandlineInteraction {
    public commandName: string; public desc: string;
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> { return new CliStates(); };
}

export class CliStates {
    bot: BotClientState; prefs: Preferences;
    client: Client; emitter: EventEmitter;
};

export class BotClientState {
    token: string; prefix?: string = `?`;
};

export type BotEvents = `clientChange` | `clientDestroy`;

export class BotComponent {
    public state: CliStates; public client: Client;
    constructor(state: CliStates) { this.client = state.client; this.state = state; writeFileSync(`./session.log`, `[bot start]\n`);  };
    
    public spawn(): void { this.client.destroy(); this.client.login(this.state.bot.token); this.listener(); this.main(); };
    public onEvent<func extends (...args: any[]) => {}>(event: BotEvents, method: func): void { this.state.emitter.on(event, method); }; 
    
    public main(): void {};

    private newhb(state: CliStates): void { this.state = state; this.client = state.client; };
    private listener(): void { 
        this.state.emitter.on("clientChange", (states: CliStates) => {
            this.newhb(states); log(`${chalk.bold.yellow(`client status changed`)}`);
        });
    };
    static importCommands(folder: string, filter: any = (i: string) => true): Map<string, BotCommand> {
        let map = new Map<string, BotCommand>();
        fs.readdirSync(folder).filter(filter).forEach(async fnA => {
            let index = (await import(`${process.cwd()}/${folder}/${fnA}`)).default; map.set(index.name, index);
        });
        return map;
    };
};

export class ClientComponent {
    public Bot = BotComponent;
};

export class BotCommand {
    public name: string; public description: string; public client: Client; 
    public setClient(client: Client) { this.client = client; return this; };
    public run(args: string[], message: Message): void {};
};


export function log(message: string): void { appendFileSync('./session.log', chalk.bold.magenta(`>> `) + message + `\n`); };