// Acesso de dados do DB ( do navegador )
// Nome do DB, versão do DB e função
var dbPromise = idb.open('CacheApp', 1, function (db) {
  // criamos o relacionamento de dados de tabelas para consumo
  if (!db.objectStoreNames.contains('cache1')) {
    db.createObjectStore('cache1', { keyPath: 'idCache1' });
  };
  if (!db.objectStoreNames.contains('cache2')) {
    db.createObjectStore('cache2', { keyPath: 'idCache2' });
  };
  // ...
});

// Escreve novos dados no IndexDB
function writeData(DBName, item) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(DBName, 'readwrite'); // Transação de eventos no IDB
      var store = tx.objectStore(DBName);
      store.put(item);
      return tx.complete; // Finalização da transação de dados
    });
};

// Le os dados de um dos bancos de dados no IDB
function readAllData(DBName) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(DBName, 'readonly');
      var store = tx.objectStore(DBName);
      return store.getAll();
    });
};

// Limpa todos os dados de uma tabela
function clearAllStorage(DBName) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(DBName, 'readwrite');
      var store = tx.objectStore(DBName);
      store.clear();
      return tx.complete;
    });
};

// Remove apenas um item da tabela
function removeItemStorage(DBName, id) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(DBName, 'readwrite');
      var store = tx.objectStore(DBName);
      store.delete(id);
      return tx.complete;
    }).catch(function (err) {
      console.log(`Não foi possível remover o item: ${id}, erro:`, err);
    })
}

// Encoders
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
