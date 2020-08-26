// User Interface functions
import {ObjectFunctions} from './object.functions';
export class UiFunctions {

  public static appPages = [
    {
      title: 'Store',
      url: '/tabs/store',
      icon: 'store.svg',
      id: 'tab-button-store',
      types: 'flower,carts,edible'
    } ,
    {
      title: 'Events',
      url: '/tabs/events',
      icon: 'calendar.svg',
      id: 'tab-button-events',
      types: 'flower,carts,edible'
    } ,
    { title: 'Community',
      url: '/tabs/community',
      icon: 'community.svg',
      id: 'tab-button-community',
      types: 'profile,profiles,post,posts'
    },
    { title: 'Messages',
      url: '/tabs/messages',
      icon: 'messages.svg',
      id: 'tab-button-messages',
      types: ''
    },
    {
      title: 'About',
      url: '/tabs/about',
      icon: 'information.svg',
      id: 'tab-button-about',
      types: ''

    }
  ];
  public static activeColor = 'black';
  public static activeBkgColor = '#76A94C'; 
  public static inActiveColor = '#00000';
  public static inActiveBkgColor = '#363232';

  // when navigation occures updates the colors to be highlighted or not
  public static UpdateColors(clickedTabId: string) {
    console.log('uifunctions.ts UpdateColors clickedTabId: ', clickedTabId);
    if (ObjectFunctions.isNullOrWhitespace(clickedTabId) === true) {
      console.log('uifunctions.ts UpdateColors returning ');
      return;
    }
    try {
      for (let i = 0; i < this.appPages.length; i++) {
        if ( this.appPages[i].id === clickedTabId ) {
          const tab = document.getElementById(clickedTabId);
          if (ObjectFunctions.isValid(tab) === true) {
            tab.setAttribute('style', 'background-color:' + this.activeBkgColor + ';color:' + this.activeColor  + ';');
          }
        }

        const tmp = document.getElementById(this.appPages[i].id);
        if (ObjectFunctions.isValid(tmp) === true) {
          tmp.setAttribute('style', 'background-color:' + this.inActiveBkgColor + ';color:' + this.inActiveColor  + ';');
      }

      }
/*
      if (this.currentTab !== '') {
        // set to inactive
        const currentTab = document.getElementById(this.currentTab);
        currentTab.setAttribute('style', 'background-color:' + this.inActiveBkgColor + ';color:' + this.inActiveColor  + ';');
      }
      this.currentTab = id;
      // console.log('app.component.ts onTabClick event:', event);

        const tab = document.getElementById(this.currentTab);
        if (ObjectFunctions.isValid(tab) === true) {
        tab.setAttribute('style', 'background-color:' + this.activeBkgColor + ';color:' + this.activeColor  + ';');
      }
*/

    } catch (Error ) {
      console.log('app.component.ts loadTypes Update CATCH:', Error);
    }
  }

  // this will return the tab id base on the path of the url.
  // when the page is reloaded the path remains the same
  // but the store tab is selected
  public static getSelectedTabId(path: string): string {
    const tabNames =  'messages,community,store,about'.split(',');
    if (path.indexOf('store') >= 0) {
      return 'tab-button-store';
    }
    if (path.indexOf('community') >= 0) {
      return 'tab-button-community';
    }
    if (path.indexOf('messages') >= 0) {
      return 'tab-button-messages';
    }
    if (path.indexOf('about') >= 0) {
      return 'tab-button-about';
    }
    // return 'tab-button-store';
    return ''; // for parameter routing in app.component.ts
  }

  public static  updateUI(pluralType: string) {
  // pluralType is usally  the title .. Events, Hosts...

          try {
  /*
          // Get the selected button.
          const selButton = document.getElementById( 'i' + pluralType);

          // Update the tab button with new selection..
          let tab = document.getElementById('lblCommunity');    console.log('UiFunctions.ts updateUI update tab lblCommunity:', tab);
          tab.innerHTML = pluralType; // update tab label
          let icon =  document.getElementById('icoCommunity'); console.log('UiFunctions.ts updateUI update tab icoCommunity:', icon);
          icon.setAttribute('class', selButton.className);

          console.log('UiFunctions.ts updateUI Update the app.component view lblCompHom...');
          // Update the app.component view..
          tab = document.getElementById('lblSegementText'); // update component side bar
          tab.innerHTML = pluralType;
          console.log('UiFunctions.ts updateUI Update the app.component view icoCompStore...');
          icon =  document.getElementById('icoCommunity'); // icoComp + title
          // icon.setAttribute('name', this.fabIcon);
          icon.setAttribute('class', selButton.className);
  */
          } catch (Error ) {
          console.log('UiFunctions.ts updateUI Update CATCH:', Error);
          }
  }

  public static setInnerHtml(elementId: string, text: string) {
    const element = document.getElementById(elementId);
    if (ObjectFunctions.isValid(element)) {
      element.innerHTML = text;
    }
  }
}
