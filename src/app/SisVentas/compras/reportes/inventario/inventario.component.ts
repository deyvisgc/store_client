import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from 'src/app/SisVentas/service/compras/compra.service';
import { ReportesService } from 'src/app/SisVentas/service/reportes/reportes.service';
import * as html2pdf from 'html2pdf.js';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  @ViewChild('cargandoModal', {static: true}) cargandoModal;
  @ViewChild('isloading', {static: true}) isloading;
  exportar = false;
  selectCategoria = [];
  cargandoInformacion = false;
  messageProceso = '';
  isProcessingRequest = false;
   filtros = {
    codigo: '',
    nombre: '',
    categoria: ''
   };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private reporServ: ReportesService) { }

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
      vm.filtros.categoria = event.target.value;
      vm.Fetch();
    });
  }
  Fetch() {
    const vm = this;
    // vm.messageProceso = 'Cargando lista';
    // vm.isloading.openModal(vm.messageProceso);
    vm.isloading.showLoading();
    vm.reporServ.Inventario(vm.filtros).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.data.categoria.length > 0) { vm.selectCategoria = rpta.data.categoria; }
      vm.datatable('.table-inventarios', rpta.data.lista);
    }).catch((e) => {
      alert(e);
    }).then(() => {
      vm.isloading.closeLoading();
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
  PDF() {
    const vm = this;
    vm.reporServ.pdf().subscribe(data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'})
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Pdf${((new Date()).getTime())}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  reporte() {
    this.reporServ.probando().then(res => {
      console.log(res);
    });
  }
  inventarioExcel() {
    const vm = this;
    vm.cargandoInformacion = true;
    vm.isloading.showLoading();
    vm.reporServ.ExportarExcelInventario(vm.filtros).subscribe(data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'});
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Reporte_Inventario${((new Date()).getTime())}.xlsx`;
      vm.cargandoInformacion = false;
      vm.isloading.closeLoading();
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  Actualizar() {
    const vm = this;
    vm.filtros.categoria = '';
    vm.filtros.codigo = '';
    vm.filtros.nombre = '';
    this.Fetch();
  }
//   dowloadPdf() {
//     const options = {
//       margin: 1,
//       filename: 'Reporte-inventario.pdf',
//       Image: {type: 'jpeg', quality: 0.98},
//       html2canvas: {scale: 2 },
//       jsPDF: {unit: 'mm', format: 'government-letter', orientation: 'portrait', floatPrecision: 16 }
//     };
//     const element: Element = document.getElementById('pdf');
//     html2pdf()
//        .from(element)
//        .set(options)
//        .save();

//  }
}
