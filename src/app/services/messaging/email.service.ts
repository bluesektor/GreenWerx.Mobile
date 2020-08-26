// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Filter, Message } from '../../models/index';

@Injectable({
    providedIn: 'root'
  })
export class EmailService  {

    constructor(private api: Api ) {    }

    sendEmail(message: Message) {
        return this.api.invokeRequest('POST', 'api/Emails/Send', message);
    }

    deleteEmail(emailUUID) {
        return this.api.invokeRequest('POST', 'api/Emails/Delete/' + emailUUID, ''    );
    }

    contactAdmin(message: Message) {
        return this.api.invokeRequest('POST', 'api/Site/SendMessage' , message);
      }

    getEmail(emailId) {
        return this.api.invokeRequest('GET', 'api/Emails/' + emailId, ''    );
    }

    getEmails(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Emails' , filter );
    }

    searchUserEmails(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Emails' , filter );
    }

    updateEmail(email) {
        return this.api.invokeRequest('PATCH', 'api/Emails/Update', email);
    }

    openedEmail(emailUUID) {
        return this.api.invokeRequest('PATCH', 'api/Emails/Opened/' + emailUUID, ''    );
    }
}
