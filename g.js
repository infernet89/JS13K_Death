// < >

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var dragging=false;
var mousex=-100;
var mousey=-100;
var oldmousex,oldmousey;
var level=0;
var drawable=[];
var start;
var end;
var playMode=false;
var timeLeft=0;
var trail=[];
var agingSpeed=3;

//TODO DEBUG
level=2;
//TODO DEBUG

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = 1280;//window.innerWidth;
canvasH=canvas.height = 800;//window.innerHeight;

//controls
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);

setup();
setInterval(run, 33);

//win the level
function win()
{
    document.title="You won!";
    playMode=false;
    level++;
    setup();
}
function fail()
{
    playMode=false;
    start.disabled=false;
    end.disabled=true;
    setup();
}
//setup all the objects
function setup()
{
    drawable=[];
    trail=[];

    start=new Object()
    start.type="start";
    start.x=canvasW-200;
    start.y=canvasH-100;
    start.width=200;
    start.height=100;
    start.bgcolor="#666";
    start.color="#FFF";
    drawable.push(start);

    end=new Object()
    end.type="end";
    end.x=50;
    end.y=50;
    end.width=125;
    end.height=125;
    end.bgcolor="#003a00";
    end.color="#FFF";
    end.disabled=true;
    drawable.push(end);

    if(level==1)
    {
        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=900;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=550;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);
    }
    else if(level==2)
    {
        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=canvasW-200;
        tmp.y=350;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=100;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=450;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=100;
        tmp.y=550;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=10;
        drawable.push(tmp);
    }

    /*var tmp=new Object();
    tmp.type="circle";
    tmp.x=200;
    tmp.y=200;
    tmp.radius=50;
    tmp.bgcolor="#0F0";
    tmp.color="#F00";
    drawable.push(tmp);*/
}
//check if mouse is inside obj
function isSelected(obj)
{
    //circle-based
    if(obj.radius>0 && distanceFrom(mousex,mousey,obj.x,obj.y) < obj.radius)
        return true;
    else if(obj.radius>0)
        return false;
    //rectangle-based
    if(mousex < obj.x) return false;
    if(mousex > obj.x + obj.width) return false;
    if(mousey < obj.y) return false;
    if(mousey > obj.y + obj.height) return false;
    return true;
}
//draw a single object
function draw(obj)
{
    ctx.fillStyle=obj.color;
    if(obj.disabled)
        ctx.globalAlpha=0.2;
    if(obj.type=="cursor")
    {
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(obj.x, obj.y+17);
        ctx.lineTo(obj.x+4, obj.y+15);
        ctx.lineTo(obj.x+6, obj.y+20);
        ctx.lineTo(obj.x+8, obj.y+20);
        ctx.lineTo(obj.x+6, obj.y+15);
        ctx.lineTo(obj.x+10, obj.y+13);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    if(obj.type=="start")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        ctx.fillStyle=obj.color;
        ctx.font = "150px sans-serif";
        ctx.fillText("🗺",obj.x,obj.y+100);
    }
    if(obj.type=="end")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        ctx.fillStyle=obj.color;
        ctx.font = "100px sans-serif";
        ctx.fillText("🏁",obj.x,obj.y+100);
    }
    if(obj.type=="circle")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle=obj.color;
        ctx.stroke();
    }
    if(obj.type=="button_click")
    {
        ctx.fillStyle=obj.color2;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //inner circle
        if(obj.clicked)
            ctx.fillStyle=obj.color2;
        else    
            ctx.fillStyle=obj.color1;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius*0.8, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //text
        if(obj.missingClick>0)
        {
            ctx.fillStyle="#000";
            ctx.font = "18px sans-serif";
            ctx.fillText(obj.missingClick,obj.x-10,obj.y+5);
        }        
    }
    if(obj.type=="button_hover")
    {
        //bug on Firefox: https://stackoverflow.com/questions/58807793/firefox-canvas-with-radial-gradient-and-globalalpha-0-1-not-working-on-two-machi
        if(obj.disabled)
        {
            ctx.fillStyle = obj.color1;
        }
        else
        {
            const gradient = ctx.createRadialGradient(obj.x, obj.y, obj.radius*0.5, obj.x, obj.y, obj.radius);
            if(obj.selected)
                gradient.addColorStop(0, obj.color2);
            else
                gradient.addColorStop(0, obj.color1);
            gradient.addColorStop(1, obj.color2);
            ctx.fillStyle = gradient;
        }
        
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //clock markers
        for (var i = 0; i < 12; i++) {
            angle = (i - 3) * (Math.PI * 2) / 12;
            ctx.lineWidth = 1;
            ctx.beginPath();
            var x1 = obj.x + Math.cos(angle) * (obj.radius*0.7);
            var y1 = obj.y + Math.sin(angle) * (obj.radius*0.8);
            var x2 = obj.x + Math.cos(angle) * (obj.radius);
            var y2 = obj.y + Math.sin(angle) * (obj.radius);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
        //text
        if(obj.missingTime>0)
        {
            ctx.fillStyle="#000";
            ctx.font = "18px sans-serif";
            ctx.fillText((obj.missingTime/10).toFixed(1),obj.x-15,obj.y+5);
        }        
    }
    if(obj.type=="obstacle")
    {
        const gradient = ctx.createLinearGradient(obj.x,obj.y,obj.x+obj.width,obj.y+obj.height);
        gradient.addColorStop(0, obj.color1);
        gradient.addColorStop(.5, obj.color2);
        gradient.addColorStop(1, obj.color3);
        ctx.fillStyle = gradient;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
    }
    ctx.globalAlpha=1;
}
//main loop that draw the screen
function run()
{
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);
    //border
    ctx.fillStyle="#FFF";
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    drawable.forEach(el => draw(el));
    drawable.forEach(el => { el.selected=isSelected(el); });

    if(!playMode)
    {
        if(start.selected)
        {
            canvas.style.cursor = "pointer";
            if(dragging)
            {
                playMode=true;
                start.disabled=true;
                end.disabled=false;
                canvas.style.cursor = "default";
                timeLeft=726;
            }
        }
        else canvas.style.cursor = "default";
    }
    //we are playing
    else
    {
        if(end.selected)
        {
            canvas.style.cursor = "pointer";
            if(dragging)
                win();
        }
        else
        {
            canvas.style.cursor = "default";
        }
        ctx.fillStyle="#FFF";
        ctx.font = "10px sans-serif";
        ctx.fillText((timeLeft/10)+" years",mousex,mousey);
        timeLeft-=agingSpeed;
        if(timeLeft <=0 || checkCollisions())
        {
            fail();
        }
        else
        {
            trail.push(mousex+"_"+mousey+"_"+dragging);
            drawTrail();
        }
    }
    oldmousex=mousex;
    oldmousey=mousey;
}
function drawTrail()
{
    if(trail.length<2) return;
    ctx.strokeStyle = "#010";
    var oldx=trail[0].split("_")[0];
    var oldy=trail[0].split("_")[1];
    for(var i=0;i<trail.length;i++)
    {
        var x=trail[i].split("_")[0];
        var y=trail[i].split("_")[1];
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(x, y);
        ctx.stroke(); 
        oldx=x;
        oldy=y;
    }
}
//return true if it has collided with something (obstacle)
function checkCollisions()
{
    var res=false;
    if(mousex<0) return true;
    if(mousex>canvasW) return true;
    if(mousey<0) return true;
    if(mousey>canvasH) return true;
    //check obstacles
    drawable.forEach(el => { 
        //obstacles
        if(el.type=="obstacle" && !el.disabled)
        {
            //mouse over
            if(isSelected(el))
                res=true;
            //passed by
            else if(lineRect(oldmousex,oldmousey,mousex,mousey,el.x,el.y,el.width,el.height))
                res=true;
        } 
        //buttons
        if(el.type=="button_click" && !el.disabled)
        {
            if(isSelected(el))
            {
                if(!el.clicked && dragging)
                {
                    clickButton(el);
                }
                else if(el.clicked && !dragging)
                {
                    el.clicked=false;
                }
            }
            else el.clicked=false;
        }
        if(el.type=="button_hover" && !el.disabled)
        {
            if(isSelected(el))
            {
                hoverButton(el);
            }
        } 
    });
    return res;
}
function clickButton(obj)
{
    obj.missingClick--;
    obj.clicked=true;
    if(obj.missingClick<=0)
    {
        obj.disabled=true;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
            {
                el.disabled=true;
            } 
        });
    }
}
function hoverButton(obj)
{
    obj.missingTime-=agingSpeed;
    if(obj.missingTime<=0)
    {
        obj.disabled=true;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
            {
                el.disabled=true;
            } 
        });
    }
}
//check if a line intersect a rectangle
function lineRect(x1,y1,x2,y2,rx,ry,rw,rh)
{
    //console.log("Checking ",x1+","+y1,x2+","+y2,"on rectangle",rx+","+ry,rw,rh);
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    var right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    var top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    var bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}
//check if two lines intersect
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4)
{
  // calculate the direction of the lines
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}
/*#############
    Funzioni Utili
##############*/
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}
function distanceFrom(ax,ay,bx,by)
{
    return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoMouse(evt)
{
    dragging=false;    
}
window.AutoScaler = function(element, initialWidth, initialHeight, skewAllowance){
    var self = this;
    
    this.viewportWidth  = 0;
    this.viewportHeight = 0;
    
    if (typeof element === "string")
        element = document.getElementById(element);
    
    this.element = element;
    this.gameAspect = initialWidth/initialHeight;
    this.skewAllowance = skewAllowance || 0;
    
    this.checkRescale = function() {
        if (window.innerWidth == self.viewportWidth && 
            window.innerHeight == self.viewportHeight) return;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var windowAspect = w/h;
        var targetW = 0;
        var targetH = 0;
        
        targetW = w;
        targetH = h;
        
        if (Math.abs(windowAspect - self.gameAspect) > self.skewAllowance) {
            if (windowAspect < self.gameAspect)
                targetH = w / self.gameAspect;
            else
                targetW = h * self.gameAspect;
        }
        
        self.element.style.width  = targetW + "px";
        self.element.style.height = targetH + "px";
    
        self.element.style.marginLeft = ((w - targetW)/2) + "px";
        self.element.style.marginTop  = ((h - targetH)/2) + "px";
    
        self.viewportWidth  = w;
        self.viewportHeight = h;
        
    }
    
    // Ensure our element is going to behave:
    self.element.style.display = 'block';
    self.element.style.margin  = '0';
    self.element.style.padding = '0';
    
    // Add event listeners and timer based rescale checks:
    window.addEventListener('resize', this.checkRescale);
    rescalercheck=setInterval(this.checkRescale, 1500);
};