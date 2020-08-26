// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.
import { Node } from '../models/node';

export class Message  extends Node {

    Subject: string;


    // This is the date when the email successfully sent to recipient.
    // Not the date it was submitted.
    //
    DateSent: string;

    DateOpened: Date;

    Type: string;

    SendTo: string;         // user UUID fix  not in class
    EmailTo: string;

    SendFrom: string;  // user uuid fix not in class
    EmailFrom: string;
    
    Body: string;

    IpAddress: string;

    NameTo: string;

    NameFrom: string;

}

