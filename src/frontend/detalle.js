const API_URL = "https://backend-logicatrack-production.up.railway.app";

let rolActual = localStorage.getItem("rol") || "operador";

document.addEventListener("DOMContentLoaded", () => {
  inicializarRol();
  cargarDetalle();
});

function inicializarRol() {
  const selectRol = document.getElementById("rol");

  if (!selectRol) return;

  selectRol.value = rolActual;

  selectRol.addEventListener("change", (e) => {
    rolActual = e.target.value;
    localStorage.setItem("rol", rolActual);

    location.reload();
  });
}

function cargarDetalle() {

  const params = new URLSearchParams(window.location.search);
  const tracking = params.get("tracking");

  if (!tracking) {
    alert("Tracking no encontrado");
    return;
  }

  fetch(`${API_URL}/envios/${tracking}`, {
    cache: "no-store" // 🔥 evita cache
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al obtener el envío");
      }
      return res.json();
    })
    .then(envio => {

      setValor("tracking", envio.trackingId);
      setValor("remitente", envio.remitente);
      setValor("destinatario", envio.destinatario);

      setValor("ciudadOrigen", envio.origen);
      setValor("ciudadDestino", envio.destino);

      setValor("fecha", formatearFecha(envio.fechaCreacion));

      const estadoActual = envio.estadoActual || envio.estado;

      const estadoEl = document.getElementById("estado");
      if (estadoEl) {
        estadoEl.textContent = estadoActual || "SIN ESTADO";
      }

      renderAccionesSupervisor(envio, estadoActual);
      renderHistorial(envio);

    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error al cargar el detalle del envío");
    });
}

function renderAccionesSupervisor(envio, estadoActual) {

  const contenedor = document.getElementById("accionesSupervisor");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (rolActual !== "supervisor") return;

  const estados = ["EN_SUCURSAL", "EN_TRANSITO", "ENTREGADO"];

  estados.forEach(estado => {

    if (estado === estadoActual) return;

    const btn = document.createElement("button");
    btn.textContent = `Pasar a ${estado}`;
    btn.style.marginRight = "10px";

    btn.onclick = () => cambiarEstado(envio.trackingId, estado);

    contenedor.appendChild(btn);
  });
}

// 🔥 FIX REAL ACÁ
function cambiarEstado(trackingId, nuevoEstado) {

  fetch(`${API_URL}/envios/${trackingId}/estado`, {
    method: "PATCH", // ✅ CORREGIDO
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // ⚠️ el backend puede no devolver JSON
      return res.text();
    })
    .then(() => {

      // ✅ actualización inmediata sin esperar reload completo
      const estadoEl = document.getElementById("estado");
      if (estadoEl) {
        estadoEl.textContent = nuevoEstado;
      }

      // 🔥 recargar datos reales del backend
      cargarDetalle();

    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo actualizar el estado");
    });
}

function renderHistorial(envio) {

  const ul = document.getElementById("historial");
  if (!ul) return;

  ul.innerHTML = "";

  if (!envio.historial || envio.historial.length === 0) {
    ul.innerHTML = "<li>Sin cambios registrados</li>";
    return;
  }

  envio.historial.forEach(item => {

    const li = document.createElement("li");
    li.textContent = `${item.estado} - ${formatearFecha(item.fecha)}`;

    ul.appendChild(li);
  });
}

function setValor(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;

  if (el.tagName === "INPUT") {
    el.value = valor || "";
  } else {
    el.textContent = valor || "-";
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  const date = new Date(fecha);
  if (isNaN(date)) return "-";

  return date.toLocaleString("es-AR");
}