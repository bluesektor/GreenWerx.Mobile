import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEditPage } from './location-edit.page';

describe('LocationEditPage', () => {
  let component: LocationEditPage;
  let fixture: ComponentFixture<LocationEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
