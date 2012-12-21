/**
	canvas object, GL context, plus operations
	
	@namespace RISE
	@class display
**/

RISE.prototypes.display = {

	/**
		adjust display size

		@method setSize
		@param width the new width of the canvas
		@param height the new height of the canvas
	**/

	setSize: function(width, height) {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, width, height);
	}
	
};

/**
	create a new display object
	
	@method createDisplay
	@param id DOM id of a canvas element
	@param alpha turns back-buffer alpha on/off
	@return display object
**/
	
RISE.createDisplay = function(id, alpha) {

	var o = Object.create(RISE.prototypes.display);

	o.canvas = document.getElementById(id);
	if (!o.canvas)
		throw "RISE.createDisplay couldn't create canvas object.";

	try {
		o.gl = o.canvas.getContext("experimental-webgl", {alpha: alpha} );
	}
	catch (e) {
		try {
			o.gl = o.canvas.getContext("webgl", {alpha: alpha} );
		}
		catch (e) {
			throw "RISE.createDisplay couldn't get WebGL context.";
		}
	}

	// just in case the browser didn't throw an exception in WebGL's absence
	if (!o.gl)
		throw "RISE.createDisplay couldn't get WebGL context.";

	return o;
};

