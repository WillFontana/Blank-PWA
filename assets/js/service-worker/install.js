if (!window.Promise) {
  window.Promise = Promise;
}

var deferredPrompt;

registerServiceWorker('sw.js');

// Prompt de download padrão do navegador
window.addEventListener('beforeinstallprompt', function (event) {
  event.preventDefault(); // Impedimos que o navegador mostre o prompt dele
  console.log('Before Install Prompt executado');
  deferredPrompt = event;
  enableDownload(); // habilitamos o download da aplicação
  return;
});

window.onload = checkRunningIOSApp();