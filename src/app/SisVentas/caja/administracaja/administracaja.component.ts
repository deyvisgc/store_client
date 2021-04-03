import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administracaja',
  templateUrl: './administracaja.component.html',
  styleUrls: ['./administracaja.component.css']
})
export class AdministracajaComponent implements OnInit {
  subtotales = {
    montoInicial: '',
    ingresos: '',
    devoluciones: '',
    gastos: '',
  };
  totales = {
    InggresosmostInicial: '',
    GastosmostDevoluciones: '',
    total: '',
  };
  constructor() { }
  estadoCaja = false;
  ngOnInit() {
  }

}
