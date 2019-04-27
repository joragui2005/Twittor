//Imports
importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v2.1";
const DINAMYC_CACHE = "dinamyc-v2.1";
const INMMUTABLE_CACHE = "inmmutable-v2";

const APP_SHELL = [
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js"
];
const APP_SHELL_INMMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js"
];

//Instalación del SW
self.addEventListener("install", e => {
  const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
    cache.addAll(APP_SHELL);
  });

  const cacheInmmutable = caches.open(INMMUTABLE_CACHE).then(cache => {
    cache.addAll(APP_SHELL_INMMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmmutable]));
});

//Activación del SW
self.addEventListener("activate", e => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      //Cambiando el versionamiento, eliminar la cache anterior e instala la nueva version.
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DINAMYC_CACHE && key.includes("dinamyc")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(respuesta);
});

self.addEventListener("fetch", e => {
  const respuesta = caches.match(e.request).then(res => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then(newRes => {
        return ActualizarCacheDinamico(DINAMYC_CACHE, e.request, newRes);
      });
    }
  });
  e.respondWith(respuesta);
});
