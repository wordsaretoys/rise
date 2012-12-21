/**
	useful misc functions
	
	@namespace RISE
	@class misc
**/

RISE.misc = {

	/**
		retrieve and concatenate text from DOM objects

		@method textOf
		@param ... list of DOM ids
		@return concatenated text from all objects
	**/
	
	textOf: function() {
		var i, il = arguments.length, text = "";
		for (i = 0; i < il; i++) {
			text += document.getElementById( arguments[i] ).innerHTML;
		}
		return text;
	},
	
	/**
		copy members from one object to another
		
		@method extend
		@param dest object to copy members to
		@param src object to copy members from
	**/

	extend: function(dest, src) {
		for (p in src)
			if (src.hasOwnProperty(p))
				dest[p] = src[p];
	},
	
	/**
		create an inheritance chain between two objects
		
		@method chain
		@param a object to extend
		@param b object to copy members from
		@return new object
	**/

	chain: function(a, b) {
		var o = Object.create(a);
		RISE.misc.extend(o, b);
		return o;
	},
	
	/**
		obtain current time at highest available precision
		
		@method getPreciseTime
		@return time in ms
	**/
	
	getPreciseTime: function() {
		if (window.performance.now) {
			return window.performance.now();
		}
		if (window.performance.webkitNow) {
			return window.performance.webkitNow();
		}
		return Date.now();
	}
	
};

