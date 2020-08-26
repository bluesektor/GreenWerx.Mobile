// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {Profile} from './profile';

export class Session {

    constructor() {
        this.Issued = new Date();
        this.Expires = new Date();
        this.IsAdmin = false;
        this.AccountUUID = '';
        this.UserUUID = '';
        this.ShoppingCartUUID = '';
        this.LastSettingUUID = '';
        this.IsPersistent = false;
        this.Profile = new Profile();
    }

    UUID: string;

    UUIDType: string;

    IsPersistent: boolean; // rememberLogin:boolean;

    LastSettingUUID: string;

    IsAdmin: boolean;

    AccountUUID: string;

    UserUUID: string;

    UserName: string;

    Issued: Date;

    Expires: Date;

    // keeps track of the clients cart items
    CartTrackingId: string;

    ShoppingCartUUID: string;

   // ProfileUUID: string;
    Profile: Profile;
}
