jaws.LightingSystem = function LightingSystem(options)
{
    if( !(this instanceof arguments.callee) ) return new arguments.callee(options);
    
    options = options || {}
    
    this.width = options.max_x || jaws.width;
    this.height = options.max_y || jaws.height;
    this.ambient_light = options.ambient_light || 0.9;
    
    if (options.isometric_scale)
    {
        this.y_scale = 0.5
    }
    else
    {
        this.y_scale = 1
    }
    
    this.light_sources = []
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
}

jaws.LightingSystem.prototype.add_light_source = function(obj)
{
    this.light_sources.push(obj)
}

jaws.LightingSystem.prototype.draw = function() 
{
    var ctx = this.canvas.getContext('2d');
    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'rgba(0,0,0,'+this.ambient_light+')';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = "destination-out";
    this.light_sources.forEach(this.draw_light, this)
    ctx.restore();
	jaws.context.drawImage(this.canvas, 0, 0);
}

jaws.LightingSystem.prototype.draw_light = function(light)
{
    var radius = light.light_radius || 100
    var x_offset = light.light_offset_x || 0
    var y_offset = light.light_offset_y*this.y_scale || 0
    
    var x = light.x + x_offset || 0
    var y = light.y + y_offset || 0
    
    var canvas = document.createElement("canvas");
    canvas.width = radius*2;
    canvas.height = radius*2;
    
    var ctx = canvas.getContext('2d');
    var g = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    g.addColorStop( 0, 'rgba(0,0,0,1)' );
    g.addColorStop( 1, 'rgba(0,0,0,0)' );
    ctx.fillStyle = g;
    ctx.setTransform(1,0,0,this.y_scale,0,0);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    this.canvas.getContext('2d').drawImage(
      canvas,
      Math.round(x-radius),
      Math.round(y-radius*this.y_scale)
    );
}