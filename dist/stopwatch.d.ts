declare const EventEmitter: any;
export interface StopwatchConfig {
    Timeout?: number;
}
interface Events {
    EXPIRED: string;
    STARTED: string;
    STOPPED: string;
    RESET: string;
}
export declare class Stopwatch extends EventEmitter {
    private _expiredTimeout;
    private _running;
    private _expired;
    private _timeout;
    private _elapsed;
    private _hrtime;
    constructor(config?: StopwatchConfig);
    static get EVENTS(): Events;
    Init(timeout: number): void;
    Reset(): void;
    Start(): void;
    Stop(): void;
    Restart(): void;
    Get(): number;
    get Running(): boolean;
    get Stopped(): boolean;
    get Expired(): boolean;
    get NotExpired(): boolean;
    get Timeout(): number;
    get Elapsed(): number;
}
export {};
