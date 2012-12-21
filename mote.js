/**
	represents a location plus orientation
	may be used as a base class for game objects
	
	@namespace RISE
	@class mote
**/

RISE.prototypes.mote = {

	/**
	 	turn mote on each axis by specified amounts
	 
	 	@method turn
	 	@param x, y, z angles in radians
	**/
	turn: function(x, y, z) {
	
		var rotations = this.rotations;
		var transpose = this.transpose;
		var modelview = this.modelview;
		
		// rotate by specified amounts
		var qx = this.qx.setFromAxisAngle(1, 0, 0, x);
		var qy = this.qy.setFromAxisAngle(0, 1, 0, y);
		var qz = this.qz.setFromAxisAngle(0, 0, 1, z);
		this.rotor.copy(qx.mul(qy).mul(qz).mul(this.rotor).norm());

		// generate rotation matrix
		this.rotor.toMatrix(rotations);

		// generate orientation vectors
		// (front vector inverted for LH coordinate system)
		this.right.set(rotations[0], rotations[4], rotations[8]);
		this.up.set(rotations[1], rotations[5], rotations[9]);
		this.front.set(rotations[2], rotations[6], rotations[10]).neg();

		// generate transpose matrix
		transpose[0] = rotations[0];
		transpose[1] = rotations[4];
		transpose[2] = rotations[8];

		transpose[4] = rotations[1];
		transpose[5] = rotations[5];
		transpose[6] = rotations[9];

		transpose[8] = rotations[2];
		transpose[9] = rotations[6];
		transpose[10] = rotations[10];

		// copy to modelview w/ transformed position
		modelview[0] = rotations[0];
		modelview[1] = rotations[1];
		modelview[2] = rotations[2];

		modelview[4] = rotations[4];
		modelview[5] = rotations[5];
		modelview[6] = rotations[6];

		modelview[8] = rotations[8];
		modelview[9] = rotations[9];
		modelview[10] = rotations[10];
		
		this.updateModelview();
	},
	
	/**
		translate position by specified vector
		
		@method move
		@param x, y, z translation coordinates
	**/
	move: function(x, y, z) {
		this.position.x += x;
		this.position.y += y;
		this.position.z += z;
		this.updateModelview();
	},
	
	/**
		updates modelview matrix with transformed position
		
		@method updateModelview
	**/
	updateModelview: function() {
		var modelview = this.modelview;
		var p = this.position;
		modelview[12] = -(modelview[0] * p.x + modelview[4] * p.y + modelview[8] * p.z);
		modelview[13] = -(modelview[1] * p.x + modelview[5] * p.y + modelview[9] * p.z);
		modelview[14] = -(modelview[2] * p.x + modelview[6] * p.y + modelview[10] * p.z);
	}

};

/**
	create a new mote
	
	@method createMote
	@return new mote object
**/

RISE.createMote = function() {

	var o = Object.create(RISE.prototypes.mote);
	
	o.position = RISE.createVector();
	o.rotor = RISE.createQuaternion(0, 0, 0, 1);
	
	o.front = RISE.createVector();
	o.up = RISE.createVector();
	o.right = RISE.createVector();

	o.rotations = new Float32Array(16);
	o.transpose = new Float32Array(16);
	o.modelview = new Float32Array(16);

	o.qx = RISE.createQuaternion();
	o.qy = RISE.createQuaternion();
	o.qz = RISE.createQuaternion();
	
	o.rotations.set(RISE.math.MAT_ID_4);
	o.transpose.set(RISE.math.MAT_ID_4);
	o.modelview.set(RISE.math.MAT_ID_4);

	o.updateModelview();
			
	return o;
};
