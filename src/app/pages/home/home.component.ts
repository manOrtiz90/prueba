import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { UserData } from '../../interfaz/interfaz';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  card!: FormGroup;
  loading: boolean = false;
  userData!: UserData;
  cardValide: boolean = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';
  showNotification: boolean = false;
  userForm: FormGroup;
  user: boolean = false;
  numberCard = '';

  constructor(
    private fb: FormBuilder,
     private userService: UserService,
     private router: Router
  ){
    this.card = this.fb.group({
      card: ['495869150214469068', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern('^[0-9]{18}$')]],
    });
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

    onSubmit() {
      if (this.card.valid) {
        this.loading = true;
        this.userService.getUserByCardNumber(this.card.value.card).subscribe({
          next: (data: UserData) => {
            this.userData = data;
            this.cardValide = true;
            this.loading = false;
            this.router.navigate(['/admin']);
            localStorage.setItem('card', this.card.value.card);


          },
          error: err => {
            console.error('Error Card:', err);
            this.showNotification = true;
            this.notificationMessage = 'Error con tu tarjeta!';
            this.notificationType = 'error';
            this.loading = false;
            setTimeout(() => {
              this.showNotification = false;
            }, 4000);
          }
        });

      } else {
        console.log('Formulario inválido');
      }
    }

    numberOnly(event: any): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    onSubmitTwo(): void {
      console.log(this.userForm.value);

      if (this.userForm.valid) {
        const userData = this.userForm.value;
        this.loading = true;
        this.userService.createUser(userData).subscribe({
          next: (response: HttpResponse<any>) => {
            // console.log('Usuario creado con éxito:', response);
            // alert('Usuario creado con éxito');
            this.numberCard = response.body.card
            this.showNotification = true;
            this.notificationMessage = 'Usuario creado con éxito';
            this.notificationType = 'success';
            this.loading = false;
            this.user = false;
            setTimeout(() => {
              this.showNotification = false;
            }, 4000);
            this.userForm.reset();
          },
          error: (err) => {
            console.error('Error al crear usuario:', err);
            alert('Hubo un error al crear el usuario');
            this.showNotification = true;
            this.notificationMessage = 'Hubo un error al crear el usuario';
            this.notificationType = 'error';
            this.loading = false;
            setTimeout(() => {
              this.showNotification = false;
            }, 4000);
          }
        });
      }
    }

    formData(){
      this.user = true;
    }
}
