import { Node } from './node';
import {Attribute} from './attribute';
export class Post extends Node {

    constructor() {
        super();
        this.Body = '';
    }

    Author: string;

    Category: string;

    AllowComments: boolean;

    Sticky: boolean;

     PublishDate: Date;

     KeyWords: string;

     Body: string;

     Attributes: Attribute[] = [];
}

