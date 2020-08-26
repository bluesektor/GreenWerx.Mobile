import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ObjectFunctions } from 'src/app/common/object.functions';
import { UiFunctions } from '../../common/uifunctions';
import { PostDialog } from '../../components/dialogs/post/post.dialog';
import { Screen } from '../../models/index';
import { PostService } from '../../services/documents/post.service';
import { FilterService } from '../../services/filter.service';
import { SessionService } from '../../services/session.service';
import { ProfileService } from '../../services/user/profile.service';
import { CommunityFilterPage } from '../community-filter/community-filter';
import * as _ from 'lodash';

@Component({
  selector: 'app-community',
  templateUrl: 'community.page.html',
  encapsulation: ViewEncapsulation.None
})
export class CommunityPage implements AfterViewInit, OnInit {

  constructor(
    public modalCtrl: ModalController,
    private profileService: ProfileService,
    private postService: PostService,
    private filterService: FilterService,
    public sessionService: SessionService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.log('community.page.ts constructor' );
    // ConsoleColors.colorLog('community.page.ts constructor', 'info');
  }
  showSearch = false;
  viewType = 'POST';
  pluralType = 'POSTS';
  segment = 'all';

  @ViewChild('lstItems', { static: false }) lstItems: any;
  @ViewChild('txtSearchCommunity', { static: false }) txtSearch: any;
  itemCount = 0; // total # of items in query.
  profileListStyle = 'background-color: red;';
  queryText = '';



  getColor(isActivated: boolean): string {
    if (isActivated === true) {
      return UiFunctions.activeColor;
    }
    return UiFunctions.inActiveColor;
  }

  listUpdated(event) {
    console.log('community.page.ts listUpdated event:', event);
    this.itemCount = parseInt(event, 10);
    UiFunctions.setInnerHtml(
      'lblSegementText',
      this.pluralType + ' (' + this.itemCount.toString() + ')'
    );
  }

  loadTypes(type: string, fab: HTMLIonFabElement) {
    this.viewType = type;
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    let title = 'Profiles';
    console.log('community.page.ts loadTypes this.viewType:', this.viewType);

    fab.close();
    switch (this.viewType) {
      case 'ATTRIBUTE':
        title = 'Attributes';
        break;
      case 'PROFILE':
        //  this.hideProfiles = false;
        title = 'Profiles';
        this.pluralType = title;
        break;
      case 'POST':
        title = 'Posts';
        this.pluralType = title;
        break;
    }
    console.log(
      'community.page.ts loadTypes this.lstItems.updateList this.viewType:',
      this.viewType
    );
    this.updateList(true); // , this.filter, this.segment, this.viewType, this.queryText);
  }

  async newPost() {
    const modal = await this.modalCtrl.create({
      component: PostDialog
      // cssClass: 'email-dialog',  // must go in globals.scss
      //  componentProps: {        isReplyMessage: isReply,
      //  emailToUserUUID: toUserUUID,
      //  emailFromUserUUID: fromUserUUID,
      // subject: tmpSubject,
      //  comment: tmpComment     }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === undefined || data == null) {
      return;
    }

    const newPost = data as PostDialog;
    console.log('community.page.ts newPost newPost:', newPost);
    // this.addProfileMember(newPost);
  }

  ngAfterViewInit(): void {
    console.log(
      'event--------------------------------------------------------------community.page.ts ngAfterViewInit'
    );
    this.updateList(true);
  }

  ngOnInit() {
    console.log(
      'event--------------------------------------------------------------community.page.ts ngOnInit'
    );
  }

  // tslint:disable-next-line:member-ordering
  onSearchData = _.debounce( function() {
    if (this.showSearch === false) {
      console.log(
        'community.page.lists.component.ts searchEvents  search is hidden, returinng'
      );
      return;
    }

    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    if (!this.queryText || this.queryText === '') {
      this.updateList(true);
      return;
    }
    console.log(
      'community.page.lists.component.ts searchEvents  this.queryText:',
      this.queryText
    );
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    screen.ParserType = 'sql';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    console.log('community.page.lists.component.ts searchEvents  updateList');
    this.updateList(true);
  }, 400 );

  onCancelSearch(event) {
    this.showSearch = false;
    if (this.showSearch === false) {
      if (ObjectFunctions.isNullOrWhitespace(this.queryText) === false) {
        this.itemCount = 0;
        this.filterService.resetFilter(this.viewType);
        this.updateList(true);
      }
    }
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: CommunityFilterPage,
      componentProps: {
        type: this.viewType
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // const filter = data as Filter;
    // filter.ViewType = this.viewType;
    // this.filterService.setFilter( filter);

    this.lstItems.updateList(true, this.segment, this.viewType, this.queryText);
  }

  segmentClicked() {
    console.log('community.page.ts this.segment:', this.segment);
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    console.log('community.page.ts segmentClicked  updateList');
    this.updateList(true);
  }

  toggleList(
    fabButton: HTMLIonFabButtonElement,
    fabList: HTMLIonFabListElement
  ) {
    fabButton.activated = !fabButton.activated;
    fabList.activated = !fabList.activated;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    const txt = document.getElementById('txtSearchCommunity');
    if (this.showSearch === true) {
      setTimeout(() => {
        this.txtSearch.setFocus();
      }, 500);
    } else {
      // this.queryText = '';
      // this.updatelist(true);
    }
  }

  async updateList(resetArray: boolean) {
    console.log('community.page.ts updateList this.viewType:', this.viewType);
    this.lstItems.updateList(
      resetArray,
      this.segment,
      this.viewType,
      this.queryText
    );
  }
}
