/**
	wrapper around frame animation API
	
	callback function should be of the form:
		function(t) { ... }
	t will be time in ms since last callback
	
	if period is 0 or unspecified, the timer
	will use the frame animation API to run
	as fast as possible
	
	@namespace RISE
	@method createTimer
	@param optional period interval in ms
	@param handler callback function
	@return timer control object
**/

RISE.createTimer = function(handler, period) {

	var requestAnimationFrame =	
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

	var elapsedTime = 0;
	var lastFrameTime = RISE.misc.getPreciseTime();
	var interval = 0;
	var running = false;

	function run() {

		if (running) {
		
			var t = RISE.misc.getPreciseTime();
			var dt = t - lastFrameTime;
			lastFrameTime = t;
			
			// reuse the last interval if this one's too long
			// this protects the app against weird effects if
			// the app was paused/tabbed over for a long time
			if (dt < 500) {
				interval = dt;
			}
			
			handler(interval);

			// set up the next callback
			if (!period && requestAnimationFrame) {
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
