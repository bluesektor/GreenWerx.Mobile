// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.


export class Node {

    constructor() {
        this.Name = '';
        this.IsBlank = false;
    }
    Id: number;

    ParentId: number;

    UUID: string;

    UUIDType: string;

    UUParentID: string;

    UUParentIDType: string;

    Name: string;

    Status: string;

    IsBlank: boolean;

    AccountUUID: string;

    Active = true;

    Deleted = false;

    Private = true;

    SortOrder = 0;

    CreatedBy: string;

    DateCreated: string;

    RoleWeight: number;

    RoleOperation: string;

    Image: string;

    GUUID: string;

    GuuidType: string;

    NSFW: number;

    // these are honeypot fields, not mapped to any table fields.
    SubmitDate: Date;

    SubmitValue: string;
}
