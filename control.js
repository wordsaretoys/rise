/**
	provides keyboard and mouse handling
	
	@namespace RISE
	@class control
**/

RISE.prototypes.control = {

	codeTable: {
		TAB: 9,
		ENTER: 13,
		PAUSE: 19,
		SPACE: 32,
		ESCAPE: 27,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,

		F1: 112, F2: 113, F3: 114, F4: 115,
		F5: 116, F6: 117, F7: 118, F8: 119,
		F9: 120, F10: 121, F11: 122, F12: 123,
		
		A: 65, 	B: 66,	C: 67,	D: 68,
		E: 69,	F: 70,	G: 71,	H: 72,
		I: 73,	J: 74,	K: 75,	L: 76,
		M: 77,	N: 78,	O: 79,	P: 80,
		Q: 81,	R: 82,	S: 83,	T: 84,
		U: 85,	V: 86,	W: 87,	X: 88,
		Y: 89,	Z: 90,

		"0": 48, "1": 49, "2": 50, "3": 51,
		"4": 52, "5": 53, "6": 54, "7": 55,
		"8": 56, "9": 57,
		
		MOUSE1: -1,
		MOUSE2: -2
	},

	/**
		adds an entry to the action table
		
		func will be passed a parameter which will be true if the key or mouse
		button was pressed down, and false if it was released.
		
		@method addAction
		@param name string, short name of action (e.g., "forward")
		@param label string, control label (e.g., "TAB", "MOUSE1", "W")
		@param event function, execute when action triggered
	**/
	
	addAction: function(name, label, event) {
		var code = this.codeTable[label];
		this.addActionByCode(name, code, event);
	},
	
	/**
		adds a code entry to the action table
		
		func will be passed a parameter which will be true if the key or mouse
		button was pressed down, and false if it was released.
		
		@method addActionByCode
		@param name string, short name of action (e.g., "forward")
		@param code number, unicode key value or mouse button code to assign to action
		@param event function, execute when action triggered
	**/
	
	addActionByCode: function(name, code, event) {
		this.action[name] = {
			code: code,
			event: event,
			active: true
		};
	},
	
	/**
		looks up an action by its code
		
		@method lookup
		@param code number, assigned unicode key value or mouse button code
		@return action object, or undefined if no action found
	**/
	
	lookup: function(code) {
		var a, n;
		for (n in this.action) {
			a = this.action[n];
			if (a.active && a.code === code) {
				return a;
			}
		}
		return undefined;
	},

	/**
		set full screen mode (and kick off pointer lock)
	
		MUST be called in the context of a click or key event!
	
		@method setFullscreen
	**/

	setFullscreen: function() {
		var db = document.body;
		db.requestFullscreen = db.requestFullscreen || db.mozRequestFullscreen || 
			db.mozRequestFullScreen || db.webkitRequestFullscreen;
		db.requestFullscreen();
	}

};

/**
	create a control object
	
	@method createControl
	@param new control object
**/

RISE.createControl = function() {

	var o = Object.create(RISE.prototypes.control);
	o.action = [];

	var raw = {
		down: false,
		lock: false,
		lastX: 0,
		lastY: 0,
		dx: 0,
		dy: 0,
		run: false
	};

	// keyboard events we pass to the calling application
	window.addEventListener("keydown", function(e) {
		if (raw.run) {
			var action = o.lookup(e.keyCode);
			if (action) {
				action.event(true);
				return false;
			} else {
				return true;
			}
		}
	}, false);

	window.addEventListener("keyup", function(e) {
		if (raw.run) {
			var action = o.lookup(e.keyCode);
			if (action) {
				action.event(false);
				return false;
			} else {
				return true;
			}
		}
	}, false);

	// but mouse events we handle locally
	document.body.addEventListener("mousedown", function(e) {
		if (raw.run) {
			var action = o.lookup(-e.button);
			if (action) {
				action.event(true);
			}
		
			raw.lastX = e.screenX;
			raw.lastY = e.screenY;
			raw.down = true;

			e.preventDefault();
		}
		return false;
	}, false);
	
	document.body.addEventListener("mouseup", function(e) {
		if (raw.run) {
			var action = o.lookup(-e.button);
			if (action) {
				action.event(false);
			}

			raw.down = false;
		}
		return false;
	}, false);

	document.body.addEventListener("mousemove", function(e) {
		if (raw.run && (raw.down || raw.lock)) {
			// if the movement properties are available
			if (typeof(e.movementX) !== "undefined" ||
			typeof(e.mozMovementX) !== "undefined" ||
			typeof(e.webkitMovementX) !== "undefined") {

				raw.dx += e.movementX || e.mozMovementX || e.webkitMovementX || 0;
				raw.dy += e.movementY || e.mozMovementY || e.webkitMovementY || 0;
				
			} else {
				// if not, fall back to click-n-drag method
				raw.dx += (e.screenX - raw.lastX);
				raw.dy += (e.screenY - raw.lastY);
			}
			raw.lastX = e.screenX;
			raw.lastY = e.screenY;
		}
		return false;
	}, false);
	
	// set handler for full screen change event
	var fullScreenChange = function () {
		var db = document.body;
		if (document.fullScreenElement === db || 
		document.webkitFullscreenElement === db ||
		document.mozFullscreenElement === db ||	
		document.mozFullScreenElement === db) {
			// if we go full screen, we want pointer lock too
			db.requestPointerLock = db.requestPointerLock || 
				db.mozRequestPointerLock || db.webkitRequestPointerLock;
			db.requestPointerLock();
		}
	};

	document.addEventListener("fullscreenchange", fullScreenChange, false);
	document.addEventListener("mozfullscreenchange", fullScreenChange, false);
	document.addEventListener("webkitfullscreenchange", fullScreenChange, false);
	
	// set handler for pointer lock event
	var pointerLockChange = function () {
		var db = document.body;
		// if pointer lock succeeded, set raw flag
		if (document.pointerLockElement === db || 
		document.webkitPointerLockElement === db ||
		document.mozPointerLockElement === db) {
			raw.lock = true;
		} else {
			raw.lock = false;
		}
	};
	
	document.addEventListener('pointerlockchange', pointerLockChange, false);
	document.addEventListener('mozpointerlockchange', pointerLockChange, false);
	document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
	
	// add control and update methods
	// (can't be defined in prototype
	// as they interact with closure)
	o.update = function() {
		o.trackX = raw.dx;
		o.trackY = raw.dy;
		raw.dx = 0;
		raw.dy = 0;
	};
	o.start = function() {
		raw.run = true;
	};
	o.stop = function() {
		raw.run = false;
	};
	
	return o;
};
