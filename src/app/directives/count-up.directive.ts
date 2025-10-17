import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appCountUp]'
})
export class CountUpDirective implements OnInit {
  @Input() appCountUp: number = 0;
  @Input() countDuration: number = 1500; // Duration in milliseconds
  @Input() countDelay: number = 0; // Delay before starting animation
  @Input() countSuffix: string = ''; // Optional suffix like '%'
  @Input() countDecimals: number = 0; // Number of decimal places

  constructor(private el: ElementRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.animateCount();
    }, this.countDelay);
  }

  private animateCount() {
    const element = this.el.nativeElement;
    const target = this.appCountUp;
    const duration = this.countDuration;
    const decimals = this.countDecimals;
    const suffix = this.countSuffix;

    const startTime = performance.now();
    const startValue = 0;

    const easeOutQuad = (t: number): number => {
      return t * (2 - t);
    };

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing function for smooth deceleration
      const easedProgress = easeOutQuad(progress);
      const currentValue = startValue + (target - startValue) * easedProgress;

      // Format the number
      const displayValue = decimals > 0
        ? currentValue.toFixed(decimals)
        : Math.floor(currentValue).toString();

      element.textContent = displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Ensure we end on exact target value
        const finalValue = decimals > 0
          ? target.toFixed(decimals)
          : target.toString();
        element.textContent = finalValue + suffix;
      }
    };

    requestAnimationFrame(updateCount);
  }
}
