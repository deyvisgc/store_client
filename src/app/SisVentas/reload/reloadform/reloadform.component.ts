import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reloadform',
  templateUrl: './reloadform.component.html',
  styleUrls: ['./reloadform.component.css']
})
export class ReloadformComponent implements OnInit {
  btnisLoading = false;
  @Input() statusReload: boolean;
  constructor() { }
  statusReaload: boolean;
  ngOnInit() {
    alert(this.statusReload);
  }

  showReload() {
    this.btnisLoading = true;
  }
  closeReload() {
    this.btnisLoading = false;
  }

}
