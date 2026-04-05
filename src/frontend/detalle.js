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
    cache: "no-store"
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

      // 🔥 ahora pasamos tracking también
      renderHistorial(envio.trackingId);

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

// 🔥 NUEVA FUNCIÓN: guardar historial
function guardarHistorial(trackingId, nuevoEstado) {

  const key = `historial_${trackingId}`;

  const historial = JSON.parse(localStorage.getItem(key)) || [];

  historial.push({
    estado: nuevoEstado,
    fecha: new Date().toISOString()
  });

  localStorage.setItem(key, JSON.stringify(historial));
}

// 🔥 FIX + historial
function cambiarEstado(trackingId, nuevoEstado) {

  fetch(`${API_URL}/envios/${trackingId}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al actualizar el estado");
      }
      return res.text();
    })
    .then(() => {

      // ✅ guardar historial en frontend
      guardarHistorial(trackingId, nuevoEstado);

      // ✅ actualizar UI inmediata
      const estadoEl = document.getElementById("estado");
      if (estadoEl) {
        estadoEl.textContent = nuevoEstado;
      }

      // 🔥 recargar para renderizar historial nuevo
      cargarDetalle();

    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo actualizar el estado");
    });
}

// 🔥 NUEVO render de historial desde localStorage
function renderHistorial(trackingId) {

  const ul = document.getElementById("historial");
  if (!ul) return;

  ul.innerHTML = "";

  const key = `historial_${trackingId}`;
  const historial = JSON.parse(localStorage.getItem(key)) || [];

  if (historial.length === 0) {
    ul.innerHTML = "<li>Sin cambios registrados</li>";
    return;
  }

  // mostrar más reciente arriba
  historial.slice().reverse().forEach(item => {

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