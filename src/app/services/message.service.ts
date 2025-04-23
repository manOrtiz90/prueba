import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private message: string = "";

  getMessage() : string {
    return this.message;
  }

  setMessage(message: string) {
    this.message= message;
  }
}
