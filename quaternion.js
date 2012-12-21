/**
	quaternion in 3-space plus standard operations
	
	@namespace RISE
	@class quaternion
**/

RISE.prototypes.quaternion = {

	/**
		set the elements of the quaternion
		
		@method set
		@param x any real number
		@param y any real number
		@param z any real number
		@param w any real number
		@return the object itself
	**/
	
	set: function(x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 0;
		return this;
	},

	/**
		copy elements from another quaternion

		@method copy		
		@param a object to copy from
		@return the object itself
	**/
	
	copy: function(a) { 
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		this.w = a.w;
		return this;
	},
	
	/**
		multiply another quaternion by this one
		result = this * a

		@method mul	
		@param a quaternion to multiply
		@return the object itself, multiplied
	**/
	
	mul: function(a) {
		var tx = this.x;
		var ty = this.y;
		var tz = this.z;
		var tw = this.w;
		this.x = tw * a.x + tx * a.w + ty * a.z - tz * a.y;
		this.y = tw * a.y + ty * a.w + tz * a.x - tx * a.z;
		this.z = tw * a.z + tz * a.w + tx * a.y - ty * a.x;
		this.w = tw * a.w - tx * a.x - ty * a.y - tz * a.z;
		return this;
	},

	/**
		negate the quaternion
		
		@method neg
		@return the object iself, negated
	**/
	
	neg: function() {
		return this.set(-this.x, -this.y, -this.z, this.w); 
	},

	/**
		normalize the quaternion
		
		@method norm
		@return the object itself, normalized
	**/
	
	norm: function()
	{
		var mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		return this.set(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
	},

	/**
		copy quaternion data into array
		
		@method toArray
		@param a array to copy to, defaults to new empty array
		@return array containing elements [x, y, z, w]
	**/
	
	toArray: function(a)
	{
		a = a || [];
		a[0] = this.x;
		a[1] = this.y;
		a[2] = this.z;
		a[3] = this.w;
		return a;
	},
	
	/**
		generate matrix from quaternion
		
		@method toMatrix
		@param m array to copy to, defaults to new empty array
		@return 16-element array containing generated matrix
	**/
	
	toMatrix: function(m) {
		m = m || [];
		m[0] = 1.0 - 2.0 * (this.y * this.y + this.z * this.z);
		m[1] = 2.0 * (this.x * this.y + this.z * this.w);
		m[2] = 2.0 * (this.x * this.z - this.y * this.w);
		m[3] = 0;
		m[4] = 2.0 * (this.x * this.y - this.z * this.w);
		m[5] = 1.0 - 2.0 * (this.x * this.x + this.z * this.z);
		m[6] = 2.0 * (this.z * this.y + this.x * this.w);
		m[7] = 0;
		m[8] = 2.0 * (this.x * this.z + this.y * this.w);
		m[9] = 2.0 * (this.y * this.z - this.x * this.w);
		m[10] = 1.0 - 2.0 * (this.x * this.x + this.y * this.y);
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return m;
	},
	
	/**
		sets quaternion data from axis-angle representation
		
		@method setFromAxisAngle
		@param x any real number
		@param y any real number
		@param z any real number
		@param ang any real number
		@return the object itself
	**/
	
	setFromAxisAngle: function(x, y, z, ang) {
		var ha = Math.sin(ang / 2);
		return this.set(x * ha, y * ha, z * ha, Math.cos(ang / 2));
	},
	
	/**
		smooth linear interpolation between two quaternions
		
		@method slerp
		@param a object, quaternion
		@param b object, quaternion
		@param m number, interpolation factor
		@return interpolated quaternion
	**/
	
	slerp: function(a, b, m) {
		this.x += m * (b.x - a.x);
		this.y += m * (b.y - a.y);
		this.z += m * (b.z - a.z);
		this.w += m * (b.w - a.w);
		return this.norm();
	}
	
	
};

/**
	create a new quaternion object
	
	@method createQuaternion
	@param x the x-coordinate of the axis vector
	@param y the y-coordinate of the axis vector
	@param z the z-coordinate of the axis vector
	@param w the rotation around the axis vector
	@return new quaternion object
**/

RISE.createQuaternion = function(x, y, z, w) {
	var o = Object.create(RISE.prototypes.quaternion);
	o.set(x, y, z, w);
	return o;
};

