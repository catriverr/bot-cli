import { CliStates, CommandlineInteraction } from "../defs.js";
import ioutils from '../../util/prefs.js';
import chalk from 'chalk';

export default new class StateInfo extends CommandlineInteraction {
    public commandName: string = `info`; public desc: string = `displays cli_states data`;
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> {
        console.log(`
${Object.getOwnPropertyNames(cli_states).map(name => `${chalk.bold.yellow(`>>`)} ${chalk.bold.red(name)}: ${chalk.bold.blue(JSON.stringify(cli_states[name]))}`).join('\n')}`)
        return cli_states;
    };
};