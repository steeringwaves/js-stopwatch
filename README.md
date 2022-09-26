# js-stopwatch

A node utility to help keep track of time.

## Example

```js
const { Stopwatch } = require("@steeringwaves/stopwatch");

const stopwatch = new Stopwatch();
stopwatch.Init(5000);
stopwatch.Start();

stopwatch.on(Stopwatch.EVENTS.EXPIRED, (when) => {
	console.log("expired at", when);
	stopwatch.Restart();
});

setInterval(() => {
	console.log("stopwatch time:", stopwatch.Get());
}, 1000);

```
