const API_URL = "https://backend-logicatrack-production.up.railway.app";

let rolActual = localStorage.getItem("rol") || "operador";

document.addEventListener("DOMContentLoaded", () => {
  inicializarRol();
  cargarEnvios();
});

function inicializarRol() {
  const selectRol = document.getElementById("rol");
  if (!selectRol) return;

  selectRol.value = rolActual;

  selectRol.addEventListener("change", (e) => {
    rolActual = e.target.value;
    localStorage.setItem("rol", rolActual);

    // 🔥 Refrescar lista al cambiar rol (por consistencia)
    cargarEnvios();
  });
}

function cargarEnvios() {

  fetch(`${API_URL}/envios`, {
    cache: "no-store" // 🔥 evita cache (clave para ver cambios de estado)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los envíos");
      }
      return response.json();
    })
    .then(envios => {

      const tbody = document.querySelector("tbody");
      if (!tbody) return;

      tbody.innerHTML = "";

      envios.forEach(envio => {

        const estado = envio.estadoActual || envio.estado || "SIN ESTADO";

        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td class="link">${envio.trackingId || "-"}</td>
          <td>${envio.destinatario || "-"}</td>
          <td>
            <span class="badge">${estado}</span>
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

      const tbody = document.querySelector("tbody");
      if (!tbody) return;

      tbody.innerHTML = `
        <tr>
          <td colspan="5">Error al cargar los envíos</td>
        </tr>
      `;
    });
}

function formatearFecha(fecha) {

  if (!fecha) return "-";

  const date = new Date(fecha);

  if (isNaN(date)) return "-";

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}