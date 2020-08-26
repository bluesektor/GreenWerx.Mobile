import * as moment from 'moment';
export class ProfileFunctions {

    public static getAge(itemDate: any): number {

        if (itemDate === null || itemDate === undefined) {
            return 0;
        }

        console.log('profile.functions.ts getAge itemDate:', itemDate);
        const now = moment(new Date()).local(); // todays date

        const dob =  moment( itemDate).local();
       // var end = moment("2015-12-1"); // another date
        const duration = moment.duration(now.diff(dob));
        const years = duration.asYears().toString();
        return parseInt( years, 10 );
      }

    public static  getGenderColor(gender: string): string {
        // console.log('details.page.ts getGenderColor gender:', gender);
        let faIcon = 'yellow';
        switch (gender) {
          case 'male':
          faIcon = 'blue';
          break;
          case 'female':
          faIcon = 'pink';
          break;
        }
        return faIcon;
      }

    public static  getGenderIcon(gender: string): string {
        // console.log('details.page.ts getGenderClass gender:', gender);
        const color =  ProfileFunctions.getGenderColor(gender);
        let faIcon = '<ion-icon style="color:' + color + ';" name="male">';
        switch (gender) {
          case 'male':
          faIcon = '<ion-icon style="color:' + color + ';" name="male">';
          break;
          case 'female':
          faIcon =  '<ion-icon style="color:' + color + ';" name="female">';
          break;
        }
        return faIcon;
      }

}
