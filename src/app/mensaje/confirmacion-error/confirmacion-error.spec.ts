import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionError } from './confirmacion-error';

describe('ConfirmacionError', () => {
  let component: ConfirmacionError;
  let fixture: ComponentFixture<ConfirmacionError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
