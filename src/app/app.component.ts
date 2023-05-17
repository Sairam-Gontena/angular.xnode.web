import { Component } from '@angular/core';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'xnode';

  isUserExists() {
    return Boolean(localStorage.getItem('currentUser'));
  }
}
