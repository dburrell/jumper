var objects = new Array();

var player = 
{
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
  jumpPower:500,
  j0:800,

  touchingWall:false,

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
  gravity: 200,
  keydown: false,      
  rowLogs: 10,
  controlsLocked: 0
}


/////////////////////////////////////////////////
//Make a generic object (tree or enemy)
/////////////////////////////////////////////////
function newObj()
{
  var o = 
  {
    height: 20,
    width: 20,
    x: 0,
    y: 0,
    y0: 0,
    x0: 0,
    y0: 0,      
    x0: 0,
    y: 0,
    x: 0,
    endY: 0,
    endX: 0,
    speed: 700,
    color: "#00F"
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

var a = newObj();
addObj(a);



var floor = 500;



function log(m)
{  
  $("#log2").html($("#log").html() + "\n" + $("#log2").html());
  $("#log").html(m); 
}


///////////////////////////////////////////////////////////////////////////////
//Draw!
///////////////////////////////////////////////////////////////////////////////
var renderplayer = function()
{
  var end = new Date().getTime();
  var xduration = (end - player.xstart)/1000;   //seconds since left/right pressed

  player.dx = 0;  
  if (player.right) { player.dx = player.speed;}  
  if (player.left)  { player.dx = 0-player.speed;}
  player.x = player.x0 + (xduration * player.dx);  

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
  


  //context.beginPath();
  //context.rect(player.x - camera.x, player.y - camera.y, player.width, player.height);
  //context.fillStyle = '#000000';  
  //context.fill();

  //Draw floor
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

  //DY adjustments from jumping
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
  

  s += "</table>";

  $("#debug").html(s);

}







renderplayer();