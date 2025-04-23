import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit{
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  show = true;

  ngOnInit() {
    // setTimeout(() => {
    //   this.show = false;
    // }, 3000);
  }

}
