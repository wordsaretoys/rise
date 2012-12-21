/**
	wrapper around GL texture
	
	@namespace RISE
	@class texture
**/

RISE.prototypes.texture = {

	/**
		bind the texture to a specified texture unit

		used in conjunction with shader.activate()
		the sampler parameter is available from the activated shader
		
		@method bind
		@param index the index of the GL texture unit, range {0..MAX_TEXTURE_IMAGE_UNITS}
		@param sampler object reference to the sampler variable
	**/

	bind: function(index, sampler) {
		var gl = this.gl;
		gl.uniform1i(sampler, index);
		gl.activeTexture(gl.TEXTURE0 + index);
		gl.bindTexture(gl.TEXTURE_2D, this.id);  
	},
	
	/**
		release GL resources held by this object
		
		@method release
	**/
	
	release: function() {
		this.gl.deleteTexture(this.id);
	}
	
};

/**
	create texture object from a image/bitmap

	@method createTexture
	@param GL context object
	@param bmp image, imageData, or custom bitmap
	@return new texture object
**/

RISE.createTexture = function(gl, bmp) {
	var o = Object.create(RISE.prototypes.texture);
	o.gl = gl;
	
	o.id = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, o.id);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bmp.width, bmp.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, bmp.data);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return o;
};

