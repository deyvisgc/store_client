import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import swal from 'sweetalert2';
import iziToast from 'izitoast';
declare const $: any;
declare const datatable: any;
@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {
  form: FormGroup;
  clasesupe: [];
  enabled: boolean;
  categoria: '';
  loading: boolean;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private fb: FormBuilder, public almacenServ: AlmacenService ) { 
    this.form = this.fb.group({
      Cla_nombre: [''],
      clase_superior: [''],
      accion: [''],
      clasePadre : [''],
      clasehijo : [''],
      idclase : ['']
    });
  }
  ngOnInit() {
    this.startScript();
    this.loading = false;
    $('body').on('hidden.bs.modal', '.modal', () => {
      $('#clasePadre').empty();
      $('#clasehijo').empty();
    });
  }
  private loadData() {
    $('#clase_superior').select2().on('change', (event) => {
    });
    $('.searchclasepadre').select2().on('change', (event) => {
      this.filtarxclasepadre(event.target.value);
    });
    $('.searchclasepadre').select2({ width: '100%' });
    $('.clase_superior').select2({ width: '100%' });
    $('.clasePadre').select2({ width: '100%' });
    $('.clasehijo').select2({ width: '100%' });
    this.getclasesupe();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
      this.Listar();
    }).catch(error => console.log(error));
  }
  Registrar() {
    let clasesupe = document.getElementById('clase_superior')['value'];
    this.form.controls.clase_superior.setValue(clasesupe);
    this.almacenServ.RegistraClase(this.form.value).subscribe(res => {
      if (res === true) {
        $('#modalRegistrar').modal('hide');
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: 'Categoria Registrada',
      });
        this.Listar();
        this.form.controls.Cla_nombre.setValue('');
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Error al Registrar',
      });
      }
      console.log(res);
    });
  }
  getclasesupe() {
    this.almacenServ.getClaseSupe().subscribe((res: any = []) => {
      this.clasesupe = res;
    });
  }
  Listar() {
    this.almacenServ.getClaserecursiva().subscribe((res: any = []) => {
      // tslint:disable-next-line:align
      const colum = this.column();
      const colum1 = this.column1();
      if (res['categorias'].length > 0 || res['padreehijos'].length > 0) {
       const cateactiva = res['categorias'].filter(f => f.clas_status === 'active');
       const catedesact = res['categorias'].filter(f => f.clas_status === 'disable');
       const cateactipadreehijo = res['padreehijos'].filter(f => f.statushijo === 'active');
       const catedesacpadreehijo = res['padreehijos'].filter(f => f.statushijo === 'disable');
       this.datatable('.tbcategory', cateactiva, colum1);
       this.datatable('.tbpclase', cateactipadreehijo, colum);

       this.datatable('.tbcategoriadesac', catedesact, colum1);
       this.datatable('.tbpclasedesacti', catedesacpadreehijo, colum);
      } else {
        this.datatable('.tbpclase', res['padreehijos'], colum);
        this.datatable('.tbcategory', res['categorias'], colum1);
        this.datatable('.tbcategoriadesac', res['padreehijos'], colum1);
        this.datatable('.tbpclasedesacti', res['categorias'], colum );
      }
    });
  }
  column() {
    const colum = [
      { data: 'clasepadre' },
      { data: 'clasehijo' },
      { data: 'statushijo' ,
      render(data, type, row) {
        if (row.statushijo === 'active') {
          return '<span _ngcontent-uwn-c151="" class="badge bg-green">Activo</span>';
        } else {
          return '<span _ngcontent-uwn-c151="" class="badge bg-red">Disable</span>';
        }
      }
      },
      { data: 'statushijo' ,
      render(data, type, row) {
        // tslint:disable-next-line:max-line-length
        const btn = '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR"  class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>';
        if (row.statushijo === 'active') {
          // tslint:disable-next-line:max-line-length
          return ( btn + '<button _ngcontent-xkn-c6=""  title="DESACTIVAR"  class="btn bg-red btn-circle  waves-effect waves-circle waves-float changestatsuclaserecursiva" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-frown"></i></button>');
        } else {
          // tslint:disable-next-line:max-line-length
          return ( btn + '<button _ngcontent-xkn-c6=""  title="ACTIVAR"  class="btn btn-success btn-circle  waves-effect waves-circle waves-float changestatsuclaserecursiva" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-grin-beam"></i></button>');
        }
      }
      },
    ];
    return colum;
  }
  column1() {
    const colum = [
      { data: 'clas_name' },
      { data: 'clas_status' ,
      render(data, type, row) {
        if (row.clas_status === 'active') {
          return '<span _ngcontent-uwn-c151="" class="badge bg-green">Activo</span>';
        } else {
          return '<span _ngcontent-uwn-c151="" class="badge bg-red">Disable</span>';
        }
      }
      },
      { data: 'clas_status' ,
      render(data, type, row) {
        // tslint:disable-next-line:max-line-length
        const btn = '<button _ngcontent-xkn-c6=""  title="Ver SUBCATEGORIAS"  class="btn btn-info btn-circle  waves-effect waves-circle waves-float view" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-eye"></i></button>';
        // tslint:disable-next-line:max-line-length
        const btn1 = '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR"  class="btn bg-green btn-circle  waves-effect waves-circle waves-float editarcate" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>'
        if (row.clas_status === 'active') {
          // tslint:disable-next-line:max-line-length
          return ( btn + btn1 + '<button _ngcontent-xkn-c6=""  title="DESACTIVAR"  class="btn bg-red btn-circle  waves-effect waves-circle waves-float changestatus" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-frown"></i></button>');
        } else {
          // tslint:disable-next-line:max-line-length
          return ( btn + btn1 + '<button _ngcontent-xkn-c6=""  title="ACTIVAR"  class="btn btn-success btn-circle  waves-effect waves-circle waves-float changestatus" type="button"  style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-grin-beam"></i></button>');
        }
      }
      },
    ];
    return colum;
  }
   datatable(tabla, datos, column) {
    $(tabla).DataTable({
      data: datos,
      columns: column,
      responsive: true,
      rowCallback: ( row, data ) => {
        $('.edit', row).bind('click', () => {
          this.edit(data);
        });
        $('.view', row).bind('click', () => {
          this.viewcate(data);
        });
        $('.editarcate', row).bind('click', () => {
          $('#updatecate').modal('show');
          this.form.controls.Cla_nombre.setValue(data.clas_name);
          this.form.controls.idclase.setValue(data.id_clase_producto);
        });
        $('.changestatus', row).bind('click', () => {
          this.changestatus(data);
        });
        $('.changestatsuclaserecursiva', row).bind('click', () => {
          this.changestatsuclaserecursiva(data);
        });
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Categorias',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        infoPostFix: "",
        thousands: ",",
        lengthMenu: 'Mostrar _MENU_ Entradas',
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
  edit(data) {
    const datos = [data];
    this.almacenServ.ObtenerclasPadreYhijo(data.idpadre).subscribe((res: any = []) => {
      $('#modaledit').modal('show');
      datos.forEach((d, i) => {
        res['padres'].forEach((pa) => {
          if (d.idpadre === pa.id_clase_producto) {
            $('#clasePadre').append('<option value=' + pa.id_clase_producto + '  selected >' + pa.clasepadre + '</option>');
          } else {
            $('#clasePadre').append('<option value=' + pa.id_clase_producto + '  >' + pa.clasepadre + '</option>');
          }
        });
        res['hijos'].forEach((hi) => {
          if (d.idhijo === hi.id_clase_producto) {
            $('#clasehijo').append('<option value=' + hi.id_clase_producto + '  selected >' + hi.clasehijo + '</option>');
          } else {
            $('#clasehijo').append('<option value=' + hi.id_clase_producto + '  >' + hi.clasehijo + '</option>');
          }
        });
      });
      console.log(datos);
    });
  }
  Actualizar() {
  //  this.enabled = false;
   const clasepadre = document.getElementById('clasePadre')['value'];
   const clasehijo = document.getElementById('clasehijo')['value']
   this.form.controls.clasePadre.setValue(clasepadre);
   this.form.controls.clasehijo.setValue(clasehijo);
   this.almacenServ.ActualizarclasPadreYhijo(this.form.value).subscribe(res => {
     if (res['status'] === true) {
      $('#modaledit').modal('hide');
      iziToast.success({
        title: 'OK',
        position: 'topRight',
        message: res['message'],
    });
      this.Listar();
      this.form.controls.accion.setValue('');
     } else {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: res['message'],
    });
     }
   });
  }
  viewcate(data) {
    this.almacenServ.ViewDetalleHijos(data.id_clase_producto).subscribe((res: any = []) => {
      const colum = [ { data: 'clasehijo' }];
      if (res.length > 0) {
        this.categoria = data.clas_name;
        $('#viewdetalle').modal('show');
        this.datatable('.subcate', res, colum);
      } else {
        this.datatable('.subcate', res, colum);
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'No existen subcategorias para esta categoria',
      });
      }
    });
  }
  ActualizarCate() {
    this.almacenServ.ActualizarCate(this.form.value).subscribe(res => {
      if (res['status'] === true) {
        $('#updatecate').modal('hide');
        this.form.controls.Cla_nombre.setValue('');
        this.form.controls.idclase.setValue('');
        this.Listar();
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
      });
      } else {
        $('#updatecate').modal('hide');
        this.form.controls.Cla_nombre.setValue('');
        this.form.controls.idclase.setValue('');
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
      });
      }
    });
  }
  changestatus(data) {
    this.almacenServ.ChangestatusCate(data).subscribe( res => {
      if (res['status'] === true) {
        this.Listar();
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
      });
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
      });
      }
    });
  }
  changestatsuclaserecursiva(data) {
    const ids = [data.idhijo, data.statushijo];
    console.log(ids);
    this.almacenServ.ChangestatusCateRecursiva(ids).subscribe(res => {
      if (res['status'] === true) {
        this.Listar();
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
      });
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
      });
      }
    });
  }
  filtarxclasepadre(value) {
    this.loading = true;
    this.almacenServ.filtrarxclasepadre(value).subscribe((res: any = []) => {
      const colum = this.column();
      if (res.length > 0) {
        this.loading = false;
        this.datatable('.tbpclase', res, colum);
        $('#filtrarpor').modal('hide');
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: 'Registros encontrados',
      });
      } else {
        this.datatable('.tbpclase', res, colum);
        this.loading = false;
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'No existen subcategorias de esta categoria',
      });
      }
    });
  }
}
