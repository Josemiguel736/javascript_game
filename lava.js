function Lava(initalPosition,characterType){
    this.position=initalPosition;
    this.size=new Vector(1,1);

    if(characterType==="=")this.speed=new Vector(2 ,0);
    else if(characterType==="|")this.speed=new Vector(0 ,2);
    else if (characterType=="v"){
        this.speed = new Vector(0 ,3);
        this.respawnPosition=initalPosition;
    }
    
}

Lava.prototype.type="lava"

Lava.prototype.act=function(step,level){
    let newPosition=this.position.plus(this.speed.times(step));
    
    if (!level.obstableAt(newPosition,this.size)) this.position=newPosition;
    else if (this.respawnPosition) this.position=this.respawnPosition; 
    else this.speed=this.speed.times(-1) } 


