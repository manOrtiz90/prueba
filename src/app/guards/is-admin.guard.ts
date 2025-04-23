import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const userService = inject(UserService);
  const router = inject(Router);
  const messageService = inject(MessageService);


  let cardNumber = ''
  if (typeof window !== 'undefined') {
    cardNumber = localStorage.getItem('card') || '';
  }


  if (!cardNumber) {
    messageService.setMessage("No hay tarjeta registrada");
    router.navigate(['home']);
    return false;
  }

  return userService.getUserByCardNumber(cardNumber).pipe(
    map(data => {
      if (data && data.name) {
        return true;
      } else {
        messageService.setMessage("Usuario no válido");
        router.navigate(['home']);
        return false;
      }
    })
  );
};
