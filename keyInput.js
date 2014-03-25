
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