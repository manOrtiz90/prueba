import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cajero, UserData } from '../interfaz/interfaz';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users = new BehaviorSubject<User[]>([]);
  currentUsers = this.users.asObservable();
  private apiUrl = 'https://operationsboomserviceapi20250319083037.azurewebsites.net/user';

  constructor(private http: HttpClient) {
  }



  setCurrentUsers(newUsers: User[]) {
    this.users.next(newUsers);
  }

  getUserByCardNumber(cardNumber: string): Observable<UserData> {
    const url = `${this.apiUrl}/${cardNumber}`;
    return this.http.get<UserData>(url);
  }

  getCajero(): Observable<Cajero> {
    return this.http.get<Cajero>(`${this.apiUrl}/Cajero`);
  }

  createCajero(data: { card: string, saldo: string }) {
    return this.http.post(`${this.apiUrl}/create-cajero`, data, {
      observe: 'response'
    });
  }

  createUser(data: { name: string; lastName: string; email: string }) {
    return this.http.post(`${this.apiUrl}/createUser`, data, {
      observe: 'response'
    });
  }
}
