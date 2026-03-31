const API_URL = "https://backend-logicatrack-production.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    const remitente = document.getElementById("remitente").value;
    const destinatario = document.getElementById("destinatario").value;
    const origen = document.getElementById("ciudadOrigen").value;
    const destino = document.getElementById("ciudadDestino").value;

    const envio = {
      remitente: remitente,
      destinatario: destinatario,
      origen: origen,
      destino: destino
    };

    fetch(API_URL + "/envios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    })
      .then(response => response.json())
      .then(data => {

        alert("Envío creado correctamente");

        window.location.href = "index.html";

      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error al crear el envío");
      });

  });

});