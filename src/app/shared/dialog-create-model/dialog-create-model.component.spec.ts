import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateModelComponent } from './dialog-create-model.component';

describe('DialogCreateModelComponent', () => {
  let component: DialogCreateModelComponent;
  let fixture: ComponentFixture<DialogCreateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
