// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import {Profile } from '../../models/profile';
import { Filter } from '../../models/filter';
import { Observable, of as observableOf} from 'rxjs';
import {ServiceResult} from '../../models/serviceresult';
import {  Screen } from '../../models/index';
@Injectable({
    providedIn: 'root'
  })
export class ProfileService  {

    Profiles: Profile[] = [];

    public Categories: string[] = [];

    public AvailableScreens:  Screen[] = []; // cache this


    constructor(private api: Api) {    }

    deleteProfile(profileUUID) {
        return this.api.invokeRequest('DELETE', 'api/Profiles/' + profileUUID);
    }

    getAllProfiles(filter: Filter) {  // end point was AllProfiles
        return this.api.invokeRequest('POST', 'api/Profiles', filter);
    }

    getProfile() {
      return this.api.invokeRequest('GET', 'api/Profile');
    }

    getProfileBy(uuid: string, ignoreCache?: boolean) {
        console.log('profile.service.ts getProfileBy uuid:', uuid);

        if (ignoreCache === true) {
            return this.api.invokeRequest('GET', 'api/ProfilesBy/' + uuid);
        }

        for (let i = 0; i < this.Profiles.length; i++) {
            if (this.Profiles[i].UUID === uuid ) {
                const res = new ServiceResult();
                res.Code = 200;
                res.Result = this.Profiles[i];
                return observableOf( res );
            }
        }
        return this.api.invokeRequest('GET', 'api/ProfilesBy/' + uuid);
    }

    getUserProfile(userName: string, ignoreCache?: boolean) {

        if (ignoreCache === true) {
            return this.api.invokeRequest('GET', 'api/Profiles/Users/' + userName);
        }
       // let name = this.Profiles[i].Name;
       // console.log('profile.service.ts getProfileBy this.Profiles[i]:', this.Profiles[i]);
       // if ( name === undefined) { name = '4asd0f9j43masd9'; }

        for (let i = 0; i < this.Profiles.length; i++) {
            if (this.Profiles[i].User.Name === userName) {
                const res = new ServiceResult();
                res.Code = 200;
                res.Result = this.Profiles[i];
                return observableOf(res);
            }
        }
        return this.api.invokeRequest('GET', 'api/Profiles/Users/' + userName);
    }

    getProfiles() {
        return this.api.invokeRequest('GET', 'api/Profiles');
    }

    logOut() {
        this.Profiles = [];
        this.Categories = [];
        this.AvailableScreens = [];
    }
    saveProfile(profile: any) {
      return this.api.invokeRequest('POST', 'api/Profiles/Save', profile);
    }

    searchUserProfiles(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Profiles/Search/User',  filter);
    }

    setActiveProfile(uuid: string) {
        return this.api.invokeRequest('PATCH', 'api/Profiles/' + uuid + '/SetActive' );
    }

    setProfileImage(profileUUID: string, attributeUUID: string) {
        return this.api.invokeRequest('PATCH', 'api/Profiles/' + profileUUID + '/SetImage/' + attributeUUID );
    }

    uploadFormEx( form: FormData, UUID: string, type: string) {
        return this.api.uploadForm( 'api/file/upload/' + UUID + '/' + type, form); }
    }
