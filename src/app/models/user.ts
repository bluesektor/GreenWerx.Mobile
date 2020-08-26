// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Node } from './node';

export class User extends Node {

    constructor() {
        super();
        this.AgreedToTOS = null;
    }

    Email: string;

    Password: string;

    ConfirmPassword: string;

    PasswordQuestion: string;

    PasswordAnswer: string;

    RelationshipStatus: string;

    DOB: Date;

    Gender: string;

    AgreedToTOS: Date;

    AffiliateTOSAgreementDate: Date;

    ReferringMember: string;

    IsAffiliate: boolean;
}
