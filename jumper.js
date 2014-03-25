
///////////////////////////////////////////////////////////////////////////////
//Render loop
///////////////////////////////////////////////////////////////////////////////
var renderplayer = function()
{
  env.click();
  var now = new Date().getTime();
  var xduration = (now - env.objects[env.playerID].xstart)/1000;   //seconds since left/right pressed
  
  camera.setPosition(true, true);  // Provides an offset based on where the 'camera' is.       
  gravity(now);                     // Move things vertically   
  
  
  // Move player horizontally  
  // This also makes it easier to convert into a loop to detect moving env.objects later on.
  env.objects[env.playerID].dx = 0;    
  env.log("DX CALC: player_touching_left (0) is " + env.objects[env.playerID].touching[0]);
  env.log("DX CALC: player_touching_right (2) is " + env.objects[env.playerID].touching[2]);
  
  var dx = 0;      
  if (env.objects[env.playerID].right && env.objects[env.playerID].touching[2] == false)  { dx = env.objects[env.playerID].speed;}
  if (env.objects[env.playerID].left  && env.objects[env.playerID].touching[0] == false)  { dx = 0-env.objects[env.playerID].speed;}        
  env.objects[env.playerID].dx = dx * xduration;
  
  
  if (dx == 0)
  {
    env.objects[env.playerID].x0 = env.objects[env.playerID].x;
    env.objects[env.playerID].xstart = now;
  }
  
  env.objects[env.playerID].x = env.objects[env.playerID].x0 + env.objects[env.playerID].dx;  
  
  env.log("DX CALC: player.dx is " + env.objects[env.playerID].dx);
  env.log("DX CALC: player.x is " + env.objects[env.playerID].x);
  
  checkTouching();    //Check nothing is overlapping, mark things that are touching, etc.

 
  showDebug();

  //Select the canvas
  var c = document.getElementById("canvas");
  var context = c.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  //Draw env.objects (including player)  
  for (var i = 0; i < env.objects.length; i++)
  {    
    var o = env.objects[i];    
    context.beginPath();
    context.rect(o.x - camera.x, o.y - camera.y, o.width, o.height);
    context.fillStyle = o.color;
    context.fill();  
  }
  

  //Refresh
  if (player.right || player.left || player.up || player.down || player.falling || player.jumping || camera.moving || env.somethingFalling)
  { requestAnimationFrame(renderplayer); }
}











///////////////////////////////////////////////////////////////////////////////
//Handle key presses
///////////////////////////////////////////////////////////////////////////////
var leftRightWait = "";

function pressLeft()
{
  env.log("keypress: left");
  player.left= true;
  player.xstart = new Date().getTime();
  player.x0 = player.x;        
  renderplayer();
}
function pressRight()
{
  env.log("keypress: right");
  player.right = true;
  player.xstart = new Date().getTime();
  player.x0 = player.x;        
  renderplayer();
}

window.addEventListener( "keydown", doKeyDown, false )
window.addEventListener( "keyup", doKeyUp, false )

function doKeyDown(e) 
{ 
  if (env.controlsLocked == 0)
  {      
    switch (e.keyCode)
    {      
      case 81:
        //q - toggle log visibility
        if ($("#log").css("display") == "block")
        {
          $("#log").css("display","none");
          $("#log2").css("display","none");
        }
        else
        {
          $("#log").css("display","block");
          $("#log2").css("display","block");
        }
        
        break;
      case 87:
        //w - wipe log
        $("#log2").html("");
        $("#log").html(""); 
        break;
      case 65:      
        if (player.jumpCount < player.maxJumps)
        {       
          env.log("keypress: jump (a)");
          player.jumpCount++;        
          player.jstart = new Date().getTime() - 1;
          player.fstart = new Date().getTime() - 1;
          player.y0 = player.y;
          player.jumping = true;        
          player.falling = true;	
          player.up = true;
          player.down = false;
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
        env.log("TEST: moving camera");
        camera.move(200,200,2, true);
        break;


      case 82:
        //RESET
        env.log("keypress: r");
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
        if (leftRightWait == "left")  { env.log("releasing left"); leftRightWait = ""; }
        
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
    s += addRow("x0",player.x0);
    s += addRow("y",player.y);
    s += addRow("y0",player.y0);
    s += addRow("left",player.left);
    s += addRow("right",player.right);
    s += addRow("gravity",env.gravity);
    s += addRow("jumping",player.jumping);
    s += addRow("jumpCount",player.jumpCount);
    s += addRow("falling",player.falling);
    s += addRow("fstart",player.fstart);
    s += addRow("jstart",player.jstart);
    s += addRow("xstart",player.xstart);
    s += addRow("ystart",player.ystart);
    s += addRow("camera.y",camera.y);
    s += addRow("camera.x",camera.x);
    s += addRow("camera.y0",camera.y0);
    s += addRow("camera.x0",camera.x0);
    s += addRow("camera.frac",camera.getFrac());
    s += addRow("camera.moving",camera.moving);
    s += addRow("env.controlsLocked",env.controlsLocked);
    s += addRow("env.somethingFalling",env.somethingFalling);
    
    s += addRow("leftRightWait",leftRightWait);
    
    s += addRow("player.up",player.up);
    s += addRow("player.down",player.down);
    
    s += addRow("player.touching_left",player.touching[0]);
    s += addRow("player.touching_down",player.touching[1]);
    s += addRow("player.touching_right",player.touching[2]);
    s += addRow("player.touching_up",player.touching[3]);
    
    
    for (var i = 0; i < 1; i++)
    {
      var o = env.objects[i];
      //s += addRow("object " + i + " touching left", o.touching[0]);
     s += addRow("object " + i + " touching bottom",o.touching[1]);
     s += addRow("object " + i + " dy",o.dy);
      //s += addRow("object " + i + " touching right",o.touching[2]);
      //s += addRow("object " + i + " touching top",o.touching[3]);
      s += addRow("object[" + i + "].y: " , o.y);
    }

    s += "</table>";

    $("#debug").html(s);
  }
}


renderplayer();




