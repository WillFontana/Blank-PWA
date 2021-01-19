importScripts('assets/js/service-worker/Polyfills/idb.js');
importScripts('assets/js/service-worker/utilities.js');

// Escutador do Service Worker
const swListener = self.addEventListener;
const register = self.registration;
// Variável de versão para caches
let version = '1.0.0';

// Caches estático
const AplicationShell = `ApplicationShell?v=${version}`;

// Cache gerais dinâmicos
const DinamicShell = `DinamicShell`;

// Caches específicos
const ImageShell = `ImageShell`;
const JSONShell = `JSONShell`;
const ScriptsShell = `ScriptsShell`;
const FontShell = `FontShell`;
const StylesShell = `StylesShell`;
const PagesShell = `PagesShell`;

// Arquivo offline genérico
const offlinePage = `/pwa/offline.html`;

// Url Home da aplicação
const urlHome = '';

// Arquivos de cacheamento estáticos
const staticFiles = [
  /**
   * Array de itens a serem cacheados estáticamente
   */

  // Telas estáticas
  'index.html',
  'offline.html',

  // Imagens dummy
  'assets/img/dummy/dummy-banner.jpg',
  'assets/img/dummy/dummy-image.jpg',

  // fontes
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap'
];

// Caminhos onde os eventos de fetch não devem gerar cache
const ignoredPaths = [
  ''
];

// Limpeza de cache por tolerância de itens
function trimCache(cacheShell, maxItems) {
  caches.open(cacheShell)
    .then(function (cache) {
      return cache.keys() // retorna todos os itens de nosso cache
        .then(function (keys) {
          if (keys.length > maxItems) {
            cache.delete(keys[0])
              .then(trimCache(cacheShell, maxItems)); // Repetimos a função até que a condição de if não ocorra
          }
        });
    });
};

// Verificamos se um conteudo existe em um array
function findInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // requisitamos o dominio onde hospedamos nossa página
    cachePath = string.substring(self.origin.length); // retornamos o caminho da url após o domínio (para cachearmos)
  } else {
    cachePath = string; // guardamos a requisição total
  }
  return array.indexOf(cachePath) > -1;
};

// Verificamos se um pedaço de string está dentro de um array
function findPathName(path, pathArray) {
  let match;
  for (let i = 0; i < pathArray.length; i++) {
    match = pathArray[i].includes(path);
    match && (i = pathArray.length + 1);
  }
  return match;
};

// Insere um item no cache
async function insertIntoCache(cacheShell, item, itemUrl) {
  return await fetch(item).then(async response => {
    let cloneRes = response.clone();
    caches.open(cacheShell).then(cache => {
      cache.match(item).then(res => {
        if (res) {
          cache.delete(res);
        }
        cache.put(itemUrl, cloneRes);
      });
    }).catch(async error => {
      console.log(error);
    });
    if (cacheShell !== 'DinamicShell') {
      await deleteItemFromCache('DinamicShell', item);
    }
    return response;
  });
};


// Retorno de um conteudo do cache
async function returnCachedContent(cacheShell, item, itemUrl) {
  return await caches.match(item).then(async response => {
    if (!response) {
      return await insertIntoCache(cacheShell, item, itemUrl);
    }
    return response
  }).catch(async error => { // Caso não conseguimos requisitar o conteudo da internet nem retornar do cache
    return caches.open(AplicationShell).then(cache => {
      if (item.headers.get('accept').includes('text/html')) { // Retornamos nossa tela offline
        return cache.match(offlinePage);
      } else if (cacheShell === ImageShell) {
        if (itemUrl.includes('banner')) {
          return cache.match('assets/img/dummy-banner.jpg'); // Dummy para banners
        } else {
          return cache.match('assets/img/dummy-image.jpg'); // Dummy para imagens comuns
        }
      }
    })
  });
};

// Deleta um item do cache
async function deleteItemFromCache(cacheShell, item) {
  caches.open(cacheShell).then(cache => {
    cache.match(item).then(res => {
      if (res) {
        cache.delete(item);
        console.log("Item deletado");
        console.log(item.url);
      }
    });
  });
};

// Remove um item desnessário do cache e o carrega em seguida
async function returnUncachedElement(cacheShell, item) {
  return await caches.open(cacheShell).then(async cache => {
    return await cache.match(item).then(async res => {
      if (res) {
        cache.delete(item);
      }
      return await fetch(item).then(res => {
        return res;
      })
    }).catch(err => {
      console.log(err);
    });
  })
};

// Função genérica para lidar com o evento de fetch
async function manageFetchEvent(cacheShell, item, itemUrl, path) {
  try {
    if (!findPathName(path, ignoredPaths)) {
      return await insertIntoCache(cacheShell, item, itemUrl);
    }
    return await returnUncachedElement(cacheShell, item);
  } catch (error) {
    try {
      return await returnCachedContent(cacheShell, item, itemUrl);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

// Focamos nosso app com a tela respectiva de nossa notificação
async function focusNotificationTab(notification) {
  clients.matchAll() // percorremos todas as abas com SW de nosso cliente
    .then(function (clis) {
      let client = clis.find(function (c) { // percorre e encontra todos os clientes de nosso array
        return c.visibilityState === 'visible'; // checa se a janela esta aberta
      });

      if (client !== undefined) { // encontramos uma janela aberta
        notification.data.url ? client.navigate(notification.data.url) : client.navigate(urlHome);
        client.focus(); // Focamos nosso service worker
      } else {
        notification.data.url ? client.openWindow(notification.data.url) : client.openWindow(urlHome);
      }
    }).catch(err => {
      console.log("Ocorreram os seguintes erros: ", err);
    })
}

// Instalação do service worker e criação do cache estático
swListener('install', function (event) {
  console.log(`[ Service Worker ] Instalando o service worker... `, event);
  event.waitUntil(caches.open(AplicationShell).then(function (cache) { // Acessamos o cache estático
    console.log('[ Service Worker ] Cacheando o conteudo');
    cache.addAll(staticFiles); // cacheamos os arquivos estáticos
  }));
});

// Ativação de uma nova versão
swListener('activate', function (event) {
  console.log(`[Service Worker] Ativando nova versão `, event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) { // Retornamos todos os caches
          if (key !== AplicationShell && key !== DinamicShell) { // Verificamos se a versão do SW é a mesma
            console.log(`Limpando o cache: ` + key);
            return caches.delete(key); // Limpamos as versões antigas
          }
        }));
      })
  );
  // Requisitamos o conteudo de outros locais para nós
  return self.clients.claim();
});

// Buscar por conteudos na rede
swListener('fetch', function (event) {
  let fetchContent = event.request;
  let { url, headers } = fetchContent;
  let path = url.split(`.br/`)[1];
  if (path) {
    path = path.split('/')[0];
  }
  event.respondWith(async function () {
    if (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpeg')) {
      return await manageFetchEvent(ImageShell, fetchContent, url, path);
    } else if (url.includes('/js/') && url.endsWith('.js')) {
      return await manageFetchEvent(ScriptsShell, fetchContent, url, path);
    } else if (url.includes('/fonts/')) {
      return await returnCachedContent(FontShell, event.request, url);
    } else if (url.includes('/css/') && url.endsWith('.css')) {
      return await manageFetchEvent(StylesShell, fetchContent, url, path);
    } else if (headers.get('accept').includes('text/html')) {
      return await manageFetchEvent(PagesShell, fetchContent, url, path, false);
    } else {
      return await manageFetchEvent(DinamicShell, fetchContent, url, path, false);
    }
  }());
});

// Evento de recebimento de notificações
swListener('push', function (event) {
  console.log('Notificação recebida', event);
  let data;
  if (!event.data) {
    data = {
      title: 'Opa!',
      content: 'Parece que temos novidade la no app para você!',
      openUrl: '/',
      badge: '/icons/mono/icon-512.png',
      actions:
        [
          { action: 'confirmar', title: 'Entendi', icon: '/assets/img/push/check.png' },
          { action: 'close', title: 'Fechar', icon: '/assets/img/push/close.png' }
        ],
      tag: 'informativo',
      data: {
        url: '/',
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
  } else {
    // transormamos uma string em um objeto javascript
    data = JSON.parse(event.data.text()); /* text serve para recuperar o texto da string */
  };
  let { title, content, icon, image, badge, tag, actions, ...rest } = data;
  let options = {
    body: content,
    icon: icon,
    image,
    lang: 'pt-BR',
    vibrate: [100, 50, 100],
    badge,
    tag,
    renotify: true,
    actions,
    rest
  };

  console.log(options);
  event.waitUntil(
    register.showNotification(title, options)
  );
});

// Caso o usuario interaja com a notificação
swListener('notificationclick', function (event) {
  let { url } = event.notification.data;
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      var client = windowClients[i];
      if (client.url === url && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(url);
    }
  }))
});

// Caso o usuario feche a notificação sem interagir com ela
swListener('notificationclose', function (event) {
  console.log('Notificação fechada', event)
});
