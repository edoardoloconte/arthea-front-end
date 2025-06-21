import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistForumsComponent } from './artist-forums.component';

describe('ArtistForumsComponent', () => {
  let component: ArtistForumsComponent;
  let fixture: ComponentFixture<ArtistForumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistForumsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistForumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
