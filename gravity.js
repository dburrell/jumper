function gravity(now)
{  
  env.log("Gravity: Starting");
  //env.refreshPlayer();
  env.somethingFalling = false;
  for (var i = 0; i < env.objects.length; i++)
  {
    var o = env.objects[i];       
    var fall = true;
    var prevDy = o.dy;
    o.dy = 0;
    
    if (o.id== "PLAYER")
    {
      env.log("Gravity: player touching[1] is " + o.touching[1]);        
      env.log("Gravity: player down is " + o.down); 
      env.log("Gravity: player up is " + o.up); 
      env.log("Gravity: fall is " + fall); 
    }
    
     //can't fall through an object
    if (!o.up && o.touching[1]) 
    {             
      if (o.id== "PLAYER")
      {     
        env.log("Graviyt: LANDING PLAYER")
        stopJumping();
        env.log("after stopJumping, player.jumping is " + player.jumping);   
      }
      o.falling = false;
      fall = false;
      //o.down = false;
      o.y0 = o.y;
      
      o.dy = 0;
    }   
  
    
    if (o.hasMass == false || o.y > env.height)
    { 
      if (o.id== "PLAYER") { env.log("Gravity: Player fallen off world, stopping");}
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
        
        if (o.id== "PLAYER") { env.log("Gravity: Jumping, so dy is now " + o.dy);}
        
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
      var dt = env.click1 - env.click0;
      var v = (o.dy - prevDy) / dt;
      env.log("gravity: player falling speed: " + dt );
      env.log("gravity: player falling by: " + (o.dy - prevDy) );
      env.log("gravity: player.dy: " + o.dy);
      env.log("gravity: player.y: " + o.y);
      env.log("gravity: player.y + player.height: " + (o.y + o.height));
      
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