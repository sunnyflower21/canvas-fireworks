import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import Tail from "./js/Tail.js";
import Spark from "./js/Spark.js";
import { hypotenuse, randomNumBetween } from "./js/Utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();
    this.tails = [];
    this.particles = [];
    this.sparks = [];
  }
  init() {
    this.canvasWidth;
    this.canvasHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";
    this.createParticle();
  }

  createTail() {
    const x = randomNumBetween(this.canvasWidth * 0.2, this.canvasWidth * 0.8);
    const vy = this.canvasHeight * randomNumBetween(0.01, 0.015) * -1;
    const colorDeg = randomNumBetween(0, 360);
    this.tails.push(new Tail(x, vy, colorDeg));
  }

  createParticle(x, y, colorDeg) {
    const PARTICLE_NUM = 400;
    //동일한 x,y 위치에서 원 형태로 퍼져나가다가 투명해지면서 사라져야함

    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        // randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
        randomNumBetween(2, 100) * 0.2;
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);
      const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
      this.particles.push(new Particle(x, y, vx, vy, opacity, _colorDeg));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      //requestAnimationFrame?
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < this.interval) return;
      this.ctx.fillStyle = this.bgColor + "40";

      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.fillStyle = `rgba(255,255,255, ${
        this.particles.length / 30000
      })`;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      if (Math.random() < 0.03) this.createTail();
      // this.createParticle();
      this.tails.forEach((tail, index) => {
        tail.update();
        tail.draw();
        for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
          const vx = randomNumBetween(-5, 5) * 0.05;
          const vy = randomNumBetween(-5, 5) * 0.05;
          const opacity = Math.min(-tail.vy * 0.5);
          this.sparks.push(
            new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
          );
        }
        if (tail.vy > -0.7) {
          this.tails.splice(index, 1);
          this.createParticle(tail.x, tail.y, tail.colorDeg);
        }
      });
      this.particles.forEach((particle, idx) => {
        particle.update();
        particle.draw();
        if (Math.random() < 0.1) {
          this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45));
        }
        if (particle.opacity < 0) {
          this.particles.splice(idx, 1);
        }
      });

      this.sparks.forEach((spark, idx) => {
        spark.update();
        spark.draw();
        if (spark.opacity < 0) this.sparks.splice(idx, 1);
      });

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

window.addEventListener("resize", () => {
  canvas.init();
});
