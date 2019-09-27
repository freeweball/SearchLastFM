'use strict';

(function () {

var render = function (data, item, func) {
	var fragment = document.createDocumentFragment();

	for (var i = 0; i < data.length; i++) {
	  fragment.appendChild(func(data[i]));
	};

	  item.appendChild(fragment);
};

var deleteItem = function (classList, classItem) {
	var linkList = document.querySelector(classList);
	var linkItem = linkList.querySelectorAll(classItem);

	for (var i = 0; i < linkItem.length; i++) {
	  linkList.removeChild(linkItem[i]);
	}
};

window.util = {
	render: render,
	deleteItem: deleteItem,
};
})();
