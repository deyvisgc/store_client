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