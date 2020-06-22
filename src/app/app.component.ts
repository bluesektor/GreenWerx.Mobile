import { Component, ViewEncapsulation, OnInit  } from '@angular/core';
import {  MenuController, Platform } from '@ionic/angular';
import { EventService } from '../app/services/events/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {EventLoop} from '../app/services/event.loop';
import {  ToastController } from '@ionic/angular';
import { SessionService } from '../app/services/session.service';
import { TranslateService } from '@ngx-translate/core';
 import {LocalSettings} from '../app/services/settings/local.settings';
import { AppSetting} from '../app/app.settings';
import { Observable, Subscription } from 'rxjs';
import { ServiceResult } from './models';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',

})
export class AppComponent implements  OnInit {

  appPages = [
    {
      title: 'Home',
      url: '/tabs/home',
      icon: 'calendar'
    },
    { title: 'Map', url: '/tabs/map', icon: 'map' },
    {
      title: 'About',
      url: '/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  path: any;
  subscriptions: Array<Subscription> = [];

  constructor(
   //  private location: Location,
    private  appSettings: AppSetting,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
     private translate: TranslateService,
    private events: EventLoop,
    private menu: MenuController,
    private router: Router,
    private toastCtrl: ToastController,
    private eventService: EventService,
    public localSettings: LocalSettings,
    private session: SessionService,
    private route: ActivatedRoute,
    ) {
     
    this.initializeApp();
  }
  ngOnInit() {

  }
  ngOnDestroy(){
    this.subscriptions.forEach(x => x.unsubscribe());
}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initEventLoops();
      this.initMessageLoops();
      this.session.loadSession(); // this will do checkLoginStatus once loaded.
         // Set the default language for translation strings, and the current language.
     this.translate.setDefaultLang('en');

     if (this.translate.getBrowserLang() !== undefined) {
         this.translate.use(this.translate.getBrowserLang());
     } else {
         this.initTranslate('en'); // Set your language here
     }

    });
  }

  openTutorial() {
    console.log('APP.COMPONENT.TS openTutorial');
    this.localSettings.storage.remove(LocalSettings.HasSeenTutorial);
    this.menu.enable(false);
    this.router.navigateByUrl('/tutorial');
  }


   checkLoginStatus() {
    console.log('APP.COMPONENT.TS checkLoginStatus');
    this.loggedIn = this.session.validSession();
    console.log('APP.COMPONENT.TS checkLoginStatus:', this.loggedIn);
    return this.loggedIn;
  }

  initEventLoops() {
    console.log('APP.COMPONENT.TS initEventLoops');
    this.subscriptions.push(
      this.events.eventLoopSource$.subscribe(data => { //
        switch(data){
          case 'user:login':
            this.loggedIn = true;
            break;
          case 'user:session.loaded':
            this.checkLoginStatus();
            break;
          case 'user:signup':
            this.loggedIn = true;
            break;
          case 'user:logout':
            this.loggedIn = false;
            break;
        }
     })
    );
  }

  initMessageLoops() {
    this.subscriptions.push(
      this.events.messageLoopSource$.subscribe(data => { //
        let msg = data as ServiceResult;
        let toast = null;
        switch(msg.Type){
          case 'console:log':
           // switch (status) {
           //   case 'err': console.log('\x1b[41m' + msg); break;
            //  case 'warn': console.log('\x1b[33m' + msg); break;
            //  case 'info': console.log('\x1b[44m' + msg); break;
            //  default: console.log(msg);
            //}
            break;
          case 'api:ok':
             toast = this.toastCtrl.create({
              message: msg.Message,
              duration: 3000,
              position: 'top'
            }).then((dlg) => {
                dlg.present();
            });
            break;
          case 'api:err':
             toast = this.toastCtrl.create({
              message: msg.Message,
              duration: 3000,
              position: 'top'
            }).then((dlg) => {
                dlg.present();
            });
            break;
          case 'service:err':
           // let errMsg = 'service error.';
           // if (data !== undefined) {
           //   errMsg = data.statusText;
            //}
             toast = this.toastCtrl.create({
              message:  msg.Message,  // data.status
              duration: 3000,
              position: 'top'
            }).then((dlg) => {
              dlg.present();
              });
          
            break;
        }
     })
    );

    }
 
/*
  selectTab(index: string, fallbackUrl: string) {

    const tabs = document.querySelector('ion-tabs');

   console.log('APP.COMPONENT.TS selectTab tabs:', tabs);


    let promise: Promise<any> = null;
    if (tabs) {
      promise = tabs.componentOnReady();
      promise.then(() => {
        return tabs.select(index);
      });
    } else {
      promise = this.navigate(fallbackUrl);
    }
    return promise.then(() => {
      return this.menu.toggle();
    });
  }
*/
  navigate(url: string) {
    console.log('APP.COMPONENT.TS navigate');
    return this.router.navigateByUrl(url);
  }

  logout() {
    console.log('APP.COMPONENT.TS logout');
    this.eventService.logOut();
    this.localSettings.storage.remove(LocalSettings.HasSeenTutorial);
    this.session.logOut().then(() => {
      return this.navigate('/tabs/home');
    });
   
  }

  useLanguage(language: string) {
    console.log('APP.COMPONENT.TS useLanguage');
    this.translate.use(language);
  }

  private initTranslate(language: string) {
    console.log('app.components.ts _initTranslate()');
    this.translate.use(language);
  }
}
