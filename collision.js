function checkTouching()
{
  for (var i1 = 0; i1 < env.objects.length; i1++)
  {
    var o1 = env.objects[i1];
    o1.touching = new Array(false, false, false, false);
  }

  for (var i1 = 0; i1 < env.objects.length; i1++)
  {
    for (var i2 = 0; i2 < env.objects.length; i2++)
    {
      if (i1 < i2)            //using strict less than so that only one touch is called.
      {        
        var o1 = env.objects[i1];
        var o2 = env.objects[i2];
               
        if (checkTouchingBool(i1,i2))
        {
          touch(i1,i2);
        }        
      }    
    } 
  }
  
  
}

function checkTouchingBool(n1, n2)
{
  var o1 = env.objects[n1];
  var o2 = env.objects[n2];
  var gap = 0;
  
  if (    o1.x              <= (o2.x + o2.width + gap)    // o1 left > o2 right
      && (o1.x + o1.width)  >=  o2.x - gap                // o1 right < o2 left
      &&  o1.y              <= (o2.y + o2.height)         // o1 top > o2 bottom
      && (o1.y + o1.height) >=  o2.y                      // o1 bottom < o2 top
      )
      { return true;  }  
      else
      { return false; }
}

function touch(n1, n2)
{  
  var o1 = env.objects[n1];
  var o2 = env.objects[n2];
  var switched = false;
  if (env.objects[n1].hard > env.objects[n2].hard)
  {
    //o2 is the harder object (if any)    
    switched = true;
    o1 = env.objects[n2];
    o2 = env.objects[n1];
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
      env.log ("assessing touching of " + o1.id + " & " + o2.id);
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
      env.log ("TOUCHING: Player DDX vs BOX is " + ddx);
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
        env.log("marking player (" + o1.y + "," + o1.x + ") touching_left (0) as true, against " + o2.id);
        env.log ("o2.y: " + o2.y);
      }
      
      o1.touching[0] = true;
      o2.touching[2] = true;
      //alert("touching left");
    }
    
    // o1 bottom & o2 top
    if (o1.y + o1.height  >= o2.y  
      //findme
      //&& o1.y + o1.height - o1.dy <= o2.y
      && o1.x              < (o2.x + o2.width )    // o1 left > o2 right
      && (o1.x + o1.width)  >  o2.x  
    )        
    { 
      diff[1] = (o1.y + o1.height) - o2.y; 
      if (o1.id=="PLAYER" && o2.id == "BOX") 
      {
        env.log("marking player (" + o1.y + "," + o1.x + ") touching_bottom (1) as true, against " + o2.id);
        env.log ("o2.y: " + o2.y);
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
      env.log("marking player (" + o1.y + "," + o1.x + ") touching_right (2) as true");
      
      o1.touching[2] = true;
      o2.touching[0] = true;
      
      //alert("touching right");
    }
        
    // o1 top & o2 bottom
    if (o1.y <= o2.y + o2.height
      && o1.y + o1.dy <= o2.y
      && o1.x              < (o2.x + o2.width )    // o1 left > o2 right
      && (o1.x + o1.width)  >  o2.x  
    )        
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
    if (o1.id == "PLAYER" && o2.id == "FLOOR" ) 
    {
      for (var i = 0; i < 4; i++)
      { env.log(i + ":" + diff[i]); }
      env.log("overlapCount: " + overlapCount + ", fixed:" + fixed + ", min:" + min);     
    }

     if (diff[0] == min && !fixed)
    {
        // o1 left & o2 right
        env.log(desc[0]);
        env.log("activing per[0] action");
                     
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
        env.log(desc[1]);       
        env.log("activing per[1] action");
        o1.y = (o2.y - o1.height) ;         
        o1.touching[1] = true;        
        o1.down = false;
        o1.up = false;
        env.log("pushed o1 ('" + o1.id + "') upwards")
        
        fixed = true;
    }
    if (diff[2] == min && !fixed)
    {
      // o1 right & o2 left
      if (o1.id == "PLAYER")
      {
        env.log ("marking player right [2] as true");
      }
      env.log(desc[2]);
      env.log("activing per[2] action");
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
      env.log(desc[3]);
      env.log("activing per[3] action");
      o1.touching[3] = true;      
      //TODO: pushing something upwards
      fixed = true;
    }
    
    
    
    
    // __ backup1.txt was in here
    
    //log("player.touching[0] (left) is now " + player.touching[0]);
    //log("player.touching[1] (down) is now " + player.touching[1]);
    //log("player.touching[2] (right)is now " + player.touching[2]);
    //log("player.touching[3] (top)  is now " + player.touching[3]);
    //Write back to the env.objects array
    if (switched)
    {
      env.objects[n1] = o2;
      env.objects[n2] = o1;
    }
    else
    {
      env.objects[n1] = o1;
      env.objects[n2] = o2;
    }    
    
    
  }
  
  
  
  //Special touching situations
  if (o1.id == "PLAYER" && o2.deadly == true || o2.id == "PLAYER" && o1.deadly == true)
  {
    //Player should die
    die();    
  }
  
  if (o1.id == "PLAYER")
  {
    env.log("TOUCHING: end of touching, player_touching_left is " + env.objects[env.playerID].touching[0]);
  }
  
}
