var objects = new Array();

var player = 
{
  id: "PLAYER",
  deadly: false,
  hasMass: true,
  hard: 1,
  x0: 370,
  y0: 350,
  x: 0,
  y: 0,
  height: 20,
  width: 20,
  dy: 0,
  dx: 0,
  right: false,
  left: false,
  up: false,
  down: true,
  speed: 700,   //should be 700
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
  height: 600,
  width: 800,
  debugging: true,
  logging: false,
  gravity: 200,  
  rowLogs: 10,
  controlsLocked: 0,
  somethingFalling: false,
  playerID: 0,               //object array id of player,
  writePlayer: function()
  { objects[env.playerID] = player; },
  refreshPlayer: function()
  { player = objects[env.playerID]; }
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
    down: true,
    x: 0,
    y: 0,
    y0: 0,
    x0: 0,    
    dy: 0,
    dx: 0,
    fstart: new Date().getTime(),    
    falling: true,    
    speed: 700,
    color: "#FAA",  //default of horrific pink
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
//addObj(a);


//Add a grey box
var b = newObj();
b.id = "BOX";
b.y = 470;
b.x = 400;
b.width= 100;
b.height = 70;
b.color = "rgba(200,200,200,0.5)";
b.deadly = false;
b.hasMass = false;
addObj(b);

//Add a wall
var c = newObj();
c.y = 0;
c.x = 600;
c.width= 100;
c.height = 50;
//addObj(c);

//Add a floor
var d = newObj();
d.id = "FLOOR";
d.y = 500;
d.x = 0;
d.width= 600;
d.height = 10;
d.hasMass = false;
d.color = "#FA5";
addObj(d);




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
               
        if (checkTouchingBool(i1,i2))
        {
          touch(i1,i2);
        }        
      }    
    } 
  }
  
  log("TOUCHING: end of touching LOOP - player.left is " + objects[env.playerID].touching[0]);
}

function checkTouchingBool(n1, n2)
{
  var o1 = objects[n1];
  var o2 = objects[n2];
  var gap = 0;
  
  if (    o1.x              <= (o2.x + o2.width + gap)    // o1 left > o2 right
      && (o1.x + o1.width)  >=  o2.x - gap                // o1 right < o2 left
      &&  o1.y              <= (o2.y + o2.height)         // o1 top > o2 bottom
      && (o1.y + o1.height) >=  o2.y                      // o1 bottom < o2 top
      )
      { return true;  }  
      else
//      else
      { return false; }
}

function touch(n1, n2)
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
    //left, down, right, up
    if (o1.id == "PLAYER" && o2.id == "BOX")
    {
      log ("assessing touching of " + o1.id + " & " + o2.id);
    }    
    var touching = true;
    var overlapping = false;
    var overlapCount = 0;
    var moved = false;
    var gap = 30;
    
    var desc = new Array("moving o1 right","moving o1 up", "moving o1 left","moving o1 down");
    var diff = new Array(0,0,0,0);
    
    
    var ddx = o1.dx - o2.dx;
    var ddy = o1.dy - o2.dy;
    if (o1.id == "PLAYER" && o2.id == "BOX")
    {
      log ("TOUCHING: Player DDX vs BOX is " + ddx);
    }
    
    ///////
    //Detecting touching, and marking as such
    ///////
    
    // o1 left & o2 right
    if (o1.x <= o2.x + o2.width  
        && (o1.x + o1.width) - o1.dx >= o2.x + o2.width
                    
        &&  o1.y              < (o2.y + o2.height)         // o1 top > o2 bottom
        && (o1.y + o1.height) >  o2.y)  
    { 
      diff[0] = (o2.x + o2.width) - o1.x; 
      if (o1.id=="PLAYER" ) 
      {
        log("marking player (" + o1.y + "," + o1.x + ") touching_left (0) as true, against " + o2.id);
      log ("o2.y: " + o2.y);
      }
      
      o1.touching[0] = true;
      o2.touching[2] = true;
      //alert("touching left");
    }
    
    // o1 bottom & o2 top
    if (o1.y + o1.height  >= o2.y  && o1.y <= o2.y
      && o1.x              < (o2.x + o2.width )    // o1 left > o2 right
      && (o1.x + o1.width)  >  o2.x  
    )        
    { 
      diff[1] = (o1.y + o1.height) - o2.y; 
      if (o1.id=="PLAYER" && o2.id == "BOX") 
      {
        log("marking player (" + o1.y + "," + o1.x + ") touching_bottom (1) as true, against " + o2.id);
        log ("o2.y: " + o2.y);
        }
      
      o1.touching[1] = true;         
      o2.touching[3] = true;    
    }
    
    // o1 right & o2 left
    if (o1.x + o1.width  >= o2.x 
        && o1.x - o1.dx <= o2.x      
        &&  o1.y              < (o2.y + o2.height)         // o1 top > o2 bottom
        && (o1.y + o1.height) >  o2.y)                      // o1 bottom < o2 top)    
    { 
      diff[2] = (o1.x + o1.width) - o2.x; 
      log("marking player (" + o1.y + "," + o1.x + ") touching_right (2) as true");
      
      o1.touching[2] = true;
      o2.touching[0] = true;
      
      //alert("touching right");
    }
        
    // o1 top & o2 bottom
    if (o2.y + o2.height  >= o1.y && o2.y + o2.height <= o1.y + o1.height)        
    { 
      diff[3] = (o2.y + o2.height) - o1.y; 
      
      o1.touching[3] = true; 
      o2.touching[1] = true;  
    }

    
    
    
    


    
    
    
    //Is there true overlap?
    for (var i = 0; i < 4; i++)
    { 
      if (diff[i] > 0){overlapCount++;} 
      if (diff[i] <= 0){diff[i] = env.height;}       
    }
    
    
    var fixed = false;  //This is used in unlikely case that there's an identical overlap in 2 directions
   
    if (overlapCount >= 1)
    {
      overlapping = true;      
    }
    else
    {
      fixed = true;//if only one is overlapping then it's not really overlapping
    }
         
    var min = Math.min.apply(null, diff); //max is now the highest value of the differences
    
    
    
    
    //Should now fix the SMALLEST overlap (i.e. where an overlap has just occured)
    
    
    //DEBUGGING
    if (o1.id == "PLAYER" && o2.id == "BOX" ) 
    {
      for (var i = 0; i < 4; i++)
      { log(i + ":" + diff[i]); }
      log("overlapCount: " + overlapCount + ", fixed:" + fixed + ", min:" + min);     
    }

     if (diff[0] == min && !fixed)
    {
        // o1 left & o2 right
        log(desc[0]);
        log("activing per[0] action");
                     
        o1.x = (o2.x + o2.width);
        o1.x0 = o1.x;
        o1.xstart = new Date().getTime();                  
        if (playerPresent) {player.jumpCount = 1;}
        o1.touching[0] = true;        
        fixed = true;
    }
    if (diff[1] == min && !fixed)
    {
        // o1 bottom & o2 top        
        log(desc[1]);       
        log("activing per[1] action");
        o1.y = (o2.y - o1.height) ;         
        o1.touching[1] = true;        
        o1.down = false;
        o1.up = false;
        log("pushed o1 ('" + o1.id + "') upwards")
        
        fixed = true;
    }
    if (diff[2] == min && !fixed)
    {
      // o1 right & o2 left
      if (o1.id == "PLAYER")
      {
        log ("marking player right [2] as true");
      }
      log(desc[2]);
      log("activing per[2] action");
      o1.x = (o2.x - o1.width) ;      
      o1.x0 = o1.x;
      if (playerPresent) {player.jumpCount = 1;}
      o1.xstart = new Date().getTime();
      o1.touching[2] = true;      
      
      fixed = true;
    }
    if (diff[3] == min && !fixed)
    {
      // o1 top & o2 bottom
      log(desc[3]);
      log("activing per[3] action");
      o1.touching[3] = true;      
      //TODO: pushing something upwards
      fixed = true;
    }
    
    
    
    
    // __ backup1.txt was in here
    
    //log("player.touching[0] (left) is now " + player.touching[0]);
    //log("player.touching[1] (down) is now " + player.touching[1]);
    //log("player.touching[2] (right)is now " + player.touching[2]);
    //log("player.touching[3] (top)  is now " + player.touching[3]);
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
  if (o1.id == "PLAYER" && o2.deadly == true || o2.id == "PLAYER" && o1.deadly == true)
  {
    //Player should die
    //log ("KILL PLAYER");
  }
  
  if (o1.id == "PLAYER")
  {
    log("TOUCHING: end of touching, player_touching_left is " + objects[env.playerID].touching[0]);
  }
  
}




///////////////////////////////////////////////////////////////////////////////
//Render loop
///////////////////////////////////////////////////////////////////////////////
var renderplayer = function()
{
  var now = new Date().getTime();
  var xduration = (now - objects[env.playerID].xstart)/1000;   //seconds since left/right pressed
  
  camera.setPosition(true, true);  // Provides an offset based on where the 'camera' is.       
  gravity(now);                     // Move things vertically   
  
  
  
  //Move player horizontally  (now using objects[env.playerID] so it access objects table directly, no need to write back to player object afterwards.
  // This also makes it easier to convert into a loop to detect moving objects later on.
  objects[env.playerID].dx = 0;    
  log("DX CALC: player_touching_left (0) is " + objects[env.playerID].touching[0]);
  log("DX CALC: player_touching_right (2) is " + objects[env.playerID].touching[2]);
  var dx = 0;
  //if (objects[env.playerID].right && objects[env.playerID].touching[2] == false)  { objects[env.playerID].dx = objects[env.playerID].speed;}
  //if (objects[env.playerID].left  && objects[env.playerID].touching[0] == false)  { objects[env.playerID].dx = 0-objects[env.playerID].speed;}        
  if (objects[env.playerID].right && objects[env.playerID].touching[2] == false)  { dx = objects[env.playerID].speed;}
  if (objects[env.playerID].left  && objects[env.playerID].touching[0] == false)  { dx = 0-objects[env.playerID].speed;}        
  objects[env.playerID].dx = dx * xduration;
  
  
  if (dx == 0)
  {
    objects[env.playerID].x0 = objects[env.playerID].x;
    objects[env.playerID].xstart = now;
  }
  
  objects[env.playerID].x = objects[env.playerID].x0 + objects[env.playerID].dx;  
  
  log("DX CALC: player.dx is " + objects[env.playerID].dx);
  log("DX CALC: player.x is " + objects[env.playerID].x);
  
  checkTouching();    //Check nothing is overlapping, mark things that are touching, etc.

 
  showDebug();

  //Select the canvas
  var c = document.getElementById("canvas");
  var context = c.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  //Draw objects (including player)  
  for (var i = 0; i < objects.length; i++)
  {    
    var o = objects[i];    
    context.beginPath();
    context.rect(o.x - camera.x, o.y - camera.y, o.width, o.height);
    context.fillStyle = o.color;
    context.fill();  
  }
  

  //Refresh
  if (player.right || player.left || player.up || player.down || player.falling || player.jumping || camera.moving || env.somethingFalling)
  { requestAnimationFrame(renderplayer); }
}


function gravity(now)
{  
  log("Gravity: Starting");
  //env.refreshPlayer();
  env.somethingFalling = false;
  for (var i = 0; i < objects.length; i++)
  {
    var o = objects[i];       
    var fall = true;
    var prevDy = o.dy;
    o.dy = 0;
    
    if (o.id== "PLAYER")
    {
      log("Gravity: player touching[1] is " + o.touching[1]);        
      log("Gravity: player down is " + o.down); 
      log("Gravity: player up is " + o.up); 
      log("Gravity: fall is " + fall); 
    }
    
     //can't fall through an object
    if (!o.up && o.touching[1]) 
    {             
      if (o.id== "PLAYER")
      {     
        log("Graviyt: LANDING PLAYER")
        stopJumping();
        log("after stopJumping, player.jumping is " + player.jumping);   
      }
      o.falling = false;
      fall = false;
      //o.down = false;
      o.y0 = o.y;
      
      o.dy = 0;
    }   
  
    
    if (o.hasMass == false || o.y > env.height)
    { 
      if (o.id== "PLAYER") { log("Gravity: Player fallen off world, stopping");}
      o.falling = false; 
      fall = false; 
            
      if (o.y > env.height)
      { stopJumping(); }
    }
    

  
    if (o.id == "PLAYER")
    {      
      //DY adjustments from jumping
      if (player.jumping )
      { 
        var duration = (now - player.jstart);  
        var jumpTime = 500;
              
  
        var frac = Math.min(1,duration/(jumpTime));          // *2 because half way gravity takes over
        
        var jumpPower = player.j0 * (1-frac);    
        o.dy -= (duration/1000)*(jumpPower);           
        
        if (o.id== "PLAYER") { log("Gravity: Jumping, so dy is now " + o.dy);}
        
        if (frac < 2)
        {
          //log("frac:" + frac + ", dy: " + dy + ", duration:" + duration);
        }
        
      }
    }
    
    if (o.falling == false && fall)                   //Should be falling but isn't yet
    {
      //START falling          
      o.fstart = new Date().getTime();
      o.falling = true;
      o.y0 = o.y;          
    }

    

    if ((fall && o.hasMass) || (o.id == "PLAYER" && player.jumping & player.up))
    {
      //DY adjustments from falling
      if (o.falling && o.hasMass)
      {     
        env.somethingFalling = true;
        var duration = (now - o.fstart)/1000;    
        o.dy += duration * env.gravity;        
      } 
      
      
      o.up = false;
      o.down = false;
      
      if (o.dy > prevDy)
      {        
        o.down = true;
       
      }
      if (o.dy < prevDy)
      {
        o.up = true;
      }
           
      
           
      //Move object vertically
      o.y = o.y0 + o.dy;      
    }
    
    if (o.id == "PLAYER")
    {
      log("gravity: player.dy: " + o.dy);
      log("gravity: player.y: " + o.y);
      log("gravity: player.y + player.height: " + (o.y + o.height));
      
    }
    objects[i] = o;
  }
}


function stopJumping()
{
  player.jumpCount = 0;
  player.jumping = false;
  player.down = false
  player.up = false;
  player.y0 = player.y;
  player.ystart = new Date().getTime();
  
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
  if (env.controlsLocked == 0)
  {      
    switch (e.keyCode)
    {      
      case 87:
        //w - wipe log
        $("#log2").html("");
        $("#log").html(""); 
        break;
      case 65:      
        if (player.jumpCount < player.maxJumps)
        {       
          log("keypress: jump (a)");
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
    s += addRow("x0",player.x0);
    s += addRow("y",player.y);
    s += addRow("y0",player.y0);
    s += addRow("left",player.left);
    s += addRow("right",player.right);
    s += addRow("gravity",env.gravity);
    s += addRow("jumping",player.jumping);
    s += addRow("jumpCount",player.jumpCount);
    s += addRow("falling",player.falling);
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
    
    
    for (var i = 0; i < objects.length ; i++)
    {
      var o = objects[i];
      //s += addRow("object " + i + " touching left", o.touching[0]);
     s += addRow("object " + i + " touching bottom",o.touching[1]);
      //s += addRow("object " + i + " touching right",o.touching[2]);
      //s += addRow("object " + i + " touching top",o.touching[3]);
      s += addRow("object[" + i + "].y: " , o.y);
    }

    s += "</table>";

    $("#debug").html(s);
  }
}







renderplayer();




