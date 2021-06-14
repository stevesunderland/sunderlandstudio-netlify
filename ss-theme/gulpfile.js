var $           = require('gulp-load-plugins')();
var browser     = require('browser-sync');
var gulp        = require('gulp');
var rimraf      = require('rimraf');
var sequence    = require('run-sequence');
var fs          = require('fs')
var slug        = require('slug')
var data        = require('gulp-data');
var pug         = require('gulp-pug');
var rename      = require('gulp-rename');
var imagemin    = require('gulp-imagemin');
var cleanCSS    = require('gulp-clean-css');
var frontMatter = require('gulp-front-matter');
var marked      = require('gulp-marked');
var markdown    = require('gulp-markdown');
var md          = require('jstransformer')(require('jstransformer-markdown-it'));
var layout      = require('gulp-layout');
var responsive = require('gulp-responsive');
var uglify      = require('gulp-uglify');


// Check for --production flag
var isProduction = true;

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  assets: [
    'src/assets/**/*',
    '!src/assets/{img,javascript,scss}/**/*'
  ],
  sass: [
    'node_modules/foundation-sites/scss',
  ],
  javascript: [
    'node_modules/jquery/dist/jquery.js',
    // 'node_modules/slick-carousel/slick/slick.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.autoload.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.bg.js',
    'node_modules/isotope-layout/dist/isotope.pkgd.js',
    'assets/javascript/three.js',
    'assets/javascript/app.js'
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


// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {

  var minifycss = $.if(isProduction, cleanCSS());

  return gulp.src('_sass/app.scss')
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    includePaths: PATHS.sass
  })
  .on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: COMPATIBILITY
  }))
  .pipe(rename('app.min.css'))
  .pipe(minifycss)
  .pipe($.if(!isProduction, $.sourcemaps.write()))
  .pipe(gulp.dest('../assets/css'))
  // .pipe(browser.reload({ stream: true }));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.min.js'))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(uglify())
    // .on('error', onError)
    .pipe(gulp.dest('../assets/javascript'))
    .on('finish', browser.reload);
});

// Copy images to the "dist" folder
// In production, the images are compressed
// gulp.task('images', function() {
//   var maybeImagemin = $.if(isProduction, imagemin({
//     progressive: true,
//     svgoPlugins: [
//       {removeViewBox: false},
//       {cleanupIDs: false}
//     ]
//   }));
//
//   return gulp.src('src/assets/img/**/*')
//   // .pipe(maybeImagemin)
//   .pipe(gulp.dest('dist/assets/img'))
//   .on('finish', browser.reload);
// });



gulp.task('resizeImages', function () {
  return gulp.src('src/assets/images/*')
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
      format: 'jpeg',
      silent: true,
    }))
    .pipe(gulp.dest('../assets/images'));
});





// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['templates', 'sass', 'javascript', 'copy', 'admin', 'resizeImages'], done);
});




// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  // gulp.watch(PATHS.assets, ['copy']);
  // gulp.watch(['src/casestudies/*'], ['build']);
  // gulp.watch(['src/**/*.pug', 'src/**/*.md'], ['templates']);
  // gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], ['pages:reset']);
  gulp.watch(['src/assets/scss/**/{*.scss, *.sass}'], ['sass']);
  gulp.watch(['src/assets/javascript/**/*.js'], ['javascript']);
  // gulp.watch(['src/assets/img/**/*'], ['resizeImages']);
  // gulp.watch(['src/admin/**/*'], ['admin']);
  // gulp.watch(['src/data.json'], ['build']);
  // gulp.watch(['gulpfile.js'], ['gulpfile-autoreload']);
});
