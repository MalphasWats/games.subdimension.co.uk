/* MalphasWats - Ludum Dare 26 */

var renown = 0
var target_renown = (Math.floor(Math.random() * 10) + 1) *10
var cash = 50

var days_left = 31

var gallery

function Renown()
{
    var sidebar, sidebar_context, sidebar_sprite
    
    var message_sprite
    
    var actions
    var timer = 100
    
    this.setup = function(param)
    {
        sidebar = document.createElement('canvas')
        sidebar.width = 120
        sidebar.height = 350
        sidebar_context = sidebar.getContext('2d')
        
        sidebar_context.fillStyle = "#dddddd"
        sidebar_context.fillRect(0,0, sidebar.width, sidebar.height)
        
        sidebar_context.textAlign  = "Left"
        sidebar_context.fillStyle  = "black"
        sidebar_context.font       = "bold 20px Terminal"
        
        sidebar_context.fillText("Renown",15, 115)
        sidebar_context.fillText("Cash",15, 195)
        sidebar_context.fillText("Days Left",15, 275)
        
        var bryan = new jaws.Sprite({image: "graphics/bryan.png", x:5, y:5, scale_image:4})
        
        sidebar_context.drawImage(bryan.image, 30, 15, 64, 64)
        
        sidebar_sprite = new jaws.Sprite({image: sidebar, x:20, y:20})
        
        actions = new jaws.SpriteList()
        
        var icons = new jaws.SpriteSheet({image: "graphics/icons.png", frame_size: [16,16], scale_image: 4})
        
        var button = document.createElement('canvas')
        button.width = 350
        button.height = 70
        var context = button.getContext('2d')
        
        context.fillStyle = "#cdcdcd"
        context.fillRect(0,0, button.width, button.height)
        
        var icon = new jaws.Sprite({image: icons.frames[0], x:0, y:0})
        context.drawImage(icon.image, 10, 5, 64, 64)
        
        context.textAlign  = "Left"
        context.fillStyle  = "black"
        context.font       = "bold 20px Terminal"
        
        context.fillText("Take a Commission", 120, 35)
        
        var sprite = new jaws.Sprite({image: button, x:200, y:40})
        sprite.action = "commission"
        actions.push(sprite)
        
        
        var button = document.createElement('canvas')
        button.width = 350
        button.height = 70
        var context = button.getContext('2d')
        
        context.fillStyle = "#cdcdcd"
        context.fillRect(0,0, button.width, button.height)
        
        var icon = new jaws.Sprite({image: icons.frames[1], x:0, y:0})
        context.drawImage(icon.image, 10, 5, 64, 64)
        
        context.textAlign  = "Left"
        context.fillStyle  = "black"
        context.font       = "bold 20px Terminal"
        
        context.fillText("Hold an Exhibition", 120, 35)
        context.font       = "bold 16px Terminal"
        context.fillText("Costs £" + Math.floor(renown/10+1)*100, 260, 55)
        
        
        var sprite = new jaws.Sprite({image: button, x:200, y:130})
        sprite.action = "exhibition"
        actions.push(sprite)
        
        
        var button = document.createElement('canvas')
        button.width = 350
        button.height = 70
        var context = button.getContext('2d')
        
        context.fillStyle = "#cdcdcd"
        context.fillRect(0,0, button.width, button.height)
        
        var icon = new jaws.Sprite({image: icons.frames[2], x:0, y:0})
        context.drawImage(icon.image, 10, 5, 64, 64)
        
        context.textAlign  = "Left"
        context.fillStyle  = "black"
        context.font       = "bold 20px Terminal"
        
        context.fillText("Guerilla Graffitto", 120, 35)
        var sprite = new jaws.Sprite({image: button, x:200, y:220})
        sprite.action = "graffitto"
        actions.push(sprite)
        
        var message = document.createElement('canvas')
        message.width = 600
        message.height = 120
        var message_context = message.getContext('2d')
        
        message_context.textAlign  = "Left"
        message_context.fillStyle  = "black"
        message_context.font       = "bold 18px Terminal"
        
        var message_text = ""
        if (param.message)
        {
            message_text = param.message
        }
        
        message_context.fillText(message_text,0,20)
        message_sprite = new jaws.Sprite({image: message, x:220, y:380})
    }
    
    this.update = function()
    {
        sidebar_context.save()
        sidebar_context.fillStyle = "white"
        sidebar_context.fillRect(10, 120, 100, 50)
        
        sidebar_context.fillRect(10, 200, 100, 50)
        
        sidebar_context.fillRect(10, 280, 100, 50)
        
        sidebar_context.textAlign  = "center"
        sidebar_context.fillStyle  = "black"
        sidebar_context.font       = "bold 30px Terminal"
        
        sidebar_context.fillText(renown+'/'+target_renown,60, 160)
        sidebar_context.fillText(days_left, 60, 320)
        sidebar_context.font       = "bold 25px Terminal"
        sidebar_context.fillText('£'+cash,60, 240)
        
        
        sidebar_context.restore()
        
        
        if (jaws.pressed("left_mouse_button"))
        {
            var point = {}
            point.rect = function() { return new jaws.Rect(jaws.mouse_x, jaws.mouse_y, 10, 10)}
            var button_hit = jaws.collideOneWithMany(point, actions.sprites)
            if (button_hit.length > 0)
            {
                if (button_hit[0].action == "commission")
                {
                    var params = {renown: (Math.floor(Math.random() * 10) + 1) * 5, cash:(Math.floor(Math.random() * 20) + 1) * 50, title:"Theme: "+themes[Math.floor(Math.random() * themes.length)]}
                    jaws.switchGameState(Easel, {fps:120}, params)
                }
                else if (button_hit[0].action == "exhibition")
                {
                    var cost = Math.floor(renown/10+1)*100
                    if (cost <= cash)
                    {
                        var params = {renown:Math.floor(renown/10+1)*8, cash:-cost, title:"Create an original Exhibit"}
                        jaws.switchGameState(Easel, {fps:120}, params)
                    }
                }
                else if (button_hit[0].action == "graffitto")
                {
                    var params = {renown:Math.floor(renown/10+1)*2, cash:0, title:"Tag Something!"}
                    jaws.switchGameState(Easel, {fps:120}, params)
                }
            }
        }
        
        timer -= 1
        
        if(timer == 0)
        {
            timer = 100
            days_left -= 1
        }
        
        if (renown >= target_renown)
        {
            jaws.switchGameState(GameWon)
        }
        
        if (days_left == 0)
        {
            jaws.switchGameState(GameLost)
        }
    }
    
    this.draw = function()
    {
        jaws.clear()
        sidebar_sprite.draw()
        actions.draw()
        message_sprite.draw()
    }

}

function Easel()
{

    var painting, painting_context, painting_sprite
    var easel, paints
    var sidebar, sidebar_context, sidebar_sprite
    var title_sprite
    
    var target_coverage, renown_to_win, cash_to_win
    
    var current_colour
    
    var fps
    
    this.setup = function(params)
    {
        renown_to_win = params.renown
        cash_to_win = params.cash
        
        jaws.context.mozImageSmoothingEnabled = false;
        
        var title = document.createElement('canvas')
        title.width = 300
        title.height = 120
        var title_context = title.getContext('2d')
        
        title_context.textAlign  = "Left"
        title_context.fillStyle  = "black"
        title_context.font       = "bold 22px Terminal"
        
        title_context.fillText(params.title,0,20)
        title_sprite = new jaws.Sprite({image: title, x:150, y:5})
        
        easel = new jaws.Sprite({image:"graphics/easel.png", x:150, y:20, scale_image:5})
    
        painting = document.createElement('canvas')
        painting.width = 510
        painting.height = 325
        painting.changed = true
        painting.changing = false
        painting_context = painting.getContext('2d')
        
        painting_sprite = new jaws.Sprite({image: painting, x:195, y:65})
        painting_sprite.title = params.title
        
        painting_context.get_coverage = function()
        {
            var painting_data = painting_context.getImageData(0, 0, painting_sprite.width, painting_sprite.height).data
            var coloured_pixels = 0
            
            for(var i=0 ; i < painting_data.length / 4 ; i++)
            {
                if (painting_data[(i*4)+3] > 0 &&
                    (painting_data[(i*4)]+painting_data[(i*4)+1]+painting_data[(i*4)+2])<765)
                {
                    coloured_pixels += 1
                }
            }
            
            return Math.round(coloured_pixels / (painting_data.length /4) *100)
        }
        
        sidebar = document.createElement('canvas')
        sidebar.width = 120
        sidebar.height = 325
        sidebar_context = sidebar.getContext('2d')
        
        sidebar_context.fillStyle = "#dddddd"
        sidebar_context.fillRect(0,0, sidebar.width, sidebar.height)
        
        sidebar_context.textAlign  = "Left"
        sidebar_context.fillStyle  = "black"
        sidebar_context.font       = "bold 20px Terminal"
        
        sidebar_context.fillText("Target",15, 115)
        sidebar_context.fillText("Coverage",15, 195)
        
        var bryan = new jaws.Sprite({image: "graphics/bryan.png", x:5, y:5, scale_image:4})
        
        sidebar_context.drawImage(bryan.image, 30, 15, 64, 64)
        
        sidebar_sprite = new jaws.Sprite({image: sidebar, x:20, y:20})
        
        
        var paint_sheet = new jaws.SpriteSheet({image: "graphics/paint.png", 
                                       frame_size: [16,16], 
                                       
                                       scale_image: 4})
                                       
        paints = new jaws.SpriteList()
        
        var paint = new jaws.Sprite({image: paint_sheet.frames[0], x:jaws.width-50, y:60, anchor: "center"})
        paint.onFrame = paint_sheet.frames[1]
        paint.offFrame = paint_sheet.frames[0]
        paint.colour = "white"
        
        paints.push( paint )
        
        var paint = new jaws.Sprite({image: paint_sheet.frames[3], x:jaws.width-50, y:130, anchor: "center"})
        paint.onFrame = paint_sheet.frames[3]
        paint.offFrame = paint_sheet.frames[2]
        paint.colour = "red"
        
        current_colour = "red"
        
        paints.push( paint )
        
        var paint = new jaws.Sprite({image: paint_sheet.frames[4], x:jaws.width-50, y:200, anchor: "center"})
        paint.onFrame = paint_sheet.frames[5]
        paint.offFrame = paint_sheet.frames[4]
        paint.colour = "green"
        
        paints.push( paint )
        
        var paint = new jaws.Sprite({image: paint_sheet.frames[6], x:jaws.width-50, y:270, anchor: "center"})
        paint.onFrame = paint_sheet.frames[7]
        paint.offFrame = paint_sheet.frames[6]
        paint.colour = "blue"
        
        paints.push( paint )
        
        var paint = new jaws.Sprite({image: paint_sheet.frames[8], x:jaws.width-50, y:340, anchor: "center"})
        paint.onFrame = paint_sheet.frames[9]
        paint.offFrame = paint_sheet.frames[8]
        paint.colour = "yellow"
        
        paints.push( paint )
        
        target_coverage = Math.floor(Math.random() * 15) + 1
        
        
        painting.update_coverage = function()
        {
            var coverage = painting_context.get_coverage()
            
            sidebar_context.save()
            sidebar_context.fillStyle = "white"
            sidebar_context.fillRect(10, 120, 100, 50)
            
            sidebar_context.fillRect(10, 200, 100, 50)
            
            sidebar_context.textAlign  = "center"
            sidebar_context.fillStyle  = "black"
            sidebar_context.font       = "bold 40px Terminal"
            
            sidebar_context.fillText(target_coverage+'%',60, 160)
            sidebar_context.fillText(coverage+'%',60, 240)
            
            sidebar_context.restore()
            
            if (coverage == target_coverage)
            {
                days_left -= 2
                var happiness = (Math.floor(Math.random() * 10) + 1)
                var message
                if (happiness > 1)
                {
                    cash += cash_to_win
                    renown += renown_to_win
                    if (cash_to_win == 0)
                    {
                        message = "Awesome, that bridge totally looks better now."
                    }
                    else {message = "Good work, they loved it!"}
                }
                else 
                {
                    if (cash_to_win < 0)
                    {
                        renown -= Math.round(renown_to_win/2)
                        cash += cash_to_win
                        
                        message = "Ouch, no-one came. Except that snooty Critic..."
                    }
                    else if (cash_to_win == 0)
                    {
                        renown += 50
                        message = "Ha! You got caught tagging! The papers say you're the minimalist Banksy."
                    }
                    else 
                    {
                        renown -= 1
                        message = "They hated it, so sad."
                    }
                }
                gallery.push(new jaws.Sprite({image:painting_sprite.image, x:0, y:0}))
                
                jaws.switchGameState(Renown, {fps:60}, {message:message})
            }
        }
    }
    
    this.update = function()
    {
        if (jaws.pressed("left_mouse_button"))
        {
            painting.changing = true
            painting_context.save()
            painting_context.translate(-painting_sprite.x, -painting_sprite.y)
            painting_context.beginPath()
            painting_context.fillStyle = current_colour
            var radius = 4
            if (current_colour == "white")
            {
                radius = 10
            }
            painting_context.arc(jaws.mouse_x, jaws.mouse_y, radius, 0, 2 * Math.PI, false)
            painting_context.fill()
            painting_context.restore()
            
            var point = {}
            point.rect = function() { return new jaws.Rect(jaws.mouse_x, jaws.mouse_y, 10, 10)}
            var paint_hit = jaws.collideOneWithMany(point, paints.sprites)
            if (paint_hit.length > 0)
            {
                current_colour = paint_hit[0].colour
                paints.forEach(function(element, index, array)
                {
                    element.setImage(element.offFrame)
                })
                paint_hit[0].setImage(paint_hit[0].onFrame)
            }
        }
        else if (painting.changing)
        {
            painting.changed = true
            painting.changing = false
        }
        
        if (painting.changed)
        {
            painting.changed = false
            painting.update_coverage()
        }
    }
    
    this.draw = function()
    {
        jaws.clear()
        easel.draw()
        painting_sprite.draw()
        sidebar_sprite.draw()
        title_sprite.draw()
        paints.draw()
    }
    
}



function IntroMenu()
{
    var pressing = false
    var sprites
    
    this.setup = function()
    {
        gallery = []
        var icons = new jaws.SpriteSheet({image: "graphics/icons.png", frame_size: [16,16], scale_image: 4})
        
        sprites = new jaws.SpriteList()
        
        sprites.push(new jaws.Sprite({image: icons.frames[0], x:600, y:270}))
        
        sprites.push(new jaws.Sprite({image: icons.frames[3], x:670, y:200}))
        
        sprites.push(new jaws.Sprite({image: "graphics/bryan.png", x:600, y:200, scale_image:4}))
    }
    
    this.update = function()
    {
        if (jaws.pressed("left_mouse_button"))
        {
            pressing = true
        }
        else if (pressing)
        {
            pressing = false
            jaws.switchGameState(Renown, {fps:60}, {message:"Choose an action to begin."})
        }
    }

    this.draw = function()
    {
        jaws.clear()

        jaws.context.save()
        jaws.context.textAlign  = "left"
        jaws.context.fillStyle  = "black"
        jaws.context.font       = "bold 20px terminal";
        jaws.context.fillText("The Minimalist", 120, 100);
        
        jaws.context.fillText("Press anywhere to begin", 180, 150);
        jaws.context.restore()
        
        sprites.draw()

    }
}


function GameWon()
{
    var art
    
    this.setup = function()
    {
        art = gallery[Math.floor(Math.random() * gallery.length)]
        art.moveTo(250, 110)
    }
    
    this.update = function()
    {
        
    }

    this.draw = function()
    {
        jaws.clear()

        jaws.context.save()
        jaws.context.textAlign  = "left"
        jaws.context.fillStyle  = "black"
        jaws.context.font       = "bold 20px terminal";
        jaws.context.fillText("Congratulations! You are The Minimalist!", 120, 80);
        jaws.context.restore()
        
        art.draw()
    }
}


function GameLost()
{
    this.setup = function()
    {
        
    }
    
    this.update = function()
    {
        
    }

    this.draw = function()
    {
        jaws.clear()

        jaws.context.save()
        jaws.context.textAlign  = "left"
        jaws.context.fillStyle  = "black"
        jaws.context.font       = "bold 20px terminal";
        jaws.context.fillText("Sorry, you didn't make it as The Minimalist!", 120, 100);
        jaws.context.restore()
    }
}