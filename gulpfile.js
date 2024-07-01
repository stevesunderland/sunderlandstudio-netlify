var $           = require('gulp-load-plugins')();
var gulp        = require('gulp');
var rimraf      = require('rimraf');
var sequence    = require('run-sequence');
var fs          = require('fs')
var slug        = require('slug')
var rename      = require('gulp-rename');
var imagemin    = require('gulp-imagemin');
var responsive  = require('gulp-responsive');
var uglify      = require('gulp-uglify');


// Check for --production flag
var isProduction = true;

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  javascript: [
    'node_modules/jquery/dist/jquery.js',
    // 'node_modules/slick-carousel/slick/slick.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.autoload.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.bg.js',
    'node_modules/isotope-layout/dist/isotope.pkgd.js',
    // 'node_modules/three/build/three.js',
    // 'assets/javascript/three.js',
    'assets/javascript/app.js'
  ],
  three: [
    'node_modules/three/build/three.js',
    // 'node_modules/three/src/renderers/WebGLRenderer.js',
    // 'node_modules/three/src/scene/Scene.js',
    // 'node_modules/three/src/scene/cameras/OrthographicCamera.js',
    // 'node_modules/three/src/geometries/Geometries.js',
    // 'node_modules/three/src/geometries/Materials.js',
    // 'node_modules/three/src/objects/LineSegments.js',
    // 'node_modules/three/src/lights/AmbientLight.js',
  ]
};

// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  // rimraf('dist', done);
  return
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
gulp.task('copy', function() {
  return gulp.src(PATHS.assets)
  .pipe(gulp.dest('dist/assets'));
});

function backgroundImage(image) {
  var split = image.split('.')
  var string = split[0] + '-680.' + split[1]
	// return image.replace('.jpg', '-680.jpg')
	return string
}

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.min.js'))
    .pipe($.sourcemaps.write())
    .pipe(uglify())
    // .on('error', onError)
    .pipe(gulp.dest('./assets/javascript'))
    // .on('finish', browser.reload);
});

gulp.task('images', function () {
  return gulp.src('assets/newimages/*')
    .pipe($.responsive({
      '*': [{
        width: 680,
        rename: { suffix: '-680' },
      }, {
        width: 1440,
        rename: { suffix: '-1440' },
      }, {
        rename: { suffix: '-original' },
      }],
    }, {
      quality: 80,
      progressive: true,
      withMetadata: false,
      withoutEnlargement: false,
      format: 'jpg',
      silent: true,
    }))
    .pipe(gulp.dest('assets/images'));
});

// Build the "dist" folder by running all of the above tasks
gulp.task('default', function(done) {
  sequence('javascript', [], done);
});




// Build the site, run the server, and watch for file changes
gulp.task('watch', [], function() {
  // gulp.watch(PATHS.assets, ['copy']);
  // gulp.watch(['src/casestudies/*'], ['build']);
  // gulp.watch(['src/**/*.pug', 'src/**/*.md'], ['templates']);
  // gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], ['pages:reset']);
  gulp.watch(['./assets/_sass/**/{*.scss, *.sass}'], ['sass']);
  gulp.watch(['./assets/javascript/**/*.js'], ['javascript', 'three']);
  // gulp.watch(['src/assets/img/**/*'], ['resizeImages']);
  // gulp.watch(['src/admin/**/*'], ['admin']);
  // gulp.watch(['src/data.json'], ['build']);
  // gulp.watch(['gulpfile.js'], ['gulpfile-autoreload']);
});
