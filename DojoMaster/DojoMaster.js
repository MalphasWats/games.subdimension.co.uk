function DojoMaster()
{
	var map = [ 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
				16, 16, 18, 16, 16, 16, 16, 16, 16, 16, 18, 16, 16,
				16, 16, 19, 16, 16, 16, 16, 16, 16, 16, 19, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 16, 16, 16, 16, 17, 16, 16, 16, 16, 16, 16,
				16, 16, 18, 16, 16, 16, 16, 16, 16, 16, 18, 16, 16,
				16, 16, 19, 16, 16, 16, 16, 16, 16, 16, 19, 16, 16,
				16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16
			];
			
	var facings = ['up', 'down', 'left', 'right'];
	
	var positions = {
		up:  [ [224-16, 128-28], [224-16, 160-28], [224-16, 192-28] ],
		down:    [ [224-16, 320-28], [224-16, 288-28], [224-16, 256-28] ],
		left:  [ [128-16, 224-28], [160-16, 224-28], [192-16, 224-28] ],
		right: [ [320-16, 224-28], [288-16, 224-28], [256-16, 224-28] ]
	}
	
	var dmaster;
	var score = 0;
	
	var baddies = [];
	
	var sprite_sheet, tile_sheet;
	
	var tile_map;
	
	var global_timer = (new Date()).getTime();
	var tick_length = 1500
	
	this.init = function()
	{
		sprite_sheet = new glixl.SpriteSheet({src:'dojo_master.png', frame_size:[16, 16]})
		
		tile_map = new glixl.TileMap({sprite_sheet: sprite_sheet, dimensions: [13, 13], scale:2});
		for (var c=0 ; c<13 ; c++)
		{
			for (var r=0 ; r<13 ; r++)
			{
				tile_map.set_tile(r, c, new glixl.Tile({frame:map[c*13+r]}));
			}
		}
		
		glixl.scene.set_active_tilemap(tile_map);
		
		dmaster = new glixl.Sprite( {sprite_sheet: sprite_sheet, x: 224-16, y: 224-28, size:[16, 16], scale: 2, frame:0} );
		glixl.scene.add_sprite(dmaster);
		
		dmaster.timer1 = (new Date()).getTime();
		dmaster.timer2 = (new Date()).getTime();
		dmaster.can_hit = true;
		dmaster.facing = 'down';
		dmaster.dead = false;
		
		dmaster.update = function()
		{
			if (this.dead)
			{
				this.x -= 5;
				this.y -= 5;
				this.angle += 10;
				this.redraw = true;
			}
			else
			{
				var now = (new Date()).getTime();
				
				if (now - this.timer1 > 500)
				{
					this.can_hit = true;
				}
				
				if (this.can_hit || now - this.timer2 > 200 )
				{
					if (this.facing == "right")
						this.set_frame(2);
					else if (this.facing == "down")
						this.set_frame(0);
					else if (this.facing == "left")
						this.set_frame(3);
					else if (this.facing == "up")
						this.set_frame(1);
						
				}
			}
		}
		
		dmaster.hit = function()
		{
			if (this.can_hit)
			{
				if (this.facing == "right")
					this.set_frame(6);
				else if (this.facing == "down")
					this.set_frame(4);
				else if (this.facing == "left")
					this.set_frame(7);
				else if (this.facing == "up")
					this.set_frame(5);
					
				this.can_hit = false;
				this.timer1 = (new Date()).getTime();
				this.timer2 = (new Date()).getTime();
			}
			
			for (var i=0 ; i<baddies.length ; i++)
			{
				if (baddies[i].position == 2 && baddies[i].lane == this.facing)
				{
					baddies[i].kill();
				}
			}
		}
		
		dmaster.kill = function()
		{
			this.dead = true;
		}
		
		
	}
	
	this.update = function()
	{
		if (glixl.key_pressed("d") || quint.touched("right"))
		{
			dmaster.facing = 'right';
		}
		if (glixl.key_pressed("s") || quint.touched("down"))
		{
			dmaster.facing = 'down';
		}
		
		if (glixl.key_pressed("a") || quint.touched("left"))
		{
			dmaster.facing = 'left';
		}
		if (glixl.key_pressed("w") || quint.touched("up"))
		{
			dmaster.facing = 'up';
		}
		
		if (glixl.key_pressed("space") || quint.touched("a"))
		{
			dmaster.hit();
		}
		
		dmaster.update();
		
		if (!dmaster.dead)
		{
		var now = (new Date()).getTime();
		for (var i=0 ; i<baddies.length ; i++)
		{
			baddies[i].update(now);
		}
		if (now - global_timer > tick_length)
		{
			global_timer = now;
			tick_length -= 20;
			if (tick_length < 400)
				tick_length = 400;
			//create a new baddie
			var r = Math.floor(Math.random()*4)
			
			var x = positions[facings[r]][0][0];
			var y = positions[facings[r]][0][1];
			
			var baddie = new glixl.Sprite( {sprite_sheet: sprite_sheet, x: x, y: y, size:[16, 16], scale: 2, frame:8+r} );
			glixl.scene.add_sprite(baddie);
			
			baddie.position = 0;
			baddie.lane = facings[r];
			baddie.dead = false;
			
			baddie.update = function(now)
			{
				/*i*/
				if (this.dead)
				{
					this.x += this.vx;
					this.y += this.vy;
					this.angle += 20;
					
					this.redraw = true;
					
					if (!glixl.scene.is_visible(this))
					{
						baddies.shift();
						glixl.scene.remove_sprite(this);
					}
				}
				else
				{
					if (now - global_timer > tick_length)
					{
						this.position += 1;
						
						if (this.position > 2)
						{
							dmaster.kill();
							return;
						}
							
							
						
						var x = positions[facings[r]][this.position][0];
						var y = positions[facings[r]][this.position][1];
						
						this.x = x;
						this.y = y;
						
						this.redraw = true;
					}
				}
			}
			
			baddie.kill = function()
			{
				this.dead = true;
				this.position = 3;
				score += 1;
				document.getElementById('score').innerHTML = score;
				
				if (this.lane == "right")
				{
					this.vx = 8;
					this.vy = 2;
				}
				else if (this.lane == "down")
				{
					this.vy = 8;
					this.vx = 2;
				}
				else if (this.lane == "left")
				{
					this.vx = -8;
					this.vy = -2;
				}
				else if (this.lane == "up")
				{
					this.vy = -8;
					this.vx = -2;
				}
			}
			
			baddies.push(baddie);
		}
		}
			
		document.getElementById('fps').innerHTML = glixl.fps;
	}
}