const API_URL = "https://backend-logicatrack-production.up.railway.app";

const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking");

fetch(API_URL + "/envios/" + tracking)
  .then(res => res.json())
  .then(envio => {

    document.getElementById("tracking").textContent = envio.trackingId;

    document.getElementById("remitente").value = envio.remitente;
    document.getElementById("destinatario").value = envio.destinatario;

    document.getElementById("ciudadOrigen").value = envio.origen;
    document.getElementById("ciudadDestino").value = envio.destino;

    document.getElementById("fecha").value = envio.fechaCreacion;

    document.getElementById("estado").textContent = envio.estadoActual;

  });