import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../services/session.service';
import { UserService } from '../../services';
import {LoginForm} from './loginform';
import {  Session, ServiceResult } from '../../models/index';
import { Events } from '@ionic/angular';
import { Api } from '../../services';
import { ProfileService} from '../../services';
import { Storage } from '@ionic/storage';
 import {LocalSettings} from '../../services/settings/local.settings';
import {SendAccountInfoForm} from '../password/SendAccountInfoForm';
import { ObjectFunctions } from 'src/app/common/object.functions';
import {UiFunctions} from 'src/app/common/uifunctions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  providers: [ProfileService],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  submitted = false;
  processing = false;
  login: LoginForm = new LoginForm();
  sessionLoaded = false;
  showMessage = false;
  message = '';
  returnUrl = '';

  constructor(
    private user: UserService,
    private events: Events,
    private session: SessionService,
    public router: Router,
    private route: ActivatedRoute,
    public messages: Events,
    public profleService: ProfileService,
    private cookieService: CookieService,
    public storage: Storage ) {
/* optimization_change
    this.events.subscribe('login.load.data', (data) => {
        // this fires after login and session is loaded.
        console.log('login.ts login.load.data event fired:', data);
        console.log('login.ts  login.load.data event fired this.sessionLoaded :', this.sessionLoaded );

        if (this.returnUrl === '/' || ObjectFunctions.isNullOrWhitespace(this.returnUrl) ===  true) {
          this.returnUrl = '/tabs/store';
        }

        const tabId =   UiFunctions.getSelectedTabId('/tabs/store');
        console.log('login.ts login.load.data event fired tabId:', tabId);
        UiFunctions.UpdateColors(tabId);
        console.log('login.ts  login.load.data event fired this.returnUrl :', this.returnUrl );
        this.router.navigate([this.returnUrl]);
    });
    */
  }

  initializeSession(loginResult: any) {

    console.log('LOGIN.TS initializeSession data.Result.AccountRoles:', loginResult.AccountRoles);
    this.session.AccountRoles = loginResult.AccountRoles;
    this.session.CurrentSession.IsPersistent = this.login.RememberMe;

    Api.authToken = loginResult.Authorization;
    this.cookieService.set( 'bearer', Api.authToken  );
    console.log('LOGIN.TS initializeSession Api.authToken:', Api.authToken);


    console.log('LOGIN.TS initializeSession LoadSession.  this.session :',  this.session);
      this.session.getSession(Api.authToken).subscribe(sessionResponse => {
        console.log('LOGIN.TS onLoging getSession. Api.authToken :', Api.authToken);
        const sessionData = sessionResponse as ServiceResult;
        console.log('LOGIN.TS initializeSession LoadSession.sessionData :', sessionData);
        if (sessionData.Code !== 200) {
          this.messages.publish('api:err', sessionData);
            return false;
        }
        this.session.CurrentSession =  sessionData.Result as Session;
        this.session.CurrentSession.IsPersistent = this.login.RememberMe;
        this.session.CurrentSession.Profile = loginResult.Profile;
        console.log('LOGIN.TS initializeSession this.session.CurrentSession.Profile :', this.session.CurrentSession.Profile );

        this.sessionLoaded = true;
        if ( this.login.RememberMe === true) {
          this.storage.set(LocalSettings.SessionToken, Api.authToken);
          this.storage.set(LocalSettings.UserName, this.login.UserName);
          this.storage.set(LocalSettings.SessionData, this.session.CurrentSession);
          this.storage.set(LocalSettings.HasLoggedIn, true);
        }
        this.messages.publish('login.load.data', 'session');

    }, (err) => {
      this.processing = false;
      this.messages.publish('service:err', err);
    });

  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.events.subscribe('login.load.data', (data) => {
      // this fires after login and session is loaded.
      console.log('login.ts login.load.data event fired:', data);
      console.log('login.ts  login.load.data event fired this.sessionLoaded :', this.sessionLoaded );

      if (this.returnUrl === '/' || ObjectFunctions.isNullOrWhitespace(this.returnUrl) ===  true) {
        this.returnUrl = '/tabs/store';
      }

      const tabId =   UiFunctions.getSelectedTabId('/tabs/store');
      console.log('login.ts login.load.data event fired tabId:', tabId);
      UiFunctions.UpdateColors(tabId);
      console.log('login.ts  login.load.data event fired this.returnUrl :', this.returnUrl );
      this.router.navigate([this.returnUrl]);
  });
}

  onLogin(form: NgForm) {
    this.submitted = true;
    this.showMessage = false;
    this.message = '';

    if (!form.valid) { console.log('login.ts onLogin form invalid.'); return; }

    this.processing = true;

    this.login.ClientType = 'web';

    this.session.CurrentSession.IsPersistent = this.login.RememberMe;
    console.log('LOGIN.TS onLogin this.session.CurrentSession.IsPersistent :', this.session.CurrentSession.IsPersistent );
    if ( this.login.RememberMe ) {
      this.login.ClientType = 'mobile.app'; // this will persist the session on the server so they won't have to login all the time.
    }

     this.session.login(this.login).subscribe((response) => {
      console.log('LOGIN.TS onLogin response:', response);

      // data fiels are set in the service in accountscontroller.Login at the bottom of the function
      const data = response as ServiceResult;
      this.processing = false;
       if (data.Code !== 200) {
          this.showMessage = true;
          this.message = data.Message;
          this.messages.publish('api:err', data);
          return false;
      }

      // NOTE: see login.load.data above for redirect.
      this.initializeSession(data.Result);
      this.messages.publish('user:login'); // events.ts is also listening so it can load favorites.
      this.messages.publish('content:refresh'); // updates the store.page for now.

    });
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }


}
