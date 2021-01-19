window.setImmediate||function(){"use strict";var n=0,e={},t=!0,r=Array.prototype.slice,i="setImmediatePolyfillMessage";function o(n){var t,o=n.data;"string"==typeof o&&0==o.indexOf(i)&&(t=e[o])&&(delete e[o],function(n){var e=n[0];switch(n.length){case 1:return e();case 2:return e(n[1]);case 3:return e(n[1],n[2])}e.apply(window,r.call(n,1))}(t))}window.setImmediate=function(){for(var r=n++,u=i+r,c=arguments.length,f=new Array(c);c--;)f[c]=arguments[c];return e[u]=f,t&&(t=!1,window.addEventListener("message",o)),window.postMessage(u,"*"),r},window.clearImmediate=function(n){delete e[i+n]}}(),function(n){"use strict";var e="[[PromiseStatus]]",t="[[PromiseValue]]",r=n.setImmediate||require("timers").setImmediate,i=Array.isArray||function(n){return"[object Array]"==Object.prototype.toString.call(n)};function o(n){this["[[OriginalError]]"]=n}function u(n){return n instanceof o}function c(n){return"function"==typeof n}function f(n){return n instanceof y}function a(n){return n}function l(n){throw n}function s(n){delete n["[[OnFulfilled]]"],delete n["[[OnRejected]]"]}function d(n){var e,t=n.length;for(e=0;e<t;e++)n[e]()}function h(n,e,t){var r=w(t);f(r)?r.then(n,e):u(r)?e(r["[[OriginalError]]"]):n(t)}function w(n){var e;if(f(n))return n;if(function(n){return Object(n)===n}(n)){try{e=n.then}catch(n){return new o(n)}if(c(e))return new y((function(t,i){r((function(){try{e.call(n,t,i)}catch(n){i(n)}}))}))}return null}function p(n,r){function i(t){"pending"==n[e]&&m(n,t)}try{r((function(r){"pending"==n[e]&&function n(r,i){var o,c=w(i);f(c)?(r[e]="internal pending",c.then((function(e){n(r,e)}),(function(n){m(r,n)}))):u(c)?m(r,c["[[OriginalError]]"]):(r[e]="fulfilled",r[t]=i,(o=r["[[OnFulfilled]]"])&&o.length&&(s(r),d(o)))}(n,r)}),i)}catch(n){i(n)}}function m(n,r){var i=n["[[OnRejected]]"];n[e]="rejected",n[t]=r,i&&i.length&&(s(n),d(i))}function y(n){if(!f(this))throw new TypeError('constructor Promise requires "new".');this[e]="pending",this[t]=void 0,p(this,n)}y.prototype.then=function(n,i){var o,u=this;return n=c(n)?n:a,i=c(i)?i:l,o=new y((function(c,f){function a(n){var e;try{e=n(u[t])}catch(n){return void f(n)}e===o?f(new TypeError("then() cannot return same Promise that it resolves.")):h(c,f,e)}function l(){r(a,n)}function s(){r(a,i)}switch(u[e]){case"fulfilled":l();break;case"rejected":s();break;default:!function(n,e,t){n["[[OnFulfilled]]"]||(n["[[OnFulfilled]]"]=[],n["[[OnRejected]]"]=[]),n["[[OnFulfilled]]"].push(e),n["[[OnRejected]]"].push(t)}(u,l,s)}}))},y.prototype.catch=function(n){return this.then(a,n)},y.resolve=function(n){var e=w(n);return f(e)?e:new y((function(t,r){u(e)?r(e["[[OriginalError]]"]):t(n)}))},y.reject=function(n){return new y((function(e,t){t(n)}))},y.race=function(n){return new y((function(e,t){var r,o;if(i(n))for(o=n.length,r=0;r<o;r++)h(e,t,n[r]);else t(new TypeError("not an array."))}))},y.all=function(n){return new y((function(e,t){var r,o,c,a,l=0,s=0;if(i(n)){for(o=(n=n.slice(0)).length,a=0;a<o;a++)f(r=w(c=n[a]))?(s++,r.then(function(t){return function(r){n[t]=r,++l==s&&e(n)}}(a),t)):u(r)?t(r["[[OriginalError]]"]):n[a]=c;s||e(n)}else t(new TypeError("not an array."))}))},"undefined"!=typeof module&&module.exports?module.exports=n.Promise||y:n.Promise||(n.Promise=y)}(this);