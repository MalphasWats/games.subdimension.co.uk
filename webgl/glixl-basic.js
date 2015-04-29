/* glixl
	v 0.1  [2015-01-11]
*/

var glixl = (function(glixl)
{
	
	glixl.initialise = function(app)
	{
		glixl.DEFAULT_VERTEX_SHADER = "attribute vec2 a_position; attribute vec2 a_texCoords; uniform mat3 u_matrix; varying vec2 v_texCoords; void main() { gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1); v_texCoords = a_texCoords; }";
		
		glixl.YUCK_VERTEX_SHADER = "attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0, 1);}"
	
		glixl.DEFAULT_FRAGMENT_SHADER = "precision mediump float;	uniform sampler2D u_image; varying vec2 v_texCoords; void main() { gl_FragColor = texture2D(u_image, v_texCoords); }";
		
		glixl.BASIC_FRAGMENT_SHADER = "void main() { gl_FragColor = vec4(1,0,1,1);}"
		
		
		glixl.canvas = document.getElementsByTagName('canvas')[0];
		if (!glixl.canvas)
			throw new Error("*** ERROR: Could not find canvas element");
			
		glixl.context = glixl.canvas.getContext("webgl");
		if (!glixl.context)
			throw new Error("*** ERROR: Unable to create webgl context");
		
		/* Set texture transparency */	
		glixl.context.blendFunc(glixl.context.SRC_ALPHA, glixl.context.ONE_MINUS_SRC_ALPHA);
		glixl.context.enable ( glixl.context.BLEND ) ;
		
		/* Set up shaders */
		glixl.shaders = []
		//glixl.shaders.push(glixl.create_shader(glixl.DEFAULT_VERTEX_SHADER, 'x-shader/x-vertex'));
		//glixl.shaders.push(glixl.create_shader(glixl.DEFAULT_FRAGMENT_SHADER, 'x-shader/x-fragment'));
		
		glixl.shaders.push(glixl.create_shader(glixl.YUCK_VERTEX_SHADER, 'x-shader/x-vertex'));
		glixl.shaders.push(glixl.create_shader(glixl.BASIC_FRAGMENT_SHADER, 'x-shader/x-fragment'));
		
		glixl.program = glixl.create_program(glixl.shaders);
		glixl.context.useProgram(glixl.program);
		
		/*glixl.DEFAULT_TEXTURE = glixl.context.createTexture();
		glixl.context.bindTexture(glixl.context.TEXTURE_2D, glixl.DEFAULT_TEXTURE);
		glixl.context.texImage2D(glixl.context.TEXTURE_2D, 0, glixl.context.RGBA, 1, 1, 0, glixl.context.RGBA, glixl.context.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255])); // fuschia*/
		
		
		glixl.position_attribute = glixl.context.getAttribLocation(glixl.program, "a_position");
		glixl.context.enableVertexAttribArray(glixl.position_attribute);
		
		//glixl.texture_coordinates = glixl.context.getAttribLocation(glixl.program, "a_texCoords");
		//glixl.context.enableVertexAttribArray(glixl.texture_coordinates);
		
		//glixl.matrix = glixl.context.getUniformLocation(glixl.program, "u_matrix");
		
		
		glixl.projection_matrix = glixl.make2DProjection(glixl.canvas.clientWidth, glixl.canvas.clientHeight);
		
		
		glixl.textures = {}
		glixl.scene = [];
		
		
		glixl.prevTS = 0;
		glixl.fps = 0;
		
		/* Initialise the app */
		glixl.app = app;
		glixl.app.init();
	}
	
	glixl.start = function(app)
	{
		//TODO allow objects to be passed in.
		glixl.initialise(new app);
		
		glixl.app_loop = function(ts)
		{
			glixl.update(ts);
			glixl.app.update();
			
			glixl.render();
			window.requestAnimationFrame(glixl.app_loop);
		}
		
		window.requestAnimationFrame(glixl.app_loop);
		
	}
	
	glixl.update = function(ts)
	{
		var delta = ts - glixl.prevTS;
		glixl.prevTS = ts;
		
		glixl.fps = 1000 / delta;
	}
	
	glixl.render = function()
	{
		for(var i=0 ; i<glixl.scene.length ; i++)
		{
			//if (glixl.scene[i].is_visible())
				glixl.scene[i].render();
		}
	}
	
	glixl.add_to_scene = function(object)
	{
		glixl.scene.push(object);
	}
	
	
	/* Sprite
	
														*/
	glixl.Sprite = function Sprite(parameters)
	{
		/*if (parameters.texture)
			this.texture = glixl.load_texture(parameters.texture);
			
		else
			this.texture = glixl.DEFAULT_TEXTURE;*/
			
		this.x = parameters.x || 0;
		this.y = parameters.y || 0;
		
		this.width = parameters.width || 1//16;
		this.height = parameters.height || 1//16;
		
		this.angle = parameters.angle || 0;
		this.scale = parameters.scale || 1;
		
		this.dirty = true;
		
		this.buffer = glixl.context.createBuffer();
		glixl.context.bindBuffer(glixl.context.ARRAY_BUFFER, this.buffer);
		glixl.context.bufferData(glixl.context.ARRAY_BUFFER, new Float32Array([
			0, 0,
			0+this.width, 0,
			0, 0+this.height,
			0, 0+this.height,
			0+this.width, 0,
			0+this.width, 0+this.height]), glixl.context.STATIC_DRAW);
			
		glixl.context.vertexAttribPointer(glixl.position_attribute, 2, glixl.context.FLOAT, false, 0, 0);
		
		/*this.texture_buffer = glixl.context.createBuffer();
		glixl.context.bindBuffer(glixl.context.ARRAY_BUFFER, this.texture_buffer);
		glixl.context.bufferData(glixl.context.ARRAY_BUFFER, new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			1, 1]), glixl.context.STATIC_DRAW);
		
		glixl.context.vertexAttribPointer(glixl.texture_coordinates, 2, glixl.context.FLOAT, false, 0, 0);*/
	}
	
	glixl.Sprite.prototype.default_parameters = {
		
		
	};
	
	glixl.Sprite.prototype.render = function()
	{
		glixl.context.bindBuffer(glixl.context.ARRAY_BUFFER, this.buffer);
		glixl.context.vertexAttribPointer(glixl.position_attribute, 2, glixl.context.FLOAT, false, 0, 0);
		/*if (glixl.textures[this.texture] != 'loading')
			glixl.context.bindTexture(glixl.context.TEXTURE_2D, glixl.textures[this.texture]);
		else
			glixl.context.bindTexture(glixl.context.TEXTURE_2D, glixl.DEFAULT_TEXTURE);
		
		if (this.dirty)
		{
			var angleInRadians = this.angle * Math.PI / 180;
			
			var moveOriginMatrix = glixl.makeTranslation(-this.width/2, -this.height/2);
			
			var translationMatrix = glixl.makeTranslation(this.x, this.y);
			var rotationMatrix = glixl.makeRotation(angleInRadians);
			var scaleMatrix = glixl.makeScale(this.scale, this.scale);
			
			// Multiply the matrices.
			var matrix = glixl.multiply_matrix(moveOriginMatrix, scaleMatrix);
			matrix = glixl.multiply_matrix(matrix, rotationMatrix);
			matrix = glixl.multiply_matrix(matrix, translationMatrix);
			matrix = glixl.multiply_matrix(matrix, glixl.projection_matrix);
			
			this.matrix = matrix;
			
			this.dirty = false;
		}
		
	    // Set the matrix.
	    glixl.context.uniformMatrix3fv(glixl.matrix, false, this.matrix);*/
		
		glixl.context.drawArrays(glixl.context.TRIANGLES, 0, 6);
	}
	
	glixl.Sprite.prototype.is_visible = function()
	{
		return ( this.x+this.width/2 > 0 &&
				 this.y+this.height/2 > 0 &&
				 this.x-this.width/2 < glixl.canvas.width &&
				 this.y-this.height/2 < glixl.canvas.height )
	}
	
	
	
	/* Helpers
		
														*/
	glixl.create_shader = function(source, type)
	{
		if (type == "x-shader/x-vertex")
		{
			type = glixl.context.VERTEX_SHADER;
		}
		else if (type == "x-shader/x-fragment")
		{
			type = glixl.context.FRAGMENT_SHADER;
		} 
		else
		{
			throw new Error("*** Error: Unknown shader type");
		}
		
		// Create the shader object
		var shader = glixl.context.createShader(type);

		// Load the shader source
		glixl.context.shaderSource(shader, source);

		// Compile the shader
		glixl.context.compileShader(shader);

		// Check the compile status
		var compiled = glixl.context.getShaderParameter(shader, glixl.context.COMPILE_STATUS);
		if (!compiled) 
		{
			glixl.context.deleteShader(shader);
			var lastError = glixl.context.getShaderInfoLog(shader);
			throw new Error("*** Error: Could not compile shader '" + shader + "' : " + lastError);
		}

		return shader;
	}
	
	glixl.create_program = function(shaders)
	{
		var program = glixl.context.createProgram();
		for (var i = 0; i < shaders.length; i++) 
		{
			glixl.context.attachShader(program, shaders[i]);
		}
		
		glixl.context.linkProgram(program);

		// Check the link status
		var linked = glixl.context.getProgramParameter(program, glixl.context.LINK_STATUS);
		if (!linked) 
		{
		  // something went wrong with the link
		  glixl.context.deleteProgram(program);
		  var lastError = glixl.context.getProgramInfoLog(program);
		  throw new Error("*** Error: Could not link program: " + lastError);
		}
		return program;
	}
	
	glixl.multiply_matrix = function(matrix_a, matrix_b)
		{
			var matrix_c = [];
			for (var a_r=0 ; a_r < 3 ; a_r++)
			{
				for (var b_c=0 ; b_c < 3 ; b_c++)
				{
					matrix_c.push( matrix_a[a_r*3] * matrix_b[b_c] + 
								   matrix_a[a_r*3+1] * matrix_b[b_c+3] + 
								   matrix_a[a_r*3+2] * matrix_b[b_c+6] );
				}
			}
			return matrix_c;
		};
		
	glixl.make2DProjection = function(width, height) {
		  // Note: This matrix flips the Y axis so that 0 is at the top.
		  return [
		    2 / width, 0, 0,
		    0, -2 / height, 0,
		    -1, 1, 1
		  ];
		}
		
	glixl.makeTranslation = function(tx, ty) {
		  return [
		     1,  0, 0,
		     0,  1, 0,
		    tx, ty, 1
		  ];
		}
		
	glixl.makeRotation = function(angleInRadians) {
		  var c = Math.cos(angleInRadians);
		  var s = Math.sin(angleInRadians);
		  return [
		    c,-s, 0,
		    s, c, 0,
		    0, 0, 1
		  ];
		}
		
	glixl.makeScale = function(sx, sy) {
		  return [
		    sx, 0, 0,
		    0, sy, 0,
		    0, 0, 1
		  ];
		}
		
	glixl.load_texture = function(name)
	{
		if (glixl.textures[name])
			return name;
			
		var image = new Image();
		image.src = name;
		image.name = name;
		glixl.textures[image.name] = 'loading'; //Feels a bit hacky
		image.onload = function() {
			glixl.textures[this.name] = glixl.context.createTexture();
			glixl.context.bindTexture(glixl.context.TEXTURE_2D, glixl.textures[this.name]);
			
			// Set up texture so we can render any size image and so we are
			// working with pixels
			glixl.context.texParameteri(glixl.context.TEXTURE_2D, glixl.context.TEXTURE_WRAP_S, glixl.context.CLAMP_TO_EDGE);
			glixl.context.texParameteri(glixl.context.TEXTURE_2D, glixl.context.TEXTURE_WRAP_T, glixl.context.CLAMP_TO_EDGE);
			glixl.context.texParameteri(glixl.context.TEXTURE_2D, glixl.context.TEXTURE_MIN_FILTER, glixl.context.NEAREST);
			glixl.context.texParameteri(glixl.context.TEXTURE_2D, glixl.context.TEXTURE_MAG_FILTER, glixl.context.NEAREST);
			
			glixl.context.texImage2D(glixl.context.TEXTURE_2D, 0, glixl.context.RGBA, glixl.context.RGBA, glixl.context.UNSIGNED_BYTE, this);
		}
		return name;
	}
	
	return glixl;
	
})(glixl || {});