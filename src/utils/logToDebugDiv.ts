export const logToDebugDiv = (message: string | object) => {
    const debugDiv = document.getElementById("debug-logs");
    if (!debugDiv) return;

    // Formatear el mensaje si es un objeto
    const formattedMessage =
      typeof message === "object" ? JSON.stringify(message, null, 2) : message;

    // Crear una nueva línea de log
    const logLine = document.createElement("div");
    logLine.textContent = `[${new Date().toLocaleTimeString()}] ${formattedMessage}`;
    debugDiv.appendChild(logLine);

    // Mostrar el contenedor si está oculto
    debugDiv.style.display = "block";

    // Desplazarse al final
    debugDiv.scrollTop = debugDiv.scrollHeight;
  };