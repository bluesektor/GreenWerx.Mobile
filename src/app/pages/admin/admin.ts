import {  Component,  ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import {InventoryService } from '../../services/store/inventory.service';
import {UserService} from '../../services/user/user.service';
import { DataImport, ServiceResult, Filter, Screen } from '../../models/index';
import { Events } from '@ionic/angular';
import { ObjectFunctions} from '../../common/object.functions';
import {StagedDataService} from '../../services/data/stageddata.service';
import * as moment from 'moment';
import {TreeNode} from 'primeng/api';
// import {LogsPageListsComponent} from '../../components/lists/logspagelists/logs.page.lists.component';
import {Location} from '@angular/common';
import {SelectItem} from 'primeng/primeng';
import {
  IonInfiniteScroll,
  IonVirtualScroll,
} from '@ionic/angular';
// import { TreeNode, TreeNode } from '@angular/router/src/utils/tree';

// AccessLog - default order by date
// RequestLogs
// SystemLog
import { FilterService } from '../../services/filter.service';
import {AccountService} from '../../services/user/account.service';
// import {StageDataModalPage} from '../admin/stagedata-modal/stagedata-modal';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
  styleUrls: ['./admin.scss', '../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None,
  providers: [InventoryService, UserService]
})

export class AdminPage implements  OnInit {
    itemCount = 0; // total # of items in query.
    viewType = 'SYSTEMLOG';
    dataTypes: SelectItem[];  //   this.dataTypes.push({ label: 'text a' , value: a });
    pluralType = 'SYSTEMLOGS';
    segment = 'dashboard';
    dataImport:  DataImport[] = [];
    selectedItem: DataImport;
    stagedDataTypes: string[];
    selectedDataType = '';
    treeNodes: TreeNode[];
    files1: TreeNode[];
    showSelectedItem = false;
    processing = false;
    queuedData: any[] = []; // Items added for saving/publishing.
    @ViewChild('lstItems', {static: false}) lstItems: any;
    queryText = '';
    selectedTypeList: any[] = [];
    infinitListEvent: any;
    @ViewChild(IonInfiniteScroll, { static: false })    infiniteScroll: IonInfiniteScroll;
    @ViewChild(IonVirtualScroll, { static: false })    virtualScroll: IonVirtualScroll;
    targetItem: any;
    mergeItem: any;
  constructor(
    public alertCtrl: AlertController,
    public accountService: AccountService,
    private routerLocation: Location,
    private filterService: FilterService,
    public router: Router,
    private session: SessionService,
    private stagedDataService: StagedDataService,
    public messages: Events,
    public modalCtrl: ModalController ) {
    }
   // ui show hosts cbo/search
   // show if has published matches
   // display if published or not



  goBack() {
        console.log('details.page.ts goBack');
        this.routerLocation.back();
       // this.router.navigateByUrl(`tabs/store`);
  }

  isStageItemQueued(uuid: string): boolean {
        let found = false;
        for (let i = 0; i <  this.queuedData.length; i++ ) {
                if (this.queuedData[i].UUID === uuid) {
                   found = true;
                   break;
                }
        }
        return found;
  }

  isValidDate(eventDate: any): boolean {
        const date =  moment( eventDate).local();

        if (date.year() === 1) {
            // console.log('admin.ts isValidDate FALSE date:', date);
            return false;
        }
        // console.log('admin.ts isValidDate TRUE date:', date);
        return true;
  }

  listUpdated(event) {
    console.log('admin.ts listUpdated event:', event);

    // ctlSelectedTypeList
 // if  stageddata and selectedDataType not null
     // load right side with selectedDataType so we can compare
     // the user selected a type from the parent window (admin.html), load the same type
     // of data on the right so we can see if anything matches for a merge. Data on the
     // left is data from stageddata table
     // this.selectedTypeList
    if (ObjectFunctions.isNullOrWhitespace(this.selectedDataType) === true) {
      console.log('admin.ts listUpdated this.selectedDataType is empty, returning');

      return;
    }

    console.log('admin.ts listUpdated calling getallAccouts()');
    this.updateSelectedTypeList(false);

  }
/*
  loadMoreInViewPort(event: any) {
    console.log('posts.component.ts loadMoreInViewPort alpha ');
    this.infinitListEvent = event;
    const index = this.filterService.getFilterIndex(this.viewType);
    let filter = new Filter();
    if (index >= 0) {
      filter = this.filterService.Filters[index];
    }
    filter.PageSize = 50;
    filter.StartIndex =    this.selectedTypeList.length;
    filter.PageResults = true;
    filter.Page++;
    filter.ViewType = this.viewType;
    if (index < 0) {
      this.filterService.addFilter(filter);
    } else {
      this.filterService.setFilter(filter);
    }

    console.log(
      '10. logs.page.lists.component.ts loadMoreInViewPort  updateList'
    );
    this.updateSelectedTypeList(false);
  }
*/
  loadStagedDataTypes() {
    if (ObjectFunctions.isValid(this.stagedDataTypes) === true && this.stagedDataTypes.length > 0) {
      console.log('admin.ts loadStagedDataTypes   using cached.');
      return; }

    this.stagedDataService.getDataTypes()
    .subscribe(response => {

    const data = response as ServiceResult;
    console.log('admin.ts loadStagedDataTypes   data:', data);
    if (data.Code !== 200) {
      this.messages.publish('api:err', data);
      return;

    }
    this.stagedDataTypes = [];
    this.stagedDataTypes = data.Result;
    // for (let i = 0; i < data.Result.length; i++) {      this.stagedDataTypes.push(data.Result[i]);    }

    console.log('admin.ts loadStagedDataTypes   this.stagedDataTypes:', this.stagedDataTypes);

    }, (err) => {
      this.messages.publish('service:err', err);
    });

  }

  loadTypes(type: string, fab: HTMLIonFabElement) {
    this.viewType = type;
    this.itemCount = 0;
    let title = '';
    this.filterService.resetFilter(this.viewType);
      console.log('admin.ts loadTypes this.viewType:', this.viewType);
        fab.close();
    switch (this.viewType) {
          case 'ATTRIBUTE':
            title = 'Attributes';
            this.pluralType = title;
            break;
          case 'SYSTEMLOG':
            title = 'System Logs';
            this.pluralType = title;
            break;
          case 'ACCESSLOG':
            title = 'Access Logs';
            this.pluralType = title;
            break;
          case 'REQUESTLOG':
              title = 'Request Logs';
            this.pluralType = title;
            break;
          case 'STAGEDDATA':
              title = 'Staged Data';
              this.pluralType = title;
              this.loadStagedDataTypes();
            break;
        }
    const filter = new Filter();
    filter.ViewType = this.viewType;
    this.filterService.addFilter(filter);
        console.log('admin.ts loadTypes this.lstItems.updateList this.viewType:', this.viewType);
    this.updateList(true); // , this.filter, this.segment, this.viewType, this.queryText);
  }

  // install "JSTool" from Plugin Manager in Notepad++.
  // from plugins menu select json tool and formant, then sort
  // use beyond compare to merge results
 async mergeItems() {
/*
  // Category
  // WebSite
    const modal = await this.modalCtrl.create({
    component: StageDataModalPage,
    componentProps: {
      mergeItem: JSON.parse( this.mergeItem.StageResults ),
      targetItem: this.targetItem
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    */
  }

  ngOnInit() {
     // this.onSegmentChange(); // load data
  }

  onCboChangeStagedDataType($event) {
    console.log('admin.ts onCboChangeStagedDataType event:' , $event);
    this.filterService.resetFilter(this.viewType);
    this.selectedDataType = $event;
    const screen  = new Screen();
    screen.Field = 'DATATYPE';
    screen.Command = 'SearchBy';
    screen.Value =  $event;
    this.filterService.addScreen(this.viewType, screen);
    this.updateList(true);

  }

  segmentClicked( ) {
    console.log('admin.ts this.segment:', this.segment);
    this.itemCount = 0;

    this.filterService.resetFilter(this.viewType);

    const index = this.filterService.getFilterIndex(this.viewType);
    let filter = new Filter();
    if (index >= 0) {
      filter = this.filterService.Filters[index];
    }

    filter.StartIndex = 0;
    filter.PageResults = true;
    filter.Page++;
    filter.Type = this.viewType;
    filter.ViewType = this.viewType;
    if (index < 0) {
      this.filterService.addFilter(filter);
    } else {
      this.filterService.setFilter(filter);
    }
    // if stageddata set screen to  selectedDataType
    const screen  = new Screen();
   // screen.Field = 'DATATYPE';
    // screen.Command = 'SearchBy';
   // screen.Value =  $event;
   // this.filterService.addScreen(this.viewType, screen);

    console.log('admin.ts segmentClicked  updateList');
    this.updateList(true);
  }

  queueStagedItem( item: any, privateEvent: boolean) {
       console.log('admin.ts queueStagedItem item:', item);
       for (let i = 0; i < this.dataImport.length; i++ ) {
            if (this.dataImport[i].StagedItem.UUID === item.UUID) {
                this.dataImport.splice(i, 1 );
                break;
            }
       }
      item.private = privateEvent;
       this.queuedData.push(item);
  }

   saveStagedItems() {
    this.processing = true;
    this.stagedDataService.publishStagedItems(this.queuedData, this.viewType).subscribe(sessionResponse => {
        this.processing = false;
        const data = sessionResponse as ServiceResult;
        console.log('admin.ts onLogin onSegmentChange.data :', data);
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
            return false;
        }
       // this.dataImport = [];
        this.queuedData = [];

    }, (err) => {
      this.processing = false;
      this.messages.publish('service:err', err);
    });
    //
   }

   selectMergeItem(item: any) {
    console.log('admin.ts selectMergeItem item:', item);
    this.mergeItem = item;
   }

   selectTargetItem(item: any) {
     // reset the currently selected row with the old color.
    if (ObjectFunctions.isValid(this.targetItem) === true) {
      const oldRow = document.getElementById(this.targetItem.UUID);
      oldRow.setAttribute('style', ' color:black;');
    }
    this.targetItem = item;
      console.log('admin.ts selectTargetItem item:', item);
      const button = document.getElementById(item.UUID);
      console.log('admin.ts selectTargetItem button:', button);
      if (ObjectFunctions.isValid(button) === false) {
        return;
      }
      console.log('admin.ts selectTargetItem button:', button);
      // update the newly selected row with highlight colors
      button.setAttribute('style', 'color:red;');
   }
    selectItem(stagedUUID: string) {
        this.showSelectedItem = false;
        console.log('admin.ts selectItem uuid:', stagedUUID);
        for (let i = 0; i <  this.dataImport.length; i++ ) {
            if (this.dataImport[i].StagedItem.UUID === stagedUUID) {
                this.selectedItem = this.dataImport[i];
                console.log('admin.ts selectItem  this.selectedItem:',  this.selectedItem);
                this.showSelectedItem = true;
               break;
            }
        }

    }


    toggleList(fabButton: HTMLIonFabButtonElement, fabList: HTMLIonFabListElement) {
        fabButton.activated = !fabButton.activated;
        fabList.activated = !fabList.activated;
      }

  updateList(resetArray: boolean) {
    if (this.segment === 'dashboard') {
      return;
    }
    this.messages.publish('console:log', 'info', 'admin.ts updateList this.viewType:' + this.viewType);
    console.log('admin.ts updateList this.lstItems:', this.lstItems);

    if (ObjectFunctions.isValid(this.lstItems) === false) {return; }

    this.lstItems.updateList(resetArray, this.segment, this.viewType, this.queryText );
  }

  updateSelectedTypeList(resetArray: boolean  ) {
    // reset before assigning parameters. If not the filters from logs filter won't work
    if (resetArray === true) {
      this.selectedTypeList  = [];
    }
    // Close any open sliding items when the listItems updates


    switch (this.selectedDataType) {
      case 'account':
          const filter = new Filter();
          filter.PageResults = false;
          this.accountService.getAllAccounts(filter).subscribe((response) => {
            console.log('admin.ts listUpdated() response: ', response);
             //   this.loading = false;
                const data = response as ServiceResult;
                if (data.Code !== 200) {
                  this.messages.publish('api:err', data);
                  return;
                }
                this.selectedTypeList = data.Result;
                console.log('admin.ts listUpdated() this.selectedDataType: ', this.selectedDataType);
               // data.Result.forEach(account => {
                //  this.cache.homeItems
                 // this.eventService.Accounts.push(account);

               // });
              });
        break;
    }



  }

/*







Converts a given JSON object into an array
const result = [];
  const keys = Object.keys(json);
  keys.forEach((key) => {
    result.push({ key, value: json[key] });
  });
  return result;


  Object.entries(obj).forEach(
    ([key, value]) => console.log(key, value)
);



for (const key of Object.keys(obj)) {
    console.log(key, obj[key]);
}


for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
}

for (var key of Object.keys(p)) {
    console.log(key + " -> " + p[key])
}

*/
}
