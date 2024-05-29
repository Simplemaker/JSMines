
function randInt(low, hi){
  var range = hi-low
  return Math.floor(Math.random()*range+low)
}

class GameSession {
  constructor(width, height, count, renderer) {
    this.height = height
    this.width = width
    this.count = count
    this.renderFn = renderer
    this.markCount = 0
    this.state = 'uninitialized'
    this.board = this.genArray()
    this.visboard = this.genArray(-1)
    this.revealed = this.genArray()
    this.revealcount = 0
  }
  
  genMines(count){
    var testMineArray = this.genArray()
    var m = 0
    while(m<count){
      var x = randInt(0,this.width)
      var y = randInt(0,this.height)
      if(testMineArray[x][y]==0){
        testMineArray[x][y]=1
        m++;
      }
    }
    return testMineArray
  }
  
  genSafeMines(x, y){
    
    if(this.count >= this.width*this.height){
      this.count = this.width*this.height-1
    }
    var v = true
    while(v){
      var t = this.genMines(this.count)
      if(t[x][y]==0){
        v=false
      }
    }
    this.mines = t
  }

  genArray(val = 0){
    var x = new Array(this.width);
    for (var i = 0; i < x.length; i++) {
      var x2 = new Array(this.height);
      for (var i2 = 0; i2 < x2.length; i2++) {
      x2[i2] = val
      }
      x[i] = x2
    }
    return x
  }

  revealSquare(x, y){
    if(x<0 || x>=this.width || y<0|| y>=this.height){
      return
      //error catching for squares not on the grid
    }

    if(this.revealed[x][y]==0){
    //only runs on squares which are not revealed
    this.revealed[x][y]=1
    this.revealcount += 1

    if(this.mines[x][y]==1){
      this.state = 'lose'
      this.revealMines(x, y)
    }else{
      var n = this.neighbors(x, y)
      this.visboard[x][y]=n
      if(n==0){
        this.revealSquare(x-1,y+1)
        this.revealSquare(x-1,y)
        this.revealSquare(x-1,y-1)
        this.revealSquare(x,  y+1)
        this.revealSquare(x+1,y+1)
        this.revealSquare(x+1,y)
        this.revealSquare(x+1,y-1)
        this.revealSquare(x  ,y-1)
      }

    }
    
    }
  }

  cutOffValue(x, y, array=this.mines){
    if(x<0 || x>=this.width || y<0|| y>=this.height){
      return 0
    }else{
      return array[x][y]
    }
  }

  neighbors(x, y, array=this.mines, testvalue=1){
  var n = 0
  n+=this.cutOffValue(x+1,y  ,array)==testvalue
  n+=this.cutOffValue(x+1,y+1,array)==testvalue
  n+=this.cutOffValue(x,  y+1,array)==testvalue
  n+=this.cutOffValue(x-1,y+1,array)==testvalue
  n+=this.cutOffValue(x-1,y  ,array)==testvalue
  n+=this.cutOffValue(x-1,y-1,array)==testvalue
  n+=this.cutOffValue(x,  y-1,array)==testvalue
  n+=this.cutOffValue(x+1,y-1,array)==testvalue
  return n
  }
  
  revealMines(bx, by){
    for(var x =0; x<this.width; x++){
      for(var y=0; y<this.height; y++){
        if(this.mines[x][y]){
          this.visboard[x][y] = 9
        }
      }
    } 
    this.visboard[bx][by] = 10
    this.render()
  }

  click(x, y){

    if(this.state == 'lose' || this.state == 'win' || this.visboard[x][y]==-2){return;}
    if(this.state == 'uninitialized'){
      //first click generates mines
      this.state = 'initialized'
      this.genSafeMines(x, y)
    }
    //Clicked and initialized
   this.revealSquare(x, y)
    
    this.render()
  }

  toggleMark(x,y){
    if(this.state == 'uninitialized' ||this.state == 'lose' || this.state == 'win'){return;}
    
    if(this.visboard[x][y]>=1 && this.visboard[x][y]<=8){
      //when on a numbered cell
      var number = this.visboard[x][y]
      var flagged= this.neighbors(x, y, this.visboard, -2)
      if(flagged == number){
        var clickList = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]
        for(var i = 0; i<clickList.length; i++){
          var newx = x+clickList[i][0]
          var newy = y+clickList[i][1]
          if(newx<0 || newx>=this.width || newy<0|| newy>=this.height){
           
          }else{
          if(this.visboard[newx][newy]==-1){
            this.click(newx,newy)
          }
          }
        }
        
      }

    }

    //for flagging unmarked cells
    if(this.visboard[x][y]==-1){
      //flag the unmarked cell
      this.visboard[x][y]=-2
      this.markCount+=1
    }else if(this.visboard[x][y]==-2){
      this.visboard[x][y]=-1
      this.markCount-=1
    }
    this.render()
    return false;
  }

  render(){
    if(this.revealcount == this.height*this.width-this.count && this.count - this.markCount == 0){
        this.state = 'win'
      }
    this.renderFn(this)
  }
}