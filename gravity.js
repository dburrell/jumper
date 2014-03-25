function gravity(now)
{    
  env.somethingFalling = false;
  
  ////////////////////////////////
  //Loop through all objects
  ////////////////////////////////
  for (var i = 0; i < env.objects.length; i++)
  {
    ////////////////////////////////
    //Grab the object in question
    ////////////////////////////////
    var o = env.objects[i];       
    var shouldBeFalling = true;
    var prevDy = o.dy;
    o.dy = 0;
    
    
    ////////////////////////////////
    //can't fall through an object
    ////////////////////////////////
    if (!o.up && o.touching[1]) 
    {             
      if (o.id== "PLAYER")
      { stopJumping(); }
      o.falling = false;
      shouldBeFalling = false;
      
      o.y0 = o.y;
      o.dy = 0;
    }   
  
  
    ////////////////////////////////
    //Out of bounds catcher
    ////////////////////////////////
    if (o.hasMass == false || o.y > env.height)
    {       
      o.falling = false; 
      shouldBeFalling = false; 
            
      if (o.y > env.height)
      { stopJumping(); }
    }
    

    ////////////////////////////////
    //Jumping (add upwards)
    ////////////////////////////////
    if (o.id == "PLAYER")
    {      
      //DY adjustments from jumping
      if (player.jumping )
      { 
        var duration = (now - player.jstart)/1000;  
        var d = player.jumpPower * duration;        
        o.dy -= d;                                         
      }
    }
    
    
    ////////////////////////////////
    //Start falling?
    ////////////////////////////////
    if (o.falling == false && shouldBeFalling)   
    {
      //START falling          
      o.fstart = new Date().getTime();        // 
      o.falling = true;                       // 
      o.y0 = o.y;                             // 
    }

    
    ////////////////////////////////
    //Basic gravity & application
    ////////////////////////////////
    if ((shouldBeFalling && o.hasMass) || (o.id == "PLAYER" && player.jumping && player.up))
    {
      //DY adjustments from falling
      if (o.falling && o.hasMass)
      {     
        env.somethingFalling = true;
        var t = (now - o.fstart)/1000;        // time falling so far (seconds)
        var a = 2000;                         // acceleration                
        var startV = 200;                     // starting velocity
        
        o.dy += (startV*t) + ((a*(t*t))/2);   // add to the dy
      } 
      
      
      
      ////////////////////////////////
      //Apply to object
      ////////////////////////////////
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
           
      
      ////////////////////////////////
      //Move object vertically
      ////////////////////////////////
      o.y = o.y0 + o.dy;      
    }
    
    
    env.objects[i] = o;
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