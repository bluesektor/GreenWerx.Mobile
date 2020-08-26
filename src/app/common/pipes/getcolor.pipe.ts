import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'getColor',
    pure: true
  })

  export class GetColorPipe implements PipeTransform {

    transform(value: number, args?: any): any {

      return this.getColor(value, 'NSFW');

    }

    getColor(point: number, type: string): String {

      if (point < 0) {
        return 'grey';
      }
      if (point === 0) {
        return 'green';
      }
      return 'red';
    }

  }
