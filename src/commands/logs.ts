import { BotComponent, CliStates, ClientComponent, CommandlineInteraction } from "../defs.js"; 
import ioutils from "../../util/prefs.js";
import EventEmitter from 'node:events';
import chalk from "chalk";
import fs from 'fs';

export default new class BotLogs extends CommandlineInteraction {
    public commandName: string = `monitor`; public desc: string = `Monitors the logs of the bot if it is running.`;
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> {
        console.clear();
        process.stdin.setEncoding(`utf-8`);
        process.stdin.setRawMode(true);
        fs.watchFile(`./session.log`, upd);
        async function upd() {
            return await (async () => {
            console.clear();
            let cur = fs.readFileSync(`./session.log`, {encoding: 'utf8'});
            console.log(chalk.bold.yellow.strikethrough(`\u200a`.repeat(process.stdout.columns)));
            console.log(cur);
            console.log(chalk.bold.yellow.strikethrough(`\u200a`.repeat(process.stdout.columns)));
            console.log(chalk.bold(`${chalk.bold.magenta(`>>`)} press ${chalk.bold.bgBlack.red(`ESC`)} to exit.`));
            return void 0;
            })();
        };
        upd();
        let kplistener = (kp: Buffer) => { if (kp.toString() != `\x1B`) return; process.stdin.removeListener(`data`, kplistener); console.clear(); fs.unwatchFile(`./session.log`); process.stdout.write(chalk.bold.magenta(`>>`) + ` ` + chalk.bold.yellow(`${process.cwd()} `))};
        process.stdin.on(`data`, kplistener);
        return cli_states;
    }
};