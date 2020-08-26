import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class CachedItems  {
  public products:  any[] = [];

  public events: any[] = [];

  public communityItems:  any[] = [];

  public messageItems:  any[] = [];

  public logItems: any[] = [];

  logOut() {
    this.products = [];
    this.events = [];
    this.communityItems = [];
    this.messageItems = [];
    this.logItems = [];
  }
}
