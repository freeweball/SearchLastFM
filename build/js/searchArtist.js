'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var fieldSearch = document.querySelector('input');
  var dataArtist;
  var dataAlbum;
  var buttonSearch = document.querySelector('.main__button-search');
  var link = document.querySelector('.music__item-link');
  var linkList = document.querySelector('ul');
  var photoList = document.querySelector('.photo__list');
  var classLink = 'li';
  var classList = 'ul';
  var classPhotoDelete = '.photo__list';
  var photoTitle = document.querySelector('.photo__title');
  var hiddenClass = 'visually-hidden';
  var closeButton = photoList.querySelector('.photo__close-list');
  var mainPage = document.querySelector('.main');
  var mainPageWrapper = mainPage.querySelector('.photo__wrapper');

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
    var checkPhoto = data.name === '';
    var checkName = data.image[2]['#text'] === '';


    var photo = photoElement.querySelector('.photo__album');
    if (!checkName) {
      photo.src = data.image[2]['#text'];
    } else {
       photoElement.removeChild(photo);
     };

    var photoName = photoElement.querySelector('.photo__name');
    if (!checkPhoto) {
      photoName.textContent = data.name;
    } else {
       photoElement.removeChild(photoName);
     };

     if (!checkPhoto || !checkName) {
        return photoElement;
     };
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
    buttonSearch.removeAttribute('disabled');
  });

  buttonSearch.addEventListener('click', function (evt) {
    var artistName = fieldSearch.value;
    var ARTIST = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + artistName + '&api_key=add372f0920529bbba611a22b6cfe906&format=json';

    window.load(successHandlerArtist, errorHandler, ARTIST);
    buttonSearch.setAttribute('disabled', 'disabled');

    if (document.querySelector('.photo__item')) {
       window.util.deleteItem(classPhotoDelete, classLink);
    };

    setTimeout(function() {
      if (dataArtist.length == 0) {
        window.util.deleteItem(classList, classLink);
        messageNotFound();
        fieldSearch.value = '';
      }

      else if (fieldSearch.value != '') {
        window.util.deleteItem(classList, classLink);
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
         window.util.deleteItem(classPhotoDelete, classLink);
      };

      setTimeout(function () {
        if (dataArtist.length == 0) {
          window.util.deleteItem(classList, classLink);
          messageNotFound();
          fieldSearch.value = '';
        }

        else if (fieldSearch.value != '') {
          window.util.deleteItem(classList, classLink);
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
        // window.util.deleteItem(classList, classLink);
        window.util.render(dataAlbum, photoList, getPhoto,);
        photoTitle.textContent = linkText;
        closeButton.classList.remove(hiddenClass);
        mainPageWrapper.classList.toggle(hiddenClass);
      }, 1000);
    }
  });

  closeButton.addEventListener('click', function () {
    window.util.deleteItem(classPhotoDelete, classLink);
    mainPageWrapper.classList.toggle(hiddenClass);
  });

  mainPageWrapper.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.util.deleteItem(classPhotoDelete, classLink);
      mainPageWrapper.classList.toggle(hiddenClass);
    }
  });
})()
