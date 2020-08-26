// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import {ProfileMember } from '../../models/profile.member';
import { Filter } from '../../models/filter';

@Injectable({
    providedIn: 'root'
  })
export class ProfileMemberService  {

    constructor(private api: Api) {    }

    deleteProfileMember(uuid) {
        return this.api.invokeRequest('DELETE', 'api/ProfileMembers/' + uuid + '/Delete');
    }

    getAllProfileMembers(filter: Filter) {  // end point was AllProfiles
        return this.api.invokeRequest('POST', 'api/ProfileMembers', filter);
    }

    getProfileMember() {
      return this.api.invokeRequest('GET', 'api/ProfileMember');
    }

    getProfileMemberBy(uuid: string) {
        return this.api.invokeRequest('GET', 'api/ProfilesBy/' + uuid);
    }

    getProfileMembers() {
        return this.api.invokeRequest('GET', 'api/ProfileMembers');
    }

    saveProfileMember(profileMember: any) {
      return this.api.invokeRequest('POST', 'api/ProfileMembers/Save', profileMember);
    }

    setActiveProfileMember(uuid: string) {
        return this.api.invokeRequest('PATCH', 'api/ProfileMembers/' + uuid + '/SetActive' );
    }

    setProfileImageMember(uuid: string, attributeUUID: string) {
        return this.api.invokeRequest('PATCH', 'api/ProfileMembers/' + uuid + '/SetImage/' + attributeUUID );
    }

    uploadFormEx( form: FormData, UUID: string, type: string) {
        return this.api.uploadForm( 'api/file/upload/' + UUID + '/' + type, form); }
}
