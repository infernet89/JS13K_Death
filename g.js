// < >

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var dragging=false;
var mousex=-100;
var mousey=-100;
var drawable=[];
var start;
var end;
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

//setup all the objects
function setup()
{
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

    if(start.selected)
    {
        canvas.style.cursor = "pointer";
    }
    else canvas.style.cursor = "default";
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