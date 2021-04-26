import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reloadform',
  templateUrl: './reloadform.component.html',
  styleUrls: ['./reloadform.component.css']
})
export class ReloadformComponent implements OnInit {
  btnisLoading = false;
  constructor() { }

  ngOnInit() {
  }

  showReload() {
    this.btnisLoading = true;
  }
  closeReload() {
    this.btnisLoading = false;
  }

}
