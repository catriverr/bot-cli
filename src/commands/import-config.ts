import { CliStates, CommandlineInteraction } from "../defs.js";
import ioutils from '../../util/prefs.js';

export default new class ImportConfig extends CommandlineInteraction {
    public commandName: string = 'prefs'; public desc: string = 'loads preferences to the cli.';
    public async run(args: string[], cli_states: CliStates): Promise<CliStates> {
        switch (args[0]) {
            case 'load':
                const prefs = await ioutils.import(args[1] ?? 'botcli-config.json', `json`);
                prefs.loaded = true; cli_states.prefs = prefs; cli_states.bot = prefs.bot; cli_states.bot.token = prefs.token;
                return cli_states;
            default:
                ioutils.put(`invalid args[0] argument: use prefs load`);
                return cli_states;
        };
    }
};
