import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesEditPage } from './preferences-edit.page';

describe('PreferencesEditPage', () => {
  let component: PreferencesEditPage;
  let fixture: ComponentFixture<PreferencesEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
