import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
/*
import {CommunityPage} from '../community/community.page';
import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { AdminPage } from '../admin/admin';
import {EventEditPage} from '../event-edit/event-edit';
import { DetailsPage } from '../details/details.page';
import { StorePage } from '../store/store.page';
*/
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'store',
        children: [
          {
            path: '',
            loadChildren: '../store/store.module#StorePageModule'
          }
        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: '../events/events.module#EventsPageModule'
          }
        ]
      },
      {
        path: 'details/:type/:uuid',
        loadChildren: '../details/details.module#DetailsPageModule'
      },
      {
        path: 'edit/:uuid',
        loadChildren: '../event-edit/event-edit.module#EventEditModule',
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: '../map/map.module#MapModule'
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: '../about/about.module#AboutModule'
          }
        ]
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            loadChildren: '../community/community.module#CommunityPageModule'
          }
        ]
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: '../messages/messages.module#MessagesPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/store',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/store',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
