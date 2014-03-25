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
  
  
  if (    o1.x              <= (o2.x + o2.width)          // o1 left > o2 right
      && (o1.x + o1.width)  >=  o2.x                      // o1 right < o2 left
      &&  o1.y              <= (o2.y + o2.height)         // o1 top > o2 bottom
      && (o1.y + o1.height) >=  o2.y                      // o1 bottom < o2 top
      )
      { 
        if (o1.clip && o2.clip)
        {
          return true;  
        }
        else
        {
          specialTouch(n1,n2);
          return false;
        }
      }  
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
    var touching = true;
    var overlapCount = 0;
    var moved = false;    
    var diff = new Array(0,0,0,0);
    
    
    
    ////////////////////////////////////////////
    //Detecting touching, and marking as such
    ////////////////////////////////////////////
    
    // o1 left & o2 right
    if (o1.x <= o2.x + o2.width  
        && (o1.x + o1.width) - o1.dx >= o2.x + o2.width                    
        &&  o1.y              < (o2.y + o2.height)     
        && (o1.y + o1.height) >  o2.y)  
    { 
      diff[0] = (o2.x + o2.width) - o1.x;       
      o1.touching[0] = true;     
    }
    
    // o1 bottom & o2 top
    if (o1.y + o1.height  >= o2.y        
      && o1.x              < (o2.x + o2.width )    
      && (o1.x + o1.width)  >  o2.x  
    )        
    { 
      diff[1] = (o1.y + o1.height) - o2.y;       
      o1.touching[1] = true;               
    }
    
    // o1 right & o2 left
    if (o1.x + o1.width  >= o2.x 
        && o1.x - o1.dx <= o2.x      
        &&  o1.y              < (o2.y + o2.height) 
        && (o1.y + o1.height) >  o2.y)             
    { 
      diff[2] = (o1.x + o1.width) - o2.x;       
      o1.touching[2] = true;      
    }
        
    // o1 top & o2 bottom
    if (o1.y <= o2.y + o2.height
      && o1.y + o1.dy <= o2.y
      && o1.x              < (o2.x + o2.width )    
      && (o1.x + o1.width)  >  o2.x  
    )        
    if (o2.y + o2.height  >= o1.y && o2.y + o2.height <= o1.y + o1.height)        
    { 
      diff[3] = (o2.y + o2.height) - o1.y;       
      o1.touching[3] = true;       
    }

    
    
    
    


    
    
    ////////////////////////////////////////////
    //Is there true overlap?
    ////////////////////////////////////////////
    for (var i = 0; i < 4; i++)
    { 
      if (diff[i] > 0){overlapCount++;} 
      if (diff[i] <= 0){diff[i] = env.height;}       
    }
    
    
    var fixed = false;  //This is used in unlikely case that there's an identical overlap in 2 directions
   
    if (overlapCount == 0)
    { fixed = true; }
         
    var min = Math.min.apply(null, diff); //max is now the highest value of the differences
    
    
    ////////////////////////////////////////////
    //Should now fix the SMALLEST overlap
    ////////////////////////////////////////////
    if (diff[0] == min && !fixed)
    {
        // o1 left & o2 right
        o1.x = (o2.x + o2.width);
        o1.x0 = o1.x;
        o1.xstart = new Date().getTime();                          
        o1.touching[0] = true;        
               
        if (playerPresent) {player.jumpCount--;}
        fixed = true;
    }
    if (diff[1] == min && !fixed)
    {
        // o1 bottom & o2 top                
        o1.y = (o2.y - o1.height) ;         
        o1.touching[1] = true;        
        o1.down = false;
        o1.up = false;        
        fixed = true;
    }
    if (diff[2] == min && !fixed)
    {
      // o1 right & o2 left      
      o1.x = (o2.x - o1.width) ;      
      o1.x0 = o1.x;      
      o1.xstart = new Date().getTime();      
      o1.touching[2] = true;      
      if (playerPresent) {player.jumpCount--;}
      fixed = true;
    }
    if (diff[3] == min && !fixed)
    {
      // o1 top & o2 bottom     
      o1.touching[3] = true;      
      //TODO: pushing something upwards
      fixed = true;
    }
    
    
    ////////////////////////////////////////////
    //Write back to the env.objects array
    ////////////////////////////////////////////
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
  
  specialTouch(n1,n2);    // Check if either object is special
  
}


/////////////////////////////////////
//Special scenarios (even if noclip)
/////////////////////////////////////
function specialTouch(n1,n2)
{
  var o1 = env.objects[n1];
  var o2 = env.objects[n2];
  
  //Special touching situations
  if (o1.id == "PLAYER" && o2.deadly == true || o2.id == "PLAYER" && o1.deadly == true)
  {
    //Player should die
    die();    
  }

  if (o1.id == "PLAYER" && o2.exit == true || o2.id == "PLAYER" && o1.exit == true)
  {
    //end of level
    completeLevel();
  }
}
