import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { Location } from '@angular/common';
import {UiFunctions} from '../../common/uifunctions';
import { ObjectFunctions } from 'src/app/common/object.functions';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit  {
  currentTab: string;
  emailsUnreadCount = 0;
  pathString = '';

  constructor( private events: Events,
    private location: Location,   ) {
    console.log('event******************************************************tabs.page.ts constructor');
    this.pathString =   this.location.path();
    this.currentTab = UiFunctions.getSelectedTabId(this.pathString);
    console.log('tabs.page.ts ngOnInit constructor:' , this.pathString);
   }



  updateTabsEvent(event) {
    console.log('tabs.page.ts updateTabsEvent event:', event);

      switch (event.key) {
       case 'tabs.messages.emails.unreadcount':
          this.emailsUnreadCount = event.value;
          console.log('tabs.page.ts updateTabsEvent this.emailsUnreadCount :', this.emailsUnreadCount );
         break;
         default:
            this.emailsUnreadCount = 0;
            console.log('tabs.page.ts updateTabsEvent default :', this.emailsUnreadCount );
           break;
      }

  }


  getTabColor(isActivated: boolean): string {
     if (isActivated === true) {
       return UiFunctions.activeBkgColor;
     }
     return UiFunctions.inActiveBkgColor;
   }

   ionSelected() {
    console.log('tabs.page.ts ionSelected');
    // this.scrollArea.scrollToTop();
    // this.refresh()
  }

   ngOnInit() {

    const tab = document.getElementById(this.currentTab);
    if ( ObjectFunctions.isValid( tab ) === true) {
      tab.setAttribute('style', 'background-color:' + UiFunctions.activeBkgColor  + ';color:' + UiFunctions.activeColor  + ';');
    }

    this.events.subscribe('tabs:update', (msg) => {
      console.log('tabs.page.ts tabs:update msg:', msg);
      console.log('\x1b[44m' + msg);
      this.updateTabsEvent(msg);

    });

   }
// [ngStyle]="{ 'color' : ( segment ==='favorites')?  getTabColor(true) : getTabColor(false) }"

  onTabClick(event, id: string) {
    console.log('tabs.page.ts onTabClick id:', id);
    UiFunctions.UpdateColors(id);
  }

}
