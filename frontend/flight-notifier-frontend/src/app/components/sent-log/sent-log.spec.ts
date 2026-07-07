import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentLog } from './sent-log';

describe('SentLog', () => {
  let component: SentLog;
  let fixture: ComponentFixture<SentLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentLog],
    }).compileComponents();

    fixture = TestBed.createComponent(SentLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
