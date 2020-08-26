// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Filter } from '../../models/filter';
@Injectable({
    providedIn: 'root'
  })
export class SettingsService  {

    constructor(private api: Api ) {    }

    addSetting(setting) {
        return this.api.invokeRequest('POST', 'api/Apps/Settings/Add', setting);
    }

    deleteSetting(settingUUID) {
        return this.api.invokeRequest('DELETE', 'api/Apps/Settings/Delete/' + settingUUID, ''    );
    }

    getSetting(settingId) {
        return this.api.invokeRequest('GET', 'api/Apps/Settings/' + settingId, ''    );
    }

    getSettings(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Apps/Settings' , filter );
    }

    updateSetting(setting) {
        return this.api.invokeRequest('PATCH', 'api/Apps/Settings/Update', setting);
    }
}
