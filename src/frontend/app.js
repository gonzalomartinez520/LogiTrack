const API_URL = "https://backend-logicatrack-production.up.railway.app";

let rolActual = localStorage.getItem("rol") || "operador";

document.addEventListener("DOMContentLoaded", () => {
  inicializarRol();
  inicializarFormulario();
});

// 🔥 Manejo de rol (igual que en detalle.js)
function inicializarRol() {
  const selectRol = document.getElementById("rol");

  if (!selectRol) return;

  selectRol.value = rolActual;

  selectRol.addEventListener("change", (e) => {
    rolActual = e.target.value;
    localStorage.setItem("rol", rolActual);
  });
}

// 🔥 Lógica del formulario
function inicializarFormulario() {
  const form = document.querySelector("form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const remitente = document.getElementById("remitente").value;
    const destinatario = document.getElementById("destinatario").value;
    const origen = document.getElementById("ciudadOrigen").value;
    const destino = document.getElementById("ciudadDestino").value;

    const envio = {
      remitente,
      destinatario,
      origen,
      destino
    };

    fetch(`${API_URL}/envios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then(data => {
        console.log("Envío creado:", data);

        alert("Envío creado correctamente");

        // 🔥 Opcional: limpiar form antes de irse
        form.reset();

        // Redirige al listado
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error al crear el envío");
      });
  });
}