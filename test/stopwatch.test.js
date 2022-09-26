/* eslint-env node,mocha,jest */
/* eslint-disable no-unused-vars */

/* eslint-enable no-unused-vars */

const { Stopwatch } = require("../stopwatch");

describe("Stopwatch", () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	it("Get/Stop/Reset/Expired", () => {
		let expired_count = 0;
		let expired_time = 0;

		const stopwatch = new Stopwatch();
		stopwatch.Init(5000);
		stopwatch.Start();

		stopwatch.on(Stopwatch.EVENTS.EXPIRED, (when) => {
			expired_time = when;
			expired_count++;
		});

		/* Tick, Elapsed, Stop, Reset, Expired */
		const cases = [
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

		for (let i = 0; i < cases.length; i++) {
			jest.advanceTimersByTime(cases[i][0]);
			const elapsed = stopwatch.Get();
			const expired = stopwatch.Expired;

			// should return elapsed time of ${cases[i][1]} ms and have expired flag set to ${cases[i][4]}
			expect(elapsed).toEqual(cases[i][1]);
			expect(expired).toEqual(cases[i][4]);

			if (true === cases[i][2]) {
				stopwatch.Stop();
			} else if (false === stopwatch.Running) {
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
