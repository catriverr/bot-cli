import { ReadlineQuery } from '../util/rlquery.js';
import { createInterface as rl } from 'readline'; 

export default new class CommandLineInterface {
    public async query(prompt: string, options?: Util.QueryOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            let intf = rl(process.stdin, process.stdout); 
            intf.question(prompt, async (data: string) => {
                intf.close();
                if (!!options?.checker) {
                    process.stdout.write(options.checker.notifier ?? ``);
                    let checker = await options.checker.check(data);
                    if (!checker.authorized) return reject(data);
                    else resolve(data);
                };
                if (!!options?.matchString && options?.matchString != data) return reject(data);
                else resolve(data);
            });
        });
    };
};

export namespace Util {

    export interface QueryOptions {
        matchString?: string; checker?: QueryChecker;
    };
    
    export class QueryChecker {
        public data: QueryCheckerData = new QueryCheckerData(); public notifier: null | string = `Checking password...`;
        constructor(url: string, msg?: string) { this.data.url = url; this.notifier = msg; };
        async check(key: string): Promise<StreamInfo> {
            return new Promise<StreamInfo>((resolve, reject) => {
                fetch(this.data.url + `/auth-check`, {
                    method: 'post', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({pass: `${key}`})
                }).then(async (data) => {
                    let res: any = JSON.parse(await data.text());
                    return resolve(new StreamInfo(res.url, res.auth));
                });
            });
        };
    };
    
    export class StreamInfo {
        public url: string; public authorized: boolean;
        constructor(url: string, authorized: boolean) { this.url = url; this. authorized = authorized; };
    };
    
    export class QueryCheckerData { url: string; };
    
};