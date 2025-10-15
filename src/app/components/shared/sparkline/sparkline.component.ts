import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.scss']
})
export class SparklineComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() width: number = 80;
  @Input() height: number = 24;
  @Input() color: string = '#24A148';
  @Input() lineWidth: number = 1.5;

  pathData: string = '';
  fillPathData: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['width'] || changes['height']) {
      this.generatePath();
    }
  }

  private generatePath(): void {
    if (!this.data || this.data.length < 2) {
      this.pathData = '';
      this.fillPathData = '';
      return;
    }

    const maxValue = Math.max(...this.data);
    const minValue = Math.min(...this.data);
    const range = maxValue - minValue || 1; // Avoid division by zero

    const points = this.data.map((value, index) => {
      const x = (index / (this.data.length - 1)) * this.width;
      const y = this.height - ((value - minValue) / range) * this.height;
      return { x, y };
    });

    // Create line path
    this.pathData = points.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }).join(' ');

    // Create fill path (same as line path but closed to bottom)
    this.fillPathData = this.pathData +
      ` L ${this.width} ${this.height} L 0 ${this.height} Z`;
  }
}
