import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePwDialogComponent } from './change-pw-dialog.component';

describe('ChangePwDialogComponent', () => {
  let component: ChangePwDialogComponent;
  let fixture: ComponentFixture<ChangePwDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePwDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePwDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
