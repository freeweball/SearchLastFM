'use strict';

(function () {
  var CODE__SUCCESS = 200;
  var TIMEOUT = 10000;

  window.load = function (onSuccess, onError, url) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === CODE__SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + 'xhr.statusText');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', url);
    xhr.send();
  };
})();
