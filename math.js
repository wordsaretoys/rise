/**
	useful math functions not available in JS math
	
	@namespace RISE
	@class math
**/

RISE.math = {

	/**
		return the sign of a number
		
		@method sign
		@param n number to test
		@return -1 if negative, 0 if zero, 1 if positive
	**/
	
	sign: function(n) {
		return n > 0 ? 1 : (n < 0 ? -1 : 0);
	},
	
	/**
		clamp a number to a set of limits
		
		@method clamp
		@param n number to clamp
		@param l number representing lower bound
		@param h number representing upper bound
		@return clamped value
	**/

	clamp: function(n, l, h) {
		return Math.min(Math.max(n, l), h);
	},
	
	/**
		scale a number to specified limits
		
		@method scale
		@param x number in range (0..1)
		@param l lower bound
		@param u upper bound
		@return scaled value
	**/
	
	scale: function(x, l, u) {
		return l + (u - l) * x;
	},

	/**
		linear interpolation
		
		@method lerp
		@param y1 lower value
		@param y2 upper value
		@param mu mixing factor (0..1)
		@return interpolated value between (y1, y2)
	**/
	
	lerp: function(y1, y2, mu) {
		return y1 * (1.0 - mu) + y2 * mu;
	},

	/**
		cosine interpolation
		
		@method cerp
		@param y1 lower value
		@param y2 upper value
		@param mu mixing factor (0..1)
		@return interpolated value between (y1, y2)
	**/
	
	cerp: function(y1, y2, mu) {
		var mu2 = (1.0 - Math.cos(mu * Math.PI)) / 2.0;
		return lerp(y1, y2, mu2);
	},
	
	/**
		multiplies two 4x4 matrices
		
		@method mulMatrix
		@param a array, first matrix (WILL be overwritten)
		@param b array, second matrix
		@return array, product matrix
	**/
	
	mulMatrix: function(a, b) {
		// generate the product in a set of temporary variables
		var r0 = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
		var r1 = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
		var r2 = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
		var r3 = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

		var r4 = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
		var r5 = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
		var r6 = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
		var r7 = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

		var r8 = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
		var r9 = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
		var r10 = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
		var r11 = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

		var r12 = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
		var r13 = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
		var r14 = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
		var r15 = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
		
		// overwrite the first matrix
		a[0] = r0;
		a[1] = r1;
		a[2] = r2;
		a[3] = r3;
		
		a[4] = r4;
		a[5] = r5;
		a[6] = r6;
		a[7] = r7;
		
		a[8] = r8;
		a[9] = r9;
		a[10] = r10;
		a[11] = r11;
		
		a[12] = r12;
		a[13] = r13;
		a[14] = r14;
		a[15] = r15;

		return a;
	}

};

