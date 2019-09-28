'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var mainPage = document.querySelector('.main');
  var fieldSearch = mainPage.querySelector('.main__search');
  var dataArtist;
  var dataAlbum;
  var buttonSearch = mainPage.querySelector('.main__button-search');
  var linkList = mainPage.querySelector('.music__list');
  var photoList = mainPage.querySelector('.photo__list');
  var photoTitle = mainPage.querySelector('.photo__title');
  var closeButton = photoList.querySelector('.photo__close-list');
  var mainPageWrapper = mainPage.querySelector('.photo__wrapper');
  var hiddenClass = 'visually-hidden';
  var classPhotoDelete = '.photo__list';
  var linkClass = 'li';
  var listClass = 'ul';

  mainPageWrapper.classList.add(hiddenClass);

  var successHandlerArtist = function (data) {
    dataArtist = data.results.artistmatches.artist;
  };

  var successHandlerAlbum = function (data) {
    dataAlbum = data.results.albummatches.album;
  };

  var getLink = function (data) {
    var linkTemplate = document.querySelector('#performer').content.querySelector('.music__item');
    var linkElement = linkTemplate.cloneNode(true);
    var link = linkElement.querySelector('.music__item-link');

    link.textContent = data.name;

    return linkElement;
  };

  var getPhoto = function (data) {
    var photoTemplate = document.querySelector('#photo').content.querySelector('.photo__item');
    var photoElement = photoTemplate.cloneNode(true);
    var checkName = data.name === '';
    var checkPhoto = data.image[2]['#text'] === '';


    var photo = photoElement.querySelector('.photo__album');
    if (!checkPhoto) {
      photo.src = data.image[2]['#text'];
    } else {
       photo.src = 'img/poster_none.png';
     };

    var photoName = photoElement.querySelector('.photo__name');
    if (!checkName) {
      photoName.textContent = data.name;
    } else {
       photoElement.removeChild(photoName);
     }

      return photoElement;
  };

  var errorHandler = function () {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var fragment = document.createDocumentFragment();

    fragment.appendChild(templateError);
    mainPage.appendChild(fragment);
  };

  var messageNotFound = function () {
    var message = document.createElement('li');
    message.classList.add('notFound');
    message.textContent = 'По вашему запросу не найдено ни одного исполнителя';
    var fragment = document.createDocumentFragment();

    fragment.appendChild(message);
    linkList.appendChild(fragment);
  };

  fieldSearch.addEventListener('input', function () {
    buttonSearch.innerHTML = 'Искать ' + fieldSearch.value;
    buttonSearch.removeAttribute('disabled');
  });

  buttonSearch.addEventListener('click', function (evt) {
    var artistName = fieldSearch.value;
    var ARTIST = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + artistName + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';

    window.load(successHandlerArtist, errorHandler, ARTIST);
    buttonSearch.setAttribute('disabled', 'disabled');

    if (document.querySelector('.photo__item')) {
       window.util.deleteItem(classPhotoDelete, linkClass);
    };

    setTimeout(function() {
      if (dataArtist.length == 0) {
        window.util.deleteItem(listClass, linkClass);
        messageNotFound();
        fieldSearch.value = '';
      }

      else if (fieldSearch.value != '') {
        window.util.deleteItem(listClass, linkClass);
        window.util.render(dataArtist, linkList, getLink);
        fieldSearch.value = '';
      }
    }, 1000);
  });

  fieldSearch.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var artistName = fieldSearch.value;
      var ARTIST = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + artistName + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';

      window.load(successHandlerArtist, errorHandler, ARTIST);
      buttonSearch.setAttribute('disabled', 'disabled');

      if (document.querySelector('.photo__item')) {
         window.util.deleteItem(classPhotoDelete, linkClass);
      };

      setTimeout(function () {
        if (dataArtist.length == 0) {
          window.util.deleteItem(listClass, linkClass);
          messageNotFound();
          fieldSearch.value = '';
        }

        else if (fieldSearch.value != '') {
          window.util.deleteItem(listClass, linkClass);
          window.util.render(dataArtist, linkList, getLink);
          fieldSearch.value = '';
        }
      }, 1000);
    }
  });

  linkList.addEventListener ('click', function (evt) {
    if (evt.target.className == 'music__item-link') {
      var linkText = evt.target.textContent;
      var ALBUM = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + linkText + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';

      window.load(successHandlerAlbum, errorHandler, ALBUM);

      setTimeout(function () {
        window.util.renderPhoto(dataAlbum, photoList, getPhoto,);
        photoTitle.textContent = linkText;
        closeButton.classList.remove(hiddenClass);
        mainPageWrapper.classList.toggle(hiddenClass);
      }, 1000);
    }
  });

  closeButton.addEventListener('click', function () {
    window.util.deleteItem(classPhotoDelete, linkClass);
    mainPageWrapper.classList.toggle(hiddenClass);
  });

  document.addEventListener('keydown', function (evt) {
    if (document.querySelector('.photo__item')) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.util.deleteItem(classPhotoDelete, linkClass);
        mainPageWrapper.classList.toggle(hiddenClass);
      }
    }
  });
})()
