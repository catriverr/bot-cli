import chalk from 'chalk';
import { readFileSync } from 'fs';
export class Preferences {
    public token: string; public loaded: boolean; public refresh_ms: number;
};

export type PrefsType = 'json' | 'exports-table';

export default class PrefsUtil {
    public static async import(fname: string, type: PrefsType): Promise<Preferences> {
        switch (type) {
            case 'exports-table':
                return {token: ``, loaded: false, refresh_ms: 5000};
            default:
            case 'json':
                const data: Preferences = JSON.parse(readFileSync(fname, {encoding: `utf-8`}) ?? `{}`);
                return data;
        }
    };
    public static async put(message: any, ...args: any[]): Promise<void> {
        return console.log(`${chalk.bold.magenta(`>>`)} ${message}`, ...args);
    };
    public static isvalid(files: string[]): boolean {
        let required = [`client.ts`, `commands`];
        for (let file of required) { if (!files.includes(file)) return false; };
        return true;
    };
};