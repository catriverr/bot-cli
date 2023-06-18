import { ActivityType, Client } from "discord.js";
import { Preferences } from "../util/prefs.js";
import EventEmitter from "node:events";
import { writeFileSync, appendFileSync } from "fs";
import chalk from "chalk";

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
};

export class ClientComponent {
    public Bot = BotComponent;
};

export function log(message: string): void { appendFileSync('./session.log', chalk.bold.magenta(`>> `) + message + `\n`); };