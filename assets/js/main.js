(function(doc) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var right = document.querySelector('#right'),
      headers =  [].slice.call(right.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    for(var header of headers) {
      var text = header.innerHTML.split(' ');

      text[0] = '<strong>' + text[0] + '</strong>';
      header.innerHTML = text.join(' ');
    }
  });

})(document);
