import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class GameCanvasComponent extends Component {
  
  constructor() {
    super(...arguments);
    this.canvas
    this.ctx
    this.width
    this.height
    this.cellWidth
    this.cellHeight
    this.winner
    this.players = ['X', 'O']
    this.grid = [
      ['','',''],
      ['','',''],
      ['','','']
    ]
  }
  @tracked playerXScore = 0;
  @tracked playerOScore = 0;
  @tracked currentPlayer = Math.floor(Math.random() * this.players.length);
  @tracked playerTurn =   this.players[this.currentPlayer];

  updateScore() {
    this.winner == 'X' ? this.playerXScore++ : this.playerOScore++
  }

  @action
  configure(element){
   this.configureCanvas(element)
   this.drawLines()
   this.drawGrid()
   this.addEventListeners() 
  }
  @action
  reset(){
    this.grid = [
      ['','',''],
      ['','',''],
      ['','','']]
    this.ctx.clearRect(0,0, this.width, this.height)
    this.winner = ''
    this.drawLines()
  }
  checkForWinner(){
    let winner = null
    for(let i = 0; i < 3; i++){
      if(this.checkLine(this.grid[i][0],this.grid[i][1],this.grid[i][2])){
        winner = this.grid[i][0]
      }
      else if(this.checkLine(this.grid[0][i], this.grid[1][i], this.grid[2][i])){
        winner = this.grid[0][i]
      }
    }
    if(this.checkLine(this.grid[0][0], this.grid[1][1], this.grid[2][2])){
      winner = this.grid[0][0]
    }
    else if(this.checkLine(this.grid[2][0], this.grid[1][1], this.grid[0][2])){
      winner = this.grid[2][0]
    }
    return winner
  }
  checkLine(a,b,c){
    return(a==b && b==c && a==c && a != '')
  }
  switchPlayer(){
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length
    this.playerTurn =   this.players[this.currentPlayer];
  }
  endTurn(){
    if(this.winner = this.checkForWinner()){
      this.updateScore()
      this.displayWinner()
      this.disableCells()
    }
  }
  displayWinner(){
    this.ctx.fillStyle = '#f0f8ff'
    this.ctx.font="60px Helvetica";
    let text= `Player ${this.winner} Won!!!`
    this.ctx.fillText(text,50, this.height/2)
  }
  disableCells(){
    this.grid = [
      [' ',' ',' '],
      [' ',' ',' '],
      [' ',' ',' ']]
  }
  fillCell(cell){
    this.grid[cell[0]] [cell[1]] = this.players[this.currentPlayer]
  }
  findCell(x, y){
    let cellX ,cellY = 0
    for(let j = 0; j < 3; j++){
      if(x < this.cellWidth * (j + 1)){
        cellX = j
        break
      }
    }
    for(let i = 0; i < 3; i++){
      if(y < this.cellHeight * (i + 1)){
        cellY = i
        break
      }
    }
    return [cellY, cellX]
  }
  isCellAvailable(cell){
   return this.grid[cell[0]][cell[1]] == "" ? true : false
  }
  keyDown(event){
    if(this.isCellAvailable(this.findCell( event.layerX,  event.layerY))){
      this.fillCell(this.findCell( event.layerX,  event.layerY))
      this.drawGrid()
      this.switchPlayer()
      this.endTurn()
    }
  }
  addEventListeners() {
    let scope = this
    this.canvas.addEventListener('mousedown', function(e){
      scope.keyDown(e)
    }, false);
  }
  drawGrid(){
    this.ctx.strokeStyle = "#F9AA33";
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        let x = this.cellWidth * j + this.cellWidth/2
        let y = this.cellHeight * i + this.cellHeight/2
        if(this.grid[i][j] == 'O'){
          this.drawCircle(x,y)
        }else if(this.grid[i][j] == 'X'){
          this.drawCross(x,y)
        }
      }
    }
  }
  drawCross(x,y){
    this.ctx.beginPath() 
    this.ctx.moveTo(x - this.cellWidth/3, y - this.cellHeight/3)  
    this.ctx.lineTo(x + this.cellWidth/3, y + this.cellHeight/3)
    this.ctx.stroke()    
    this.ctx.moveTo(x + this.cellWidth/3, y - this.cellHeight/3)  
    this.ctx.lineTo(x - this.cellWidth/3, y + this.cellHeight/3)
    this.ctx.stroke()    
  }
  drawCircle(x,y){
    this.ctx.beginPath();
    this.ctx.arc(x, y, 50, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  drawLines(){
    this.ctx.lineWidth = 5
    this.ctx.strokeStyle = "#232F34";
    this.ctx.beginPath() 
    this.ctx.moveTo(this.cellWidth, 0)  
    this.ctx.lineTo(this.cellWidth, this.height)
    this.ctx.stroke();    
    this.ctx.moveTo(this.cellWidth*2, 0)   
    this.ctx.lineTo(this.cellWidth*2, this.height)
    this.ctx.stroke()    
    this.ctx.moveTo(0, this.cellHeight)   
    this.ctx.lineTo(this.width, this.cellHeight)
    this.ctx.stroke()   
    this.ctx.moveTo(0, this.cellHeight*2)
    this.ctx.lineTo(this.width, this.cellHeight*2)
    this.ctx.stroke()   
  }
  configureCanvas(c) {
    this.canvas = c
    this.ctx = this.canvas.getContext('2d')
    this.width = c.width
    this.height = c.height
    this.cellWidth = c.width/3
    this.cellHeight = c.height/3
  }
}