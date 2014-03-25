var env = 
{        
  height: 600,
  width: 800,
  
  gameOver: false,
  
  objects: new Array(),
  debugging: true,
  logging: false,
  logFilter: "", 
  gravity: 300,  
  rowLogs: 10,
  controlsLocked: 0,
  click0:0,
  click1:0,
  somethingFalling: false,
  playerID: 0,               //object array id of player,
  
  click: function()
  {
    env.click0 = env.click1;
    env.click1 = new Date().getTime();
  },
  
  writePlayer: function()
  { env.objects[env.playerID] = player; },
  
  refreshPlayer: function()
  { player = env.objects[env.playerID]; },
  
  log: function(m)
  {
    var filter = env.logFilter.toUpperCase();
    if (env.logging && m.toUpperCase().indexOf(filter) >= 0)
    {
      $("#log2").html($("#log").html() + "\n" + $("#log2").html());
      $("#log").html(m); 
    }
  }
}
