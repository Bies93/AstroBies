import { World } from '../ecs/world';
import { Position, Size, Render } from '../ecs/components';
import { defineQuery } from 'bitecs';

const renderQ = defineQuery([Position, Size, Render]);

export class Renderer2D {
  public dpr = 1;
  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {}

  setDPR(dpr: number) { this.dpr = dpr; }

  clear() {
    this.ctx.fillStyle = 'rgba(10,10,15,1)';
    this.ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
  }

  renderWorld(world: World) {
    const ents = renderQ(world);
    for (let i = 0; i < ents.length; i++) {
      const e = ents[i];
      const r = `rgba(${Render.r[e]}, ${Render.g[e]}, ${Render.b[e]}, ${Render.alpha[e]})`;
      this.ctx.fillStyle = r;
      this.ctx.fillRect(Position.x[e], Position.y[e], Size.width[e], Size.height[e]);
    }
  }
}

