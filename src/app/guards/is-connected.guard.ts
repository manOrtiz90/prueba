import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { MessageService } from '../services/message.service';

export const isConnectedGuard: CanActivateFn = (
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
    messageService.setMessage("No se encontró número de tarjeta.");
    router.navigate(['home']);
    return false;
  }

  return userService.getUserByCardNumber(cardNumber).pipe(
    map(data => {
      if (data) {
        if (data.email === "anonymous") {
          messageService.setMessage("home");
          return false;
        } else {
          messageService.setMessage("");
          return true;
        }
      } else {
        messageService.setMessage("f");
        router.navigate(['home']);
        return false;
      }
    })
  );
};

