
import { Node } from './node';

export class Account extends Node {
    constructor() {
        super();
        this.Image = '/assets/img/blankprofile.png';
    }
    Category: string;
    LocationUUID: string;
    LocationType: string;

    BillingAddress: string;
    Description: string;
    Email: string;
    BillingPostalCode;

    FavoritedByUserUUID: string;

    FavoritedByAccountUUID: string;

    WebSite: string;

    Distanse: number;

    IsAffiliate: boolean;
}


