var Site = {
	init: function() {
		Site.portfolio();
		Site.menu();
		Site.testimonials()

		if ($('.testimonial-column').length) {
			Site.testimonials()
		}

		if ($('#canvas1').length) {
			Site.animation();
		}
	},
	testimonials: function() {
		var cards = $(".testimonial-column");
		for(var i = 0; i < cards.length; i++){
			var target = Math.floor(Math.random() * cards.length -1) + 1;
			var target2 = Math.floor(Math.random() * cards.length -1) +1;
			cards.eq(target).before(cards.eq(target2));
		}
	},
	menu: function() {
		$(document).on('click', '.menu-toggle, .mobile-menu a', function(){
			// $('.mobile-menu').toggle(0);
			$('body').toggleClass('menu-active')
		});
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
			  if (hashFilter == '.background') {
			  	hashFilter = '*';
			  }
			  if (hashFilter == '.testimonials') {
			  	hashFilter = '*';
			  }
			  if (hashFilter == '.services') {
			  	hashFilter = '*';
			  }
			  if (hashFilter == '.contact') {
			  	hashFilter = '*';
			  }


			  isIsotopeInit = true;

			  $grid.isotope({
			    itemSelector: '.portfolio-item',
			    layoutMode: 'fitRows',
			    filter: hashFilter || '*',
			    transitionDuration: 0,
			    hiddenStyle: {
					opacity: 0
				},
				visibleStyle: {
					opacity: 1
				},
			  });

			  if ( hashFilter && $('body').hasClass('portfolio') ) {
			  	$('.portfolio-filters a[data-filter="'+hashFilter+'"]').parents('li').addClass('active');
			  	$('.portfolio-filters-toggle').addClass('active');
			  }

			  setTimeout(function(){
				$grid.isotope({ transitionDuration: 600 })
			  }, 500);
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

			onHashchange();

			$.extend($.lazyLoadXT, {
			  forceLoad: true,
			  oncomplete: function(){
				$grid.isotope('layout');
			  }
			});

			setTimeout(function(){
				$grid.isotope('layout');
			}, 500)
		}
	},
	animation: function() {

		console.log('site.animation')
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


		// var $color1 = 0x00FFFF;
		// var $color2 = 0xFF00FF;
		// var $color3 = 0xFFFF00;

		var $color1, $color2, $color3 = 0xFFFFFF;

		// var line_material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } )
		var line_material = new THREE.LineBasicMaterial( { color: $color3, linewidth: 2 } )

		var edges = new THREE.EdgesGeometry( geometry );
		var mesh = new THREE.LineSegments(edges, line_material);
		scene1.add(mesh);


		var geometry = new THREE.SphereGeometry(4, 1, 1);
		var line_material2 = new THREE.LineBasicMaterial( { color: $color1, linewidth: 2 } )

		var sphere_geo = new THREE.EdgesGeometry( geometry );
		var sphere = new THREE.LineSegments(sphere_geo, line_material2);
		scene2.add(sphere);


		var geometry = new THREE.CircleGeometry(3.5, 32);

		var circle1_edges = new THREE.EdgesGeometry(geometry);
		var circle1 = new THREE.LineSegments(circle1_edges, new THREE.LineBasicMaterial( { color: $color2, linewidth: 2 }));
		circle1.rotation.x = 90;
		circle1.rotation.y = 90;
		scene3.add(circle1);

		var circle2 = new THREE.LineSegments(circle1_edges, new THREE.LineBasicMaterial( { color: $color2, linewidth: 2 }));
		scene3.add(circle2);

		var circle3 = new THREE.LineSegments(circle1_edges, new THREE.LineBasicMaterial( { color: $color2, linewidth: 2 }));
		circle3.rotation.x = 90;
		scene3.add(circle3);

		// var circle4_edges = new THREE.EdgesGeometry(geometry);
		var circle4 = new THREE.LineSegments(circle1_edges, new THREE.LineBasicMaterial( { color: $color2, linewidth: 2 }));
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

		  // cylinder.rotation.x += 0.005;
		  // cylinder.rotation.y += 0.01;

		  sphere.rotation.x += 0.005;
		  sphere.rotation.y += 0.01;

		  circle1.rotation.x += 0.005;
		  circle1.rotation.y += 0.01;

		  circle2.rotation.x += 0.005;
		  circle2.rotation.y += 0.01;

		  circle3.rotation.x += 0.005;
		  circle3.rotation.y += 0.01;

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
