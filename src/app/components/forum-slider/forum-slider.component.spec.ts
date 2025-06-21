import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumSliderComponent } from './forum-slider.component';

describe('ForumSliderComponent', () => {
  let component: ForumSliderComponent;
  let fixture: ComponentFixture<ForumSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
