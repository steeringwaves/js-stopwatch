import * as _ from "lodash";
import { EventEmitter } from "events";

export interface StopwatchConfig {
	Timeout?: number;
}

interface Events {
	EXPIRED: string;
	STARTED: string;
	STOPPED: string;
	RESET: string;
}

// TODO bigint doesn't work with jest
// function convertHrtime(t: bigint): number {
// 	const number = Number(t);
// 	const milliseconds = number / 1000000;

// 	return milliseconds;
// }

export class Stopwatch extends EventEmitter {
	private _expiredTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

	private _running: boolean = false;

	private _expired: boolean = false;

	private _timeout: number = 0;

	private _elapsed: number = 0;

	// private _hrtime: bigint | undefined = undefined;
	private _hrtime: [number, number] | undefined = undefined;

	constructor(config?: StopwatchConfig) {
		super();

		const opt: StopwatchConfig = _.defaultsDeep(config, <StopwatchConfig>{
			Timeout: 0
		});

		this._running = false;
		this._expired = false;
		if (_.isNumber(opt.Timeout)) {
			this._timeout = <number>opt.Timeout;
		}

		this.Init(this._timeout);
	}

	static get EVENTS(): Events {
		return {
			EXPIRED: "expired",
			STARTED: "started",
			STOPPED: "stopped",
			RESET: "reset"
		};
	}

	public Init(timeout: number): void {
		this._timeout = timeout;
		this.Reset();
	}

	public Reset(): void {
		if (this._expiredTimeout) {
			clearTimeout(this._expiredTimeout);
			this._expiredTimeout = undefined;
		}

		const when = this.Get();
		this._running = false;
		this._expired = false;
		this._hrtime = undefined;
		this._elapsed = 0;
		this.emit(Stopwatch.EVENTS.RESET, 0, when);
	}

	public Start(): void {
		if (false === this._running) {
			if (this._expiredTimeout) {
				clearTimeout(this._expiredTimeout);
				this._expiredTimeout = undefined;
			}

			if (this._timeout > 0) {
				let timeout;
				timeout = this._timeout - this._elapsed;

				if (timeout <= 0) {
					timeout = 1;
				} else if (timeout > this._timeout) {
					timeout = this._timeout;
				}

				this._expiredTimeout = setTimeout(() => {
					this._expired = true;
					this.emit(Stopwatch.EVENTS.EXPIRED, this.Get());
				}, timeout);
			}

			this._running = true;
			// this._hrtime = hrtime.bigint();
			this._hrtime = process.hrtime();

			this.emit(Stopwatch.EVENTS.STARTED, this.Get());
		}
	}

	public Stop(): void {
		if (this._expiredTimeout) {
			clearTimeout(this._expiredTimeout);
			this._expiredTimeout = undefined;
		}

		const when: number = this.Get();
		this._elapsed = when;
		this._running = false;
		this._hrtime = undefined;
		this.emit(Stopwatch.EVENTS.STOPPED, when);
	}

	public Restart(): void {
		this.Reset();
		this.Start();
	}

	public Get(): number {
		if (this._hrtime && true === this._running) {
			const hrdiff: [number, number] = process.hrtime(this._hrtime);
			return this._elapsed + (hrdiff[0] * 1000 + hrdiff[1] / 1e6);

			// const hrdiff: bigint = hrtime.bigint() - this._hrtime;
			// return this._elapsed + convertHrtime(hrdiff);
		}

		return this._elapsed;
	}

	get Running(): boolean {
		return this._running;
	}

	get Stopped(): boolean {
		return !this._running;
	}

	get Expired(): boolean {
		return this._expired;
	}

	get NotExpired(): boolean {
		return !this._expired;
	}

	get Timeout(): number {
		return this._timeout;
	}

	get Elapsed(): number {
		return this.Get();
	}
}
