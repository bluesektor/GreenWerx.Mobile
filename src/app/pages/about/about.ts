import { Component, ViewEncapsulation } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from '../about-popover/about-popover';
import { AppSetting} from '../../app.settings';
import { TranslateService } from '@ngx-translate/core';
import {AffiliateLog} from '../../models/affiliatelog';
import {AffiliateService} from '../../services/common/affiliate.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutPage {

  constructor(
    public popoverCtrl: PopoverController,
    private affiliateService: AffiliateService,
    private sessionService: SessionService,
    public appSettings: AppSetting) {
      console.log('about.ts this.appSettings:', this.appSettings);
     }

  async presentPopover(event: Event) {
    /*
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
    */
  }


  async openWebSite(linkText: string , url: string) {

    console.log('abouts.ts openHostSite url :', url );


    const log = new AffiliateLog();
    log.UUIDType = 'AffiliateLog.Link';
    log.Name = linkText;
    log.NameType = 'textlink';
    log.Link = url;
    log.AccessType = 'href';
    log.ClientUserUUID = this.sessionService.CurrentSession.UserUUID;
    log.Direction = 'outbound';

    log.CreatedBy = this.sessionService.CurrentSession.UserUUID;
    log.Referrer =  document.referrer;
    await this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
      console.log('about.ts openHostSite logAffliateAccess resLogAff:', resLogAff);
    });

    window.open(url, '_blank');
  //  this.inAppBrowser.create(      `${host.WebSite}`,      '_blank'    );
  }
}
