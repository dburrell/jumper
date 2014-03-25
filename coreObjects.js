
var player = 
{
  id: "PLAYER",
  deadly: false,
  hasMass: true,
  hard: 1,
  x0: 0,
  y0: 0,
  x: 450,
  y: 280,
  height: 20,
  width: 20,
  dy: 0,
  dx: 0,
  right: false,
  left: false,
  up: false,
  down: true,
  speed: 500,   //should be 700
  color:"#000",  
  jumpCount:0,
  maxJumps:2,
  climber: false,
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



/////////////////////////////////////////////////////
//Make a generic object (tree or enemy or whatever)
/////////////////////////////////////////////////////
function newObj()
{
  var o = 
  {
    id: "OBJECT" + env.objects.length,
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
  o.x0 = o.x;
  o.y0 = o.y;
  env.objects[env.objects.length] = o;   
}



//Add the player
addObj(player);