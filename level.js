const ACTORS={"o":Coin,"@":Player,"=":Lava,"|":Lava,"v":Lava

};

const MAX_STEP=0.05;
const coinAudio = new Audio('./sound/sounds_coin.wav');
const wonAudio = new Audio('./sound/win.mp3');
const deathAudio = new Audio('./sound/death.mp3');

function Level(plan){
    if (!validateLevel(plan)) throw new Error("You need a player and Coin")
    this.width=plan[0].length;
    this.height=plan.length;
    this.status=null;
    this.finishDelay=null;
 


    this.grid=[];
    this.actors=[];

    for (let y = 0; y < this.height; y++){
        let line=plan[y];
        let gridLine=[];
        for (let x=0; x<this.width;x++){
            let character=line[x];
            let characterType=null;

            let Actor=ACTORS[character]
            if (Actor) this.actors.push(new Actor(new Vector(x,y),character));
            if(character==="x") characterType="wall";
            else if (character==="!") characterType="lava";

            gridLine.push(characterType);

        }
        this.grid.push(gridLine);

    }this.player=this.actors.filter(actor=>actor.type==="player")[0];
   
  
}

Level.prototype.isFinished=function(){
    return (this.status !==null&&this.finishDelay<0)
}

Level.prototype.animate=function(step,keys){
    if (this.status !== null) this.finishDelay-=step;

    while(step>0){
        let thisStep=Math.min(step,MAX_STEP);
        this.actors.forEach(actor => actor.act(thisStep,this,keys));
        step-=thisStep;
    }
}

Level.prototype.actorAt=function(actor){
    for (let i = 0; i < this.actors.length; i++) {
        let other = this.actors[i];
        if(actor !== other && 
        actor.position.x + actor.size.x > other.position.x &&
        actor.position.x < other.position.x + other.size.x &&
        actor.position.y + actor.size.y > other.position.y &&
        actor.position.y < other.position.y + other.size.y) return other;
    }
}

Level.prototype.obstableAt=function(position,size){
    let xStart=Math.floor(position.x);
    let xEnd=Math.ceil(position.x+size.x);
    let yStart=Math.floor(position.y);
    let yEnd=Math.ceil(position.y+size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0 ) return "wall";
    if (yEnd > this.height) return 'lava';
    for(let y=yStart; y<yEnd;y++){
        for (let x=xStart; x<xEnd;x++){
            let fieldType=this.grid[y][x];
            if (fieldType)return fieldType;
        }
    }


}


Level.prototype.playerTouched=function(type,actor){
    if(type==="lava"&& this.status===null){
        this.status="lost";
        loseAudio()
        this.finishDelay=3;
    }
    else if (type==="coin"){
        playAudio();
        this.actors=this.actors.filter(otherActor =>otherActor!==actor);
        if (!remainCoins(this.actors)){ 
            this.status="won";
            winAudio()
            this.finishDelay=2;
    } }  }

function playAudio(){
    coinAudio.pause();
    coinAudio.currentTime=0;
    coinAudio.play();
}

function winAudio(){
    wonAudio.pause();
    wonAudio.currentTime=0;
    wonAudio.play();
}

function loseAudio(){
    deathAudio.pause();
    deathAudio.currentTime=0;
    deathAudio.play();
}


function validateLevel(level){

    return (level.some(row => row.indexOf("@")!==-1)&&level.some(row => row.indexOf("o")!==-1))

}

function remainCoins(actors){
    return actors.some(actor=>actor.type==="coin");
}