(function (window, document) {

  'use strict';

  var canvas,
    color = '#98B232',
    context,
    count = 250,
    flakes = [];

  function debounce(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

  function init (width, height) {
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = color;
    context.lineWidth = 0.1;
    context.strokeStyle = color;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var left = document.querySelector('#left'),
      interval;

    canvas = document.querySelector('canvas');

    if (!canvas) {
      return;
    }

    context = canvas.getContext('2d')
    canvas.style.display = 'block';

    init(left.offsetWidth, left.offsetHeight);

    flakes = [];

    for (var i = 0; i < count; i++) {
      flakes.push(new Flake());
    }

    setInterval(animate, 1000 / 30);

    window.addEventListener('resize', debounce(function () {
      init(left.offsetWidth, left.offsetHeight);
    }, 200));

  });

  function animate () {

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var flake of flakes) {
      flake.draw();

      if (flake.y < 0 || flake.y > canvas.height) {
        flake.vx = flake.vx;
        flake.vy = -flake.vy;
      }
      else if (flake.x < 0 || flake.x > canvas.width) {
        flake.vx = -flake.vx;
        flake.vy = flake.vy;
      }
      flake.x += flake.vx;
      flake.y += flake.vy;
    }
  }

  function Flake () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = -.5 + Math.random();
    this.vy = -.5 + Math.random();
    this.radius = Math.random();

    this.draw = function draw () {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fill();
    }
  }

})(this, document);
