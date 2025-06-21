import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false  // Indica che il pipe deve essere ricalcolato ad ogni ciclo di change detection
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    if (!value) return '';

    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(value).getTime()) / 1000); // Differenza in secondi

    if (diff < 60) return 'ora';
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  }
}
