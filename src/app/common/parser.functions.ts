import {ObjectFunctions} from './object.functions';
export class Parser {

    public static   getURLParameter(name: string, path: string): string {
        console.log('app.settings.ts  getURLParameter:', name);
        if (ObjectFunctions.isNullOrWhitespace(name)) {
          return '';
        }
        if (ObjectFunctions.isNullOrWhitespace(path)) {
            return '';
          }
        return decodeURIComponent((new RegExp('[?|&]' +
        name + '=' + '([^&;]+?)(&|#|;|$)').exec(path) || [null, ''])[1].replace(/\+/g, '%20')) || null;
      }
}
