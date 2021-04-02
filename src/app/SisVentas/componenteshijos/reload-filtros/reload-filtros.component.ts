import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reload-filtros',
  templateUrl: './reload-filtros.component.html',
  styleUrls: ['./reload-filtros.component.css']
})
export class ReloadFiltrosComponent implements OnInit {
  reload = false;
  constructor() { }

  ngOnInit() {
  }
  showLoading() {
    const vm = this;
    vm.reload = true;
  }
  closeLoading() {
    const vm = this;
    vm.reload = false;
  }

}
