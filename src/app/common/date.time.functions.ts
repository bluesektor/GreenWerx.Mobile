
import {ObjectFunctions} from './object.functions';

export class DateTimeFunctions {
    monthsKV: any[] = [];

    constructor() {
    }

    public static combine (date: any, time: any ): Date {
       // console.log('DateTimeFunctions.combine date:' , date);
        // console.log('DateTimeFunctions.combine time:' , time);

        if (typeof date === 'string' && typeof time === 'string') {
            // console.log('DateTimeFunctions.combine 1' );

            return DateTimeFunctions.combineByString(date, time);
        }

        if (typeof date === 'object' && typeof time === 'object') {
      // console.log('DateTimeFunctions.combine 2 time:', time );
            const ampm =  time.ampm.text; // .value
            let hour = time.hour.value;
            if ( time.hour.value < 10) {
          // console.log('DateTimeFunctions.combine 3' );
                hour = + '0' + time.hour.text;
            }
            if ( ampm === 'PM' && time.hour.value < 12  ) {
      // console.log('DateTimeFunctions.combine 4' );
                hour =   time.hour.value  + 12;
            }
            const minute = time.minute.text;
            const day = date.day.text;
            const month  = date.month.value; // because text is non numeric
            const year = date.year.text;

            const dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
            // console.log('DateTimeFunctions.combine objD objT dateString:', dateString);
            const fullDate = new Date(dateString );
            // console.log('DateTimeFunctions.combine objD objT fullDate:', fullDate);
            // console.log('DateTimeFunctions.combine 5' );
            return fullDate;
        }

        if (typeof date === 'string' && typeof time === 'object') {
            // console.log('DateTimeFunctions.combine 6' );
            const ampm =  time.ampm.text; // .value
            let hour = time.hour.value;
            if ( time.hour.value < 10) {
                // console.log('DateTimeFunctions.combine 7' );
                hour = + '0' + time.hour.text;
            }
            if ( ampm === 'PM' && time.hour.value < 12  ) {
                // console.log('DateTimeFunctions.combine 8' );
                hour =   time.hour.value  + 12;
            }
            // console.log('DateTimeFunctions.combine 9' );
            const minute = time.minute.text;

            let dateParts = date.split('T') as any[];
            // console.log('DateTimeFunctions.combine 10' );
            dateParts = dateParts[0].split('-') as any[];
            const day = dateParts[2];
            const month  = dateParts[1];
            const year = dateParts[0];
            // console.log('DateTimeFunctions.combine 11' );
            const dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
            // console.log('DateTimeFunctions.combine 12 stringD objT dateString:', dateString);
            const fullDate = new Date(dateString );
            // console.log('DateTimeFunctions.combine 13 stringD objT fullDate:', fullDate);
            return fullDate;
        }

        if (typeof date === 'object' && typeof time === 'string') {
            // console.log('DateTimeFunctions.combine 14' );
            let timeParts =  time .split('T');
            // console.log('DateTimeFunctions.combine 15' );
            timeParts =  timeParts[1].split(':');
            const hour =  timeParts[0];
            const minute =  timeParts[1];
            // console.log('DateTimeFunctions.combine 16' );
            const day = date.day.text;
            const month  = date.month.value; // because text is non numeric
            const year = date.year.text;

            const dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
            // console.log('DateTimeFunctions.combine 17 objD stringT dateString:', dateString);
            const fullDate = new Date(dateString );
            // console.log('DateTimeFunctions.combine 18 objD stringT fullDate:', fullDate);
            return fullDate;
        }
    }

    public static combineByString (date: string, time: string ): Date {

        // console.log('DateTimeFunctions.combineByString date:', date);
        // console.log('DateTimeFunctions.combineByString time:', time);
        //  2018-10-20T19:34:10.669Z
        // if($scope.sdate && $scope.stime) {
            // console.log('DateTimeFunctions.combineByString a ');
        let dateParts = date.split('T') as any[];
        // console.log('DateTimeFunctions.combineByString b ');
        dateParts = dateParts[0].split('-') as any[];
        // console.log('DateTimeFunctions.combineByString c   ');
        let timeParts =  time.split('T');
        // console.log('DateTimeFunctions.combineByString d timeParts:', timeParts);
        if (timeParts === undefined) {
            // console.log('DateTimeFunctions.combineByString d.1 timeParts:', timeParts);
            // console.log('DateTimeFunctions.combineByString d.1a time:', time);
            timeParts =  time.split(':');
        } else {
            // console.log('DateTimeFunctions.combineByString d.2 timeParts:', timeParts);
            // console.log('DateTimeFunctions.combineByString d.2a time:', time);
            if (timeParts.length === 1) {
            timeParts =  timeParts[0].split(':');
            } else {
                timeParts =  timeParts[1].split(':');
            }
        }
        // console.log('DateTimeFunctions.combineByString e dateParts:', dateParts);
        // console.log('DateTimeFunctions.combineByString f timeParts:', timeParts);
        if (!dateParts && !timeParts) {
            // console.log('DateTimeFunctions.combineByString g ');
            return null; }

        const dateString = dateParts[0] + '-' +  dateParts[1] + '-' + dateParts[2] + 'T' + timeParts[0] + ':' + timeParts[1];
        // console.log('DateTimeFunctions.combineByString h dateString:', dateString);
        const fullDate = new Date(dateString );
        // console.log('DateTimeFunctions.combineByString h.1 fullDate:', fullDate);
        return fullDate;
    }

    public static  getAmPm() {
        const ampm = [];
        ampm.push({label: 'am' , value: 'am' });
        ampm.push({label: 'pm' , value: 'pm' });
        return ampm;
    }

    public static getDays() {
        const days = [
            {'value': 1, 'label': '1'},
            {'value': 2, 'label': '2'},
            {'value': 3, 'label': '3'},
            {'value': 4, 'label': '4'},
            {'value': 5, 'label': '5'},
            {'value': 6, 'label': '6'},
            {'value': 7, 'label': '7'},
            {'value': 8, 'label': '8'},
            {'value': 9, 'label': '9'},
            {'value': 10, 'label': '10'},
            {'value': 11, 'label': '11'},
            {'value': 12, 'label': '12'},
            {'value': 13, 'label': '13'},
            {'value': 14, 'label': '14'},
            {'value': 15, 'label': '15'},
            {'value': 16, 'label': '16'},
            {'value': 17, 'label': '17'},
            {'value': 18, 'label': '18'},
            {'value': 19, 'label': '19'},
            {'value': 20, 'label': '20'},
            {'value': 21, 'label': '21'},
            {'value': 22, 'label': '22'},
            {'value': 23, 'label': '23'},
            {'value': 24, 'label': '24'},
            {'value': 25, 'label': '25'},
            {'value': 26, 'label': '26'},
            {'value': 27, 'label': '27'},
            {'value': 28, 'label': '28'},
            {'value': 29, 'label': '29'},
            {'value': 30, 'label': '30'},
            {'value': 31, 'label': '31'}
        ];
        return days;
    }

    public static  getHoursMilitary() {
        const hrs  = [];
        for (let i = 1; i <= 24; i++) {
            if ( i < 10) {
                hrs.push({label: '0' + i, value: '0' + i });
            } else {
                hrs.push({label:  i, value: i });
            }
        }
        return hrs;
    }

    public static  getHoursStandard() {
        const hrs  = [];
        for (let i = 1; i <= 12; i++) {
            hrs.push({label: i, value: i });
        }
        return hrs;
    }

    public static  getMinutes() {
        const min  = [];
        for (let i = 0; i < 60; i++) {
            if ( i < 10) {
                min.push({label: '0' + i, value: '0' + i });
            } else {
                min.push({label:  i, value: i });
            }
        }
        return min;
    }

    public static getMonths() {
        const months =  [
            {'value': 1, 'label': 'January'},
            {'value': 2, 'label': 'February'},
            {'value': 3, 'label': 'March'},
            {'value': 4, 'label': 'April'},
            {'value': 5, 'label': 'May'},
            {'value': 6, 'label': 'June'},
            {'value': 7, 'label': 'July'},
            {'value': 8, 'label': 'August'},
            {'value': 9, 'label': 'September'},
            {'value': 10, 'label': 'October'},
            {'value': 11, 'label': 'November'},
            {'value': 12, 'label': 'December'}
        ];
        return months;
    }
    // todo update to match some of these
    // 
    public static  getYears(startYear?: number) {
        const years = [];
        const today = new Date();

        let currentYear = today.getFullYear();

        if (startYear !== null || startYear !== undefined) {
            currentYear = startYear;
        }
        // today.setFullYear(currentYear - 17 ); // todo do this for DOB
        years.push({label: currentYear, value: currentYear});
        const maxYears = 100;
        for ( let i = 1; i < maxYears; i++ ) {
            years.push({label: currentYear - i, value: currentYear - i});
        }
        return years;
    }

    public static getDifference(startDate: Date, endDate: Date) : any { 
        if(ObjectFunctions.isValid(startDate) === false ||
            ObjectFunctions.isValid(endDate) === false) {
                return false;
        }

        const difference = (endDate.getTime() - startDate.getTime()) / 1000;
        return difference;
    }

}
