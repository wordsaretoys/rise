/**
	vector in 3-space plus standard operations
	
	@namespace RISE
	@class vector
**/

RISE.prototypes.vector = {

	/**
		set the elements of the vector
		
		@method set
		@param x any real number
		@param y any real number
		@param z any real number
		@return the object itself
	**/
	
	set: function(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		return this;
	},
	
	/**
		copy elements from another vector

		@method copy
		@param a object to copy from
		@return the object itself
	**/
	
	copy: function(a) { 
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		return this;
	},
	
	/**
		add another vector to this one
		
		@method add
		@param a vector to add
		@return the vector, added
	**/
	
	add: function(a) {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;
		return this;
	},
	
	/**
		subtract another vector from this one
		
		@method sub
		@param a vector to subtract
		@return the vector, subtracted
	**/
	
	sub: function(a) {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;
		return this;
	},
	
	/**
		multiply this vector by a constant
		
		@method mul
		@param c scalar to multiply
		@return the vector, multiplied
	**/
	
	mul: function(c) {
		this.x *= c;
		this.y *= c;
		this.z *= c;
		return this;
	},
	
	/**
		divide this vector by a constant
		
		return zero-length vector if constant is zero
		
		@method div
		@param c constant to divide by
		@return the vector, divided
	**/
	
	div: function(c) {
		if (c)
		{
			this.x /= c;
			this.y /= c;
			this.z /= c;
		}
		else
			this.set(0, 0, 0);
		return this;
	},
	
	/**
		negate this vector
		
		@method neg
		@return the vector, negated
	**/
	
	neg: function() {
		return this.set(-this.x, -this.y, -this.z); 
	},
	
	/**
		return the length of the vector
		
		@method length
		@return the length of the vector
	**/
	
	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},

	/**
		get distance between this vector and another
		
		@method distance
		@param a vector 
		@return distance between this vector and a
	**/
	
	distance: function(a) {
		var dx = this.x - a.x;
		var dy = this.y - a.y;
		var dz = this.z - a.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	},

	/**
		get square of distance between this vector and another
		
		@method distsqrd
		@param a vector 
		@return distance^2 between this vector and a
	**/
	
	distsqrd: function(a) {
		var dx = this.x - a.x;
		var dy = this.y - a.y;
		var dz = this.z - a.z;
		return dx * dx + dy * dy + dz * dz;
	},

	/**
		normalize this vector
		
		@method norm
		@return this vector, normalized
	**/
	
	norm: function() {
		var l = this.length();
		return this.div(l);
	},

	/**
		obtain dot product between this vector and another
		
		@method dot
		@param a vector
		@return dot product between this vector and a
	**/
	
	dot: function(a) {
		return this.x * a.x + this.y * a.y + this.z * a.z;
	},

	/**
		obtain cross product between this vector and another
		
		@method cross
		@param a vector
		@return this vector crossed with a
	**/
	
	cross: function(a) {
		var tx = this.x;
		var ty = this.y;
		var tz = this.z;
		this.x = ty * a.z - tz * a.y;
		this.y = tz * a.x - tx * a.z;
		this.z = tx * a.y - ty * a.x;
		return this;
	},

	/**
		copy vector data into array
		
		@method toArray
		@param a array to copy to, defaults to new empty array
		@return array containing elements [x, y, z]
	**/
	
	toArray: function(a) {
		a = a || [];
		a[0] = this.x;
		a[1] = this.y;
		a[2] = this.z;
		return a;
	},
	
	/**
		round the vector by a specified factor
		
		@method nearest
		@param v number to round by
		@param f rounding function, defaults to Math.round
		@return the object, rounded off
	**/
	
	nearest: function(v, f) {
		f = f || Math.round;
		this.x = f(this.x / v) * v;
		this.y = f(this.y / v) * v;
		this.z = f(this.z / v) * v;
		return this;
	},
	
	/**
		transform by a matrix multiplication
		
		@method transform
		@param m array, the matrix to multiply by
		@return the object, transformed
	**/
	
	transform: function(m) {
		var x = m[0] * this.x + m[4] * this.y + m[8] * this.z + m[12];
		var y = m[1] * this.x + m[5] * this.y + m[9] * this.z + m[13];
		var z = m[2] * this.x + m[6] * this.y + m[10] * this.z + m[14];
		var d = m[3] * this.x + m[7] * this.y + m[11] * this.z + m[15];
		return this.set(x / d, y / d, z / d);
	},
	
	/**
		generate a guaranteed perpendicular vector (for length > 0)
		
		@method perp
		@return the object, perpendicularized
	**/
	
	perp: function() {
		var swp;
		if (this.x !== this.y) {
			swp = this.x;
			this.x = this.y;
			this.y = swp;
		} else if (this.x !== this.z) {
			swp = this.x;
			this.x = this.z;
			this.z = swp;
		} else {
			swp = this.y;
			this.y = this.z;
			this.z = swp;
		}
		if (this.x !== 0) {
			this.x = -this.x;
		} else if (this.y !== 0) {
			this.y = -this.y;
		} else {
			this.z = -this.z;
		}
		return this;
	},
	
	/**
		apply modulus n
		
		@method mod
		@param n number to divide by
	**/
	
	mod: function(n) {
		this.x %= n;
		this.y %= n;
		this.z %= n;
		return this;
	}
};

/**
	create a new vector object
	
	@method create
	@param x the x-coordinate of the new vector
	@param y the y-coordinate of the new vector
	@param z the z-coordinate of the new vector
	@return a new vector object
**/

RISE.createVector = function(x, y, z) {
	var o = Object.create(RISE.prototypes.vector);
	o.set(x, y, z);
	return o;
};
