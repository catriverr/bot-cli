import { BotComponent, CliStates, ClientComponent, CommandlineInteraction } from "../defs.js"; 
import ioutils from "../../util/prefs.js";
import chalk from "chalk";
import fs from 'fs';
import EventEmitter from 'node:events';

export default new class LoadBot extends CommandlineInteraction {
    public commandName: string = "load"; public desc: string = "Starts the discord bot in the provided args[0] directory.";
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> {
        if (!cli_states.prefs.loaded) { ioutils.put(chalk.bold.red`cannot start a bot without a config [execute prefs load]`); return cli_states; };
        ioutils.put(`validating config...`);
        if (!(cli_states.prefs.loaded && cli_states.prefs.token) || !(cli_states.bot.token)) {
            ioutils.put(chalk.bold.red`invalid config [check config schema]`); return cli_states;
        };
        ioutils.put(`validating token...`);
        try { 
            await cli_states.client.login(cli_states.bot.token); cli_states.client.destroy(); 
            ioutils.put(`configuration and preferences seem to be valid, starting bot...`); 
            if (!args[0]) { ioutils.put(chalk.bold.red`an argument for a bot component directory was not provided [check process::cwd]`); return cli_states; };
            if (!fs.existsSync(args[0])) { ioutils.put(chalk.bold.red`the directory${args[0]} does not exist.`); return cli_states; };
            if (!fs.statSync(args[0]).isDirectory()) { ioutils.put(chalk.bold.red`the provided file${args[0]} is not a directory.`); return cli_states; };
            let components = fs.readdirSync(args[0], {encoding: 'utf8'});
            if (!ioutils.isvalid(components)) { ioutils.put(chalk.bold.red`the directory${args[0]} is not a valid directory.`); return cli_states; };
            ioutils.put(chalk.bold.green`bot directory is healthy, loading components...`);
            ioutils.put(`refresh interval is ${cli_states.prefs.refresh_ms}`);
            let core: ClientComponent = (await import(`${process.cwd()}/${args[0]}/client.js`));
            let bot = new core.Bot(cli_states);
            // unused - does not have a purpose. setInterval(() => { bot.newhb(cli_states); }, cli_states.prefs.refresh_ms);
            bot.spawn();
            return cli_states;
        }
        catch (e) { ioutils.put(chalk.bold.red`invalid bot token [check https://www.discord.com/developers/portal]`); return cli_states; };
        return cli_states;
    }
};