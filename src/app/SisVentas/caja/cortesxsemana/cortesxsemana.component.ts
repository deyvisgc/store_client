import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
declare const sendRespuesta: any;
declare const flatpickr: any;
import iziToast from 'izitoast';
import * as moment from 'moment';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from 'src/app/SisVentas/service/caja/caja.service';
@Component({
  selector: 'app-cortesxsemana',
  templateUrl: './cortesxsemana.component.html',
  styleUrls: ['./cortesxsemana.component.css']
})
export class CortesxsemanaComponent implements OnInit {
  cargandoInformacion = true;
  fechaHasta = moment().format('YYYY-MM-DD');
  fechadesdePrueba = moment().subtract(2, 'd').format('YYYY-MM-DD');
  fechaHastaPrueba = moment().add(2, 'd').format('YYYY-MM-DD');
  fechaDesde = moment().subtract(5, 'd').format('YYYY-MM-DD');
  lunesarray = [];
  horaActual = moment().format('HH:mm');
  horaTermino = moment().add(7, 'hour').format('HH:mm');
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  @ViewChild('lunesComponent', {static: true}) lunesComponent;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private cajaSer: CajaService,private rutaActiva: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    const vm = this;
    await this.dynamicScriptLoader.load('form.min').then(data => {
      flatpickr('.fechaDesde', {
        locale: Spanish,
        defaultDate: [this.fechadesdePrueba]
      });
      flatpickr('.fechaHasta', {
        locale: Spanish,
        defaultDate: [this.fechaHastaPrueba]
      });
      console.log('desde', this.fechaDesde);
      console.log('desde', this.fechadesdePrueba);
      // flatpickr('#horaInicio', {
      //   dateFormat: 'H:i',
      //   enableTime: true,
      //   allowInput: true,
      //   noCalendar: true,
      //   defaultDate : [this.horaActual]
      // });
      // flatpickr('#horaTermino', {
      //   dateFormat: 'H:i',
      //   enableTime: true,
      //   allowInput: true,
      //   noCalendar: true,
      //   defaultDate : [this.horaTermino]
      // });
    }).catch(error => console.log(error));
  }
  SearchCortes() {
    const vm = this;
    const fechas = {
      fechaDesde : vm.fechadesdePrueba,
      fechaHasta : vm.fechaHastaPrueba
    };
    vm.cajaSer.BuscarcortesXFechas(fechas).then(res => {
      const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
      const rpta = sendRespuesta(res);
      rpta.data.forEach((element, index) => {
        const date  = new Date(rpta.data[index].fecha_corte);
        // const fechaNum = date.getUTCDate();
        rpta.data[index].diaSemana = dias[date.getDay()];
      });
      const lunes = rpta.data.filter(l => l.diaSemana === 'Lunes');
      const martes = rpta.data.filter(l => l.diaSemana === 'Martes');
      const miercoles = rpta.data.filter(l => l.diaSemana === 'Miercoles');
      const jueves = rpta.data.filter(l => l.diaSemana === 'Jueves');
      // const viernes = rpta.data.filter(l => l.diaSemana === 'Viernes');
      vm.cajaSer.obtenerCorteLunes(lunes);
      vm.cajaSer.obtenerCorteMartes(martes);
      vm.cajaSer.obtenerCorteMiercoles(miercoles);
      vm.cajaSer.obtenerCorteJueves(jueves);
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      console.log('entro');
    });
  }
}
