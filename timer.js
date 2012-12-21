/**
	wrapper around frame animation API
	
	callback function should be of the form:
		function(t) { ... }
	t will be time in ms since last callback
	
	@namespace RISE
	@method createTimer
	@param period interval in ms
	@param handler callback function
	@return timer control object
**/

RISE.createTimer = function(period, handler) {

	var requestAnimationFrame =	
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

	var maxWaitTime = period * 10;
	var elapsedTime = 0;
	var lastFrameTime = RISE.misc.getPreciseTime();
	var lastHandleTime = 0;
	var running = false;

	function run() {

		if (running) {
		
			var t = RISE.misc.getPreciseTime();
			var dt = t - lastFrameTime;
			lastFrameTime = t;
			
			// throw out any interval greater than 10 * period
			if (dt > maxWaitTime) {
				dt = period;
			}
			
			// we use elapsed time to drive events as it won't
			// update when the application is paused. using the
			// system time throws up all kinds of trouble here.
			elapsedTime += dt;
			
			var et = elapsedTime - lastHandleTime;
			
			// if we've gone past the timer period
			if (et >= period) {
				handler(et);
				lastHandleTime = elapsedTime;
			}

			// set up the next callback
			if (requestAnimationFrame) {
				requestAnimationFrame(run);
			} else {
				setTimeout(run, period);
			}
		}

	}

	// return a control object	
	return {
		start: function() {
			running = true;
			run();
		},
		stop: function() {
			running = false;
		},
		isRunning: function() {
			return running;
		}
	};

};
