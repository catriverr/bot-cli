import { CliStates, CommandlineInteraction } from "../defs.js";
import ioutils from '../../util/prefs.js';
import chalk from "chalk";

export default new class ChangeClient extends CommandlineInteraction {
    public commandName: string = 'mod'; public desc: string = 'Modifys the clientstates.';
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> {
        switch(args[0]) {
            case `method`:
                if (args.length < 2) { ioutils.put(`command requires a minimum of 2 arguments [mod method <eval expression>]`); return cli_states };
                let mtd = args.slice(1).join(' '); let res = eval(`let core = cli_states;\n${mtd};\ncli_states = core;`); console.log(res); 
                break;
            case `var`:
                if (args.length < 2) { ioutils.put(`command requires a minimum of 2 arguments [mod var <name> [value]]`); return cli_states };
                if (args.length == 2) { 
                    let variable = eval(`cli_states${args.slice(1).join(` `).split(`.`).map(v => `['${v}']`).join(``)}`);
                    console.log(variable); 
                } 
                else { 
                    let truevarnm = `${args[1].split(`.`).map(v => `['${v}']`).join(``)}`;
                    try {
                        eval(`cli_states${truevarnm} = JSON.parse(\`${args.slice(2).join(` `)}\`)`); 
                    } catch (e) {
                        ioutils.put(chalk.bold.red(e.name) + `: ` + chalk.bold.gray(e.message));
                    };
                };
                break;
        };
        cli_states.emitter.emit(`clientChange`, cli_states);
        return cli_states;
    }
};
