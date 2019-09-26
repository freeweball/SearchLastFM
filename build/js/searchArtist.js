(function () {

'use strict'
  var fieldSearch = document.querySelector('input');
  var dataArtist;
  var dataAlbum;
  var buttonSearch = document.querySelector('button');
  var link = document.querySelector('.performer__link');
  var linkList = document.querySelector('ul');

  var successHandlerArtist = function (data) {
    dataArtist = data.results.artistmatches.artist;
  };

  var successHandlerAlbum = function (data) {
    dataAlbum = data.results.albummatches.album;
  };

  var getLink = function (data) {
    var linkTemplate = document.querySelector('#performer').content.querySelector('.performer');
    var linkElement = linkTemplate.cloneNode(true);
    var link = linkElement.querySelector('.performer__link');

    link.textContent = data.name;

    return linkElement;
  };

  var getPhoto = function (data) {
    var photoTemplate = document.querySelector('#photo').content.querySelector('.photo');
    var photoElement = photoTemplate.cloneNode(true);
    var photo = photoElement.querySelector('.photo__album');

    if (data.image[2]['#text']) {
      photo.src = data.image[2]['#text'];
    }

    return photoElement;
  };

  var renderLink = function (item) {
    var linkList = document.querySelector('ul');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < item.length; i++) {
      if (item[i].name) {
        fragment.appendChild(getLink(item[i]));
      }
    }

    linkList.appendChild(fragment);
  };

  var renderphotoAlbum = function (item) {
    var photoList = document.querySelector('.photo__item');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < item.length; i++) {
      if (item[i].image) {
        fragment.appendChild(getPhoto(item[i]));
      }
    }

    photoList.appendChild(fragment);
  };

  var deleteLink = function () {
    var linkList = document.querySelector('ul');
    var linkItem = linkList.querySelectorAll('li');

    for (var i = 0; i < linkItem.length; i++) {
      linkList.removeChild(linkItem[i]);
    }
  };

  var errorHandler = function () {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var tagMain = document.querySelector('body');
    var fragment = document.createDocumentFragment();

    fragment.appendChild(templateError);
    tagMain.appendChild(fragment);
  };

  var messageNotFound = function () {
    var message = document.createElement('li');
    message.classList.add('notFound');
    message.textContent = 'По вашему запросу не найдено ни одного исполнителя';
    var list = document.querySelector('ul');
    var fragment = document.createDocumentFragment();

    fragment.appendChild(message);
    list.appendChild(fragment);
  };

  fieldSearch.addEventListener('input', function () {
    buttonSearch.innerHTML = 'Искать ' + fieldSearch.value;
  });

  fieldSearch.addEventListener('input', function () {
    buttonSearch.removeAttribute('disabled');
  });

  buttonSearch.addEventListener('click', function (evt) {
    var artistName = fieldSearch.value;
    var ARTIST = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + artistName + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';
    window.load(successHandlerArtist, errorHandler, ARTIST);
    buttonSearch.setAttribute('disabled', 'disabled');

    setTimeout(function() {
      if (dataArtist.length == 0) {
        deleteLink();
        messageNotFound();
        fieldSearch.value = '';
      }

      else if (fieldSearch.value != '') {
        deleteLink();
        renderLink(dataArtist);
        fieldSearch.value = '';
      }
    }, 1000);
  });

  linkList.addEventListener('click', function (evt) {
    if (evt.target.className == 'performer__link') {
      var linkText = evt.target.textContent;
      var ALBUM = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + linkText + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';
      console.log(linkText);
      window.load(successHandlerAlbum, errorHandler, ALBUM);

      setTimeout(function() {
        deleteLink();
        // renderLink(dataAlbum);
        console.log(dataAlbum[2].image[0]['#text']);
        renderphotoAlbum(dataAlbum);
      }, 1000);
    }
  });
})();
