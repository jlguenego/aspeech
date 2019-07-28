import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechTestComponent } from './speech-test.component';

describe('SpeechTestComponent', () => {
  let component: SpeechTestComponent;
  let fixture: ComponentFixture<SpeechTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
