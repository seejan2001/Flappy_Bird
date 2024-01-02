const cvs = document.getElementById("flappyCanvas");
const ctx = cvs.getContext("2d");

let frame = 0;

// LOAD IMAGE INTO OBJECT
const sprite = new Image();
sprite.src = "/img/original.png";

const degree = Math.PI / 180;

// State
const state = {
  current: 0,
  getReady: 0,
  start: 1,
  gameOver: 2,
};

// Event Listener
cvs.addEventListener("click", function () {
  bird.onFlap();
});

// GET READY STATE
const readyState = {
  sX: 0,
  sY: 230,
  w: 170,
  h: 150,
  x: 0,
  y: 100,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.h / 2,
      this.y + this.w / 2 - 50,
      this.w,
      this.h
    );
  },
};
// GAMEOVER
const gameOver = {
  sX: 180,
  sY: 230,
  w: 220,
  h: 200,
  x: 0,
  y: 40,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w / 4,
      this.y + this.h / 2,
      this.w,
      this.h
    );
  },
};

// BACKGROUND
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 10,
  y: cvs.height - 240,
  dx: 0.5,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.w + this.x,
      this.y,
      this.w + 40,
      this.h
    );
  },
  update: function () {
    this.x = (this.x - this.dx) % this.w;
    console.log(this.x);
  },
};

// FOREGROUND
const foreground = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx: 2,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w + this.h,
      this.h
    );
  },
  update: function () {
    this.x = (this.x - this.dx) % 22;
  },
};

// BIRD
const bird = {
  animation: [
    { sX: 276, sY: 115 },
    { sX: 276, sY: 140 },
    { sX: 276, sY: 165 },
    { sX: 276, sY: 115 },
  ],
  w: 35,
  h: 25,
  x: 25,
  y: 150,
  gravity: 2.4,
  frames: 0,
  speed: 0.5,
  rotation: 0,
  radius: 12,

  onFlap: function () {
    if (this.y < 0) {
    } else this.y += this.gravity - this.gravity * 17;
  },

  draw: function () {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      this.animation[this.frames].sX,
      this.animation[this.frames].sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    // ctx.restore();
  },
  update: function () {
    let timeGap = frame % 5 == 0 ? 1 : 0;
    this.frames = timeGap % this.animation.length;
    if (bird.y >= cvs.height - foreground.h) {
      this.y = cvs.height - foreground.h;
      bird.animation[0];
    }

    this.y += this.gravity;

    // this.rotation = -10 * degree;
  },
};

// PIPES
const pipe = {
  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 500,
    sY: 0,
  },
  gap: 105,
  h: 400,
  w: 53,
  dx: 2,
  position: [],
  maxYPos: -150,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (frame % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;
      let bottomYPos = p.y + this.h + this.gap;
      if (p.x + this.w < 0) {
        this.position.shift();
      }
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        console.log("Top Collision");
      }
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomYPos &&
        bird.y - bird.radius < bottomYPos + this.h
      ) {
        console.log("Bottom Collision");
      }
    }
  },
};

// METHODS
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipe.draw();
  // readyState.draw();
  // gameOver.draw();
  foreground.draw();
  bird.draw();
}
function update() {
  bird.update();
  foreground.update();
  pipe.update();
  bg.update();
}

function loop() {
  update();
  draw();
  frame++;
  requestAnimationFrame(loop);
}
loop();
