/**
	camera object (mote plus projection matrix)
	
	@namespace RISE
	@class camera
**/

RISE.prototypes.camera = {

	/**
		set camera aspect ratio and viewport
		
		@method size
		@param width, height dimensions of viewport
	**/
	size: function(width, height) {
		var aspectRatio = width / height;
		this.projector[0] = this.viewFactor / aspectRatio;
	}

};

/**
	create a new camera
	
	@method createCamera
	@param viewAngle viewing frustum angle
	@param nearLimit viewing frustum near limit
	@param farLimit viewing frustum far limit
	@return new camera object
**/

RISE.createCamera = function(viewAngle, nearLimit, farLimit) {

	// simulate OO-inheritance by adding camera members to mote object
	var o = RISE.misc.chain( RISE.createMote(), RISE.prototypes.camera );

	// set fixed matrix elements
	o.viewFactor = 1 / Math.tan(viewAngle * Math.PI / 180);
	o.projector = new Float32Array(16);
	var d = nearLimit - farLimit;
	o.projector[0] = o.viewFactor;
	o.projector[5] = o.viewFactor;
	o.projector[10] = (farLimit + nearLimit) / d;
	o.projector[11] = -1;
	o.projector[14] = 2 * nearLimit * farLimit / d;

	return o;
};
