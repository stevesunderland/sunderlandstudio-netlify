var Site = {
	init: function() {
		Site.carousel();
		// Site.colorful();
		// Site.portfolio();
		Site.menu();
		Site.smoothscroll();
		if ($('#canvas1').length) {
			Site.animation();
		}
    // Site.showcase();
		Site.tooltip()
	},
	tooltip: function() {
		var popover = $('.popover');

		window.onmousemove = function (e) {
		    var x = e.clientX,
		        y = e.clientY,
					 	height = popover.height(),
						width = popover.width()

		    popover.css({ top: (y - height/2) + 'px' })
		    popover.css({ left: (x - width/2) + 'px' })
		};
	},
  showcase: function(){
    if ( $('.showcase').length ) {
      var rellax = new Rellax('.parallax', {
        speed: -5,
        center: true,
      });
    }
  },
	smoothscroll: function() {
		$('a[href*="#"]:not([href="#"])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html, body').animate({
						scrollTop: target.offset().top
					}, 1000);
					return false;
				}
			}
		});
	},
	menu: function() {
		$(document).on('click', '.menu-toggle, .mobile-menu a', function(){
			$('.mobile-menu').toggle(0);
		});
	},
	carousel: function() {
		var carousel = $('.carousel');
		if ( carousel.length ) {
			carousel.slick({
				autoplay: true,
				autoplaySpeed: 7000,
				arrows: false,
				pauseOnHover: false,
				dots: true
			});
		}
	},
	colorful: function() {
		var interval;
		var colors = ['#ff0000', '#ff8000', '#00ff00', '#0000ff', '#ff00ff'];
		// var colors = ['#E31606', '#FEBE09', '#55DB12', '#1D3AE1', '#A000FF'];
		var counter = 0;
		var speed = 300;

		cycleColors = function(element) {

			function doSomething() {
				// $(element).animate({ color: colors[counter], 'border-bottom-color': colors[counter] }, speed);
				$(element).css({ color: colors[counter], 'border-bottom-color': colors[counter] });
				counter++;
				if (counter == colors.length) {
					counter = 0;
				}
			};
			doSomething();
			interval = setInterval(doSomething, speed);
		};
		cycleColorsEnd = function(element) {
		  	element.css({ color: '', 'border-bottom-color': '#000' });
		  	clearInterval(interval);
		};
		cycleBackground = function(element) {
			function doSomething() {
				$(element).css({ 'background-color': colors[counter] });
				counter++;
				if (counter == colors.length) {
					counter = 0;
				}
			};
			doSomething();
			interval = setInterval(doSomething, speed);
		};
		cycleBackgroundEnd = function(element) {
		  	element.css({ 'background-color': '#000'});
		  	clearInterval(interval);
		};



		$('h1 a, a.button, .mobile-menu ul a').hover(function(){
			cycleColors($(this));
		}, function(){
			cycleColorsEnd($(this));
		});

		$('.colorful-bg').hover(function(){
		  	cycleBackground($(this));
		});

		cycleColors($('.colorful'));

	},
	portfolio: function() {
		if ( $('.portfolio-grid').length ) {

			function getHashFilter() {
			  var matches = location.hash.match( /filter\/([^&]+)/i );
			  var hashFilter = matches && matches[1];
			  return hashFilter && decodeURIComponent( hashFilter );
			}

			function getHash() {
				var hash = window.location.hash.replace('#', '');
				if (hash) {
					return '.' + hash;
				} else {
					return false;
				}
			}

			function resizeItems() {
				// var item = $('.portfolio-item');
				// var width = item.first().width()
				// var height = item.first().height()

				// height = width*.66;

				// item.height(height).width(width)
			}

			var $grid = $('.portfolio-grid');
			var isIsotopeInit = false;

			function onHashchange() {
			  var hashFilter = getHash();
			  if (hashFilter == '.all') {
			  	hashFilter = '*';
			  }
			  if ( !hashFilter && isIsotopeInit ) {
			    return;
			  }
			  isIsotopeInit = true;


				resizeItems()

				// $('')

			  $grid.isotope({
					// percentPosition: true,
					resize: false,
			    itemSelector: '.portfolio-item',
			    layoutMode: 'fitRows',
			    filter: hashFilter || '*'
			  });

			  if ( hashFilter ) {
			  	// $('.portfolio-filters').slideDown();
			  	$('.portfolio-filters a[data-filter="'+hashFilter+'"]').parents('li').addClass('active');
			  	$('.portfolio-filters-toggle').addClass('active');
			  }
			}

			$('.portfolio-filters a').on( 'click', function(event) {
				event.preventDefault();
				$('.portfolio-filters li').removeClass('active');
				$(this).parents('li').addClass('active');

				var filterValue = $( this ).attr('data-filter');
				$grid.isotope({ filter: filterValue });

				var filterHash = filterValue.replace('.', '');
				if (filterHash == '*') {
					filterHash = 'all';
				}
				location.hash = filterHash;
			});

			// $('.portfolio-filters').slideUp(0);
			// $('.portfolio-filters-toggle').on('click', function(event){
			// 	event.preventDefault();
			// 	$(this).toggleClass('active');
			// 	$('.portfolio-filters').slideToggle();
			// });

			onHashchange();
		}
	},
	animation: function() {
		var canvas1 = document.getElementById('canvas1'),
			canvas2 = document.getElementById('canvas2'),
			canvas3 = document.getElementById('canvas3')

		var scene1 = new THREE.Scene(),
			scene2 = new THREE.Scene(),
			scene3 = new THREE.Scene();

		var w = 200;

		var camera = new THREE.OrthographicCamera( -5, 5, 5, -5, 1, 1000 );

		var renderer1 = new THREE.WebGLRenderer({ antialias: true });
		var renderer2 = new THREE.WebGLRenderer({ antialias: true });
		var renderer3 = new THREE.WebGLRenderer({ antialias: true });

		renderer1.setSize(w, w);
		renderer1.setClearColor(0x000000);

		renderer2.setSize(w, w);
		renderer2.setClearColor(0x000000);

		renderer3.setSize(w, w);
		renderer3.setClearColor(0x000000);

		canvas1.appendChild(renderer1.domElement);
		canvas2.appendChild(renderer2.domElement);
		canvas3.appendChild(renderer3.domElement);

		var geometry = new THREE.BoxGeometry(5, 5, 5);
		var material = new THREE.MeshLambertMaterial({
		  wireframe: false,
		  transparent: true,
		  opacity: 0
		})
		var mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(0, 0, 0)

		var cube = new THREE.EdgesHelper(mesh, 0xffffff);
		cube.material.linewidth = 2;
		scene1.add(cube);

		scene1.add(mesh);

		var TILE_SIZE = 1.5;

		var geometry = new THREE.CylinderGeometry(0, TILE_SIZE * 3, TILE_SIZE * 3, 3);
		var cylinder = new THREE.Mesh(geometry, material);
		cylinder.position.set(0, 0, 0);

		var triangle = new THREE.EdgesHelper(cylinder, 0xffffff);
		triangle.material.linewidth = 2;

		var geometry = new THREE.SphereGeometry(4, 1, 1);
		var sphereGeo = new THREE.Mesh(geometry, material);
		sphereGeo.position.set(0, 0, 0);
		scene2.add(sphereGeo);

		var sphere = new THREE.EdgesHelper(sphereGeo, 0xffffff);
		sphere.material.linewidth = 2;
		scene2.add(sphere);

		var geometry = new THREE.CircleGeometry(3.5, 32);
		var material = new THREE.MeshBasicMaterial({
		  transparent: true,
		  opacity: 0,
		});
		var circleGeo = new THREE.Mesh(geometry, material);
		scene3.add(circleGeo);

		var circleGeo2 = new THREE.Mesh(geometry, material);
		circleGeo2.rotation.x = 90;
		circleGeo2.rotation.y = 90;
		scene3.add(circleGeo2);

		var circleGeo3 = new THREE.Mesh(geometry, material);
		circleGeo3.rotation.x = 90;
		scene3.add(circleGeo3);

		var circleGeo4 = new THREE.Mesh(geometry, material);
		scene3.add(circleGeo4);

		var circle1 = new THREE.EdgesHelper(circleGeo, 0xffffff);
		circle1.material.linewidth = 2;
		scene3.add(circle1);

		var circle2 = new THREE.EdgesHelper(circleGeo2, 0xffffff);
		circle2.material.linewidth = 2;
		scene3.add(circle2);

		var circle3 = new THREE.EdgesHelper(circleGeo3, 0xffffff);
		circle3.material.linewidth = 2;
		scene3.add(circle3);

		var circle4 = new THREE.EdgesHelper(circleGeo4, 0xffffff);
		circle4.material.linewidth = 2;
		scene3.add(circle4);

		var light = new THREE.AmbientLight(0xffffff, 1);
		scene1.add(light);
		scene2.add(light);
		scene3.add(light);

		camera.position.z = 30;

		function render() {
		  requestAnimationFrame(render);
		  mesh.rotation.x += 0.005;
		  mesh.rotation.y += 0.01;

		  cylinder.rotation.x += 0.005;
		  cylinder.rotation.y += 0.01;

		  sphereGeo.rotation.x += 0.005;
		  sphereGeo.rotation.y += 0.01;

		  circleGeo.rotation.x += 0.005;
		  circleGeo.rotation.y += 0.01;

		  circleGeo2.rotation.x += 0.005;
		  circleGeo2.rotation.y += 0.01;

		  circleGeo3.rotation.x += 0.005;
		  circleGeo3.rotation.y += 0.01;

		  renderer1.render(scene2, camera);
		  renderer2.render(scene3, camera);
		  renderer3.render(scene1, camera);
		}
		render();
	}
}

$(document).ready(function(){
	Site.init();
});

$.extend($.lazyLoadXT, {
  oncomplete: function(){
		console.log('lazy load complete!')
		// window.dispatchEvent(new Event('resize'));
		setTimeout(function(){
			// window.dispatchEvent(new Event('resize'));
			// Site.showcase()

		}, 1000)
	}
});
