import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';

// Renders ISO timestamps as "5 minutes ago" / "2 hours ago" relative to the
// VIEWER's device clock. Re-renders itself on a smart cadence (every minute
// for fresh items, every 30 minutes for older ones) so the feed feels alive.
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  private timer: any = null;
  private lastValue: string | Date | number | null | undefined = null;
  private lastFormatted = '';

  transform(value: string | Date | number | null | undefined): string {
    if (value == null) return '';
    if (value !== this.lastValue) {
      this.lastValue = value;
    }

    const target = new Date(value).getTime();
    if (Number.isNaN(target)) return '';

    const diffMs = Date.now() - target;
    const formatted = this.format(diffMs);
    this.lastFormatted = formatted;
    this.scheduleRefresh(diffMs);
    return formatted;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private format(diffMs: number): string {
    const future = diffMs < 0;
    const seconds = Math.round(Math.abs(diffMs) / 1000);

    if (seconds < 5) return future ? 'in a moment' : 'just now';
    if (seconds < 60) return future ? `in ${seconds} seconds` : `${seconds} seconds ago`;

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      const unit = minutes === 1 ? 'minute' : 'minutes';
      return future ? `in ${minutes} ${unit}` : `${minutes} ${unit} ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      const unit = hours === 1 ? 'hour' : 'hours';
      return future ? `in ${hours} ${unit}` : `${hours} ${unit} ago`;
    }

    const days = Math.round(hours / 24);
    if (days < 30) {
      const unit = days === 1 ? 'day' : 'days';
      return future ? `in ${days} ${unit}` : `${days} ${unit} ago`;
    }

    const months = Math.round(days / 30);
    if (months < 12) {
      const unit = months === 1 ? 'month' : 'months';
      return future ? `in ${months} ${unit}` : `${months} ${unit} ago`;
    }

    const years = Math.round(months / 12);
    const unit = years === 1 ? 'year' : 'years';
    return future ? `in ${years} ${unit}` : `${years} ${unit} ago`;
  }

  // Run timers OUTSIDE Angular's zone so they don't trigger change detection
  // on the whole app every minute — only on the cells that bind this pipe.
  private scheduleRefresh(diffMs: number) {
    this.clearTimer();
    const abs = Math.abs(diffMs);
    const next = abs < 60_000 ? 1_000           // < 1 min: tick every second
      : abs < 3_600_000 ? 30_000                 // < 1 hour: every 30s
      : abs < 86_400_000 ? 5 * 60_000            // < 1 day: every 5 min
      : 30 * 60_000;                              // older: every 30 min

    this.zone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.zone.run(() => this.cdr.markForCheck());
      }, next);
    });
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
