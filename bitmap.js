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
		@param c number, intensity
	**/
	
	fill: function(c) {
		var dt = this.data;
		var il = this.length;
		for (var i = 0; i < il; i++) {
			dt[i] = c;
		}
	},
	
	/**
		generate a pattern by random walking across image
		
		blend MUST be the range (0..1)
		p0-p3 MUST be in range (0...1)
		
		@method walk
		@param reps number, multiplier for iterations
		@param blend number, multipler for blending
		@param c number, intensity to blend on each pass
		@param p0 number, chance of moving +x on each pass
		@param p1 number, chance of moving +y on each pass
		@param p2 number, chance of moving -x on each pass
		@param p3 number, chance of moving -y on each pass
	**/
		
	walk: function (reps, blend, c, p0, p1, p2, p3) {
		var scale = RISE.math.scale;
		var w = this.width;
		var h = this.height;
		var dt = this.data;
		var il = Math.round(this.length * reps);
		var dnelb = 1 - blend;
		var x, y, i, j, r;
		
		x = Math.floor(scale(Math.random(), 0, w));
		y = Math.floor(scale(Math.random(), 0, h));
		for (i = 0; i < il; i++) {
		
			j = x + w * y;
			dt[j] = dt[j] * dnelb + c * blend;
			
			r = Math.random();
			
			if (r < p0) {
				x++;
				if (x >= w) {
					x = 0;
				}
			}
			if (r < p1) {
				y++;
				if (y >= h) {
					y = 0;
				}
			}
			if (r < p2) {
				x--;
				if (x < 0) {
					x = w - 1;
				}
			}
			if (r < p3) {
				y--;
				if (y < 0) {
					y = h - 1;
				}
			}
		}
	}

};

/**
	creates a new bitmap object
	
	@method createBitmap
	@param sz number size, must be power of 2
	@return object
**/

RISE.createBitmap = function(sz) {
	var o = Object.create(RISE.prototypes.bitmap);
	o.width = sz;
	o.height = sz;
	o.length = sz * sz;
	o.data = new Uint8Array(o.length);
	return o;
};

