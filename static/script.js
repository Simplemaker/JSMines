b = document.getElementById('board')
m = document.getElementById('mines')
t = document.getElementById('timer')
s = document.getElementById('smiley')
gc= document.getElementById('gamecontainer')
mnu=document.getElementById('menu')

function renderBoard(game){
  var l = game.height
  var w = game.width
  var data = game.visboard
  var text = '<table>\n'
  
  for(var iy=0; iy<l; iy++){
    text+='<tr>'
    for(var ix=0; ix<w; ix++){
      var innertext = cellText(data[ix][iy])

      text+='<td class=\'' +cellClasses(data[ix][iy])+ '\' onclick=\'grid(' +ix+','+iy+ ')\' oncontextmenu=\'mark('+ix+','+iy+');return false;\'>'+innertext+'</td>'
    }
    text+='</tr>'
  }
  text+='</table>'
  b.innerHTML = text
  if(game.state == 'lose'){
    s.src = 'die.png'
  }else if(game.state == 'win'){
    s.src = 'cool.png'
  }else{
    s.src = 'smile.png'
  }
  m.innerHTML = pad(game.count - game.markCount)
}

function cellClasses(dataval){
  if(dataval == -2){
    return 'cell_unclicked'
  }else if(dataval == -1){
    return 'cell_unclicked'
  }else if(dataval <=8 && dataval >= 0){
    return 'cell_value'
  }else if(dataval == 9){
    return 'mine'
  }else if(dataval == 10){
    return 'clicked_mine'
  }
}

function cellText(dataval){
  if(dataval <= 8 && dataval >= 1){
    return dataval+''
  }else if(dataval==9 || dataval==10){
    return '<img src=\'mine.png\' class=\'gridimg\'>'
  }else if(dataval==-2){
    return '<img src=\'flag.png\' class=\'gridimg\'>'
  }else{
    return ' '
  }
}

function grid(x,y){
  g.click(x,y)
}

function mark(x,y){
  g.toggleMark(x,y)
}

function startGame(){
  var a = document.getElementById('inputMines')
  var newMines = parseInt(a.value)
  var a = document.getElementById('inputWidth')
  var newWidth = parseInt(a.value)
  var a = document.getElementById('inputHeight')
  var newHeight =parseInt(a.value)
  g = new GameSession(newWidth, newHeight, newMines, renderBoard)
g.render()
timerFn()
}
startGame();

function pad(number){
  var ntext = ''+number
  while(ntext.length<3){ntext='0'+ntext;}
  return ntext
}

function menu(x){
  if(x){
    gc.style.display = 'none'
    mnu.style.display ='block'
  }else{
    gc.style.display = 'block'
    mnu.style.display ='none'
  }
}

function difficulty(x){
  var presets = [
    [9,9,10],
    [16,16,40],
    [30,16,99]
  ]
  var s = presets[x]
  document.getElementById('inputMines').value = s[2]
  document.getElementById('inputWidth').value = s[0]
  document.getElementById('inputHeight').value = s[1]
}

function startGameButton(){
  startGame()
  menu(0)
}

function timerFn(){
  if(g.state == 'initialized'){
    timer+=1
  }else if(g.state == 'uninitialized'){
    timer=0
  } 
  t.innerHTML = pad(timer)
}



v = setInterval(timerFn, 1000)
t.innerHTML = '000'
timer = 0
