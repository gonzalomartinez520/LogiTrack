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

  try {
    const res = await fetch(`${API_URL}/envios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(envio)
    });

    const data = await res.json();

    alert("Envío creado con prioridad: " + data.prioridad);

  } catch (error) {
    console.error(error);
    alert("Error al crear envío");
  }
});