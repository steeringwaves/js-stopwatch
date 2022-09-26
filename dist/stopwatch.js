"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwatch = void 0;
var hrtime = require("node:process").hrtime;
var _ = require("lodash");
var EventEmitter = require("events");
// TODO bigint doesn't work with jest
// function convertHrtime(t: bigint): number {
// 	const number = Number(t);
// 	const milliseconds = number / 1000000;
// 	return milliseconds;
// }
var Stopwatch = /** @class */ (function (_super) {
    __extends(Stopwatch, _super);
    function Stopwatch(config) {
        var _this = _super.call(this) || this;
        _this._expiredTimeout = undefined;
        _this._running = false;
        _this._expired = false;
        _this._timeout = 0;
        _this._elapsed = 0;
        // private _hrtime: bigint | undefined = undefined;
        _this._hrtime = undefined;
        var opt = _.defaultsDeep(config, {
            Timeout: 0
        });
        _this._running = false;
        _this._expired = false;
        if (_.isNumber(opt.Timeout)) {
            _this._timeout = opt.Timeout;
        }
        _this.Init(_this._timeout);
        return _this;
    }
    Object.defineProperty(Stopwatch, "EVENTS", {
        get: function () {
            return {
                EXPIRED: "expired",
                STARTED: "started",
                STOPPED: "stopped",
                RESET: "reset"
            };
        },
        enumerable: false,
        configurable: true
    });
    Stopwatch.prototype.Init = function (timeout) {
        this._timeout = timeout;
        this.Reset();
    };
    Stopwatch.prototype.Reset = function () {
        if (this._expiredTimeout) {
            clearTimeout(this._expiredTimeout);
            this._expiredTimeout = undefined;
        }
        var when = this.Get();
        this._running = false;
        this._expired = false;
        this._hrtime = undefined;
        this._elapsed = 0;
        this.emit(Stopwatch.EVENTS.RESET, 0, when);
    };
    Stopwatch.prototype.Start = function () {
        var _this = this;
        if (false === this._running) {
            if (this._expiredTimeout) {
                clearTimeout(this._expiredTimeout);
                this._expiredTimeout = undefined;
            }
            if (this._timeout > 0) {
                var timeout = void 0;
                timeout = this._timeout - this._elapsed;
                if (timeout <= 0) {
                    timeout = 1;
                }
                else if (timeout > this._timeout) {
                    timeout = this._timeout;
                }
                this._expiredTimeout = setTimeout(function () {
                    _this._expired = true;
                    _this.emit(Stopwatch.EVENTS.EXPIRED, _this.Get());
                }, timeout);
            }
            this._running = true;
            // this._hrtime = hrtime.bigint();
            this._hrtime = process.hrtime();
            this.emit(Stopwatch.EVENTS.STARTED, this.Get());
        }
    };
    Stopwatch.prototype.Stop = function () {
        if (this._expiredTimeout) {
            clearTimeout(this._expiredTimeout);
            this._expiredTimeout = undefined;
        }
        var when = this.Get();
        this._elapsed = when;
        this._running = false;
        this._hrtime = undefined;
        this.emit(Stopwatch.EVENTS.STOPPED, when);
    };
    Stopwatch.prototype.Restart = function () {
        this.Reset();
        this.Start();
    };
    Stopwatch.prototype.Get = function () {
        if (this._hrtime && true === this._running) {
            var hrdiff = process.hrtime(this._hrtime);
            return this._elapsed + (hrdiff[0] * 1000 + hrdiff[1] / 1e6);
            // const hrdiff: bigint = hrtime.bigint() - this._hrtime;
            // return this._elapsed + convertHrtime(hrdiff);
        }
        return this._elapsed;
    };
    Object.defineProperty(Stopwatch.prototype, "Running", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stopwatch.prototype, "Stopped", {
        get: function () {
            return !this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stopwatch.prototype, "Expired", {
        get: function () {
            return this._expired;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stopwatch.prototype, "NotExpired", {
        get: function () {
            return !this._expired;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stopwatch.prototype, "Timeout", {
        get: function () {
            return this._timeout;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stopwatch.prototype, "Elapsed", {
        get: function () {
            return this.Get();
        },
        enumerable: false,
        configurable: true
    });
    return Stopwatch;
}(EventEmitter));
exports.Stopwatch = Stopwatch;
//# sourceMappingURL=stopwatch.js.map