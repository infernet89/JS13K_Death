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
var startCountries=[];
var end;
var reset;
var playMode=false;
var timeLeft=0;
var trail=[];
var agingSpeed=3;
var activeCountry=start;
var startTime;

//TODO DEBUG
level=6;
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
    playMode=false;
    if(activeCountry)
    {
        activeCountry.won=true;
        activeCountry.x=mousex;
        activeCountry.y=mousey;
    }
    setTimeout(function(){
        if(activeCountry)
        {
            activeCountry.won=true;
            var levelCompleted=true
            startCountries.forEach(el => { if(!el.won) levelCompleted=false; });
            if(levelCompleted)
            {
                levelUp();
            }
            else
            {
                activeCountry.trail=[...trail];
                activeCountry=null;
                setup();
                reset.disabled=false;
            }
        }
        else
            levelUp();
    },2000);
}
function fail()
{
    console.log("called fail??");
    if(activeCountry)
    {
        activeCountry.trail=[...trail];
        activeCountry.won=false;
    }
    playMode=false;
    timeLeft=-1;
    canvas.style.cursor="none";
    var tmp=new Object();
    tmp.type="tomb";
    tmp.x=mousex;
    tmp.y=mousey;
    drawable.push(tmp);  
    setTimeout(function(){
        canvas.style.cursor="default";
        setup();
        reset.disabled=false;
    },2000);      
    
}
function levelUp()
{
    setTimeout(function() {        
        oldmousex=-100;
        oldmousey=-100;
        trail=[];
        startCountries=[];
        level++;
        setup();
    },33);
}
//setup all the objects
function setup()
{
    activeCountry=null;
    drawable=[];
    trail=[];
    playMode=false;
    timeLeft=0;

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

    reset=new Object()
    reset.type="reset";
    reset.x=1220;
    reset.y=2;
    reset.width=58;
    reset.height=20;
    reset.color="#FFF";
    reset.disabled=true;
    drawable.push(reset);

    if(level==1)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=100;
        tmp.y=400;
        tmp.text="The global average \nage of death \nis around 72 years"
        drawable.push(tmp);

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
        tmp.type="commentary";
        tmp.x=140;
        tmp.y=380;
        tmp.text="In that short time, everybody will try to reach his goal"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=180;
        tmp.y=550;
        tmp.text="Overcoming all obstacles that are in between!"
        drawable.push(tmp);

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
    else if(level==3)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=150;
        tmp.text="With some help, you can reach goals\nthat you thought were impossible!"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=450;
        tmp.text="But remember to help other as well!"
        drawable.push(tmp);

        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="AFRICA";
            tmp.age=51;
            tmp.type="country";
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }
        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=1000;
        tmp.y=2;
        tmp.width=50;
        tmp.height=600;
        tmp.color1="#e63300";
        tmp.color2="#770000";
        tmp.color3="#e63300";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=250;
        tmp.width=1000-2;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=canvasW-100;
        tmp.y=100;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=850;
        tmp.y=100;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);
    }
    else if(level==4)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=150;
        tmp.text="Sometimes, reaching your goal can be really hard"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=450;
        tmp.text="Luckily, you can get help in the process"
        drawable.push(tmp);

        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=500;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=1000;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=800;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=600;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=400;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=200;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=300;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=500;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=700;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=900;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);
    }
    else if(level==5)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="ICELAND";
            tmp.age=82;
            tmp.type="country";
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=500;
        tmp.width=800-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=750;
        tmp.y=2;
        tmp.width=50;
        tmp.height=550-2;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=950;
        tmp.y=650;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=999;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=300;
        tmp.width=400-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=350;
        tmp.y=2;
        tmp.width=50;
        tmp.height=350-2;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=550;
        tmp.y=400;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=30;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=70;
        tmp.y=450;
        tmp.text="A lifetime can seem like a lot of time.."
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=70;
        tmp.y=650;
        tmp.text="But if you not focus,\nit will pass without achieving anything."
        drawable.push(tmp);
    }

    else if(level==7)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="AFRICA";
            tmp.age=51;
            tmp.type="country";
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="ICELAND";
            tmp.age=82;
            tmp.type="country";
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=800;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=2;
        tmp.width=50;
        tmp.height=200;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=150;
        tmp.width=250;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=100;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=6;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=725;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingTime=330;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=300;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=650;
        tmp.y=300;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=425;
        tmp.y=325;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=550;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=650;
        tmp.y=550;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=425;
        tmp.y=575;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=425;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=725;
        tmp.y=450;
        tmp.radius=30;
        tmp.color1="#0db3a9";
        tmp.color2="#000";
        tmp.key="cyan";
        drawable.push(tmp);
    }

    //calculate countries properties
    for(i=0;i<startCountries.length;i++)
    {
        var el=startCountries[i];
        el.x=start.x+3+100*Math.floor(i/3);
        el.y=start.y+3+(i%3)*30;
        el.width=4+10*el.label.length;
        el.height=24;
        drawable.push(el);
    }
}
function clickedReset(obj)
{
    setTimeout(function() {        
        oldmousex=-100;
        oldmousey=-100;
        trail=[];
        startCountries=[];
        setup();
    },33);
}
function clickedStart(obj)
{
    playMode=true;
    start.disabled=true;
    end.disabled=false;
    drawable.forEach(el => { if(el.type=="commentary") el.disabled=true; });
    canvas.style.cursor = "default";
    if(!obj || obj==start)
    {
        timeLeft=726;
    }
    else
    {
        startCountries.forEach(el => { el.disabled=(el!=obj); });
        timeLeft=obj.age*10;
        obj.trail=[];
        activeCountry=obj;
    }
    startTime=Date.now();
}
//check if mouse is inside obj
function isSelected(obj,tx,ty)
{
    if(tx==null)
    {
        tx=mousex;
        ty=mousey;
    }
    //circle-based
    if(obj.radius>0 && distanceFrom(tx,ty,obj.x,obj.y) < obj.radius)
        return true;
    else if(obj.radius>0)
        return false;
    //rectangle-based
    if(tx < obj.x) return false;
    if(tx > obj.x + obj.width) return false;
    if(ty < obj.y) return false;
    if(ty > obj.y + obj.height) return false;
    return true;
}
//draw a single object
function draw(obj)
{
    ctx.save();
    ctx.fillStyle=obj.color;
    if(obj.disabled)
        ctx.globalAlpha=0.2;
    if(obj.type=="commentary")
    {
        ctx.fillStyle = "#AAA";
        ctx.font = "25px sans-serif";
        var text=obj.text.split("\n");
        for(i=0;i<text.length;i++)
            ctx.fillText(text[i],obj.x,obj.y+i*25);
    }
    if(obj.type=="cursor")
    {
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#FFF";
        var cursor=new Path2D("M"+obj.x+" "+obj.y+" l 0 17 l 4 -2 l 2 5 l 2 0 l -2 -5 l 4 -2 Z");
        ctx.stroke(cursor);
        ctx.fill(cursor);        
    }
    if(obj.type=="tomb")
    {
        ctx.fillStyle = "#EEE";
        ctx.font = "30px sans-serif";
        ctx.fillText("☠",obj.x-15,obj.y+15);     
    }
    if(obj.type=="reset")
    {
        ctx.fillStyle = "#FFF";
        ctx.font = "15px sans-serif";
        ctx.fillText("Reset ♻",obj.x,obj.y+15);
        
    }
    if(obj.type=="start")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        ctx.fillStyle=obj.color;
        ctx.font = "150px sans-serif";
        ctx.fillText("🗺",obj.x,obj.y+100);
    }
    if(obj.type=="country")
    {
        if(obj.selected)
        {
            ctx.font = "16px monospace";
            ctx.fillStyle="#999";
        }
        else
        {
            ctx.font = "15px monospace";
            ctx.fillStyle="#000";
        }
        
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        if(obj.won)
            ctx.fillStyle="#9F9";
        else
            ctx.fillStyle="#FFF";
        ctx.fillRect(obj.x+2,obj.y+2,obj.width-4,obj.height-4);
        ctx.fillStyle="#000";
        ctx.fillText(obj.label,obj.x+5,obj.y+16);
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
            ctx.fillText(obj.missingClick,obj.x-5,obj.y+5);
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
    if(obj.type=="button_hold")
    {
        //bug on Firefox: https://stackoverflow.com/questions/58807793/firefox-canvas-with-radial-gradient-and-globalalpha-0-1-not-working-on-two-machi
        if(obj.disabled)
        {
            ctx.fillStyle = obj.color1;
        }
        else
        {
            const gradient = ctx.createRadialGradient(obj.x, obj.y, obj.radius*0.1, obj.x, obj.y, obj.radius);
            if(obj.selected)
                gradient.addColorStop(0, obj.color2);
            else
            {
                gradient.addColorStop(0, obj.color1);
                gradient.addColorStop(0.1, obj.color2);
                gradient.addColorStop(0.2, obj.color1);
                gradient.addColorStop(0.3, obj.color2);
                gradient.addColorStop(0.4, obj.color1);
                gradient.addColorStop(0.5, obj.color2);
                gradient.addColorStop(0.6, obj.color1);
                gradient.addColorStop(0.7, obj.color2);
                gradient.addColorStop(0.8, obj.color1);
                gradient.addColorStop(0.9, obj.color2);
            }                
            gradient.addColorStop(1, obj.color1);
            ctx.fillStyle = gradient;
        }
        
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
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
    ctx.restore();
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

    //current level
    ctx.font = "10px sans-serif";
    ctx.fillText("Level "+level,5,10);

    drawable.forEach(el => draw(el));
    drawable.forEach(el => { el.selected=isSelected(el); });

    if(!playMode)
    {
        if(start.selected)
        {
            if(startCountries.length>0)
            {
                canvas.style.cursor = "default";
                startCountries.forEach(el => {
                    if(el.selected)
                    {
                        canvas.style.cursor = "pointer";
                        if(dragging)
                        {
                            clickedStart(el);
                        }
                    }
                });
            }
            else
            {
                canvas.style.cursor = "pointer";
                if(dragging)
                {
                    clickedStart();
                }
            }            
        }
        //reset
        else if(reset.selected && !reset.disabled)
        {
            canvas.style.cursor = "pointer";
            if(dragging)
            {
                clickedReset();
            }
        }
        else if(timeLeft!=-1)
        {
            canvas.style.cursor = "default";
        }
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
        if(playMode && (timeLeft <=0 || checkCollisions()))
        {
            fail();
        }
        else if (playMode)
        {
            var tick=Date.now()-startTime;
            trail.push(mousex+"_"+mousey+"_"+dragging+"_"+tick);
            drawTrail(trail);
            startCountries.forEach(el => { 
                if(el.trail && el.trail.length>0)
                {
                    drawTrail(el.trail,tick);
                    handleGhost(el.trail,tick);
                }                                 
            });
        }
    }


    //log trail
    oldmousex=mousex;
    oldmousey=mousey;
}
function handleGhost(obj,limit)
{
    if(obj.length<1) return;
    if(obj[0].length<4) return;
    for(var i=0;i<obj.length;i++)
    {
        var tick=obj[i].split("_")[3];
        if(tick>limit) break;
    }
    if(i>=obj.length) return;
    var x=obj[i].split("_")[0];
    var y=obj[i].split("_")[1];
    var drag=(obj[i].split("_")[2])=="true"?true:false;
    obj.x=x;
    obj.y=y;
    obj.drag=drag;
    //prima i release
    drawable.forEach(el => { 
        //facciamo la release SOLO se non c'è il player sopra
        if(el.type.startsWith("button_") && el.holding && !isSelected(el))
        {
            //check if someone else is here
            var toRelease=true;
            startCountries.forEach(c => { 
                if(c.trail && c.trail.x>0 && !isSelected(el,c.trail.x,c.trail.y))
                {
                    toRelease=false;
                }                                 
            });
            if(toRelease)
            {
                releaseButton(el);
                unclickButton(el);
            }
                
        }
    });
    //poi controlliamo se fare hover
    drawable.forEach(el => { 
        if(el.type.startsWith("button_"))
        {
            if(isSelected(el,x,y))
            {
                hoverButton(el);
                if(drag)
                {
                    clickButton(el);
                }
                else
                {
                    unclickButton(el);
                }
            }
        }
    });
}
function drawTrail(obj,limit=9999999)
{
    if(obj.length<1) return;
    if(obj[0].length<4) return;
    ctx.strokeStyle = "#010";
    var oldx=obj[0].split("_")[0];
    var oldy=obj[0].split("_")[1];
    for(var i=0;i<obj.length;i++)
    {
        var x=obj[i].split("_")[0];
        if(x<0) continue;
        var y=obj[i].split("_")[1];
        var tick=obj[i].split("_")[3];
        if(tick>limit) break;
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(x, y);
        ctx.stroke(); 
        ctx.closePath();
        oldx=x;
        oldy=y;
    }
    if(limit<9999999)
    {
        var tmp=new Object();
        tmp.type="cursor";
        tmp.x=oldx;
        tmp.y=oldy;
        draw(tmp);
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
        //handle buttons
        if(el.type.startsWith("button") && !el.disabled)
        {
            if(isSelected(el))
            {
                hoverButton(el);
                if(dragging)
                {
                    clickButton(el);
                }
                else
                {
                    unclickButton(el);
                }
            }
            else
            {
                releaseButton(el);
            }
        }
    });
    return res;
}
function clickButton(obj)
{
    if(obj.type=="button_click" && !obj.clicked)
    {
        obj.missingClick--;
        obj.clicked=true;
        if(obj.missingClick<=0)
        {
            obj.disabled=true;
            var allDone=true;
            drawable.forEach(el => { 
                if(el.type.startsWith("button_") && !el.disabled && el.key==obj.key)
                {
                    allDone=false;
                }
            });
            if(allDone)
            {
                drawable.forEach(el => { 
                    if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
                    {
                        el.disabled=true;
                    } 
                });
            }
        }
    }    
}
function unclickButton(obj)
{
    if(obj.type=="button_click" && obj.clicked)
    {
        obj.clicked=false;
    }
}
function hoverButton(obj)
{
    if(obj.type=="button_hold")
    {
        holdButton(obj);
    }
    if(obj.type=="button_hover")
    {
        obj.missingTime-=agingSpeed;
        if(obj.missingTime<=0)
        {
            obj.disabled=true;
            var allDone=true;
            drawable.forEach(el => { 
                if(el.type.startsWith("button_") && !el.disabled && el.key==obj.key)
                {
                    allDone=false;
                }
            });
            if(allDone)
            {
                drawable.forEach(el => { 
                    if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
                    {
                        el.disabled=true;
                    } 
                });
            }
        }
    }
}
function holdButton(obj)
{
    if(obj.type=="button_hold" && !obj.holding)
    {
        obj.holding=true;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
            {
                el.disabled=true;
            } 
        });
    }    
}
function releaseButton(obj)
{
    if(obj.type=="button_hold" && obj.holding)
    {
        obj.holding=false;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && el.disabled && el.key==obj.key)
            {
                el.disabled=false;
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
    document.title=mousex+"_"+mousey;//TODO DEBUG
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