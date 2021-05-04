import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-cargando-modal',
  templateUrl: './cargando-modal.component.html',
  styleUrls: ['./cargando-modal.component.css']
})
export class CargandoModalComponent implements OnInit {
  messageProceso = '';
  modal;
  constructor() { }

  ngOnInit() {
  }
  openModal(message) {
    const vm = this;
    vm.messageProceso = message;
    $('#isModalTransaccion').modal('show');
  }
   closeModal() {
    $('#isModalTransaccion').modal('hide');
  //   $('#isModalTransaccion').one('shown.bs.modal', function(){
  //     $(this).modal("hide");
  // });
  }
}
