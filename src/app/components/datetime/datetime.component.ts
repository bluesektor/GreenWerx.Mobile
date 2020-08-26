import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import * as moment from 'moment';
import { DateTimeFunctions } from '../../common/date.time.functions';
import { ObjectFunctions } from 'src/app/common/object.functions';
//  you can subtract time and can format it as
// console.log(moment().subtract(9,'hours').format('YYYY-MM-DD HH:mm:ss'));

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss', '../../../assets/styles/primeng/primeng.min.css' ],
})
export class DateTimeComponent implements OnInit, OnChanges {
    @Input() DateValue: Date;
    @Input() Title: string;
    @Input() ShowDate: boolean;
    @Input() ShowTime: boolean;
    @Input() UseLocalTime: boolean;
    @Output() eventDateChanged = new EventEmitter<string>();


    public Month: number;
    public Day: number;
    public Year: number;

    public Hour: number;
    public Minute: string;
    public AmPm: string;

    months: SelectItem[];
    days: SelectItem[];
    years: SelectItem[];


    hours: SelectItem[];
    minutes: SelectItem[];
    ampms: SelectItem[];

  constructor(
     // dateTimeHelper: DateTimeFunctions
      ) {

    this.months = DateTimeFunctions.getMonths();
    this.days = DateTimeFunctions.getDays();
    this.years = DateTimeFunctions.getYears(2023); // todo start from 17 years ago

    this.hours = DateTimeFunctions.getHoursStandard();
    this.minutes = DateTimeFunctions.getMinutes();
    this.ampms = DateTimeFunctions.getAmPm();
  }

  getCombinedDate() {
    let monthString = this.Month.toString();
    if (this.Month < 10) {
        monthString = '0' + this.Month.toString();
    }

    let dayString = this.Day.toString();
    if (this.Day < 10) {
        dayString = '0' + this.Day.toString();
    }

    const dateStr =  this.Year.toString() + '-' + monthString + '-' + dayString;
    const timeString = moment(this.Hour.toString() + ':' + this.Minute.toString() + ' ' + this.AmPm, 'h:mm A').format('HH:mm');
    const timePart = dateStr + 'T' + timeString;
    const tmp = DateTimeFunctions.combine(dateStr, timePart  );
    return tmp;
  }

  public ngOnChanges(changes: SimpleChanges) {
    console.log('datetime.component.ts ngOnChanges  changes:', changes);

    if ('DateValue' in changes) {
        // s ome code here
        console.log('datetime.component.ts ngOnChanges if (DateValue in changes) changes:', changes);
       this.parseDate();
       this.parseTime();
       this.eventDateChanged.emit('onDateChange');
     }
}


  ngOnInit() {

    if ( ObjectFunctions.isValid(this.DateValue) === true) {
        console.log('datetime.component.ts ngOnInit  ObjectFunctions.isValid == true DateValue', this.DateValue);
            this.parseDate();
           this.parseTime();
    } else {
        console.log('datetime.component.ts ngOnInit  ObjectFunctions.isValid == false DateValue', this.DateValue);
        this.DateValue = new Date();
        this.parseDate();
        this.parseTime();
    }

  }
  onCboChangeAmPm(event) {
      this.AmPm = event.value;
      this.DateValue = this.getCombinedDate();
      this.eventDateChanged.emit('onDateChange');
  }

  onCboChangeDay(event) {
    this.Day = event.value;
    this.DateValue = this.getCombinedDate();
    this.eventDateChanged.emit('onDateChange');
  }

  onCboChangeHour(event) {
    this.Hour = event.value;
    this.DateValue = this.getCombinedDate();
    this.eventDateChanged.emit('onDateChange');
  }

  onCboChangeMinute(event) {
    this.Minute = event.value;
    this.DateValue = this.getCombinedDate();
    this.eventDateChanged.emit('onDateChange');
  }

  onCboChangeMonth(event) {
    console.log('datetime.component.ts onCboChangeMonth  event: ', event);
    this.Month = event.value;
    this.DateValue = this.getCombinedDate();
    this.eventDateChanged.emit('onDateChange');
  }

  onCboChangeYear(event) {
    this.Year = event.value;
    this.DateValue = this.getCombinedDate();
    this.eventDateChanged.emit('onDateChange');
  }

  parseDate() {
    const tmp =  moment(this.DateValue);
    console.log('datetime.component.ts parseDate  moment date: ', tmp);

        this.Month = tmp.month() + 1; // moment months are zero indexed.  // this.DateValue.getMonth();
        console.log('datetime.component.ts parseDate  this.Month ', this.Month);
        this.Day = tmp.date(); // tmp.day() return day of the week, not the day assinged. kinda stupid.
        console.log('datetime.component.ts parseDate  this.Day ', this.Day);
        this.Year = tmp.year(); // this.DateValue.getFullYear();
        console.log('datetime.component.ts parseDate  this.Year ', this.Year);
  }

  parseTime() {
    const tmp =  moment(this.DateValue);
    if (tmp.hour() <= 12) {
         this.Hour =  tmp.hour();
         this.AmPm = 'am';
    } else {
        this.Hour = tmp.hour() - 12;
        this.AmPm = 'pm';
    }
         console.log('datetime.component.ts parseTime  this.Hour ', this.Hour);
        if (tmp.minute() < 10) {
        this.Minute = '0' + tmp.minute().toString();
        } else {
            this.Minute =   tmp.minute().toString();
        }

        console.log('datetime.component.ts parseTime  this.Minute ', this.Minute);

        console.log('datetime.component.ts parseTime  this.combine(): ', this.getCombinedDate());
  }

}



