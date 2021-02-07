

 function datatable(tabla,data,column,opciones) {
  $(tabla).DataTable({
    data: data,
    columns:column,
    responsive: true,
    "rowCallback": function( row, data ) {
      $(opciones, row).bind('click', () => {
        functionAcciones(data, opciones)
      });
    },
    language: {
      decimal: "",
      emptyTable: "No exsiten Ventas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
      infoEmpty: "Mostrando 0 to 0 of 0 Entradas",
      infoFiltered: "(Filtrado de _MAX_ total entradas)",
      infoPostFix: "",
      thousands: ",",
      lengthMenu: "Mostrar _MENU_ Entradas",
      loadingRecords: "Cargando...",
      processing: "Procesando...",
      search: "Buscar:",
      zeroRecords: "Sin resultados encontrados",
      paginate: {
        first: "Primero",
        last: "Ultimo",
        next: "Siguiente",
        previous: "Anterior"
      }
    },
    order:[],
    destroy: true
  });
}
 function functionAcciones(data, opciones) {
  switch (opciones) {
    case '.edit':
    console.log(data);
    break;
    case '.delete':
    break;
    case '.changestatus':
    break;
  }
};
