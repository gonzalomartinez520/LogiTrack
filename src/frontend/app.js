const API_URL = "https://backend-logicatrack-production.up.railway.app";

document.getElementById("form-envio").addEventListener("submit", async (e) => {
  e.preventDefault();

  const envio = {
    remitente: document.getElementById("remitente").value,
    destinatario: document.getElementById("destinatario").value,
    origen: document.getElementById("ciudadOrigen").value,
    destino: document.getElementById("ciudadDestino").value,

    // 🔥 IA
    distancia_km: parseFloat(document.getElementById("distancia_km").value),
    tipo_envio: document.getElementById("tipo_envio").value,
    ventana_horaria: document.getElementById("ventana_horaria").value,
    fragil: document.getElementById("fragil").checked ? 1 : 0,
    frio: document.getElementById("frio").checked ? 1 : 0,
    saturacion_ruta: parseFloat(document.getElementById("saturacion_ruta").value)
  };

<<<<<<< HEAD
  if (!selectRol) return;

  selectRol.value = rolActual;

  selectRol.addEventListener("change", (e) => {
    rolActual = e.target.value;
    localStorage.setItem("rol", rolActual);
  });
}

// 🔥 Manejo del nombre de usuario
function inicializarUsuario() {
  const nombreElemento = document.getElementById("nombreUsuario");
  const botonCambiar = document.getElementById("cambiarUsuario");

  if (!nombreElemento) return;

  // Cargar usuario guardado
  let nombreGuardado = localStorage.getItem("usuario") || "Usuario";

  nombreElemento.textContent = nombreGuardado;

  // Cambiar usuario
  if (botonCambiar) {
    botonCambiar.addEventListener("click", () => {

      const nuevoNombre = prompt("Ingrese su nombre de usuario:", nombreGuardado);

      if (nuevoNombre && nuevoNombre.trim() !== "") {

        localStorage.setItem("usuario", nuevoNombre);
        nombreElemento.textContent = nuevoNombre;

      }

    });
  }
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

    // 🔹 Nuevos campos para cálculo de prioridad
    const distanciaKm = parseFloat(document.getElementById("distanciaKm").value);
    const tipoEnvio = document.getElementById("tipoEnvio").value;
    const ventanaHoraria = document.getElementById("ventanaHoraria").value;
    const volumen = parseFloat(document.getElementById("volumen").value);
    const saturacionRuta = parseFloat(document.getElementById("saturacionRuta").value);
    const fragil = document.getElementById("fragil").checked;
    const frio = document.getElementById("frio").checked;

    const envio = {
      remitente,
      destinatario,
      origen,
      destino,
      distanciaKm,
      tipoEnvio,
      ventanaHoraria,
      volumen,
      fragil,
      frio,
      saturacionRuta
    };

    fetch(`${API_URL}/envios`, {
=======
  try {
    const res = await fetch(`${API_URL}/envios`, {
>>>>>>> 45e8f336c96760797f4ad88ee7b90479498a1858
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    });

    const data = await res.json();

    alert("Envío creado con prioridad: " + data.prioridad);

<<<<<<< HEAD
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error al crear el envío");
      });
  });
}
=======
  } catch (error) {
    console.error(error);
    alert("Error al crear envío");
  }
});
>>>>>>> 45e8f336c96760797f4ad88ee7b90479498a1858
