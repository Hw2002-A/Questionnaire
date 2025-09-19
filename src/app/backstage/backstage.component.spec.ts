import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackstageComponent } from './backstage.component';

describe('BackstageComponent', () => {
  let component: BackstageComponent;
  let fixture: ComponentFixture<BackstageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackstageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackstageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
