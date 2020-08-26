import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import {LocalSettings} from '../../services/settings/local.settings';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TutorialPage {
  showSkip = true;
  loading = false;
  @ViewChild('slides', {static: false}) slides: any;

  constructor(
    public menu: MenuController,
    public router: Router,
   // public storage: Storage
  ) {
    console.log('tutorial.ts constructor');
  }

  ionViewDidEnter() {
    console.log('tutorial.ts ionViewDidEnter');
  //  if (this.slides === null || this.slides === undefined) {
  //    return;
  //  }
   // this.slides.update();
  }

  ionViewDidLeave() {
    console.log('tutorial.ts ionViewDidLeave');
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    console.log('tutorial.ts ionViewWillEnter');

   // this.storage.get(LocalSettings.HasSeenTutorial).then(res => {
   //   if (res) {
        this.router.navigateByUrl('/tabs/store');
   //   }
   // });

    this.menu.enable(false);
  }

  onSlideChangeStart(event) {
    this.showSkip = !event.target.isEnd();
  }

  startApp() {
    console.log('tutorial.ts startApp');
    this.loading = true; // sanity check. todo create modal wait
    this.router
      .navigateByUrl('/tabs/store');
     // .then(() => this.storage.set(LocalSettings.HasSeenTutorial, 'true'));
  }
}
