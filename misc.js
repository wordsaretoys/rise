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
	},
	
	/**
		convert 4 color values to RGBA value
		
		@method toRGBA
		@param r, g, b, a real values in range (0..1)
		@return integer representing RBGA value
	**/
	
	toRGBA: function(r, g, b, a) {
		r = Math.round(r * 255) & 0xff;
		g = Math.round(g * 255) & 0xff;
		b = Math.round(b * 255) & 0xff;
		a = Math.round(a * 255) & 0xff;
		return r + (g << 8) + (b << 16) + (a << 24);
	},
	
	/**
		interpolate between two RGBA color values
		
		@method mixRGBA
		@param c1, c2 integers in 0xAABBGGRR color format
		@param mu mixing factor in range (0..1)
		@return mixed color in 0xAABBGGRR format
	**/
	
	mixRGBA: function(c1, c2, mu) {
		var um = 1 - mu;

		var r1 = c1 & 0xff;
		var g1 = (c1 >> 8) & 0xff;
		var b1 = (c1 >> 16) & 0xff;
		var a1 = (c1 >> 24) & 0xff;
	
		var r2 = c2 & 0xff;
		var g2 = (c2 >> 8) & 0xff;
		var b2 = (c2 >> 16) & 0xff;
		var a2 = (c2 >> 24) & 0xff;
		
		var r = Math.round(um * r1 + mu * r2) & 0xff;
		var g = Math.round(um * g1 + mu * g2) & 0xff;
		var b = Math.round(um * b1 + mu * b2) & 0xff;
		var a = Math.round(um * a1 + mu * a2) & 0xff;
		
		return r + (g << 8) + (b << 16) + (a << 24);
	}
	
};

