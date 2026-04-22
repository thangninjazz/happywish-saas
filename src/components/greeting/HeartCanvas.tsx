'use client';

import { useEffect, useRef } from 'react';

export const HeartCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const settings = {
      particles: {
        length: 500,
        duration: 2,
        velocity: 100,
        effect: -0.75,
        size: 30,
      },
    };

    class Point {
      x: number;
      y: number;
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Point(this.x, this.y);
      }
      getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      setLength(length: number) {
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
      }
      normalize() {
        const len = this.getLength();
        if (len !== 0) {
          this.x /= len;
          this.y /= len;
        }
        return this;
      }
    }

    class Particle {
      position = new Point();
      velocity = new Point();
      acceleration = new Point();
      age = 0;
      initialize(x: number, y: number, dx: number, dy: number) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }
      update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
      }
      draw(context: CanvasRenderingContext2D, image: HTMLCanvasElement) {
        const ease = (t: number) => --t * t * t + 1;
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
      }
    }

    class ParticlePool {
      particles: Particle[];
      firstActive = 0;
      firstFree = 0;
      duration = settings.particles.duration;
      constructor(length: number) {
        this.particles = new Array(length).fill(null).map(() => new Particle());
      }
      add(x: number, y: number, dx: number, dy: number) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
      }
      update(deltaTime: number) {
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(deltaTime);
          for (let i = 0; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
          this.firstActive++;
          if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
      }
      draw(context: CanvasRenderingContext2D, image: HTMLCanvasElement) {
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(context, image);
          for (let i = 0; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
      }
    }

    const pool = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration;
    let time: number;

    const pointOnHeart = (t: number) => {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
      );
    };

    const image = (() => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = settings.particles.size;
      canvas.height = settings.particles.size;
      const to = (t: number) => {
        const point = pointOnHeart(t);
        point.x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
        point.y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
        return point;
      };
      context.beginPath();
      let t = -Math.PI;
      let point = to(t);
      context.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        context.lineTo(point.x, point.y);
      }
      context.closePath();
      context.fillStyle = '#ff2a6d';
      context.fill();
      return canvas;
    })();

    const render = () => {
      requestAnimationFrame(render);
      const newTime = new Date().getTime() / 1000;
      const deltaTime = newTime - (time || newTime);
      time = newTime;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().setLength(settings.particles.velocity);
        pool.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
      }
      pool.update(deltaTime);
      pool.draw(context, image);
    };

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', onResize);
    onResize();
    render();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};
