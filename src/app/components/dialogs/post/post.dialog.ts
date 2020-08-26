import { AfterViewInit, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../../services/events/event.service';
import { ServiceResult} from '../../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../../common/object.functions';
import { SessionService} from '../../../services/session.service';
import { AccountService} from '../../../services/user/account.service';
import { Api} from '../../../services/api/api';
import { Filter, Screen } from '../../../models/index';
import {SelectItem} from 'primeng/primeng';
import {Post} from '../../../models/post';
import { PostService } from '../../../services/documents/post.service';
import {DateTimeComponent} from '../../datetime/datetime.component';
import {Attribute} from '../../../models/attribute';
import {AttributesListsComponent} from '../../../components/lists/attributes.lists/attributes.lists.component';
import {AttributesService} from '../../../services/common/attributes.service';
// todo refactor the screens and filters in the services to be in a singular class.
@Component({
  selector: 'page-post.dialog',
  templateUrl: 'post.dialog.html',
  styleUrls: ['./post.dialog.scss', '../../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None
})
export class PostDialog implements AfterViewInit {
  text: string;
  public post: Post = new Post();
  public isNew = true;
  loading = false;

  // this is next version format => @ViewChild('publishDate', {static: false}) publishDate: DateTimeComponent;
  @ViewChild('publishDate', {static: false}) publishDate: DateTimeComponent;

  // postFilters = [];
  Category: string;
  categories: SelectItem[] = [];
  status: SelectItem[];
  public type: string;
  saving = false;
  currentAttribute = new Attribute();
  postAttributeTypes: SelectItem[];

  @ViewChild('lstAttributes', {static: false}) lstAttributes: AttributesListsComponent;
   // attributes: Attribute[] = [];

  constructor(
    private attributeService: AttributesService,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public eventService: EventService,
    private sessionService: SessionService,
    private accountService: AccountService,
    private postService: PostService,
    public messages: Events  ) {
      const url = Api.url;
      console.log('post.dialog.ts constructor url:', url);

      this.status = [];
      this.status.push({ label: 'Draft', value: 'draft' });
      this.status.push({ label: 'Publish', value: 'publish' });
      // status: draft, published, pending review, kickback
      console.log('post.dialog.ts constructor post:', this.post);

      }

      // author

  dismiss() {
    this.modalCtrl.dismiss();
  }

  initializeView() {
    console.log('post.dialog.ts initializeView');
    console.log('post.dialog.ts constructor initializeView:', this.post);
  }

  ionViewDidEnter() {
    console.log('post.dialog.ts ionViewDidEnter type:',  this.type);
    this.loadPostCategories();
    console.log('post.dialog.ts constructor ionViewDidEnter:', this.post);
  }


  async loadPostCategories() {
    console.log('post.dialog.ts loadPostCategories');
    if (ObjectFunctions.isValid(this.categories) ===  false) {
      this.categories = [];
    }


    if (  this.categories.length > 0) {
      console.log('post.dialog.ts cached screens  this.eventService.AvailableScreens:',  this.eventService.AvailableScreens);

    } else {

    this.http
      .get( Api.url + 'Content/filters/posts.web.json').subscribe(res => {
        if (res) {
          console.log('post.dialog.ts loadPostCategories res:', res);
          this.categories = [];

          if (!Array.isArray(res)) {
            console.log('post.dialog.ts loadPostCategories !Array.isArray(res) returning');
            return;
          }

          for (let i = 0; i < res.length; i++) {
        /*   const screen = new Screen();
            screen.Command = res[i].Command;
            screen.Field = res[i].Field;
            screen.Selected = res[i].Selected;
            screen.Caption = res[i].Caption;
            screen.Value = res[i].Value;
            screen.Type = res[i].Type;
            // "Icon" : "assets/icon/promoter-200.png"
            screen.ParserType = res[i].ParserType;
            screen.Junction = res[i].Junction;
            this.postFilters.push(screen);*/
            this.categories.push({label: res[i].Value, value: res[i].Value});
          }

        }
      }, (err)  => {
        this.messages.publish('service:err', err);
        return;
      });
    }
  }

  ngAfterViewInit() {
    console.log('post.dialog.ts constructor ngAfterViewInit:', this.post);
  }

  onCboChangeAttributeTypes(event) {
    console.log('post.dialog.ts onCboChangeAttributeTypes event:', event);
  }

  onCboChangeCategory(event) {
    if (ObjectFunctions.isValid(event) === false) {
      return;
    }
      console.log('post.dialog.ts onCboChangeCategory event:', event);
      this.post.Category = event;
      console.log('post.dialog.ts onCboChangeCategory this.post.Category:', this.post.Category);

      this.postAttributeTypes = [];
      this.http
      .get( Api.url + 'Content/Default/Attributes/post.' + this.post.Category + '.json').subscribe(res => {
        if (res) {
          console.log('post.dialog.ts onCboChangeCategory res:', res);

          if (!Array.isArray(res)) {
            console.log('post.dialog.ts onCboChangeCategory !Array.isArray(res) returning');
            return;
          }

          for (let i = 0; i < res.length; i++) {
            const attr  = res[i];

            this.postAttributeTypes.push({label: res[i].Name, value: attr});
          }
          console.log('post.dialog.ts postAttributeTypes:', this.postAttributeTypes);
        }
      }, (err)  => {
       // this.messages.publish('service:err', err);
        return;
      });

  }

  onCboChangeStatus(event) {
    this.post.Status = event.value;
  }

  onChangedPublishDate() {

    if (ObjectFunctions.isValid(this.publishDate) === false) {
      return;
    }

    if (ObjectFunctions.isValid(this.publishDate.DateValue) === false) {
      return;
    }
    console.log('post.dialog.ts  onDateChange onChangedPublishDate this.publishDate.DateValue:', this.publishDate.DateValue);
    this.post.PublishDate = this.publishDate.DateValue;
     // this.eventStartDate  = this.publishDate.DateValue;

    /*
    console.log('event-module.ts onDateChange this.syncStartDateToEndDate   :', this.syncStartDateToEndDate);
    // this.syncStartDateToEndDate = false;
    if (this.syncStartDateToEndDate === true) {
      try {
        const tmpStart = moment( this.publishDate.DateValue );
        const dtEndString   = tmpStart.year() + '-' + (tmpStart.month() + 1) + '-' + ( tmpStart.date() + 1)  + ' 03:00';
        const tmpEnd = moment(dtEndString);
        this.eventEndDate = tmpEnd.toISOString();
        this.event.EndDate =  this.eventEndDate ;
        this.endDate.DateValue  = this.eventEndDate ;
        console.log('event-modal.ts onChangedStartDate this.eventEndDate :', this.eventEndDate );
      } catch (Error ) {
        console.log('event-modal.ts onChangedStartDate CATCH:', Error);
      }
    }
    */
  }

  savePost() {
    this.saving  = true;
    console.log('post.dialog.ts savePost ');
    let svc = null;

    // this.post.Attributes = this.attributes
    if (this.isNew === true) {
      svc = this.postService.savePost(this.post);
    } else {
      svc = this.postService.updatePost(this.post);
    }

    console.log('post.dialog.ts savePost this.post:', this.post);
    svc.subscribe((response) => {
      this.saving = false;
      const data = response as ServiceResult;
      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        return;
      }
      this.isNew = false;
      this.dismiss();
    }, (err) => {
      this.saving = false;
       this.messages.publish('service:err', err);
    });
  }

  validPost(): boolean {
/*
 post.Body
 post.Category
 post.Name
 post.Status

    if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Name)) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Name FAILED;', this.profileMember.Name);
      return false;
    }

    if (this.profileMember.Height <= 0 ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Height FAILED;', this.profileMember.Height);
      return false;
    }

    if (this.profileMember.Weight <= 0 ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Weight FAILED;', this.profileMember.Weight);
      return false;
    }
    if (this.profileMember.DOB === undefined) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.DOB FAILED;', this.profileMember.DOB);
      return false;
     }

     const age = ProfileFunctions.getAge( this.profileMember.DOB );
     console.log('profilemember.dialog.ts getAge age:' , age);
     console.log('profilemember.dialog.ts getAge  this.profileMember.DOB:' ,  this.profileMember.DOB);
     if (age < 18) {
      console.log('profilemember.dialog.ts validProfileMember age FAILED;', age);
      return false;
     }

     if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Orientation)) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Orientation FAILED;', this.profileMember.Orientation);
      return false;
     }

     if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Gender) ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Gender FAILED;', this.profileMember.Gender);
      return false;
     }
     */
    return true;
  }

}
