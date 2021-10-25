//import resources
const app = new PIXI.Application(800,500);
const bg = new PIXI.Sprite.fromImage('res/background.png');
const front = new PIXI.Sprite.fromImage('res/front.png');
const path = new PIXI.Sprite.fromImage('res/path.png');
const poses = [];
for(let i = 0; i < 5; i++) poses.push('res/pose' + i + '.png');
const playerBox = new PIXI.Sprite(null);
const player = new PIXI.extras.AnimatedSprite.fromImages(poses);
const jumpPose0 = new PIXI.Texture.fromImage('res/jumpPose0.png');
const jumpPose1 = new PIXI.Texture.fromImage('res/jumpPose1.png');
const jumpPlayer = new PIXI.Sprite.fromImage('res/jumpPose1.png');
const jumpBtn = new PIXI.Sprite.fromImage('res/jumpBtn.png');
const coins = [];
const style = {
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill:'#ffffff',
  // 描边
  stroke: '#4a1850',
  // 描边宽度
  strokeThickness: 4,
  // 字体阴影
  dropShadow: true,
  // 阴影颜色
  dropShadowColor: '#0000ee',
  dropShadowBlur: 4,
  // 阴影倾斜
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
}
const tip = new PIXI.Text('按下空格跳跃',style);
const scores = new PIXI.Text('');
const keyObj = keyboard(' '); //add listener on space key
keyObj.press = () => {
  //arrow function
  jump();
}

//init variables
var isJump = false;
var speed = -20;
var refreshCoin = 0;
var coinNum = 0;

document.body.appendChild(app.view);
app.stage.addChild(bg);
app.stage.addChild(front);
app.stage.addChild(path);
app.stage.addChild(playerBox);
playerBox.addChild(player);
playerBox.addChild(jumpPlayer);
app.stage.addChild(jumpBtn);
app.stage.addChild(tip);
app.stage.addChild(scores);
jumpBtn.interactive = true;
jumpBtn.on('click',jump);



front.y = 200;
path.y = 400;
path.scale.x = 4;
player.animationSpeed = 0.2;
playerBox.anchor.set(.5,.5);
playerBox.x = 100;
playerBox.y = 310;
player.play();
jumpPlayer.visible = false;
jumpBtn.x = 600;
jumpBtn.y = 340;
jumpBtn.buttonMode = true;
tip.x = 285;
tip.y = 40;
tip.alpha = 0;
scores.text = '金币：' + coinNum;
scores.x = 20;
scores.y = 20;
scores.style.fill = '#ffffff';  
app.ticker.add(animate);

function animate(){
  path.x -= 5;
  if(path.x == -1600)path.x = -350;

  tip.alpha += 0.02 ;
  if(tip.alpha > 1)tip.alpha = 0;

  refreshCoin++;
  if(refreshCoin == 100){
    refreshCoin = 0;
    let coin = new PIXI.Sprite.fromImage('res/coin.png');
    coins.push(coin);
    coin.x = 800;
    coin.y = Math.random() * 240 + 100;
    app.stage.addChild(coin);
  }
  if(coins.length != 0){
    for(let i = coins.length - 1; i >= 0; i--){
      coins[i].x -= 5;
      let d = (coins[i].x - playerBox.x) * (coins[i].x - playerBox.x) + (coins[i].y - playerBox.y) * (coins[i].y - playerBox.y);
      if(d < 100 * 100){
        let del = coins.splice(i,1);
        app.stage.removeChild(del[0]);
        coinNum++;
        scores.text = '金币：' + coinNum;
      }
    }
  }
  if(isJump){
    playerBox.y += speed;
    speed++;
    if(playerBox.y > 310){
      playerBox.y = 310;
      speed = -20;
      isJump = false;
      jumpPlayer.visible = false;
      player.visible = true;
      player.play();
    }
  }
}

function jump(){
  player.stop();
  player.visible = false;
  jumpPlayer.visible = true;
  isJump = true;
}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}