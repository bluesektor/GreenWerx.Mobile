// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import { AffiliateLog, EventLocation , Favorite, Filter,  Screen} from '../../models/index';
import { Observable, of as observableOf} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AffiliateService  {

    constructor(private api: Api ) {    }

    public logAffliateAccess(logEntry: AffiliateLog):  Observable<Object> {
        return this.api.invokeRequest('POST', 'api/Affiliate/Log' ,logEntry);
    }
}
