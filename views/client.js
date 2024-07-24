const ws = new WebSocket("ws://localhost:3001");

ws.onmessage = (message) => {
  if (message.data === "reload") {
    const pdfViewer = document.getElementById("pdf-viewer");
    // Actualizar el parámetro de consulta para forzar la recarga
    pdfViewer.src = `output.pdf?v=${new Date().getTime()}`;
  } else if (message.data === "error") {
    console.error("Error regenerating PDF");
  }
};
