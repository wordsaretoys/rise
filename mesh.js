/**
	wrapper around vertex buffer object
	
	@namespace RISE
	@class mesh
**/

RISE.prototypes.mesh = {

	/**
		generate a GL buffer from vertex/index data
		
		@method build
		@param vb vertex data buffer
		@param ib index data buffer
	**/
	
	build: function(vb, ib) {
		var gl = this.gl;
		
		// allocate and fill vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex);
		gl.bufferData(gl.ARRAY_BUFFER, vb.data.subarray(0, vb.length), gl.STATIC_DRAW);
		this.vertexCount = vb.length;
		
		// allocate and fill index buffer object, if data is present
		if (ib) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib.data.subarray(0, ib.length), gl.STATIC_DRAW);
			this.indexCount = ib.length;
		}
	},

	/**
		draw the mesh

		@method draw
	**/
	
	draw: function() {
		var gl = this.gl;
		var i, il, attr, acc;
		
		// bind the vertex/index data buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);

		// enable each attribute and indicate its position within the data buffer
		for (acc = 0, i = 0, il = this.attribute.length; i < il; i++) {
			attr = this.attribute[i];
			gl.enableVertexAttribArray(attr.id);
			gl.vertexAttribPointer(attr.id, attr.size, gl.FLOAT, false, 
				this.stride * Float32Array.BYTES_PER_ELEMENT, acc * Float32Array.BYTES_PER_ELEMENT);
			acc += attr.size;
		}
		
		// draw the vertex arrays (by index, if present)
		if (this.indexCount > 0) {
			gl.drawElements(this.drawPrimitive, this.indexCount, gl.UNSIGNED_SHORT, 0);
		} else {
			gl.drawArrays(this.drawPrimitive, 0, this.vertexCount / this.stride);
		}

		// disable each attribute
		for (i = 0, il = this.attribute.length; i < il; i++)
			gl.disableVertexAttribArray(this.attribute[i].id);
	},
	
	/**
		release GL resources held by this object
		
		@method release
	**/
	
	release: function() {
		this.gl.deleteBuffer(this.vertex);
		this.gl.deleteBuffer(this.index);
	}

};

/**
	create a new mesh object
	
	id and sz must be the same length. typically,
	the call will be of the form
	
		mesh = RISE.createMesh( gl, [ shader.position, shader.normal ], [3, 3] );
		
	see the shader object for a similar convention
	
	@method createMesh
	@param gl GL context object
	@param id array of attribute names
	@param sz array of attribute float sizes
	@param dp draw primitive, defaults to TRIANGLES
	@return a new object
**/

RISE.createMesh = function(gl, id, sz, dp) {

	if (id.length !== sz.length) {
		throw "RISE.createMesh must be called with arrays of the same length.";
	}

	var o = Object.create(RISE.prototypes.mesh);
	
	o.gl = gl;
	o.drawPrimitive = dp || gl.TRIANGLES;

	o.vertex = gl.createBuffer();
	o.index = gl.createBuffer();
	o.vertexCount = 0;
	o.indexCount = 0;

	// create the attribute table and determine stride
	for (var i = 0, s = 0, a = []; i < id.length; i++) {
		a.push( { id: id[i], size: sz[i] } );
		s += sz[i];
	}

	o.attribute = a;
	o.stride = s;

	return o;
};

