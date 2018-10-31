import { Injectable } from '@angular/core';
import { DayViewEvent } from "calendar-utils";

@Injectable()
export class EventLayouter {

    layoutEvents(dayViewEvents: DayViewEvent[], totalWidth: number): void {

        let events = dayViewEvents.map(e => new EventAdapter(e));

        events = this.sortEvents(events);

        var columns = new Array<Column>();
        let lastEventEnding: Date = null;

        events.forEach(ev => {
            if (ev.start >= lastEventEnding) {
                this.packEventsInColumns(columns);
                columns = [];
                lastEventEnding = null;
            }
            let placed: boolean = false;
            columns.forEach(col => {
                if (!col.last().collidesWith(ev)) {
                    col.events.push(ev);
                    placed = true;
                    return false;
                }
            });
            if (!placed) {
                columns.push(new Column([ev]));
            }
            if (lastEventEnding == null || ev.end > lastEventEnding) {
                lastEventEnding = ev.end;
            }
        });
        if (columns.length > 0) {
            this.packEventsInColumns(columns);
        }

        this.scaleToTotalWidth(events, totalWidth);
    }

    private scaleToTotalWidth(events: EventAdapter[], totalWidth: number): void {
        events.forEach(ev => {
            let oldWidth = ev.width;
            ev.left = ev.left * totalWidth
            ev.width = oldWidth * totalWidth;
        });
    }

    private sortEvents(events: EventAdapter[]): EventAdapter[] {
        return events.sort((e1, e2) => e1.start.getTime() - e2.start.getTime()).sort((e1, e2) => e1.end.getTime() - e2.end.getTime());
    }

    private packEventsInColumns(columns: Column[]): void {

        let numColumns = columns.length;
        let iColumn = 0;

        columns.forEach(col => {
            col.events.forEach(ev => {
                let colSpan = this.expandEvent(ev, iColumn, columns);
                ev.left = iColumn / numColumns;
                ev.right = (iColumn + colSpan) / numColumns;
            });
            iColumn++;
        });

    }


    private expandEvent(ev: EventAdapter, iColumn: number, columns: Column[]): number {
        let colSpan = 1;
        let rest = columns.slice(iColumn + 1);
        for (let col of rest) {
            for (let ev1 of col.events) {
                if (ev1.collidesWith(ev)) {
                    return colSpan;
                }
            }
            colSpan++;
        }
        return colSpan;
    }



}

class EventAdapter {

    constructor(private dayViewEvent: DayViewEvent) {
        dayViewEvent.left = 0;
        dayViewEvent.width = 0;
    }

    get start(): Date {
        return this.dayViewEvent.event.start;
    }

    get end(): Date {
        return this.dayViewEvent.event.end;
    }

    get left(): number {
        return this.dayViewEvent.left;
    }

    set left(value: number) {
        this.dayViewEvent.left = value;
    }

    set right(value: number) {
        this.dayViewEvent.width = value - this.dayViewEvent.left;
    }

    get width(): number {
        return this.dayViewEvent.width;
    }

    set width(value: number) {
        this.dayViewEvent.width = value;
    }


    collidesWith(that: EventAdapter): boolean {
        return this.dayViewEvent.event.end > that.start && this.dayViewEvent.event.start < that.end;
    }

}

class Column {

    constructor(public events: EventAdapter[]) { }

    last(): EventAdapter {
        return this.events[this.events.length - 1];
    }

}

