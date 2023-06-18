import chalk from 'chalk';
import cli, { Util as utils } from './cli.js';
import { CliStates, CommandlineInteraction } from './defs.js';
import { readdirSync } from 'fs';
import { Client } from 'discord.js';
import EventEmitter from 'node:events';

let CLI_STATE: CliStates = { emitter: new EventEmitter(), client: new Client({intents: 3276799}), bot: { token: ``, prefix: `` }, prefs: { loaded: false, token: ``, refresh_ms: 2000 } };

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;

console.log(`[prelude] starting at`, __dirname);
let commands = new Map<string, CommandlineInteraction>();
export function load_commands() {
    console.log(`[prelude] loading commands from ${__dirname}commands`)
    let files = readdirSync(`./src/commands`, {encoding: `utf-8`}).filter(j=>j.endsWith(`.ts`));
    console.log(`[prelude] starting to load ${files.length} commands`);
    let i = 0;
    console.log();
    files.forEach(async f => {
        console.log(`\u001b[A\r[prelude] ${(files.length-i)}/${files.length} remaining (currently loading ${f})${` `.repeat(10)}`)
        import(`./commands/`+(f.slice(0, -3) + `.js`)).then(async (f) => { const file: CommandlineInteraction = f.default;
            await commands.set(file.commandName, file);
        });
        i++;
    });
    console.log(`\u001b[A\r[prelude] 0/${files.length} remaining`);
};
export async function run_command(nm: string, args: string[], state: CliStates): Promise<CliStates> {
    return await commands.get(nm).run(args, state);
};


export async function main(args: string[]): Promise<number> {
    load_commands();
    async function loop() {
        await cli.query(chalk.bold.magenta(`>>`) + ` ` + chalk.bold.yellow(`${process.cwd()} `)).then(async q => {
            if (!commands.has(q.split(` `)[0])) return console.log(chalk.bold.red(`>> unknown command: ${chalk.bold.bgBlack.white(q.split(` `)[0])}`));
            let cli_state = await run_command(q.split(` `)[0], q.split(` `).slice(1), CLI_STATE);
            CLI_STATE = cli_state;
        })
        await loop();
    };
    await loop();
    return 0;
};