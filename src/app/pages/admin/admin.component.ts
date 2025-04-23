import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { Cajero, UserData } from '../../interfaz/interfaz';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  nip!: FormGroup;
  loading: boolean = false;
  nipvalidBooleam: boolean = false;
  retiro: boolean = false;
  showNotification: boolean = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';
  total = 0;
  modalVisible: boolean = false;
  cardValide: boolean = false;
  cardNumber:string = '495869150214469068';

  denominaciones = [
    { tipo: 'Billete', valor: 1000 },
    { tipo: 'Billete', valor: 500 },
    { tipo: 'Billete', valor: 200 },
    { tipo: 'Billete', valor: 100 },
    { tipo: 'Billete', valor: 50 },
    { tipo: 'Billete', valor: 20 },
    { tipo: 'Moneda', valor: 10 },
    { tipo: 'Moneda', valor: 5 },
    { tipo: 'Moneda', valor: 2 },
    { tipo: 'Moneda', valor: 1 },
    { tipo: 'Moneda', valor: 0.5 }
  ];
  moneyCajero:string = '0';
  userData!: UserData;
  pdfC: boolean = false;

  constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router
  ){
          this.nip = this.fb.group({
            nip: ['1234', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]{4}$')]],
          });
          let cardNumber = ''
          if (typeof window !== 'undefined') {
            cardNumber = localStorage.getItem('card') || '';
          }
           this.userService.getCajero().subscribe({
                  next: (data: Cajero) => {
                    this.moneyCajero = data.money
                  },
                  error: err => {
                    console.error('Error al obtener el cajero:', err);
                  }
          });
          if (cardNumber) {
            this.userService.getUserByCardNumber(cardNumber).subscribe({
              next: (data: UserData) => {
                this.userData = data;
              },
              error: err => {
                console.error('Error Card:', err);
                // this.showNotification = true;
                // this.notificationMessage = 'Error con tu tarjeta!';
                // this.notificationType = 'error';
                // this.loading = false;
                // setTimeout(() => {
                //   this.showNotification = false;
                // }, 4000);
              }
            });
          }


  }

  onSubmit(){

  }

  nipValid(){
    this.showNotification = true;

    this.notificationMessage = '¡NIP enviado correctamente!';
    this.notificationType = 'success';

    setTimeout(() => {
      this.showNotification = false;
    }, 4000);

    this.nipvalidBooleam = true;

}

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  agregarValor(valor: number) {
    const moneyCajero = parseFloat(this.moneyCajero);
    const saldoUsuario = parseFloat(this.userData.saldo);
    const maxPermitido = Math.min(moneyCajero, saldoUsuario);

    if (this.total + valor <= maxPermitido) {
      this.total += valor;
    } else {
      const disponible = maxPermitido - this.total;
      if (disponible > 0) {
        this.total += disponible;
      }
      console.warn('No se puede agregar más, se alcanzó el límite');
      this.showNotification = true;

      this.notificationMessage = 'No se puede agregar más, se alcanzó el límite';
      this.notificationType = 'info';

      setTimeout(() => {
        this.showNotification = false;
      }, 4000);
    }
  }


  verMonto() {
    this.modalVisible = true;
  }

  cerrarModal(res: string) {
    if (res === 'ok') {
      console.log('Modal finalizó con éxito');
      this.modalVisible = false;
      this.showNotification = true;

      this.notificationMessage = 'Retira tu dinero';
      this.notificationType = 'success';
      this.pdfC = true;

      setTimeout(() => {
        this.showNotification = false;
      }, 4000);

      this.retiro = true;
    }else{
      this.modalVisible = false;
    }

  }
  close() {
    localStorage.removeItem('card');
    localStorage.clear();
    this.router.navigate(['/home']);
  }

    descargar() {
      const doc = new jsPDF();

      const marginX = 20;
      let posY = 20;

      doc.setFillColor(63, 81, 181);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Comprobante', 105, 20, { align: 'center' });

      posY = 40;
      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);

      const userLines = [
        { label: 'Nombre', value: `${this.userData.name} ${this.userData.lastName}` },
        { label: 'Email', value: this.userData.email },
        { label: 'Tarjeta', value: this.userData.card },
        { label: 'Retiro', value: '$'+this.total.toString() },
        { label: 'Saldo disponible', value: `${Number(this.userData.saldo).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}` },
      ];

      userLines.forEach(item => {
        doc.setFont(undefined!, 'bold');
        doc.text(`${item.label}:`, marginX, posY);
        doc.setFont(undefined!, 'normal');
        doc.text(item.value, marginX + 40, posY);
        posY += 10;
      });

      doc.setDrawColor(200);
      doc.line(marginX, posY, 190, posY);
      posY += 15;

      doc.setFontSize(14);
      doc.setTextColor(0, 123, 50);
      doc.setFont(undefined!, 'bold');
      doc.text(`Saldo disponible: ${Number(this.userData.saldo).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`, marginX, posY);

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Documento generado automáticamente.', marginX, 290);

      doc.save('comprobante.pdf');
    }
}
