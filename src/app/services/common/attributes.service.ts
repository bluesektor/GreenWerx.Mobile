// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Filter } from '../../models/filter';
import {Attribute} from '../../models/attribute';

@Injectable({
    providedIn: 'root'
  })
export class AttributesService  {

    constructor( private api: Api) {
    }

    addAttribute(attribute) {
        return this.api.invokeRequest('POST', 'api/Attributes/Add', attribute);
    }

    deleteAttribute(attributeUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Attributes/' + attributeUUID  );
    }

    getAttributes(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Attributes' , filter, );
    }

    updateAttribute(attribute) {
        return this.api.invokeRequest('PATCH', 'api/Attributes/Update', attribute);
    }

    updateAttributes(attributes: Attribute[]) {
        return this.api.invokeRequest('PATCH', 'api/Attributes/Update/Bulk',  attributes);
    }
}
