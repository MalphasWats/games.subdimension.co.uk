function Iso()
{
	var fps
	
	var map = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
				
	/*var map = [ 0, 0, 0, 0, 0, 0, 
	            0, 0, 1, 1, 1, 0, 
	            0, 1, 0, 0, 1, 0, 
	            0, 1, 0, 0, 1, 0,
	            0, 1, 1, 0, 1, 0,
                0, 0, 0, 0, 0, 0, ]*/
				
    var width = 16
    var height = 16
	
	var tile_base_width = 16 * game_scale
	var tile_base_height = 8 * game_scale
	
	var half_tile_base_width = Math.floor(tile_base_width/2)
	var half_tile_base_height = Math.floor(tile_base_height/2)
	
	var max_tile_height = 24 * game_scale
	
	var o_x
	var o_y
    
    var tiles = []
    
    var sheet
    var player
	
	var viewport
	
	var light
    
    this.setup = function()
	{
	    fps = document.getElementById('fps')
		
		o_x = width*half_tile_base_width //jaws.width/2
		o_y = max_tile_height //(jaws.height/2) - Math.floor( (height*tile_base_height) / 2) + tile_base_height
		
		sheet = new jaws.SpriteSheet({image: "graphics/tiles.png", frame_size: [16,24]})
		
		for (var y=0 ; y<height ; y++)
	    {
    	    for(var x=0 ; x<width ; x++)
    	    {
    	        var i = map[(width*y)+x]
        	    var s = new Sprite({image: sheet.frames[i], 
									x: (x-y)*half_tile_base_width + o_x, 
									y: (x+y)*half_tile_base_height + o_y, 
									scale_image:game_scale, 
									anchor:'bottom_center'})
        	    
        	    tiles.push(s)
    	    }
	    }
	    
	    player = new Sprite({image: sheet.frames[5], 
							 x: o_x,
							 y: o_y+tile_base_height,
							 scale_image:game_scale, 
							 anchor:'bottom_center'})
							 //anchor:'center'})
							 
        player.light_offset_y = -8*game_scale;
        player.light_radius = 180;
							 
		viewport = new jaws.Viewport({max_x: width*tile_base_width, max_y: (height*tile_base_height)+max_tile_height})
		
		lighting = new jaws.LightingSystem({max_x: width*tile_base_width*2, max_y: height*tile_base_height+max_tile_height, isometric_scale:true})
		
		lighting.add_light_source(player)
		
		var candle = {x: 300, y: 250, light_radius:30*game_scale}
		lighting.add_light_source(candle)
	}
	
	this.update = function()
	{
	    var vx = 0
		var vy = 0
		
		if(jaws.pressed("right") || quint.touched("right")) 
		{
			vx = 4; 
			vy = 2;
			
			player.image = sheet.frames[5]
		}
		
		if(jaws.pressed("left") || quint.touched("left")) 
		{
			vx = -4; 
			vy = -2;
			
			player.image = sheet.frames[7]
		}
		
		if(jaws.pressed("down") || quint.touched("down")) 
		{
			vx = -4; 
			vy = 2;
			
			player.image = sheet.frames[6]
		}
		
		if(jaws.pressed("up") || quint.touched("up")) 
		{
			vx = 4; 
			vy = -2;
			
			player.image = sheet.frames[8]
		}
		
		if(jaws.pressed("space") || quint.touched("a")) 
		{
			player.x = o_x
			player.y = o_y+tile_base_height
			
			player.image = sheet.frames[5]
		}
		
		player.x += vx
		player.y += vy
		
		var x_ = player.x - o_x
		var y_ = player.y - o_y
		
		var gx = Math.round( (y_ / tile_base_height) + (x_ / tile_base_width) )
        var gy = Math.round( (y_ / tile_base_height) - (x_ / tile_base_width) )
		
		if (map[(width*gy)+gx] > 0)
		{
			player.x -= vx
			player.y -= vy
		}
		else
		{
			player.gx = gx
			player.gy = gy
		}
		
		viewport.centerAround(player)
		
        fps.innerHTML = jaws.game_loop.fps
	}
	
	this.draw = function()
	{
	    jaws.clear()
		
		viewport.apply( function() {
	    
	    for (var y=0 ; y<height ; y++)
	    {
    	    for(var x=0 ; x<width ; x++)
    	    {
    	        tiles[(width*y)+x].draw()
				if (x == player.gx && y == player.gy)
    	        /*if (tiles[(width*y)+x].x > player.x-half_tile_base_width-1 &&
					tiles[(width*y)+x].x < player.x+half_tile_base_width+1 &&
					tiles[(width*y)+x].y > player.y-half_tile_base_height-1 &&
					tiles[(width*y)+x].y < player.y+half_tile_base_height+1
				   )*/
    	        {
    	            player.draw()
                }
    	    }
        }
        lighting.draw()
		})
		//lighting.draw()
	}
}

