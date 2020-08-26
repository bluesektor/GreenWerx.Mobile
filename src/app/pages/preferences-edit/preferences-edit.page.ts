
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services';
import { ServiceResult } from '../../models/serviceresult';
import { NgForm } from '@angular/forms';
 // import {ChangePasswordForm} from './changePassword';
import { Events, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {FileEx} from '../../models/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicValidators } from '../../common/basicValidators';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import {   SessionService } from '../../services/session.service';
import { AttributesService } from '../../services/common/attributes.service';
import {LocationEditPage} from '../location-edit/location-edit.page';
import { EventLocation } from '../../models/location';
import {SelectItem} from 'primeng/primeng';
import { ObjectFunctions } from 'src/app/common/object.functions';
import { AlertController } from '@ionic/angular';
import {RoleService} from '../../services/user/roles.service';
import {Role} from '../../models/role';
import {Filter} from '../../models/filter';
import {Screen} from '../../models/screen';
import { CheckboxModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import {BatchCommand} from '../../models/batchCommand';
import {UserRole} from '../../models/userrole';

@Component({
  selector: 'modal-preferences-edit',
  templateUrl: './preferences-edit.page.html',
  styleUrls: ['./preferences-edit.page.scss', '../../../assets/styles/primeng/primeng.min.css' ],
})

export class PreferencesEditPage implements OnInit {

  availableRoles: Role[] = [];
  blockedRoles: UserRole[] = []; // technically class BlockedRole. todo change to any when done
  loadingBlockedRoles = false;
  showWait = false;
  isAuthorized = false;
  blockOption = 'roles';

  userRoles: Role[] = [];
  roleBatchCommands: BatchCommand[] = [];

  blockedUsers: Role[] = [];

  constructor(
    private route: ActivatedRoute,
    public messages: Events,
    public modalCtrl: ModalController,
    private sessionService: SessionService,
    private attributesService: AttributesService,
    private rolesService: RoleService,
    public router: Router,
    public alertController: AlertController

      ) {
  }

  dismiss() {
    this.modalCtrl.dismiss();  // this.viewCtrl.dismiss();
  }

  // This appears in the top list for blocking roles
  // They are the roles available in the account where category='block'
  loadAvailableRoles() {
    this.loadingBlockedRoles = true;
    this.availableRoles = [];
    // todo FILTER BY accountUUID && Category = 'block' where CategoryRoleName != ''
    const filter = new Filter();
    filter.PageResults = false;
    const screen = new Screen();
    screen.Command = 'SEARCHBY';
    screen.Field = 'CATEGORY';
    //  screen.ParserType = 'sql';
    screen.Value = 'block';
    screen.Type = 'role';

    filter.Screens.push(screen);
    // get from roles table where they have ability to block.
    // this is just the list of whats available, not whats assigned.
    this.rolesService.getRoles(filter).subscribe(data => {
      const response = data as ServiceResult;
      console.log('preferences-edit.page.ts ngOnInit getRoles response:', response);

      if (response.Code !== 200) {
        this.loadingBlockedRoles = false;
        if (response.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
          return false;
        }
        this.messages.publish('api:err' ,  response.Message );
        return false;
      }
      const tmpRoles = response.Result;
      for (let i = 0; i < tmpRoles.length; i++) {
        if (tmpRoles[i].CategoryRoleName !== '') {
          this.availableRoles.push(tmpRoles[i]);
        }
      }
      console.log('preferences-edit.page.ts ngOnInit getRoles this.availableRoles:', this.availableRoles);
      this.loadBlockedRoles();
     }, err => {
      this.showWait = false;

      if (err.status === 401) {
        // this.messages.publish('user:logout');
        return;
      }
      this.messages.publish('service:err' ,  err.statusText );
    });
  }

  // Get roles user blocked from blockedRoles table.
  //
  async loadBlockedRoles() {
    this.loadingBlockedRoles = true;
    this.blockedRoles = [];
    await this.rolesService.getBlockedRoles(null).subscribe(data => {
      const response = data as ServiceResult;
      console.log('preferences-edit.page.ts ngOnInit getloadUserRoles  response:', response);

      if (response.Code !== 200) {
        this.loadingBlockedRoles = false;
        if (response.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
            return false;
        }
           this.messages.publish('api:err' ,  response.Message );
          return false;
      }

      this.blockedRoles = response.Result;
      for (let i = 0; i < this.availableRoles.length; i++) {
        for (let j = 0; j < this.blockedRoles.length; j++) {
          if (this.blockedRoles[j].RoleUUID === this.availableRoles[i].UUID ) {
            this.availableRoles[i].Selected = true;
          }
        }
      }

// todo if target is blank don't add to this.userRoles
     // this.userRoles = response.Result;

      /*    let blankNameIdx = -1;

      if (blankNameIdx >= 0) {
        this.availableRoles.splice(blankNameIdx, 1);
      }
      this.loadingBlockedRoles = false;






  const tmpRoles = response.Result;
     for (let i = 0; i < tmpRoles.length; i++) {
        if (tmpRoles[i].TargetUUID !== '') {
          this.userRoles.push(tmpRoles[i]);
        }
      }
     // this.loadBlockingRoles();

*/
      this.loadingBlockedRoles = false;
     }, err => {
      this.loadingBlockedRoles = false;
      if (err.status === 401) {
        // this.messages.publish('user:logout');
        return;
      }
      this.messages.publish('service:err' ,  err.statusText );
    });
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////


  // Loads all the roles the current user has
  // blocked, including roles and specific users.
  //
  async loadBlockedUsers() {
    console.log('preferences-edit.page.ts ngOnInit loadBlockedUsers');
    this.blockedUsers = [];

   await this.rolesService.getBlockedUsers(null).subscribe(data => {
      const response = data as ServiceResult;
      console.log('preferences-edit.page.ts ngOnInit getBlockedUsers response:', response);

      if (response.Code !== 200) {
        console.log('preferences-edit.page.ts ngOnInit getBlockedUsers response.Code !== 200');
        this.showWait = false;
        if (response.Code === 401) {
          console.log('preferences-edit.page.ts ngOnInit getBlockedUsers response.Code !== 401');
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
            return false;
        }
           this.messages.publish('api:err' ,  response.Message );
          return false;
      }
      console.log('preferences-edit.page.ts ngOnInit getBlockedUsers response.Result:', response.Result);
      this.blockedUsers = response.Result;

      console.log('preferences-edit.page.ts ngOnInit getBlockedUsersthis.blockedUsers:', this.blockedUsers);
     }, err => {
      this.showWait = false;

      if (err.status === 401) {
        // this.messages.publish('user:logout');
        return;
      }
      this.messages.publish('service:err' ,  err.statusText );
    });
  }

  ngOnInit() {
    this.loadAvailableRoles();
    this.loadBlockedUsers();

  }

  onEditBlockedRole(event: any, roleUUID: string, isSelected: boolean) {
    console.log('preferences-edit.page.ts onEditRole roleUUID', roleUUID);
    console.log('preferences-edit.page.ts onEditRole event', event);
    let cmd = 'add';
    if (isSelected === false) {
      cmd = 'remove';
    }

    const command = new BatchCommand();
    command.Command = cmd;
    command.UUID = roleUUID;

    if (this.roleBatchCommands.length === 0) {
      this.roleBatchCommands.push(command);
      console.log('preferences-edit.page.ts onEditRole this.roleBatchCommands', this.roleBatchCommands);
      return;
    }
    let foundIdx = -1;
    for (let i = 0; i < this.roleBatchCommands.length; i++) {
      if (this.roleBatchCommands[i].UUID === roleUUID) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx >= 0) {
      this.roleBatchCommands[foundIdx].Command = cmd;
    } else {
      this.roleBatchCommands.push(command);
    }
    console.log('preferences-edit.page.ts onEditRole this.roleBatchCommands', this.roleBatchCommands);
  }


  onSelectBlockOption(event) {
    console.log('preferences.edit.page.ts onSelectBlockOption event:', event);
    this.blockOption = event;
    /*
    switch (this.supportOption) {
      case 'sendMessage':
        this.showSupportQuestion = true;
        break;
      default:
        this.showSupportQuestion = false;
        break;
    }
    */
  }


  async  onUnblockUser(userRole: any) {
    console.log('onUnblockUser item:', userRole);
    // removeUserFromRole(roleUUID: string, userUUID: string) {
      await this.rolesService.deleteBlockedUser(userRole.TargetUUID).subscribe(data => {
          // .removeUserFromRole(userRole.RoleUUID, userRole.ReferenceUUID ).subscribe(data => {
        const response = data as ServiceResult;
        console.log('preferences-edit.page.ts onUnblockUser  response:', response);

        if (response.Code === 401) {
          this.isAuthorized = false;
          this.showWait = false;
          // this.messages.publish('user:logout');
            return false;
        }

        if (response.Code !== 200) {
          this.showWait = false;
             this.messages.publish('api:err' ,  response.Message );
            return false;
        }

        this.loadBlockedUsers();

       }, err => {
        this.showWait = false;

        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err' ,  err.statusText );
      });
  }

  async updateBlockedRoles() {
    this.showWait = true;
    await this.rolesService.updateBlockedRoles(this.roleBatchCommands).subscribe(data => {
      const response = data as ServiceResult;
      console.log('preferences-edit.page.ts ngOnInit saveUserRoles  response:', response);

      if (response.Code === 401) {
        this.isAuthorized = false;
        this.showWait = false;
        // this.messages.publish('user:logout');
          return false;
      }

      if (response.Code !== 200) {
        this.showWait = false;
           this.messages.publish('api:err' ,  response.Message );
          return false;
      }
      this.showWait = false;
      this.loadBlockedRoles();

     }, err => {
      this.showWait = false;

      if (err.status === 401) {
        // this.messages.publish('user:logout');
        return;
      }
      this.messages.publish('service:err' ,  err.statusText );
    });
  }


}
