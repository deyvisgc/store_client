function calcularVuelto (total, monto) {
  const vuelto = parseFloat(total) - parseFloat(monto);
  const vueltoFinal = Math.abs(vuelto);
  return vueltoFinal.toFixed(2);
}