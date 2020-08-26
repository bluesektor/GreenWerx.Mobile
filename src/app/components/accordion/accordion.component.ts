import { Component, OnInit } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  groups = [];
  shownGroup = '';

  constructor() { }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.groups[i] = {
        name: i,
        items: []
      };
      for (let j = 0; j < 3; j++) {
        this.groups[i].items.push(i + '-' + j);
      }
    }
  }

  toggleGroup(group: string) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }
}


