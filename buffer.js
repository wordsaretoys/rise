/**
	growable buffer, any type
	
	@namespace RISE
	@class buffer
**/

RISE.prototypes.buffer = {

	STARTING_LENGTH: 16,

	/**
		place a variable list of of values into the buffer,
		growing the buffer if necessary, and advance to the
		next buffer position
		
		@method set
		@param list of values
	**/
	
	set: function() {
		var i, il = arguments.length;
		this.grow(il);
		for (i = 0; i < il; i++) {
			this.data[this.length++] = arguments[i];
		}
	},

	/**
		increase the size of the buffer if necessary
		
		@method grow
		@param n number of values to grow by
	**/
	
	grow: function(n) {
		var newSize = this.length + n;
		var newBuffer, l;
		if (newSize > this.data.length) {
			// find smallest power of 2 greater than newSize
			l = Math.pow(2, Math.ceil(Math.log(newSize) / Math.LN2));
			newBuffer = new (this.type)(l);
			newBuffer.set(this.data);
			this.data = newBuffer;
		}
	},

	/**
		copy/append another buffer into this one
		
		@method copy
		@param buffer another buffer object
	**/
	
	copy: function(buffer) {
		this.grow(buffer.length);
		this.data.set(buffer.data, this.length);
		this.length += buffer.length;
	},

	/**
		reset the buffer to its first position
		
		@method reset
	**/
	
	reset: function() {
		this.length = 0;
	}
};

/**
	create a new buffer object
	
	@method createBuffer
	@param type array type (Float32Array, Int8Array, etc)
	@return new buffer object
**/

RISE.createBuffer = function(type) {

	var o = Object.create(RISE.prototypes.buffer);
	
	o.type = type;
	o.data = new type(o.STARTING_LENGTH);
	o.length = 0;

	return o;
};

