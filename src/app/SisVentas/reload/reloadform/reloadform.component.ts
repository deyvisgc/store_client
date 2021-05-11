import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reloadform',
  templateUrl: './reloadform.component.html',
  styleUrls: ['./reloadform.component.css']
})
export class ReloadformComponent implements OnInit {

  @Input() btnisLoading: boolean;
  constructor() { }
  statusReaload: boolean;
  ngOnInit() {
  }

  showReload() {
    this.btnisLoading = true;
  }
  closeReload() {
    this.btnisLoading = false;
  }

}
