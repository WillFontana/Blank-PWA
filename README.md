# Blank Themplate - PWA

Themplate próprio de PWA para a criação fácil de WebApps.

## Service Worker

O service worker está funcionando com o cacheamento 100% dinâmico, ou seja ele está com o conteúdo, scripts, e estilos sempre atualizados de acordo com o que vem da rede, e com o cache sendo atualizado a cada requisição, exceto pelos arquivos estáticos.

## Ignored Paths

No service worker pode se encontrar uma variável chamada __ignoredPaths__ qualquer valor colocado lá, serve como um path a ser ignorado para cacheamento, por exemplo, se colocarmos */admin* todo o conteúdo dentro do caminho /admin/* não será cacheado.

## Push notifications

A aplicação está pronta para trabalhar com a API de webpush __(se disponível)__ com os escutadores dos eventos para clicks nas notificações.

### Funções de cache

Em nossa pasta __/assets/js/cache__ temos o arquivo *cache-functions.js* que serve como um controle para o IndexDB, assim se trabalharmos com JSON para popularmos nosso HTML, podemos cachear e descachear conteudos como imagens, icones, etc... de acordo com as requisições e atualizações de conteudos.

### Usabilidade

A maioria dos scripts tem comentários do que fazem e como se comportam, caso existam mais algumas dúvidas sobre como trabalhar com a aplicação, basta olharmos suas respectivas documentações:

PWA: 
[Web Dev.](https://web.dev/progressive-web-apps/ "Progressive Web Apps - Web.dev");
[Google: Progressive Web Apps Training.](https://developers.google.com/web/ilt/pwa "Progressive Web Apps Training | Google Developers");
[Google: The Offline Cookbook.](https://web.dev/offline-cookbook/ "The Offline Cookbook");

WebPush:
[Google WebPush.](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications "Introduction to Push Notifications");
[MDN WebPush.](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push "How to make PWAs re-engageable using Notifications and Push");
[WebPush com firebase.](https://medium.com/trainingcenter/adicionando-push-notifications-a-um-web-app-com-firebase-2a20cf12b6fe "Adicionando Push Notifications a um Web App com Firebase");
[WebPush com npm.](https://www.npmjs.com/package/web-push "Web Push with node");