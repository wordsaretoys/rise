/**
	wrapper around GL shader
	
	@namespace RISE
	@class shader
**/

RISE.prototypes.shader = {

	/**
		activates the shader program
		
		@method activate
	**/
	
	activate: function() {
		this.gl.useProgram(this.program);
	},

	/**
		release GL resources held by this object
		
		@method release
	**/
	
	release: function() {
		var gl = this.gl;
		var shader = gl.getAttachedShaders(this.program);
		var i, il;
		for (i = 0, il = shader.length; i < il; i++) {
			gl.detachShader(this.program, shader[i]);
			gl.deleteShader(shader[i]);
		}
		gl.deleteProgram(this.program);
	}

};

/**
	create a shader program object
	
	compiles the code into a GL program object. references to all 
	specified uniforms and samples are also added to this object.

	@method createShader
	@param GL context
	@param vertex string containing the vertex shader code to compile
	@param fragment string containing the fragment shader code to compile
	@param attributes array of all attribute variables referenced in vertex shader
	@param uniforms array of all uniform variables referenced in the shaders
	@param samplers array of all sampler variables referenced in the shaders
	@return new program object
**/

RISE.createShader = function(gl, vertex, fragment, attributes, uniforms, samplers) {

	attributes = attributes || [];
	uniforms = uniforms || [];
	samplers = samplers || [];

	// compile the vertex shader
	var vobj = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vobj, vertex);
	gl.compileShader(vobj);
	if (!gl.getShaderParameter(vobj, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vobj));
		throw "RISE.createShader couldn't compile vertex shader";
	}

	// compile the fragment shader
	var fobj = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fobj, fragment);
	gl.compileShader(fobj);
	if (!gl.getShaderParameter(fobj, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fobj));
		throw "RISE.createShader couldn't compile fragment shader";
	}

	// create and link the shader program
	var prog = gl.createProgram();

	gl.attachShader(prog, vobj);
	gl.attachShader(prog, fobj);
	gl.linkProgram(prog);

	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(prog));
		throw "RISE.createShader couldn't link shader program";
	}

	var o = Object.create(RISE.prototypes.shader);
	o.program = prog;
	o.gl = gl;

	// add attribute, uniform, and sampler variables
	var i, il, n;
	for (i = 0, il = attributes.length; i < il; i++) {
		n = attributes[i];
		o[n] = gl.getAttribLocation(prog, n);
	}
	for (i = 0, il = uniforms.length; i < il; i++) {
		n = uniforms[i];
		o[n] = gl.getUniformLocation(prog, n);
	}
	for (i = 0, il = samplers.length; i < il; i++) {
		n = samplers[i];
		o[n] = gl.getUniformLocation(prog, n);
	}

	return o;
};

