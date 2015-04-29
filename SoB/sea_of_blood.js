function Example() 
{
    var ninja

    this.setup = function()
    {
        var anim = new jaws.Animation({sprite_sheet: "graphics/ninja.png", 
                                       frame_size: [96,96], 
                                       orientation: "right", 
                                       frame_duration: 60 })
                                       
        ninja = new jaws.Sprite({x:jaws.width/2, y:jaws.height/2, anchor: "center"})
        
        ninja.anim = {}
        ninja.anim.standing = anim.slice(0,1)
        ninja.anim.standing_drawn = anim.slice(6, 7)
        ninja.anim.walking = anim.slice(0,6)
        ninja.anim.walking_drawn = anim.slice(6, 12)
        ninja.anim.attack = anim.slice(12, 18)
        ninja.anim.attack.frame_duration = 30
        ninja.anim.draw = anim.slice(18, 24)
        ninja.anim.draw.frame_duration = 40
        
        ninja.anim.current = ninja.anim.standing
        
        ninja.vx = 0
        ninja.vy = 0
        ninja.can_jump = true
        ninja.idle_timer = 0
        
        ninja.weapon_drawn = false
        
        ninja.move = function() 
        {
            
            this.x += this.vx
            this.y -= this.vy
            
            this.vx = 0
            
            this.vy -= 1 // Gravity
            
            if (this.y+51 > jaws.canvas.height)
            {
                this.vy = 0
                this.can_jump = true
            }   
            
            jaws.forceInsideCanvas(this)
            
            if (this.anim.current == this.anim.draw &&
                ( ( this.anim.current.atLastFrame() && !this.weapon_drawn) ||
                  ( this.anim.current.atFirstFrame() && this.weapon_drawn) )
               )
            {
                this.weapon_drawn = !(this.weapon_drawn)
                if (this.weapon_drawn)
                {
                    this.anim.current = this.anim.standing_drawn
                }
                else {this.anim.current = this.anim.standing }
                
                this.anim.draw.frame_direction = -(this.anim.draw.frame_direction)
            }
            
            if (this.anim.current == this.anim.attack && this.anim.current.atLastFrame())
            {
                this.anim.current.next()
                this.anim.current = this.anim.standing_drawn
            }
            
            this.setImage(this.anim.current.next())
            
        }        
            
        jaws.context.mozImageSmoothingEnabled = false;    // non-blurry, blocky retro scaling
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
    }

    this.update = function()
    {
        if (ninja.anim.current != ninja.anim.draw && ninja.anim.current != ninja.anim.attack)
        {
            if (ninja.weapon_drawn)
            {
                ninja.anim.current=ninja.anim.standing_drawn
            }
            else
            {
                ninja.anim.current=ninja.anim.standing
            }
        }
        if ( (jaws.pressed("left") || quint.touched("left")) && ninja.anim.current != ninja.anim.draw
                                                             && ninja.anim.current != ninja.anim.attack)
        {
            ninja.vx = -4;
            if (ninja.weapon_drawn)
            {
                ninja.anim.current=ninja.anim.walking_drawn;
            }
            else {ninja.anim.current=ninja.anim.walking;}
            ninja.flipped=true
        }
        
        if ( (jaws.pressed("right") || quint.touched("right")) && ninja.anim.current != ninja.anim.draw
                                                               && ninja.anim.current != ninja.anim.attack)
        {
            ninja.vx = 4;
            if (ninja.weapon_drawn)
            {
                ninja.anim.current=ninja.anim.walking_drawn;
            }
            else {ninja.anim.current=ninja.anim.walking;}
            ninja.flipped=false
        }
        
        if (ninja.can_jump && (jaws.pressed("up") || quint.touched("up")))
        {
            ninja.can_jump = false
            ninja.vy = 18
        }
        
        if (jaws.pressed("space") || quint.touched("a"))
        {
            if (ninja.weapon_drawn)
            {
                ninja.anim.current = ninja.anim.attack
                
            }
            else { ninja.anim.current=ninja.anim.draw }
            ninja.idle_timer = 220
        }
        
        
        if (ninja.idle_timer > 0)
        {
            ninja.idle_timer -= 1
        }
        else
        {
            if (ninja.weapon_drawn) { ninja.anim.current=ninja.anim.draw }
        }
        
        ninja.move()
    }

    this.draw = function()
    {
        jaws.clear()
        ninja.draw()
    }
}