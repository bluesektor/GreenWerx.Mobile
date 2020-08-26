// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlaggingService  {

    constructor(private api: Api ) {

    }



  flagItem(type: string, uuid: string, accountUUID: string, flagName: string, value: string) {

    return this.api.invokeRequest('PATCH', 'api/Generic/' + type + '/' + uuid +
                                  '/accounts/' + accountUUID + '/Flag/' + flagName + '/Value/' + value );
  }

  // To mark as safe set the value to 0. To mark unsafe pass a value greater than 0. It doesn't matter
  // what the value is because the current users highest roleWeight will be used as the NSFW value.
  //
   setNsfwFlag(UUIDType: string, UUID: string, AccountUUID: string, value: string  ) {
        const svc = this.flagItem( UUIDType, UUID, AccountUUID, 'NSFW', value);
   }
    test() {
      return this.api.invokeRequest('GET', 'api/Tools/TestCode', ''    );
    }



}
