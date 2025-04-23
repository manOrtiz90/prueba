import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMontoComponent } from './modal-monto.component';

describe('ModalMontoComponent', () => {
  let component: ModalMontoComponent;
  let fixture: ComponentFixture<ModalMontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMontoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalMontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
