const API_URL = "https://backend-logicatrack-production.up.railway.app";

document.addEventListener("DOMContentLoaded", cargarEnvios);

function cargarEnvios() {

  fetch(API_URL + "/envios")
    .then(response => response.json())
    .then(envios => {

      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";

      envios.forEach(envio => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td class="link">${envio.trackingId}</td>
          <td>${envio.destinatario}</td>
          <td>
            <span class="badge">${envio.estadoActual}</span>
          </td>
          <td>${formatearFecha(envio.fechaCreacion)}</td>
          <td>
            <a href="detalle.html?tracking=${envio.trackingId}">
              Ver detalle
            </a>
          </td>
        `;

        tbody.appendChild(fila);

      });

    })
    .catch(error => {
      console.error("Error cargando envíos:", error);
    });

}

function formatearFecha(fecha) {

  const date = new Date(fecha);

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

}