function sendRespuesta(respuesta) {
  const myString = JSON.stringify(respuesta);
  return JSON.parse(myString);
}