// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Screen } from './screen';

export class Filter {

    constructor() {
        this.PageResults = true;
        this.StartIndex = 0;
        this.PageSize = 50;
        this.Screens = [];
        this.Page = 1;
    }

    // Account, Event...
    ViewType: string;

    FilterByAccount = true;

    PageResults = true;

    Page = 1; // sql pages different than linq.

    StartIndex = 0;

    PageSize = 50;

    // These are initial sorts, additional sorting can be
    // added to the screens.
    SortBy = '';

    SortDirection = '';

    Screens: Screen[] = [];

    TimeZone = '';

    IncludePrivate = false;

    IncludeDeleted = false;

    // This uses sort order to prepend the
    // top x to the list. Only used for
    // the locations comboboxes for now.
    PrependTop = 0;

    Latitude: number;

    Longitude: number;

    Type: string;

}
