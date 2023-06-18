import { EventEmitter } from 'node:events';

export type RLQEvent = "pass" | "fail";

export class ReadlineQuery {
    private emitter: EventEmitter = new EventEmitter();
    onFail(callback: (resp: string) => {}): void {
        this.emitter.on('fail', (resp) => { callback(resp); });
    };
    onPass(callback: (resp: string) => {}): void {
        this.emitter.on('pass', (resp) => { callback(resp); });
    };
    emit(event: RLQEvent, ...args: any[]): void {
        this.emitter.emit(event, ...args);
    };
};