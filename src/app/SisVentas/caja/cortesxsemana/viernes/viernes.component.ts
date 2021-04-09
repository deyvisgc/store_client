import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CajaService } from 'src/app/SisVentas/service/caja/caja.service';
declare const $: any;
declare const sendRespuesta: any;
import _ from 'lodash';
@Component({
  selector: 'app-viernes',
  templateUrl: './viernes.component.html',
  styleUrls: ['./viernes.component.css']
})
export class ViernesComponent implements OnInit {
  @Output() corteSemanal = new EventEmitter<any>();
  monedasarray: any = [];
  billetesarray: any = [];
  cajaAdd = [];
  totalMonedas = '';
  totalBilletes = '';
  sumMonedas = 0;
  sumBilletes = 0;
  totalCobrado = '';
  sum = 0;
  saldoInicio = 0;
  total = 0;
  totalAentregar = '';
  monedas = [
    {
    descripcion: 'S/ 0.10',
    valor: 0.10,
    cantidad : 0,
    subtotal : 0,
    type_money: 1
    },
    {
     descripcion: 'S/ 0.20',
     valor: 0.20,
     cantidad : 0,
     subtotal : 0,
     type_money: 1
    },
    {
    descripcion: 'S/ 0.50',
     valor: 0.50,
     cantidad : 0,
     subtotal : 0,
     type_money: 1
    },
    {
     descripcion: 'S/ 1.00',
     valor: 1.00,
     cantidad : 0,
     subtotal : 0,
     type_money: 1
    },
    {
     descripcion: 'S/ 2.00',
     valor: 2.00,
     cantidad : 0,
     subtotal : 0,
     type_money: 1
    },
    {
     descripcion: 'S/ 5.00',
     valor: 5.00,
     cantidad : 0,
     subtotal : 0,
     type_money: 1
    },

  ];
  billetes = [
   {
   valor: 10.00,
   descripcion : 'S/ 10.00',
   cantidad : 0,
   subtotal : 0,
   type_money: 2
   },
   {
    valor: 20.00,
    descripcion : 'S/ 20.00',
    cantidad : 0,
    subtotal : 0,
    type_money: 2
   },
   {
    valor: 50.00,
    descripcion : 'S/ 50.00',
    cantidad : 0,
    subtotal : 0,
    type_money: 2
   },
   {
    valor: 100.00,
    descripcion : 'S/ 100.00',
    cantidad : 0,
    subtotal : 0,
    type_money: 2
   },
   {
    valor: 200.00,
    descripcion : 'S/ 200.00',
    cantidad : 0,
    subtotal : 0,
    type_money: 2
   }
  ];

  constructor(private cajaSer: CajaService, private rutaActiva: ActivatedRoute) { }

  ngOnInit() {
    this.obtenerSaldoInicio();
    this.limpiar();
    this.obtenerDataLocalStorage();
  }
  calcularMonedas(event, mo, index) {
   const vm = this;
   const total = vm.calcular(event, mo, index);
   vm.sumMonedas = total;
   vm.totalMonedas = parseFloat(total).toFixed(2);
   localStorage.setItem('monedas', JSON.stringify(vm.monedas));
   localStorage.setItem('totalMonedas', JSON.stringify(vm.totalMonedas));
   vm.calcularTotales();
  }
  calcularBilletes(event, bille, index) {
    const vm = this;
    const total = vm.calcular(event, bille, index);
    vm.sumBilletes = total;
    vm.totalBilletes = parseFloat(total).toFixed(2);
    localStorage.setItem('billetes', JSON.stringify(vm.billetes));
    localStorage.setItem('totalBilletes', JSON.stringify(vm.totalBilletes));
    vm.calcularTotales();
  }
  calcular(event, typeMoney, index) {
    typeMoney[index].cantidad = event.target.value;
    const subtotal = typeMoney[index].valor * event.target.value;
    typeMoney[index].subtotal = _.round(subtotal, 2);
    return _.sumBy(typeMoney, 'subtotal');
  }
  calcularTotales() {
    const vm = this;
    vm.totalCobrado = (vm.sumBilletes + vm.sumMonedas).toFixed(2);
    const cobrado = vm.sumBilletes + vm.sumMonedas;
    vm.totalAentregar = (Number(vm.saldoInicio) + (cobrado)).toFixed(2);
    localStorage.setItem('totalCobrado', vm.totalCobrado);
    localStorage.setItem('totalAentregar', vm.totalAentregar);
  }
  obtenerSaldoInicio() {
    const vm = this;
    vm.cajaSer.ObtenerSaldoInicial(vm.rutaActiva.snapshot.params.idCaja).then(res => {
    const rpta = sendRespuesta(res);
    if (rpta.status) {
      vm.saldoInicio =  rpta.data[0].saldoInicial;
    } else {
    }
    }).catch((err) => {

    }).then(() => {
    }, () => {
      console.log('error');
    });
  }
  SumarTotales() {
    const vm = this;
    const corteSemana = {
      monedas: vm.monedas,
      billetes: vm.billetes,
      saldoInicial : vm.saldoInicio,
      totalCobrado: vm.totalCobrado,
      montoTotalIngresado: vm.totalAentregar,
      totalMonedas : vm.totalMonedas,
      totalBilletes : vm.totalBilletes
    };
    vm.corteSemanal.emit(corteSemana);
  }
  obtenerDataLocalStorage() {
    const vm = this;
    const monedaslocalstorage = localStorage.getItem('monedas');
    const billeteslocalstorage = localStorage.getItem('billetes');
    // tslint:disable-next-line:max-line-length
    if (JSON.parse(monedaslocalstorage) === undefined  || JSON.parse(monedaslocalstorage) === null  || JSON.parse(monedaslocalstorage) === '') {
     vm.monedas = vm.monedas;
     return;
    }
    vm.monedas = JSON.parse(monedaslocalstorage);
    const monedas = localStorage.getItem('totalMonedas').replace(/['"]+/g, '');
    vm.totalMonedas = monedas;

    // tslint:disable-next-line:max-line-length
    if (JSON.parse(billeteslocalstorage) === undefined  || JSON.parse(billeteslocalstorage) === null  || JSON.parse(billeteslocalstorage) === '') {
      vm.billetes = vm.billetes;
      return;
    }
    vm.billetes = JSON.parse(billeteslocalstorage);
    const billetes = localStorage.getItem('totalBilletes').replace(/['"]+/g, '');
    const totalCobrado = localStorage.getItem('totalCobrado').replace(/['"]+/g, '');
    const totalAentregar = localStorage.getItem('totalAentregar').replace(/['"]+/g, '');
    vm.totalBilletes = billetes;
    vm.totalCobrado = totalCobrado;
    vm.totalAentregar = totalAentregar;
  }
  limpiar() {
    const vm = this;
    vm.cajaSer.viernesrrayObs$.subscribe(res  => {
      if (res) {
       const listas = vm.BorrarListas();
       vm.monedas = listas.monedas;
       vm.billetes = listas.billetes;
       vm.totalMonedas = '';
       vm.totalBilletes = '';
       vm.totalCobrado = '';
       vm.saldoInicio = 0;
       vm.totalAentregar = '';
      }
    });
  }
  BorrarListas() {
   const  monedas = [
      {
      descripcion: 'S/ 0.10',
      valor: 0.10,
      cantidad : 0,
      subtotal : 0,
      type_money: 1
      },
      {
       descripcion: 'S/ 0.20',
       valor: 0.20,
       cantidad : 0,
       subtotal : 0,
       type_money: 1
      },
      {
      descripcion: 'S/ 0.50',
       valor: 0.50,
       cantidad : 0,
       subtotal : 0,
       type_money: 1
      },
      {
       descripcion: 'S/ 1.00',
       valor: 1.00,
       cantidad : 0,
       subtotal : 0,
       type_money: 1
      },
      {
       descripcion: 'S/ 2.00',
       valor: 2.00,
       cantidad : 0,
       subtotal : 0,
       type_money: 1
      },
      {
       descripcion: 'S/ 5.00',
       valor: 5.00,
       cantidad : 0,
       subtotal : 0,
       type_money: 1
      },
  
    ];
   const   billetes = [
     {
     valor: 10.00,
     descripcion : 'S/ 10.00',
     cantidad : 0,
     subtotal : 0,
     type_money: 2
     },
     {
      valor: 20.00,
      descripcion : 'S/ 20.00',
      cantidad : 0,
      subtotal : 0,
      type_money: 2
     },
     {
      valor: 50.00,
      descripcion : 'S/ 50.00',
      cantidad : 0,
      subtotal : 0,
      type_money: 2
     },
     {
      valor: 100.00,
      descripcion : 'S/ 100.00',
      cantidad : 0,
      subtotal : 0,
      type_money: 2
     },
     {
      valor: 200.00,
      descripcion : 'S/ 200.00',
      cantidad : 0,
      subtotal : 0,
      type_money: 2
     }
    ];
   return {
     monedas,
     billetes
   };
  }
}
