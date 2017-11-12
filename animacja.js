var srednica = 30;
var szerLini = 4;
var pozycje = []
var wektory = []
var wektory = []

pozycje[0] = [400, 170, 0]//biala
pozycje[1] = [500, 90, 0]//zielona
pozycje[2] = [500, 180, 0]//zolta
pozycje[3] = [200, 470, 0]//pomaranczowa
pozycje[4] = [500, 360, 0]//czerwona
pozycje[5] = [500, 450, 0]//niebieska

for(i=0; i<pozycje.length; i++){
  wektory[i] = [0, 0];
}
//wektory[4] = [-1, 0.5];
wektory[5] = [-1, 0.1];
//=========================================================================
//drzewo

var tree;
var r = srednica*2;
var cwiartka = 0;


function Node(){
  this.data = [arguments[0], arguments[1], arguments[2], arguments[3]];
  this.kula = null; //numer kuli w tablicy pozycje i wektory
  this.parent = null;
  this.ilePotomkow = 0;
  this.children = [];
}

function Tree(){
  var node = new Node(arguments[0], arguments[1], arguments[2], arguments[3]);
  this._root = node;
}

function initTree(){
  tree = new Tree(0, 0, window.innerWidth, window.innerHeight);

  tree._root.children.push(new Node(0, 0, window.innerWidth/2, window.innerHeight/2));
  tree._root.children[0].parent = tree;

  tree._root.children.push(new Node(window.innerWidth/2, 0, window.innerWidth, window.innerHeight/2));
  tree._root.children[1].parent = tree;

  tree._root.children.push(new Node(0, window.innerHeight/2, window.innerWidth/2, window.innerHeight));
  tree._root.children[2].parent = tree;

  tree._root.children.push(new Node(window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight));
  tree._root.children[3].parent = tree;

  tree._root.ilePotomkow = 4;

  for(i=1; i<pozycje.length; i++){
    if(pozycje[i][0] < window.innerWidth/2 && pozycje[i][1] < window.innerHeight/2){
      tree._root.children[0].children.push(new Node(pozycje[i][0]-r, pozycje[i][1]-r, pozycje[i][0]+r, pozycje[i][1]+r));
      tree._root.children[0].children[tree._root.children[0].ilePotomkow].parent = tree._root.children[0];
      tree._root.children[0].children[tree._root.children[0].ilePotomkow].kula = i;
      tree._root.children[0].ilePotomkow = tree._root.children[0].ilePotomkow +1;
    }else if(pozycje[i][0] >= window.innerWidth/2 && pozycje[i][1] < window.innerHeight/2){
      tree._root.children[1].children.push(new Node(pozycje[i][0]-r, pozycje[i][1]-r, pozycje[i][0]+r, pozycje[i][1]+r));
      tree._root.children[1].children[tree._root.children[1].ilePotomkow].parent = tree._root.children[1];
      tree._root.children[1].children[tree._root.children[1].ilePotomkow].kula = i;
      tree._root.children[1].ilePotomkow = tree._root.children[1].ilePotomkow +1;
    }else if(pozycje[i][0] < window.innerWidth/2 && pozycje[i][1] >= window.innerHeight/2){
      tree._root.children[2].children.push(new Node(pozycje[i][0]-r, pozycje[i][1]-r, pozycje[i][0]+r, pozycje[i][1]+r));
      tree._root.children[2].children[tree._root.children[2].ilePotomkow].parent = tree._root.children[2];
      tree._root.children[2].children[tree._root.children[2].ilePotomkow].kula = i;
      tree._root.children[2].ilePotomkow = tree._root.children[2].ilePotomkow +1;
    }else if(pozycje[i][0] >= window.innerWidth/2 && pozycje[i][1] >= window.innerHeight/2){
      tree._root.children[3].children.push(new Node(pozycje[i][0]-r, pozycje[i][1]-r, pozycje[i][0]+r, pozycje[i][1]+r));
      tree._root.children[3].children[tree._root.children[3].ilePotomkow].parent = tree._root.children[3];
      tree._root.children[3].children[tree._root.children[3].ilePotomkow].kula = i;
      tree._root.children[3].ilePotomkow = tree._root.children[3].ilePotomkow +1;
    }
  }
}

function checkCwiartka(){
  //zmiana cwiartki
  if(pozycje[0][0] < tree._root.children[cwiartka].data[0] || pozycje[0][1] < tree._root.children[cwiartka].data[1] || pozycje[0][0] >= tree._root.children[cwiartka].data[2] || pozycje[0][1] >= tree._root.children[cwiartka].data[3]){
    for(i=0; i<tree._root.ilePotomkow; i++){
      if(pozycje[0][0] > tree._root.children[i].data[0] && pozycje[0][1] > tree._root.children[i].data[1] && pozycje[0][0] <= tree._root.children[i].data[2] && pozycje[0][1] <= tree._root.children[i].data[3]){
        cwiartka = i;
      }
    }
  }
}

//=========================================================================
//kolizje

function kolizjaPierwszy(){
  wektory[arguments[0]][0] = -wektory[arguments[0]][0];
  wektory[arguments[0]][1] = wektory[arguments[0]][1];
}

function kolizjaDrugi(){
  wektory[arguments[0]][0] = wektory[arguments[0]][0];
  wektory[arguments[0]][1] = -wektory[arguments[0]][1];
}

function kolizjaTrzeci(){
  wektory[arguments[0]][0] = -wektory[arguments[0]][0];
  wektory[arguments[0]][1] = -wektory[arguments[0]][1];
}

//========================================================================
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// x, y, kolor lini, kolor wypelnienia
function rysujBile(){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(arguments[0],arguments[1],srednica,0,2*Math.PI, false);
  ctx.fillStyle = arguments[3];
  ctx.fill();
  ctx.lineWidth = szerLini;
  ctx.strokeStyle = arguments[2];
  ctx.stroke();
}

function ruchBili(){
  for(i=0; i<pozycje.length; i++){
    if(wektory[i][0] != 0 || wektory[i][1] != 0){
      if(pozycje[i][0] + wektory[i][0] <= srednica || pozycje[i][0] + wektory[i][0] >= window.innerWidth-srednica){
        kolizjaPierwszy(i);
      }else if(pozycje[i][1] + wektory[i][1] <= srednica || pozycje[i][1] + wektory[i][1] >= window.innerHeight-srednica){
        kolizjaDrugi(i);
      }else{
        if(i == 0){
          checkCwiartka();
        }
        for(j=0; j<tree._root.ilePotomkow; j++){
          if(tree._root.children[j].ilePotomkow != 0){
            for(k=0; k<tree._root.children[j].ilePotomkow; k++){
              if(i != tree._root.children[j].children[k].kula && pozycje[i][1] + wektory[i][1] >= tree._root.children[j].children[k].data[1] && pozycje[i][1] + wektory[i][1] <= tree._root.children[j].children[k].data[3] && pozycje[i][0] + wektory[i][0] >= tree._root.children[j].children[k].data[0] && pozycje[i][0] + wektory[i][0] <= tree._root.children[j].children[k].data[2]){
                wektory[tree._root.children[j].children[k].kula][0] = wektory[tree._root.children[j].children[k].kula][0] + wektory[i][0];
                wektory[tree._root.children[j].children[k].kula][1] = wektory[tree._root.children[j].children[k].kula][1] + wektory[i][1];
                kolizjaTrzeci(i);
              }
            }
          }
        }
        pozycje[i][0] = pozycje[i][0] + wektory[i][0];
        pozycje[i][1] = pozycje[i][1] + wektory[i][1];
        wektory[i][0] = wektory[i][0] *0.997;
        wektory[i][1] = wektory[i][1] *0.997;
      }
    }
  }
}

function rysujBile(){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(arguments[0],arguments[1],srednica,0,2*Math.PI, false);
  ctx.fillStyle = arguments[3];
  ctx.fill();
  ctx.lineWidth = szerLini;
  ctx.strokeStyle = arguments[2];
  ctx.stroke();
}

function rysuj(){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  rysujBile(pozycje[0][0],pozycje[0][1],'#404040','#f2f2f2');//biala
  rysujBile(pozycje[1][0],pozycje[1][1],'#003300','#1a6600');//zielona
  rysujBile(pozycje[2][0],pozycje[2][1],'#4d4d00','#ffff00');//zolta
  rysujBile(pozycje[3][0],pozycje[3][1],'#4d2800','#ff8c1a');//pomaranczowa
  rysujBile(pozycje[4][0],pozycje[4][1],'#4d0000','#e60000');//czerwona
  rysujBile(pozycje[5][0],pozycje[5][1],'#00134d','#002db3');//niebieska
  ctx.font = "30px Arial"
  ctx.fillText(tree._root.data,10,50);
  ctx.fillText(tree._root.children[0].data,30,80);
  ctx.fillText(tree._root.children[1].data,30,110);
  ctx.fillText(tree._root.children[2].data,30,140);
  ctx.fillText(tree._root.children[3].data,30,170);

  ctx.fillText('Cwiartka: '+cwiartka,30,270);
  ctx.fillText('Ile Kul: '+tree._root.children[cwiartka].ilePotomkow,30,300);

  ctx.fillText('Pierwsza: '+tree._root.children[0].ilePotomkow,30,370)
  ctx.fillText('Druga: '+tree._root.children[1].ilePotomkow,30,400)
  ctx.fillText('Trzecia: '+tree._root.children[2].ilePotomkow,30,430)
  ctx.fillText('Czwarta: '+tree._root.children[3].ilePotomkow,30,460)
}

function startBiala(evt){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var pozycjaMyszy = getMousePos(c, evt);
  wektory[0][0] = (pozycjaMyszy.x - pozycje[0][0])/200;
  wektory[0][1] = (pozycjaMyszy.y - pozycje[0][1])/200;
}

function timer(){
  setInterval(initTree, 20);
  setInterval(rysuj, 20);
  setInterval(ruchBili, 10);
}
