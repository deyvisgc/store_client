import { Component, OnInit } from '@angular/core';
import { CajaService } from 'src/app/SisVentas/service/caja/caja.service';
declare const $: any;
@Component({
  selector: 'app-miercoles',
  templateUrl: './miercoles.component.html',
  styleUrls: ['./miercoles.component.css']
})
export class MiercolesComponent implements OnInit {
  listMonedas: any = [];
  listBilletes: any = [];
  totalMonedas = '';
  totalBilletes = '';
  constructor(private cajaSer: CajaService) { }

  ngOnInit() {
    this.Fecth();
  }
  Fecth() {
    const vm = this;
    vm.cajaSer.MiercolesrrayObs$.subscribe((res: any = []) => {
      const arrayMonedas = res.filter( m => m.dcc_type_money === 1);
      const arrayBilletes = res.filter( m => m.dcc_type_money === 2);
      vm.listMonedas = arrayMonedas;
      vm.listBilletes = arrayBilletes;
      let totalesmonedas = 0;
      arrayMonedas.map((x, index) => {
        totalesmonedas += parseFloat(arrayMonedas[index].dcc_total);
      });
      vm.totalMonedas = totalesmonedas.toFixed(2);
      let totalesBilltes = 0;
      arrayMonedas.map((x, index) => {
        totalesBilltes += parseFloat(arrayBilletes[index].dcc_total);
      });
      vm.totalBilletes = totalesBilltes.toFixed(2);
    });
  }
}
