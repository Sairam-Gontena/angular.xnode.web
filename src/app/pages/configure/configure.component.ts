import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  ngOnInit(): void {
    localStorage.setItem('currentUser', String(true));
  }
}
