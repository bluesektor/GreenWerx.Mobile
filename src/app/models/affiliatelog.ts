import { Node } from './node';

export class AffiliateLog  extends Node {
    // Name = destination uuid, userName  being accesed
    NameType: string; // event, user, account

    // Link (clicked), Profile View
    AccessType: string;

    Link: string;  // Name =target userName, link name etc. being accesed

    Referrer: string; // http referrer

    ClientIp: string; // current users ip

    ClientUserUUID: string; // current users uuid if they're logged in.

    ReferringUUID: string;  // is usually set in the Users.ReferringMember
    ReferringUUIDType: string;

    Direction: string; // inbound, outbound. inbound a person click on a profile link to this site
                        // outbound a person clicks on a link to another site.

    PromoCode: string;
    TemplateId: string;

    PaymentReceived: Date;
    AmmountReceived: number;
    CommissionAmount: number;
    // percent,  see priceRule
    CommissionOperator: string;
    CommissionType: string;
    PaymentSent: Date;
    AmountSent: number;

}
