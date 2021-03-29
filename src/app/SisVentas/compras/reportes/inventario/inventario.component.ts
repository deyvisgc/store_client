import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from 'src/app/SisVentas/service/compras/compra.service';
import { ReportesService } from 'src/app/SisVentas/service/reportes/reportes.service';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
   filtros = {
    codigo: '',
    nombre: '',
    categoria: '',
    fechaDesde: '',
    fechaHasta: ''
   };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private reporServ: ReportesService) { }

  ngOnInit() {
    this.startScript();
    this.Fetch();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
    $('.categoria').select2({ width: '100%' }).on('change', (event) => {
    });
  }
  Fetch() {
    const vm = this;
    console.log(vm.filtros);
    vm.reporServ.Inventario(vm.filtros).then(res => {
      const rpta = sendRespuesta(res);
      vm.datatable('.table-inventarios', rpta.data);
    }).catch((e) => {
      alert(e);
    }).then(() => {
    }, () => {
    });
  }
  datatable(tabla, datos) {
    const vm = this;
    $(tabla).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
      { data: 'pro_code'},
      {data: 'pro_name' },
      {data: 'clas_name'},
      {data: 'pro_cantidad'},
      {data: 'pro_precio_venta'},
      {data: 'total'},
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Compras',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Compras)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Compras',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Buscar:',
        zeroRecords: 'Sin resultados encontrados',
        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      },
      order: [],
      destroy: true
    });
  }

}
