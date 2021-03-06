import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MMMM yyyy', locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE d/LL', locale);
  }

  public weekViewTitle({ date, locale }: DateFormatterParams): string {
    return 'Semaine ' + new DatePipe(locale).transform(date, 'w', locale) + ' de ' + new DatePipe(locale).transform(date, 'yyyy', locale);
  }

  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEE d MMMM yyyy', locale);
  }

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    //return new DatePipe(locale).transform(date, 'HH:mm', locale);
    return new Intl.DateTimeFormat('ca', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }
}
