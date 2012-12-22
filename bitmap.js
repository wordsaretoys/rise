/**
	bitmap plus pattern generators
	used to create texture objects
	
	@namespace RISE
	@class bitmap
**/

RISE.prototypes.bitmap = {

	/**
		fills a pattern object with a specified intensity
		
		@method fill
		@param color number, color value in 0xAABBGGRR format
	**/
	
	fill: function(color) {
		var dt = this.view;
		var il = dt.length;
		for (var i = 0; i < il; i++) {
			dt[i] = color;
		}
	},
	
	/**
		generate a pattern by random walking across image
		
		blend MUST be the range (0..1)
		p0-p3 MUST be in range (0...1)
		
		@method walk
		@param reps number, multiplier for iterations
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
		@param p0 number, chance of moving +x on each pass
		@param p1 number, chance of moving +y on each pass
		@param p2 number, chance of moving -x on each pass
		@param p3 number, chance of moving -y on each pass
	**/
		
	walk: function (reps, blend, color, p0, p1, p2, p3) {
		var dt = this.view;
		var scale = RISE.math.scale;
		var mixRGBA = RISE.misc.mixRGBA;
		var w = this.width;
		var h = this.height;
		var il = Math.round(w * h * reps);
		var x, y, i, j, r;
		
		x = Math.floor(scale(Math.random(), 0, w));
		y = Math.floor(scale(Math.random(), 0, h));
		for (i = 0; i < il; i++) {
		
			j = x + w * y;
			dt[j] = mixRGBA(dt[j], color, blend);
			
			if (Math.random() < p0) {
				x++;
				if (x >= w) {
					x = 0;
				}
			}
			if (Math.random() < p1) {
				y++;
				if (y >= h) {
					y = 0;
				}
			}
			if (Math.random() < p2) {
				x--;
				if (x < 0) {
					x = w - 1;
				}
			}
			if (Math.random() < p3) {
				y--;
				if (y < 0) {
					y = h - 1;
				}
			}
		}
	},
	
	/**
		generate a pattern by drawing steps across image
		
		blend MUST be the range (0..1)
		brush is a string of characters ("0".."9"). the
		number is the angle to turn by (x10).
		
		@method draw
		@param reps number, multiplier for iterations
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
		@param brush string, list of rotations to execute
	**/
		
	draw: function (reps, blend, color, brush) {
		var dt = this.view;
		var mixRGBA = RISE.misc.mixRGBA;
		var w = this.width;
		var h = this.height;
		var il = Math.round(w * h * reps);
		var bl = brush.length - 1;
		var x = y = dx = 0;
		var dy = 1;
		var i, j, b;
		var a, c, s;
		var nx, ny;
		
		for (i = 0, b = 0; i < il; i++) {
		
			j = x + w * y;
			dt[j] = mixRGBA(dt[j], color, blend);
			
			a = (brush.charAt(b) - 48) * Math.PI / 180;
			c = Math.cos(a);
			s = Math.sin(a);
			nx = dx * c - dy * s;
			ny = dy * c + dx * s;
			dx = nx;
			dy = ny;			
			
			x = Math.round(x + dx);
			y = Math.round(y + dy);
			
			if (x >= w) {
				x = 0;
			}
			if (y >= h) {
				y = 0;
			}
			if (x < 0) {
				x = w - 1;
			}
			if (y < 0) {
				y = h - 1;
			}
			
			b = (b < bl) ? b + 1 : 0;
		}
	}

};

/**
	creates a new RBGA bitmap object
	
	@method createBitmap
	@param sz number size, must be power of 2
	@return object
**/

RISE.createBitmap = function(sz) {
	var o = Object.create(RISE.prototypes.bitmap);
	o.width = sz;
	o.height = sz;
	o.length = sz * sz * 4;
	o.data = new Uint8Array(o.length);
	o.view = new Uint32Array(o.data.buffer);
	return o;
};

