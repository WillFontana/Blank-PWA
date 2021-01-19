// Função de comparativos de cache
async function compareCaches(dbName, itemsInCache, itemsInFetch, keyPath, imageJson) {
  let cacheAtualizado;
  let fetchSize = itemsInFetch.length;
  let cacheSize = itemsInCache.length;
  do {
    if (cacheSize === fetchSize) {
      // console.log("Verificando equalidade");
      // console.log(`Tamanho do cache: ${cacheSize}`);
      // console.log(`Tamanho na web: ${fetchSize}`);
      for (let i = 0; i < cacheSize; i++) {
        if (JSON.stringify(itemsInCache[i]) !== JSON.stringify(itemsInFetch[i])) {
          await removeItemStorage(dbName, itemsInCache[i][keyPath]);
          await writeData(dbName, itemsInFetch[i]);
        }
      };
    }
    else if (cacheSize > fetchSize && fetchSize !== 0) {
      // console.log("Removendo conteudo antigo");
      // console.log(`Tamanho do cache: ${cacheSize}`);
      // console.log(`Tamanho na web: ${fetchSize}`);
      for (let i = 0; i <= cacheSize; i++) {
        let descachearElemento = true;
        for (let j = 0; j <= fetchSize; j++) {
          if (JSON.stringify(itemsInCache[i]) === JSON.stringify(itemsInFetch[j])) {
            descachearElemento = false;
          }
        }
        descachearElemento && await removeItem(dbName, itemsInCache[i], keyPath, imageJson, 'ImageShell');
      }
    }
    else if (cacheSize < fetchSize && cacheSize !== 0) {
      // console.log("Adicionando novo conteudo");
      // console.log(`Tamanho do cache: ${cacheSize}`);
      // console.log(`Tamanho na web: ${fetchSize}`);
      for (let i = 0; i <= fetchSize; i++) {
        let cachearElemento = true;
        for (let j = 0; j <= cacheSize; j++) {
          if (JSON.stringify(itemsInFetch[i]) === JSON.stringify(itemsInCache[j])) {
            cachearElemento = false;
          }
        }
        cachearElemento && await writeData(dbName, itemsInFetch[i]);
      }
    }
    else if (cacheSize === 0 && fetchSize === 0) {
      // console.log("Limpando cache vazio");
      await clearAllStorage(dbName);
    }
    else if (cacheSize === 0 && fetchSize !== 0) {
      // console.log("Criando novo cache");
      for (let i = 0; i < fetchSize; i++) {
        await writeData(dbName, itemsInFetch[i]);
      }
    }
    else if (fetchSize === 0) {
      // console.log("Limpando cache vazio");
      await clearAllCached(dbName, itemsInCache, imageJson, 'ImageShell');
    }
    cacheSize = await readAllData(dbName).then(res => res.length);
    cacheAtualizado = await readAllData(dbName).then(res => JSON.stringify(res) === JSON.stringify(itemsInFetch) && true);
  } while (!cacheAtualizado);
  // console.log(`Cache de ${dbName} atualizado`);
}

// Removemos um item do IDB e sua imagem do cache
async function removeItem(dbName, itemToRemove, keyPath, jsonObj, cacheShell) {
  try {
    // Remoção do item no idb
    await removeItemStorage(dbName, itemToRemove[keyPath]);
    // Remoção da imagem no cache
    removeCachedItem(`/${itemToRemove[jsonObj]}`, cacheShell)
  } catch (error) {
    console.log(error);
  }
}

// Limpamos todo um cache no IDB e removemos as imagens da listagem antiga
async function clearAllCached(dbName, cachedList, jsonObj, cacheShell) {
  // Caso existam caches
  for (let index = 0; index <= cachedList.length; index++) {
    await removeCachedItem(`/${cachedList[index][jsonObj]}`, cacheShell)
  }
  await clearAllStorage(dbName);

};

// Remoção de um item no cache
async function removeCachedItem(item, cacheName) {
  if ('caches' in window) {
    return caches.open(cacheName)
      .then(cache => {
        return cache.match(item)
          .then(response => {
            response && cache.delete(item);
          });
      }).catch(err => {
        console.log(err);
      });
  } else {
    return;
  }
}
