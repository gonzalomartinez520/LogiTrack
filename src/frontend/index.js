const API_URL = "https://backend-logicatrack-production.up.railway.app";

let rolActual = localStorage.getItem("rol") || "operador";

// 🔥 guardamos envíos globalmente para filtrar
let enviosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
  inicializarRol();
  inicializarBuscador();
  cargarEnvios();
});

function inicializarRol() {
  const selectRol = document.getElementById("rol");
  if (!selectRol) return;

  selectRol.value = rolActual;

  selectRol.addEventListener("change", (e) => {
    rolActual = e.target.value;
    localStorage.setItem("rol", rolActual);

    cargarEnvios();
  });
}

// 🔥 NUEVO: buscador en tiempo real
function inicializarBuscador() {
  const input = document.getElementById("buscador");
  if (!input) return;

  input.addEventListener("input", () => {
    const texto = input.value.toLowerCase();

    const filtrados = enviosGlobal.filter(envio => {
      const tracking = (envio.trackingId || "").toLowerCase();
      const destinatario = (envio.destinatario || "").toLowerCase();

      return tracking.includes(texto) || destinatario.includes(texto);
    });

    renderTabla(filtrados);
    actualizarCards(filtrados);
  });
}

function cargarEnvios() {

  fetch(`${API_URL}/envios`, {
    cache: "no-store"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los envíos");
      }
      return response.json();
    })
    .then(envios => {

      // 🔥 guardamos globalmente
      enviosGlobal = envios;

      renderTabla(envios);
      actualizarCards(envios);

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

      setCard("totalEnvios", "-");
      setCard("enSucursal", "-");
      setCard("enTransito", "-");
      setCard("entregados", "-");
    });
}

// 🔥 NUEVA: render de tabla reutilizable
function renderTabla(envios) {

  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (envios.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No se encontraron envíos</td>
      </tr>
    `;
    return;
  }

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
}

// 🔥 NUEVA: actualizar estadísticas reutilizable
function actualizarCards(envios) {

  let total = envios.length;
  let enSucursal = 0;
  let enTransito = 0;
  let entregados = 0;

  envios.forEach(envio => {
    const estado = envio.estadoActual || envio.estado;

    if (estado === "EN_SUCURSAL") enSucursal++;
    if (estado === "EN_TRANSITO") enTransito++;
    if (estado === "ENTREGADO") entregados++;
  });

  setCard("totalEnvios", total);
  setCard("enSucursal", enSucursal);
  setCard("enTransito", enTransito);
  setCard("entregados", entregados);
}

// helper
function setCard(id, valor) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = valor;
  }
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