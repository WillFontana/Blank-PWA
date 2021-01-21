// Registra o Service Worker
function registerServiceWorker(swfile) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swfile) // adicionar o caminho absoluto até o arquivo sw.js
      .then(() => {
        console.log('Service Worker registrado');
        let pushKey = 'BCLUFSRluldAmCQ5p7niN4azMng2RkIYeCUedWyp5mlIMJWvziEfoLowqZtUbwOr1d5J-1nb_3kMqVfXVigz02g';
        let url = 'https://pwa-wdb.firebaseio.com/subscriptions.json';
        requestNotification(pushKey, url);
      }).catch(function (err) {
        console.log('Erro ao registrar o Service Worker: ', err);
      });
  };
};

// Inicia o Download do WebApp
function startDownloadApp() {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function (UserDecision) {
    console.log(UserDecision.outcome);
    if (UserDecision.outcome === 'dismissed') {
      console.log('O usuário cancelou a instalação');
    } else {
      console.log('O usuário realizou a instalação');
    };
  });
  deferredPrompt = null;
}

// Habilitar o download
function enableDownload() {
  if (deferredPrompt) {
    // Habilitamos o usuário a realizar o download da aplicação
  }
}

// Mostra a notificações de que o usuário se increveu no sistema de push
function callConfirmSubscription() {
  navigator.serviceWorker.getRegistration().then(SWreg => {
    let options = {
      body: 'Agora você vai ficar por dentros das novidades no aplicativo!',
      icon: '/favicon/android-chrome-512x512.png',
      badge: '/icons/mono/icon-512.png',
      // image: 'https://www.geniuz.com.br/admin/assets/img/backgrounds/banner_painel.jpg',
      lang: 'pt-BR',
      vibrate: [100, 50, 100],
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'accept', title: 'Ver no app', icon: '/assets/img/push/check.png' },
        { action: 'close', title: 'Remover', icon: '/assets/img/push/close.png' },
      ],
      data: {
        url: '/',
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    SWreg.showNotification('Notificações habilitadas', options);
  });
}

// Verificação se a aplicação está rodando como app
function detectStandaloneMode() {
  if (window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.matchMedia('(display-mode: minimal-ui)').matches)
    return true;
  else
    return false;
}

// Verifica se a plataforma é iOS
function detectIOSDevice() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad com iOS 13
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// Verifica se o usuário está pelo app instalado no IOS apenas
function checkRunningIOSApp() {
  if (detectIOSDevice && !detectStandaloneMode()) {
    // O app ainda não foi instalado e podemos indicar a instalação
    return;
  } else if (!detectIOSDevice()) {
    // O app não está rodando em ambiente IOS
    return;
  } else {
    // A Aplicação já está instalada
    return;
  }
}

// Gera o nosso corpo da mensagem de subscription
function createPushSubscribebody(pushSubscibe) {
  let { endpoint } = pushSubscibe;
  let key = pushSubscibe.getKey('p256dh');
  let token = pushSubscibe.getKey('auth');
  let contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];
  return JSON.stringify({
    endpoint: endpoint,
    publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
    authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
    contentEncoding,
  });
}

// Configura os pushs de notificações
function configurePushSubscription(pushKey, URL, swRegistration) {
  let publicToken = urlBase64ToUint8Array(pushKey); // Encriptografamos nosso token
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true, // garante que a notificações só seja vista pelo usuário específico
    applicationServerKey: publicToken
  }).then(async newPushSubs => {
    let body = await createPushSubscribebody(newPushSubs);
    return await fetch(URL, { method: 'POST', body }).then(res => {
      if (res.ok) {
        return callConfirmSubscription();
      }
    }).catch(err => {
      console.log("Erro ao cadastrar o usuário no sistema de push: ", err);
    });
  });
}

// Atualiza as configurações do push do usuário
async function updatePushSubscription(URL, subscription) {
  let body = await createPushSubscribebody(subscription);
  return await fetch(URL, { method: 'POST', body })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

// Habilita as notificações
function requestNotification(pushKey, URL) {
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) { // Verificamos se temos a API de push no navegador
    let registrations;
    navigator.serviceWorker.ready
      .then(swRegistrations => {
        registrations = swRegistrations;
        swRegistrations.pushManager.getSubscription().then(subscription => {
          if (!subscription) {
            return Notification.requestPermission(userResponse => {
              switch (userResponse) {
                case 'granted': // O usuário aceitou o push
                  configurePushSubscription(pushKey, URL, registrations);
                  break;
                case 'denied': // O usuário não aceitou o push
                  console.log("O usuário não aceitou o push");
                  break;
                default: // O usuário não interagiu com o promt
                  console.log("O usuário não interagiu com o promt");
                  break;
              }
            })
          } else {
            return updatePushSubscription(URL, subscription)
          }
        })
      }).catch(err => {
        console.log("Errro ao configurar o push de notificações");
        console.log(err);
      })
  } else {
    console.log("Notificações não suportadas no navegador");
  }
}