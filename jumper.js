var objects = new Object();

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

      jumpCount:0,
      jumping:false,      
      jumpPower:500,
      j0:800,

      touchingWall:false,

      falling:true,

      xstart: new Date().getTime(), 
      fstart: new Date().getTime(),
      jstart: new Date().getTime()
    }

var env = 

    {      
      gravity: 200,
      keydown: false,      
      startTime: new Date().getTime(), 
      endTime: new Date().getTime(),
      left: false,
      right: false,
      up: false,
      down: false,
      y0: 0,      
      x0: 0,
      y: 0,
      x: 0,
      endY: 0,
      endX: 0,

      moving: false,

      moveCamera: function(x, y, t)
      {        
        env.startTime = new Date().getTime();
        env.endTime = env.startTime + (t * 1000);  
        env.y0 = env.y;
        env.x0 = env.x;                    
        env.endY = y;
        env.endX = x;
        env.moving = true;       
      },

      setCameraPosition: function()
      {        
        if (env.moving)
        {                             
          env.y = (env.endY - env.y0) * env.getFrac();  
          env.x = (env.endX - env.x0) * env.getFrac();                     
        }        
      },

      getFrac: function()
      {
        var now = new Date().getTime() ;  
        var timeSoFar = now - env.startTime;
        var totalTime = env.endTime - env.startTime;       
        var frac = timeSoFar/totalTime;
        if (now >= env.endTime)
        { env.moving = false; }
        return frac;
      }      
    }


function addObj(o)
{
  n = Object.keys(objects).length
  objects[n] = o;   
}

addObj(player);



var floor = 500;


function log(m)
{  
  $("#log2").html($("#log").html() + "<br>" + $("#log2").html());
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

  env.setCameraPosition();
  gravity(end); 

  showDebug();

  var c = document.getElementById("canvas");
  var context = c.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  //Draw player
  context.beginPath();
  context.rect(player.x - env.x, player.y - env.y, player.width, player.height);
  context.fillStyle = '#000000';  
  context.fill();

  //Draw floor
  context.beginPath();
  context.moveTo(0, 500);
  context.lineTo(600, 500);
  context.stroke();

  //Refresh
  if (player.right || player.left || player.up || player.down || player.falling || player.jumping || env.moving)
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
  switch (e.keyCode)
  {

    case 65:      
      if (player.jumpCount < 2)
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
      env.moveCamera(200,200,2);
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


function doKeyUp(e) 
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
  s += addRow("env.y",env.y);
  s += addRow("env.x",env.x);
  s += addRow("leftRightWait",leftRightWait);
  

  s += "</table>";

  $("#debug").html(s);

}







renderplayer();