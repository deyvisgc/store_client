function validacion(total, monto, tipoPago, tipoComprobante) {
  const error = []
  if (total === '') {
   error.status = false 
   error.message = 'Total es requerido'
   return error;
  } else if (monto === '') {
    error.status = false 
    error.message = 'Monto es requerido'
    return error;
  }  else if (tipoPago === '') {
    error.status = false 
    error.message = 'tipo de pago es requerido'
    return error;
  }
  else if (tipoComprobante === '') {
    error.status = false 
    error.message = 'tipo Comprobante es requerido'
    return error;
  }
  return true;
}
function soloNumeros(evt){
  // code is the decimal ASCII representation of the pressed key.
  var code = (evt.which) ? evt.which : evt.keyCode;
  
  if(code==8) { // backspace.
    return true;
  } else if(code>=48 && code<=57) { // is a number.
    return true;
  } else{ // other keys.
    return false;
  }
}