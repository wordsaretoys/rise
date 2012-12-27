/**
	bitmap plus pattern generators
	used to create texture objects
	
	@namespace RISE
	@class bitmap
**/

RISE.prototypes.bitmap = {

	/**
		fill in a single pixel on the bitmap
		
		@method set
		@param x, y coordinates of point to fill
		@param color color to fill it with
	**/
	
	set: function(x, y, color) {
		this.view[Math.floor(x) + this.width * Math.floor(y)] = color;
	},
	
	/**
		return a single pixel on the bitmap
		
		@method get
		@param x, y coordinates of point to return
		@return color at point
	**/
	
	get: function(x, y) {
		return this.view[Math.floor(x) + this.width * Math.floor(y)];
	},

	/**
		blend a single pixel on the bitmap
		
		@method blend
		@param x, y coordinates of point to blend
		@param color to fill it with
		@param blend mixing factor (0..1)
	**/
	
	blend: function(x, y, color, blend) {
		var i = Math.floor(x) + this.width * Math.floor(y);
		this.view[i] = RISE.misc.mixRGBA(this.view[i], color, blend);
	},
	
	/**
		enforce tiling rules for coordinates
		
		@method tile(X|Y)
		@method x, y, coordinates of point
		@return corrected coordinates
	**/
	
	tileX: function(x) {
		return (x >= this.width) ? 0 : (x < 0) ? this.width - 1 : x;
	},
	
	tileY: function(y) {
		return (y >= this.height) ? 0 : (y < 0) ? this.height - 1 : y;
	},

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
		var il = Math.round(this.width * this.height * reps);
		var x, y, i;
		
		x = Math.floor(scale(Math.random(), 0, this.width));
		y = Math.floor(scale(Math.random(), 0, this.height));
		for (i = 0; i < il; i++) {

			this.blend(x, y, color, blend);
			
			if (Math.random() < p0) {
				x++;
			}
			if (Math.random() < p1) {
				y++;
			}
			if (Math.random() < p2) {
				x--;
			}
			if (Math.random() < p3) {
				y--;
			}
			
			x = this.tileX(x);
			y = this.tileY(y);
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
		draw a line across an image (with tiling)
		
		blend MUST be in the range (0..1)

		@method scratch
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
		@param x, y number, starting point of scratch
		@param dx, dy number, direction of scratch
		@param len number, length of scratch
	**/
	
	scratch: function(blend, color, x, y, dx, dy, len) {
		
		for (var i = 0; i < len; i++) {
			this.blend(x, y, color, blend);
			x = this.tileX(x + dx);
			y = this.tileY(y + dy);			
		}
	},
	
	/**
		draw a tiled curve across an image
		
		blend MUST be in the range (0..1)
		curve SHOULD be in the range (0..1)

		@method sweep
		@param reps number, multiplier for iterations
		@param blend number, multipler for blending
		@param color number, color value in 0xAABBGGRR format
		@param curve number, curve factor
	**/
	
	sweep: function(reps, blend, color, curve) {
		var scale = RISE.misc.scale;
		var il = Math.round(this.width * this.height * reps);
		var x = scale(Math.random(), 0, this.width);
		var y = scale(Math.random(), 0, this.height);
		var dx = scale(Math.random(), -1, 1);
		var dy = scale(Math.random(), -1, 1);
		for (var i = 0; i < il; i++) {
			this.blend(x, y, color, blend);
			x = this.tileX(x + dx);
			y = this.tileY(y + dy);
			dx = dx + scale(Math.random(), -curve, curve);
			dy = dy + scale(Math.random(), -curve, curve);
			dd = 2 * Math.sqrt(dx * dx + dy * dy);
			dx /= dd;
			dy /= dd;
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

