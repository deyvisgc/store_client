
export interface Compra {
  map(arg0: (x: any) => number);
  idCompra?: number;
  idProveedor?: number;
  comTipoPago: string;
  comTipoComprobante: string;
  comSerieCorrelativo: string;
  comUrlComprobante: string;
  comEstadoTipoPago: string;
  comDescuento: string;
  comSubTotal: string;
  comTotal: string;
  comMontoDeuda: string;
  comMontoPagado: string;
  comIgv: string;
  com_cuotas: string;
  comFecha: string;
  comEstado: string;
  comSerieComprobante: string;
}
