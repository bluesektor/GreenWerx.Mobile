export class ObjectFunctions {

    public static isNullOrWhitespace(object: string): boolean {
        if (object === 'NULL' || object === 'null' || object === null || object === undefined || object === '') {
            return true;
        }
        return false;
    }

    public static isValid(object: any): boolean {
        if (object === null || object === undefined) {
            return false;
        }
        return true;
    }
}
