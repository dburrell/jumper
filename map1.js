
player.img = "man.png";

//Add enemy
var a = newObj();
a.y = 480;
a.x = 300;
a.width= 20;
a.img = "poison.png";
a.deadly = true;
addObj(a);


//Add a grey box
var b = newObj();
b.id = "BOX";
b.y = 320;
b.x = 400;
b.width= 100;
b.height = 180;
b.color = "rgba(200,200,200,0.5)";
b.deadly = false;
b.hasMass = false;
addObj(b);

//Add a wall
var c = newObj();
c.id = "BOX_RIGHT";
c.y = 420;
c.x = 600;
c.width= 100;
c.height = 80;
addObj(c);

//Add a floor
var d = newObj();
d.id = "FLOOR";
d.y = 500;
d.x = 0;
d.width= 700;
d.height = 10;
d.hasMass = false;
d.color = "#FA5";
addObj(d);


//Add an exit door
var exit      = newObj();
exit.id       = "EXIT";
exit.exit     = true;
exit.clip     = false;
exit.y        = 470;
exit.x        = 10;
exit.height   = 30;
exit.width    = 30;
//exit.color = "#0F0";
exit.img      = 'portal.png';
exit.deadly   = false;
exit.hasMass  = false;
addObj(exit);


//Add a grey box
var img = newObj();
img.id = "BOX";
img.solid = false;
img.y = 100;
img.x = 100;
img.width= 100;
img.height = 100;
img.img = "check.png";
img.deadly = false;
img.hasMass = false;
addObj(img);

