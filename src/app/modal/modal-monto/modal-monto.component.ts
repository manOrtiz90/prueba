import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-modal-monto',
  templateUrl: './modal-monto.component.html',
  styleUrl: './modal-monto.component.scss'
})
export class ModalMontoComponent {
  @Input() visible: boolean = false;
  @Input() total: number = 0;
  @Input() cards: string = "";
  @Output() close = new EventEmitter<string>();

  loading: boolean = false;


  constructor(
      private userService: UserService,
    ){

    }

    accept() {
      this.loading = true;

      const data = {
        card: this.cards,
        saldo: this.total.toString()
      };

      this.userService.createCajero(data).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status === 200) {
            this.close.emit('ok');
          }
        },
        error: err => {
          this.loading = false;
          console.error('Error Card:', err);
        }
      });
    }

    cerrar() {
      this.close.emit('close');
    }

}
