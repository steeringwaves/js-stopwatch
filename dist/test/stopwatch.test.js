/* eslint-env node,mocha,jest */
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
var Stopwatch = require("../stopwatch").Stopwatch;
describe("Stopwatch", function () {
    beforeAll(function () {
        jest.useFakeTimers();
    });
    it("Get/Stop/Reset/Expired", function () {
        var expired_count = 0;
        var expired_time = 0;
        var stopwatch = new Stopwatch();
        stopwatch.Init(5000);
        stopwatch.Start();
        stopwatch.on(Stopwatch.EVENTS.EXPIRED, function (when) {
            expired_time = when;
            expired_count++;
        });
        /* Tick, Elapsed, Stop, Reset, Expired */
        var cases = [
            [1000, 1000, false, false, false],
            [1000, 2000, false, false, false],
            [1000, 3000, true, false, false],
            [1000, 3000, true, false, false],
            [1000, 3000, false, false, false],
            [1000, 4000, false, true, false],
            [1000, 1000, false, false, false],
            [1000, 2000, false, false, false],
            [1000, 3000, false, false, false],
            [1000, 4000, false, false, false],
            [1000, 5000, false, false, true],
            [1000, 6000, false, false, true],
            [1000, 7000, false, true, true],
            [1000, 1000, false, true, false]
        ];
        for (var i = 0; i < cases.length; i++) {
            jest.advanceTimersByTime(cases[i][0]);
            var elapsed = stopwatch.Get();
            var expired = stopwatch.Expired;
            // should return elapsed time of ${cases[i][1]} ms and have expired flag set to ${cases[i][4]}
            expect(elapsed).toEqual(cases[i][1]);
            expect(expired).toEqual(cases[i][4]);
            if (true === cases[i][2]) {
                stopwatch.Stop();
            }
            else if (false === stopwatch.Running) {
                stopwatch.Start();
            }
            if (true === cases[i][3]) {
                stopwatch.Reset();
                stopwatch.Start();
            }
        }
        // should fire expired event once at 5000 ms
        expect(expired_time).toEqual(5000);
        expect(expired_count).toEqual(1);
    });
});
//# sourceMappingURL=stopwatch.test.js.map