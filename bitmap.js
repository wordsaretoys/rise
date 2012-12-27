/**
	bitmap plus pattern generators
	used to create texture objects
	
	@namespace RISE
	@class bitmap
**/

RISE.prototypes.bitmap = {

	/**
		fills a bitmap with a specified color
		
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
		generate a pattern by random walking across bitmap
		
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
		var scale = RISE.misc.scale;
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
		blends color into the bitmap at random points
		
		@method stipple
		@param reps number, multiplier for iterations
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
	**/
	
	stipple: function(reps, blend, color) {
		var dt = this.view;
		var scale = RISE.misc.scale;
		var mixRGBA = RISE.misc.mixRGBA;
		var l = this.width * this.height;
		var il = Math.round(l * reps);
		var i;
		
		for (i = 0; i < il; i++) {
			j = Math.floor(scale(Math.random(), 0, l));
			dt[j] = mixRGBA(dt[j], color, blend);
		}
	},
	
	/**
		draw a line across an image (with wrapping)
		
		blend MUST be the range (0..1)

		@method scratch
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
		@param x, y number, starting point of scratch
		@param dx, dy number, direction of scratch
		@param len number, length of scratch
	**/
	
	scratch: function(blend, color, x, y, dx, dy, len) {
		var dt = this.view;
		var mixRGBA = RISE.misc.mixRGBA;
		var w = this.width;
		var h = this.height;
		var dnelb = 1 - blend;
		var i, j;
		
		for (i = 0; i < len; i++) {
		
			j = (Math.floor(x) + w * Math.floor(y));
			dt[j] = dt[j] * dnelb + color * blend;
			
			x += dx;
			y += dy;
			
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
		}
	},
	
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

