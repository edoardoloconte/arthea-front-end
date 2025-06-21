import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSliderComponent } from './card-slider.component';

describe('ProvaComponent', () => {
  let component: CardSliderComponent;
  let fixture: ComponentFixture<CardSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
