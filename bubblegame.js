
//Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;


let score = 0;
let gameFrame = 0;

ctx.font = '50px Georgia';

// Mouser Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
});

//Player
const playerLeft = new Image();
playerLeft.src = 'player_left'; 
const playerRight = new Image();
playerRight.src = 'player_right';
class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0,
        this.frame = 0;
        this.sprideWidth = 498;
        this.sprideHeight = 327;
        
    }
    update (){

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx/30;
        }
        if (mouse.y != this.y){
            this.y -= dy/30;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

const player = new Player();

//Bubbles
const bubblesArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy); 
    }
    draw(){
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubbles-single2.wav';



function handleBubbles(){
    if(gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
    }
    for(let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
        
    }
    for(let i = 0; i < bubblesArray.length; i++){
        if(bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
        }
        if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            if(!bubblesArray[i].counted){
                if(bubblesArray[i].sound == 'sound1'){
                    bubblePop1.play();
                } else{
                    bubblePop2.play();
                }
                score++;
                bubblesArray[i].counted = true;
                bubblesArray.splice(i, 1);
            }
        }

    }
}



//Animate Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('SCORE : ' + score, 275, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();