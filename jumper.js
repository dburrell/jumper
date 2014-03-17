var objects = new Array();

var player = 
{
  id: "PLAYER",
  deadly: false,
  hasMass: true,
  hard: 1,
  x0: 0,
  y0: 400,
  x: 0,
  y: 400,
  height: 20,
  width: 20,
  dy: 0,
  dx: 0,
  right: false,
  left: false,

  speed: 700,
  color:"#000",

  jumpCount:0,
  maxJumps:2,
  
  jumping:false,      
  jumpPower:700,
  j0:800,

  touching: new Array(false,false,false,false) ,

  falling:true,

  xstart: new Date().getTime(), 
  fstart: new Date().getTime(),
  jstart: new Date().getTime()
}


var camera = 
{
  startTime: new Date().getTime(), 
  endTime: new Date().getTime(),
  y0: 0,      
  x0: 0,
  endY: 0,
  endX: 0,
  y: 0,
  x: 0,  
  moving: false,
  controlsLocked: false,

  move: function(x, y, t, lockControls)
  {        
    if (lockControls)
    {
      camera.controlsLocked = true;
      env.controlsLocked++;
    }
    camera.startTime = new Date().getTime();
    camera.endTime = camera.startTime + (t * 1000);  
    camera.y0 = camera.y;
    camera.x0 = camera.x;                    
    camera.endY = y;
    camera.endX = x;
    camera.moving = true; 
    renderplayer();
  },

  setPosition: function()
  {        
    if (camera.moving)
    {                             
      camera.y = camera.y0 + ((camera.endY - camera.y0) * camera.getFrac());  
      camera.x = camera.x0 + ((camera.endX - camera.x0) * camera.getFrac());                     
    }        
  },

  getFrac: function()
  {
    var now = new Date().getTime() ;  
    var timeSoFar = now - camera.startTime;
    var totalTime = camera.endTime - camera.startTime;       
    var frac = timeSoFar/totalTime;
    if (now >= camera.endTime)
    { 
      camera.moving = false; 
      if (camera.controlsLocked)
      {
        camera.controlsLocked = false;
        env.controlsLocked--;
      }
    }
    return frac;
  }     
}



var env = 
{      
  debugging: false,
  logging: false,
  gravity: 200,  
  rowLogs: 10,
  controlsLocked: 0
}


/////////////////////////////////////////////////////
//Make a generic object (tree or enemy or whatever)
/////////////////////////////////////////////////////
function newObj()
{
  var o = 
  {
    id: "OBJECT" + objects.length,
    deadly: false,
    hasMass: true,
    hard: 2,
    height: 20,
    width: 20,
    left: 0,
    right: 0,
    x: 0,
    y: 0,
    y0: 0,
    x0: 0,    
    endY: 0,
    endX: 0,
    speed: 700,
    color: "#00F",  //default of blue
    touching: new Array(false,false,false,false) 
  }
  
  return o;
}

function addObj(o)
{  
  objects[objects.length] = o;   
}



///////////////////////////////////////////////////////////////////////////////
//Initalise things
///////////////////////////////////////////////////////////////////////////////

//Add the player
addObj(player);

//Add a random object
var a = newObj();
a.y = 480;
a.x = 300;
a.width= 20;
a.deadly = true;
addObj(a);


//Add a platform
var b = newObj();
b.y = 350;
b.x = 400;
b.width= 20;
b.height = 50;
b.color = "#ccc";
b.deadly = false;
addObj(b);

//Add a wall
var c = newObj();
c.y = 0;
c.x = 600;
c.width= 10;
c.height = 500;
addObj(c);



var floor = 500;



function log(m)
{
  if (env.logging)
  {
    $("#log2").html($("#log").html() + "\n" + $("#log2").html());
    $("#log").html(m); 
  }
}



function checkTouching()
{
  for (var i1 = 0; i1 < objects.length; i1++)
  {
    var o1 = objects[i1];
    o1.touching = new Array(false, false, false, false);
  }

  for (var i1 = 0; i1 < objects.length; i1++)
  {
    for (var i2 = 0; i2 < objects.length; i2++)
    {
      if (i1 < i2)            //using strict less than so that only one touch is called.
      {        
        var o1 = objects[i1];
        var o2 = objects[i2];
                       
        var gap = 50;
               
        if (    o1.x              <= (o2.x + o2.width + gap)    // o1 left > o2 right
            && (o1.x + o1.width)  >=  o2.x - gap                // o1 right < o2 left
            &&  o1.y              <= (o2.y + o2.height)   // o1 top > o2 bottom
            && (o1.y + o1.height) >=  o2.y                // o1 bottom < o2 top
            )
            {       
              touch(i1,i2);
            }  
      }    
    } 
  }
}

function touch(n1,n2)
{
  var o1 = objects[n1];
  var o2 = objects[n2];
  var switched = false;
  if (objects[n1].hard > objects[n2].hard)
  {
    //o2 is the harder object (if any)    
    switched = true;
    o1 = objects[n2];
    o2 = objects[n1];
  }
  
  var playerPresent = false;
  if (o1.id == "PLAYER" || o2.id == "PLAYER")
  {
    playerPresent = true;
  }
  
  
  if (o1.hard > 0 && o2.hard > 0)
  {
    //log(o1.id + "(" + o1.hard +  ") and " + o2.id + "(" + o2.hard + ") are touching");
    
    //left, down, right, up
    var o1t = new Array(false, false, false, false);
    var o2t = new Array(false, false, false, false);
         
    //log ("comparing o1.x:" + o1.x + ", o1.w:" + o1.width + ", o2.x:" + o2.x + ", o2.w:" + o2.width); 
         
    var moved = false;
    if (!moved && o1.x + o1.width  >= o2.x && o1.x <= (o2.x))    // o1 right & o2 left
    {             
      o1.touching[2] = true;
      o2.touching[0] = true;
         
      o1.x = (o2.x - o1.width);
      o1.x0 = o1.x;
      o1.xstart = new Date().getTime();
      moved = true;            
      if (playerPresent) {player.jumpCount = 1;}
    }
    
    if (!moved && (o2.x + o2.width)  >= o1.x && o2.x <= (o1.x) )  // o1 left & o2 right
    {       
      o1.touching[0] = true;
      o2.touching[2] = true;
      
      o1.x = o2.x + o2.width ;
      o1.x0 = o1.x;
      o1.xstart = new Date().getTime();      
      moved = true;      
      if (playerPresent) {player.jumpCount = 1;}
    }
    
    if (!moved && o1.y + o1.height  > o2.y && o1.y + o1.height < o2.y + o2.height)        // o1 bottom & o2 top
    {o1.touching[1] = true; o2.touching[3] = true;}
    
    if (!moved && o2.y + o2.height  > o1.y && o2.y + o2.height < o1.y + o1.height)        // o1 top & o2 bottom
    {o1.touching[3] = true; o2.touching[1] = true; }
    
    
    //Write back to the objects array
    if (switched)
    {
      objects[n1] = o2;
      objects[n2] = o1;
    }
    else
    {
      objects[n1] = o1;
      objects[n2] = o2;
    }    
  }
  
  
  
  //Special touching situations
  if (o1.id == "PLAYER" && o2.deadly == true)
  {
    //Player should die
    log ("KILL PLAYER");
  }
  
}

///////////////////////////////////////////////////////////////////////////////
//Draw!
///////////////////////////////////////////////////////////////////////////////
var renderplayer = function()
{
  var end = new Date().getTime();
  var xduration = (end - player.xstart)/1000;   //seconds since left/right pressed
  
    
  player.dx = 0;  
  
  checkTouching();
  
  //log("touching: " + player.touching[2]);
  if (player.right && player.touching[2] == false)  { player.dx = player.speed;}
  if (player.left  && player.touching[0] == false)  { player.dx = 0-player.speed;}    
  player.x = player.x0 + (xduration * player.dx);  

  checkTouching();

  camera.setPosition();
  gravity(end); 
  
  showDebug();

  var c = document.getElementById("canvas");
  var context = c.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);



  //Draw objects (including player)  
  for (var i = 0; i < objects.length; i++)
  {    
    var o = objects[i];    
    context.beginPath();
    context.rect(o.x - camera.x, o.y - camera.y, o.width, o.height);
    context.fillStyle = o.color;//'#000000';  
    context.fill();  
  }
  
  
  //Draw floor (TEMPORARY)
  context.beginPath();
  context.moveTo(0, 500);
  context.lineTo(600, 500);
  context.stroke();

  //Refresh
  if (player.right || player.left || player.up || player.down || player.falling || player.jumping || camera.moving)
  { requestAnimationFrame(renderplayer); }
}


function gravity(end)
{  

  var fall = true;

  if ((player.y + player.height) >= floor)       //feet touching floor - don't fall
  { player.falling = false; fall=false; }


  if (player.falling === false && fall)                   //Should be falling but isn't yet
  {
    //START falling    
    player.fstart = new Date().getTime();
    player.falling = true;
    player.y0 = player.y;    
  }

  var dy = 0;

  //DY adjustments from jumpintg
  if (player.jumping)
  { 
    var jumpTime = 0.25;
    var duration = (end - player.jstart)/1000;
    var frac = duration/(jumpTime*2);          // times 2 because half way gravity takes over
    var jumpPower = player.j0* (1-frac);    
    dy -= duration*(jumpPower);           
  }


  //DY adjustments from falling
  if (player.falling)
  {     
    var duration = (end - player.fstart)/1000;    
    dy += duration * env.gravity;    
  }  

  player.y = player.y0 + dy;      
  if (player.y + player.height > floor)
  {
    player.y = floor - player.height;
    stopJumping();
  }  



}


function stopJumping()
{
  player.jumpCount = 0;
  player.jumping = false;
  player.y0 = player.y;
}









///////////////////////////////////////////////////////////////////////////////
//Handle key presses
///////////////////////////////////////////////////////////////////////////////
var leftRightWait = "";

function pressLeft()
{
  log("keypress: left");
  player.left= true;
  player.xstart = new Date().getTime();
  player.x0 = player.x;        
  renderplayer();
}
function pressRight()
{
  log("keypress: right");
  player.right = true;
  player.xstart = new Date().getTime();
  player.x0 = player.x;        
  renderplayer();
}

window.addEventListener( "keydown", doKeyDown, false )
window.addEventListener( "keyup", doKeyUp, false )

function doKeyDown(e) 
{ 
  if (env.controlsLocked === 0)
  {
    switch (e.keyCode)
    {

      case 65:      
        if (player.jumpCount < player.maxJumps)
        {       
          log("keypress: jump (a)");
          player.jumpCount++;        
          player.jstart = new Date().getTime();
          player.fstart = new Date().getTime();
          player.y0 = player.y;
          player.jumping = true;        
          renderplayer();        
        }
        break;
        
      case 37:      
        if (player.left === false && player.right === false) { pressLeft(); }      
        if (player.right) { leftRightWait = "left"; }
        break;

      case 39:      
        if (player.left === false && player.right === false) { pressRight(); }
        if (player.left) { leftRightWait = "right"; }
        break;

      case 84:
        log("TEST: moving camera");
        camera.move(200,200,2, true);
        break;


      case 82:
        //RESET
        log("keypress: r");
        player.y0 = 0;
        player.x0 = 0;
        player.x = 0;
        player.y = 0;
        player.right = false;
        player.down = false;
        ystart = new Date().getTime();
        xstart = new Date().getTime();
        renderplayer();      
        break;      
    }   
  } 
}


function doKeyUp(e) 
{   
  if (env.controlsLocked === 0)
  {
    switch (e.keyCode)
    {        
      case 37:
        if (leftRightWait == "left")  { log("releasing left"); leftRightWait = ""; }
        
        if (player.left)
        {
          player.left = false;
          player.x0 = player.x;        
          if (leftRightWait === "right") { pressRight(); }
        }
        break;
        
        
      case 39:
        if (leftRightWait == "right")  { leftRightWait = ""; }
        
        if (player.right)
        {
          player.right = false;
          player.x0 = player.x;        
          if (leftRightWait === "left")   { pressLeft(); }
        }
        break;
    }
  }
}


/////////////////////////////////////////////////////////////
//Debug!
/////////////////////////////////////////////////////////////
function showDebug()
{
  
  function addRow(header,value)
  {
    s ="<tr><td><b>" + header + ":</b> </td><td>" + value + "</td></tr>"; 
    return s;
  }

  if (env.debugging)
  {
    s = "<table cellpadding=0 cellspacing=0>";
    s += addRow("x",player.x);
    s += addRow("y",player.y);
    s += addRow("left",player.left);
    s += addRow("right",player.right);
    s += addRow("gravity",env.gravity);
    s += addRow("jumping",player.jumping);
    s += addRow("jumpCount",player.jumpCount);
    s += addRow("falling",player.falling);
    s += addRow("jstart",player.jstart);
    s += addRow("camera.y",camera.y);
    s += addRow("camera.x",camera.x);
    s += addRow("camera.y0",camera.y0);
    s += addRow("camera.x0",camera.x0);
    s += addRow("camera.frac",camera.getFrac());
    s += addRow("camera.moving",camera.moving);
    s += addRow("env.controlsLocked",env.controlsLocked);
    s += addRow("leftRightWait",leftRightWait);
    
    for (var i = 0; i < objects.length ; i++)
    {
      var o = objects[i];
      s += addRow("object " + i + " touching left", o.touching[0]);
      s += addRow("object " + i + " touching bottom",o.touching[1]);
      s += addRow("object " + i + " touching right",o.touching[2]);
      s += addRow("object " + i + " touching top",o.touching[3]);
    }

    s += "</table>";

    $("#debug").html(s);
  }
}







renderplayer();