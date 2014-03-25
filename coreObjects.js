var player = 
{
  // Game elements
  id: "PLAYER",
  deadly: false,
  hasMass: true,
  clip:true,
  hard: 100,
  
  // Position/location
  height: 20,
  width: 20,  
  x: 450,
  y: 280,  
  
  // Asthetics
  color:"#000",  
  img:"",             // background image
  imgRepeat: false,  // repeat background image
    
  // Capabilities
  climber: false,
  maxJumps:2,
  jumpPower:700,
  speed: 500,   
  
  // Current state
  x0: 0,
  y0: 0,
  dy: 0,
  dx: 0,
  right: false,
  left: false,
  up: false,
  down: true,
  falling:true,
  jumpCount:0,    
  jumping:false,      
  xstart: new Date().getTime(), 
  fstart: new Date().getTime(),
  jstart: new Date().getTime(),
  touching: new Array(false,false,false,false) 
  
}


/////////////////////////////////////////////////////
//Make a generic object (tree or enemy or whatever)
/////////////////////////////////////////////////////
function newObj()
{
  var o = 
  {
    // Game elements
    id: "OBJECT" + env.objects.length,
    deadly: false,
    exit: false,
    hasMass: true,
    clip: true,
    hard: 102,
    
    
    // Position/location
    height: 20,
    width: 20,
    x: 0,
    y: 0,
    
    // Asthetics
    color: "#FAF",      // default of horrific pink
    img:"",             // background image
    imgRepeat: false,  // repeat background image
    
    // Capabilities
    speed: 700,
    
    // Current state
    left: 0,          // needed?
    right: 0,         // needed?
    down: true,    
    y0: 0,
    x0: 0,    
    dy: 0,
    dx: 0,    
    fstart: new Date().getTime(),    
    falling: true,           
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



//Add the player
addObj(player);