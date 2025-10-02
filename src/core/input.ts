export class Input {
  public keys = new Set<string>();
  public isPointerDown = false;
  public pointer = { x: 0, y: 0 };
  private firstInteractionResolved = false;
  private firstInteractionCbs: Array<() => void> = [];

  constructor(private el: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') e.preventDefault();
      this.keys.add(e.code.replace('Key', ''));
      this.resolveFirstInteraction();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code.replace('Key', '')));
    el.addEventListener('pointerdown', (e) => { this.isPointerDown = true; this.updatePointer(e); this.resolveFirstInteraction(); });
    window.addEventListener('pointerup', () => { this.isPointerDown = false; });
    el.addEventListener('pointermove', (e) => this.updatePointer(e));
  }

  onFirstInteraction(cb: () => void) { this.firstInteractionCbs.push(cb); }

  private resolveFirstInteraction() {
    if (this.firstInteractionResolved) return;
    this.firstInteractionResolved = true;
    this.firstInteractionCbs.forEach((cb) => cb());
    this.firstInteractionCbs.length = 0;
  }

  private updatePointer(e: PointerEvent) {
    const rect = (this.el as HTMLCanvasElement).getBoundingClientRect();
    this.pointer.x = e.clientX - rect.left;
    this.pointer.y = e.clientY - rect.top;
  }
}

