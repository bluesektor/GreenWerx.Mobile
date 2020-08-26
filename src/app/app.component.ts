import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet,UrlTree, UrlSegmentGroup , UrlSegment} from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { AppSetting } from '../app/app.settings';
import { Filter, Screen } from '../app/models/index';
import { AffiliateService } from '../app/services/common/affiliate.service';
import { PostService } from '../app/services/documents/post.service';
import { EventService } from '../app/services/events/event.service';
import { SessionService } from '../app/services/session.service';
import { LocalSettings } from '../app/services/settings/local.settings';
import { ObjectFunctions } from './common/object.functions';
import { UiFunctions } from './common/uifunctions';
import { ServiceResult } from './models/';
import { AffiliateLog } from './models/affiliatelog';
import { ProfileService } from './services/user/profile.service';
import {CachedItems} from './services/cached.items';
import {FilterService} from './services/filter.service';
const EventSource: any = window['EventSource'];
import * as _ from 'lodash';
import { filter, combineLatest, debounceTime,   map, mergeAll, switchMap, tap } from 'rxjs/operators';
const PRIMARY_OUTLET = "primary";
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {Parser} from './common/parser.functions';
import {Timer} from './common/timer';
import {Api} from '../app/services/api/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;

  appPages: any[] = [];
  loggedIn = false;
  isAdmin = false;
  path: any;
  pathString: string;
  currentTab: string;
  showDetail = false;

  public options = {
    position: ['bottom', 'right'],
    showProgressBar: false,
    timeOut: 3000,
    lastOnBottom: true,
    maxStack: 3,
    animate: 'fromBottom'
  };

  constructor(
    private apiService: Api,
    public alertController: AlertController,
    private cookieService: CookieService,
    private affiliateService: AffiliateService,
    private location: Location,
    private appSettings: AppSetting,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private profileService: ProfileService,
    private messages: Events,
    private http: HttpClient,
    private menu: MenuController,
    private router: Router,
    private eventService: EventService,
    public localSettings: LocalSettings,
    private session: SessionService,
    private route: ActivatedRoute,
    private notification: NotificationsService,
    private postService: PostService,
    private cache: CachedItems,
    private filterService: FilterService
  ) {

     this.appPages = UiFunctions.appPages;

     console.log( 'event******************************************************app.component.ts constructor'    );
  }

  checkLoginStatus() {
    const tidx = Timer.start('APP.COMPONENT.TS checkLoginStatus');
    console.log('APP.COMPONENT.TS checkLoginStatus');
    this.loggedIn = this.session.validSession();
    console.log('APP.COMPONENT.TS checkLoginStatus:', this.loggedIn);
    Timer.stop(tidx);
    return this.loggedIn;
  }

  getRoute(type: string): string {
    console.log('app.component.ts getRoute type:', type);
    if (ObjectFunctions.isNullOrWhitespace(type) === true) {
      return '';
    }

    let baseRoute = '/tabs/';

    switch (type.toLowerCase()) {
      case 'profile':
        this.showDetail = true;
        baseRoute = baseRoute + 'details/profile/';
        break;
     
      case 'post':
        this.showDetail = true;
        baseRoute = baseRoute + 'details/post/';
        break;
      /*
      case 'profiles':
          baseRoute = baseRoute + 'community';
          break;
      case 'host':
          baseRoute = baseRoute +  'details/Account/';
          break;
      case 'hosts':
          baseRoute = baseRoute + 'store';
        break;
      case 'place':
          baseRoute = baseRoute +  'TODO';
        break;
      case 'places':
        break;
      case 'dispensary':
          baseRoute = baseRoute +  'details/Account/';
        break;
      case 'dispensaries':
          baseRoute = baseRoute + 'store';  // apply filter
        break;
      case 'event':
        baseRoute = baseRoute +  'details/Event/';
        break;
      case 'events':
          baseRoute = baseRoute + 'store';
        break;

      case 'posts':
          baseRoute = baseRoute + 'community';
        break;
        */
    }
    return baseRoute;
  }

  initializeApp() {
    console.log('APP.COMPONENT.TS initializeApp');
    const tidx = Timer.start('APP.COMPONENT.TS initializeApp');

    this.platform.ready().then(() => {
      const tidx2 = Timer.start('APP.COMPONENT.TS initializeApp.platform.ready');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translate.setDefaultLang('en');

      if (this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang());
      } else {// Set the default language for translation strings, and the current language.
        this.initTranslate('en'); // Set your language here
      }
      Timer.stop(tidx2);
    });
    this.listenForLoginEvents();
    this.listenForApiEvents();
    this.session.loadSession(); // async call so it shouldn't block the ui

    Timer.stop(tidx);
  }

  private initTranslate(language: string) {
    const tidx = Timer.start('APP.COMPONENT.TS initTranslate');
    console.log('app.components.ts _initTranslate()');
    this.translate.use(language);
    Timer.stop(tidx);
  }

  listenForApiEvents() {
    console.log('APP.COMPONENT.TS listenForApiEvents');
    const tidx = Timer.start('APP.COMPONENT.TS listenForApiEvents');
    this.messages.subscribe('console:log', (status, msg) => {
      console.log('APP.COMPONENT.TS listenForApiEvents console:log:', msg);
      switch (status) {
        case 'err':
          console.log('\x1b[41m' + msg);
          break;
        case 'warn':
          console.log('\x1b[33m' + msg);
          break;
        case 'info':
          console.log('\x1b[44m' + msg);
          break;
        default:
          console.log(msg);
      }
    });

    this.messages.subscribe('api:ok', msg => {
      if (ObjectFunctions.isNullOrWhitespace(msg) === true) {
        this.notification.success('Success', '');
      return;
      }
      console.log('APP.COMPONENT.TS listenForApiEvents api:ok data:', msg);
      console.log('\x1b[44m' + msg);
      this.notification.success('Success', msg);
    });

    this.messages.subscribe('api:err', data => {
      console.log('APP.COMPONENT.TS listenForApiEvents api:err data:', data);
      this.notification.error('Error', data.Message);
    });

    this.messages.subscribe('app:err', msg => {
      console.log('APP.COMPONENT.TS listenForApiEvents msg:', msg);
      this.notification.error('Error', msg);
    });

    this.messages.subscribe('service:err', data => {
      console.log('app.compoennt.TS loadSession service:err data:', data);
      let errMsg = 'service error.';

      if (data !== undefined) {
        errMsg = data.statusText;
        if (errMsg === 'OK') {
          errMsg = data.message;
        }
        if (data.status === 401) {
          if (this.session.validSession() === true) {
            errMsg = 'You are not authorized this functionality';
          } else {
            // this.messages.publish('user:logout');
           // errMsg = 'You must be logged in to access this functionality';
          }
        }
      }
      this.notification.error('Error', errMsg);
    });
    Timer.stop(tidx);
  }

  listenForLoginEvents() {
    console.log('APP.COMPONENT.TS listenForLoginEvents');
    const tidx = Timer.start('APP.COMPONENT.TS listenForLoginEvents');
    this.messages.subscribe('user:login', () => {
      this.loggedIn = true;
      this.notification.success('Success', 'Login success.');
    });

    this.messages.subscribe('user:session.loaded', () => {
      this.checkLoginStatus();
    });

    this.messages.subscribe('user:signup', () => {
      this.loggedIn = true;
    });

    this.messages.subscribe('user:logout', () => {
      console.log(
        'app.component.ts listenForLoginEvents this.messages.subscribe(user:logout:'
      );
      this.loggedIn = false;
      this.logout();
    });
    Timer.stop(tidx);
  }

 async showDialog(title: string, subTitle: string, body: string) {

      const alert = await this.alertController.create( {
        header: title,
        subHeader: subTitle,
        message: body,
        buttons: ['OK']
      });

      await alert.present();
  }

  // Global logout, use
  //  this.messages.publish('user:logout');
  // to trigger the event that calls this function.
  //
  logout() {
    console.log('APP.COMPONENT.TS logout');
    this.loggedIn = false;
    // todo maybe move all these service logouts to session.logOut?
    this.postService.logOut();
    this.cache.logOut();
    this.filterService.logOut();
    this.profileService.logOut();
    this.eventService.logOut();
    this.cookieService.delete('bearer');
    this.session.logOut().then(() => {
      this.messages.publish('api:ok', 'You have been logged out.');
      this.messages.publish('content:refresh');
      return this.navigate('/tabs/store');

    });
  }

  navigate(url: string) {
    console.log('APP.COMPONENT.TS navigate');
    return this.router.navigateByUrl(url);
  }

  ngOnInit() {
   
    console.log('APP.COMPONENT.TS ngOnInit');
    const tidx = Timer.start('APP.COMPONENT.TS ngOnInit');
    this.initializeApp();

    this.pathString = this.location.path();
    const pathTokens = this.pathString.split('/');
    const param = pathTokens[pathTokens.length - 1]; // this.pathString.substring( this.pathString.lastIndexOf('/')  + 1);
    this.currentTab = UiFunctions.getSelectedTabId(param);
    console.log('app.component.ts ngOnInit pathstring:', this.pathString);
    console.log('APP.COMPONENT.TS ngOnInit param:', param);
    console.log('APP.COMPONENT.TS ngOnInit  this.currentTab:', this.currentTab);
    if (this.currentTab === '') {
      this.processParameters(pathTokens);
    }
    Timer.stop(tidx);
 
  }

  onMenuClick(url: string, id: string) {
    console.log('app.component.ts onMenuClick url:', url);
    this.router.navigateByUrl(url);

    console.log('app.component.ts onMenuClick clicked tab id:', id);
    UiFunctions.UpdateColors(id);
    /*
    try {
      for (let i = 0; i < this.appPages.length; i++) {
        if ( this.appPages[i].id === id ) {
          const tab = document.getElementById(this.currentTab);
          tab.setAttribute('style', 'background-color:' + this.activeBkgColor + ';color:' + this.activeColor  + ';');
          continue;
        }

        const tmp = document.getElementById(this.appPages[i].id);
        if (ObjectFunctions.isValid(tmp) === true) {
          tmp.setAttribute('style', 'background-color:' + this.inActiveBkgColor + ';color:' + this.inActiveColor  + ';');
      }

      }

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
    } catch (Error ) {
      console.log('app.component.ts loadTypes Update CATCH:', Error);
    }
*/
  }

  openTutorial() {
    console.log('APP.COMPONENT.TS openTutorial');
    this.localSettings.storage.remove(LocalSettings.HasSeenTutorial);
    this.menu.enable(false);
    this.router.navigateByUrl('/tutorial');
  }

  processParameters(tokens: string[]) {
    console.log('APP.COMPONENT.TS processParameters');
    const tidx = Timer.start('APP.COMPONENT.TS processParameters');

    if (ObjectFunctions.isValid(tokens) === false) {
      return;
    }

    const pathTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      if (ObjectFunctions.isNullOrWhitespace(tokens[i]) === true) {
        continue;
      }
      pathTokens.push(tokens[i]);
    }

    console.log('app.component.ts processParameters pathTokens:', pathTokens);
    if (
      ObjectFunctions.isValid(pathTokens) === false ||
      pathTokens.length <= 1
    ) {
      console.log('app.component.ts processParameters invalid pathTokens');
      return;
    }

    const type = pathTokens[pathTokens.length - 2]; // profile(s), place(s), post, blog,
    console.log('app.component.ts processParameters type:', type);

    if (ObjectFunctions.isNullOrWhitespace(type) === true) {
      console.log('app.component.ts processParameters invalid pathTokens type');
      return;
    }

    const identifier = pathTokens[pathTokens.length - 1];
    console.log('app.component.ts processParameters identifier:', identifier);
    if (ObjectFunctions.isNullOrWhitespace(identifier) === true) {
      console.log(
        'app.component.ts processParameters invalid pathTokens identifier'
      );
      return;
    }

    const route = this.getRoute(type);
    console.log('app.component.ts processParameters route:', route);

    if (ObjectFunctions.isNullOrWhitespace(route) === true) {
      console.log(
        'app.component.ts processParameters no route for type:',
        type
      );
      return;
    }

    switch (type.toLowerCase()) {
      case 'profile':
        this.viewProfile(route, identifier);
        break;
      case 'post':
        this.viewPost(route, identifier);
        break;
    }
    Timer.stop(tidx);
  }

  

 async showTermsOfService() {
    this.apiService.downloadFile( Api.url + 'docs/eula.html' ).subscribe(resp => {
      console.log('app.component.ts showTermsOfService downloadFile response:', resp);
      this.showDialog('Terms Of Service', '', resp.toString());
    });
 }

 async showPrivacyPolicy() {
  this.apiService.downloadFile( Api.url + 'docs/privacynotice.html' ).subscribe(resp => {
    console.log('app.component.ts showTermsOfService downloadFile response:', resp);
    this.showDialog('Privacy Policy', '', resp.toString());
  });
 }





  useLanguage(language: string) {
    console.log('APP.COMPONENT.TS useLanguage');
    const tidx = Timer.start('APP.COMPONENT.TS useLanguage');
    this.translate.use(language);
    Timer.stop(tidx);
  }

  private viewPost(route: string, identifier: string) {
    console.log('APP.COMPONENT.TS viewPost');
    const filter = new Filter();
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'EQUAL';
    // screen.ParserType = 'sql';
    screen.Value = identifier;
    filter.Screens.push(screen);
    this.postService.searchUserPosts(filter).subscribe(
      data => {
        const response = data as ServiceResult;
        console.log(
          'app.component.ts postService.searchUserPosts response:',
          response
        );

        if (response.Code !== 200) {
          // this.loading = false;
          if (response.Code === 401) {
            // this.messages.publish('user:logout');
            return false;
          }
          return;
        }
        const log = new AffiliateLog();
        log.UUIDType = 'AffiliateLog.Post';
        log.Name = identifier;
        log.NameType = 'Post';
        log.Link = this.pathString;
        log.AccessType = 'Post';
        log.ClientUserUUID = this.session.CurrentSession.UserUUID;

        log.CreatedBy = this.session.CurrentSession.UserUUID;
        log.Referrer = document.referrer;
        log.Direction = 'inbound';
        let item = null;
        if (response.TotalRecordCount > 1) {
          item = response.Result[0];
        } else if (response.TotalRecordCount === 1) {
          item = response.Result[0];
        } else {
          if (ObjectFunctions.isValid(item) === false) {
            this.affiliateService
              .logAffliateAccess(log)
              .subscribe(resLogAff => {
                console.log(
                  'app.component.ts viewPost NULL item logAffliateAccess resLogAff:',
                  resLogAff
                );
              });
          }
          return;
        }

        this.postService.Posts.push(item); // add to cache
        console.log('app.component.ts viewPost:', item);
        if (this.showDetail === true) {
          route = route + identifier; // TODO TRY LOADING BY NAME // item.UUID;
          // because we add it to the cache it won't call the service when loading in the detail page.
        }
        this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
          console.log(
            'app.component.ts viewPost logAffliateAccess resLogAff:',
            resLogAff
          );
        });

        this.localSettings.storage
          .get(LocalSettings.ReferringMember)
          .then(res => {
            console.log(
              'app.component.ts viewPost get LocalSettings.ReferringMember res:',
              res
            );
            if (ObjectFunctions.isValid(res) === false) {
              console.log(
                'app.component.ts viewPost saving member identifier:',
                identifier
              );
              this.localSettings.storage.set(
                LocalSettings.ReferringMember,
                identifier
              );
            }
          });

        console.log('app.component.ts viewPost route:', route);
        this.router.navigateByUrl(route); //
      },
      err => {
        // this.loading = false;
        // this.messages.publish('service:err' ,  err.statusText );
        if (err.status === 401) {
         // this.messages.publish('user:logout');
          return;
        }
      }
    );
  }

  private viewProfile(route: string, identifier: string) {
    console.log('app.component.ts viewProfile route:', route);
    console.log('app.component.ts viewProfile identifier:', identifier);

    const filter = new Filter();
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'EQUAL';
    screen.ParserType = 'sql';
    screen.Value = identifier;
    filter.Screens.push(screen);

    // this.profileService.searchUserProfiles(filter).subscribe(data => {
    this.profileService.getUserProfile(identifier).subscribe(
      data => {
        const response = data as ServiceResult;
        console.log(
          'app.component.ts profileService.getUserProfile response:',
          response
        );

        if (response.Code !== 200) {
          if (response.Code === 401) {
           // this.messages.publish('user:logout');
            return false;
          }
          this.messages.publish('api:err', response.Message);
          return;
        }
        const log = new AffiliateLog();
        log.UUIDType = 'AffiliateLog.Profile';
        log.Name = identifier;
        log.NameType = 'User';
        log.Link = this.pathString;
        log.AccessType = 'Profile';
        log.ClientUserUUID = this.session.CurrentSession.UserUUID;

        log.CreatedBy = this.session.CurrentSession.UserUUID;
        log.Referrer = document.referrer;
        log.Direction = 'inbound';

        console.log('1. app.component.ts viewProfile response:', response);
        const item = response.Result;
        if (ObjectFunctions.isValid(item) === false) {
          this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
            console.log(
              'app.component.ts viewProfile NULL item logAffliateAccess resLogAff:',
              resLogAff
            );
          });
          return;
        }

        /*
       let item = null;
       if (response.TotalRecordCount > 1 ) {
         item  =  response.Result[0];
       } else if (response.TotalRecordCount === 1) {
         item = response.Result[0];
       } else {
         if (ObjectFunctions.isValid(item) === false) {
           this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
                 console.log('app.component.ts viewPost NULL item logAffliateAccess resLogAff:', resLogAff);
               });
         }
         console.log('2. app.component.ts viewProfile route:', route);
         return;
       }*/

        console.log('3. app.component.ts viewProfile route:', route);

        this.profileService.Profiles.push(item); // add to cache
        console.log('app.component.ts profile:', item);
        if (this.showDetail === true) {
          // NOTE: SET THIS IN getRoute(..) above
          console.log('4. app.component.ts viewProfile route:', route);
          route = route + identifier; // because we add it to the cache it won't call the service when loading in the detail page.
        }
        this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
          console.log('5. app.component.ts viewProfile route:', route);
          console.log(
            'app.component.ts viewProfile logAffliateAccess resLogAff:',
            resLogAff
          );
        });

        console.log('6. app.component.ts viewProfile route:', route);
        this.localSettings.storage
          .get(LocalSettings.ReferringMember)
          .then(res => {
            console.log(
              'app.component.ts viewProfile get LocalSettings.ReferringMember res:',
              res
            );
            if (ObjectFunctions.isValid(res) === false) {
              console.log(
                'app.component.ts viewProfile saving member identifier:',
                identifier
              );
              this.localSettings.storage.set(
                LocalSettings.ReferringMember,
                identifier
              );
            }
          });
        console.log('7. app.component.ts viewProfile route:', route);
        console.log('app.component.ts viewProfile route:', route);
        console.log('app.component.ts viewProfile identifier:', identifier);

        console.log('app.component.ts processParameters route:', route);
        this.router.navigateByUrl(route); //
      },
      err => {
        if (err.status === 401) {
         // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err', err.statusText);
      }
    );
  }
}
