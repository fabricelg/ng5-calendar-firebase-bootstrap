//import { Platform } from 'ionic-angular';
import { Injectable, ElementRef } from '@angular/core';
import { GetMonthViewArgs, MonthView, GetWeekViewHeaderArgs, WeekDay, WeekViewEventRow, DayView, DayViewHour, GetDayViewHourGridArgs, GetDayViewArgs, GetWeekViewArgs, getMonthView, getWeekViewHeader, getWeekView, getDayView, getDayViewHourGrid, DayViewEvent } from "calendar-utils";
import { EventLayouter } from "./eventLayouter";

@Injectable()
export class CustomCalenderUtils {

    constructor(private el:ElementRef) {

    }

    getMonthView(args: GetMonthViewArgs): MonthView {
        return getMonthView(args);
    }

    getWeekViewHeader(args: GetWeekViewHeaderArgs): WeekDay[] {
        return getWeekViewHeader(args);
    }

    getWeekView(args: GetWeekViewArgs) {
        return getWeekView(args);
    }


    getDayViewHourGrid(args: GetDayViewHourGridArgs): DayViewHour[] {
        return getDayViewHourGrid(args);
    }

    getDayView(args: GetDayViewArgs): DayView {
        let dayView = getDayView(args);

        let hoursColumnWidth = 150;
        let totalWidth;

        //console.log("args", args);
        
        if (args.eventWidth != 150){
            totalWidth = (this.el.nativeElement.offsetParent.offsetWidth - hoursColumnWidth)/7 - 10; // View week
            //console.log("view week");
        } 
        else{
            totalWidth = (this.el.nativeElement.offsetParent.offsetWidth - hoursColumnWidth); // View day
            //console.log("view day");
        } 

        new EventLayouter().layoutEvents(dayView.events, totalWidth);

        //console.log("this.el", this.el);
        //console.log("totalWidth", totalWidth);
        //console.log("events", dayView.events);

        return dayView;
    }


}


