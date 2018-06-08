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


// Check for --production flag
var isProduction = true;

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  admin: [
    'src/admin/**/*'
  ],
  assets: [
    'src/assets/**/*',
    '!src/assets/{img,javascript,scss}/**/*'
  ],
  sass: [
    'node_modules/foundation-sites/scss',
  ],
  javascript: [
    'node_modules/jquery/dist/jquery.js',
    // 'node_modules/foundation-sites/dist/js/foundation.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.autoload.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.bg.js',
    'node_modules/isotope-layout/dist/isotope.pkgd.js',
    // 'node_modules/rellax/rellax.js',
    // 'node_modules/wowjs/dist/wow.js',
    'src/assets/javascript/three.js',
    'src/assets/javascript/app.js'
  ]
};

// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
gulp.task('copy', function() {
  return gulp.src(PATHS.assets)
  .pipe(gulp.dest('dist/assets'));
});

gulp.task('admin', function() {
  return gulp.src(PATHS.admin)
  .pipe(gulp.dest('dist/admin'));
});



function orderByDate(arr, dateProp) {
  return arr.slice().sort(function (a, b) {
    return a[dateProp] < b[dateProp] ? -1 : 1;
  });
}

function sortShowcase(array) {

  var filtered_array = array.filter(function(element){
    return element.showcase !== undefined
  })

  var new_array = filtered_array.sort(function(a, b) {
    return a.showcase.order < b.showcase.order ? -1 : 1
  })

  return new_array
}

function getPreviousArticle(article) {

  var articles_sorted = orderByDate(articles, 'date').reverse()
  var index = articles_sorted.indexOf(article)
  var previousArticle = articles_sorted[index-1]

  if (previousArticle) {
    return previousArticle
  } else {
    return null
  }
}

function getNextArticle(article) {

  var articles_sorted = orderByDate(articles, 'date').reverse()
  var index = articles_sorted.indexOf(article)
  var nextArticle = articles_sorted[index+1]

  if (nextArticle) {
    return nextArticle
  } else {
    return null
  }
}

function backgroundImage(image) {
  var split = image.split('.')
  var string = split[0] + '-680.' + split[1]
	// return image.replace('.jpg', '-680.jpg')
	return string
}



var tags = []

gulp.task('tags', function(){
  tags = []
  return gulp.src('./src/tags/*.md')
  .pipe(frontMatter({
    property: 'metadata',
    remove: true,
  }))
  .pipe(layout(function(file){
    // console.log(file.metadata.title)
    var isFeatured = file.metadata.featured
    if (isFeatured) {
      tags.push(file.metadata.title)
    }
  }))

})


var testimonials = []

gulp.task('testimonials', function(done){
  testimonials = []

  return gulp.src('./src/testimonials/*.md')
    .pipe(frontMatter({
      property: 'metadata',
      remove: true,
    }))
    .pipe(layout(function(file){

      var _testimonial = {
        'title': file.metadata.title,
        'quote': file.metadata.quote,
      }

      testimonials.push(_testimonial)
    }))

})


var articles = []

gulp.task('portfolio', ['tags'], function(){
  articles = [];

  return gulp.src('./src/portfolio/*.md')
  .pipe(frontMatter({
    property: 'metadata',
    remove: true
  }))
  .pipe(marked())
  .pipe(layout(function(file){
    basename = slug(file.metadata.title || 'none', {lower: true })

    if (file.metadata.date == null) {
      return
    }

    article_data = {
      'title': file.metadata.title,
      // 'description': file.metadata.description,
      'description': md.render(file.metadata.description + '').body,
      'slug': basename,
      'date': file.metadata.date,
      'gallery': file.metadata.gallery,
      'testimonial': file.metadata.testimonial,
      'featured': file.metadata.featured,
      'tags': file.metadata.tags,
      'showcase': file.metadata.showcase,
      'website': file.metadata.website,
    }
    articles.push(article_data)

    return {
      pretty: true,
      layout: 'src/templates/_portfolio.pug',
      data: article_data,
      articles: orderByDate(articles, 'date').reverse(),
      testimonials: testimonials,
      getNextArticle: getNextArticle,
      getPreviousArticle: getPreviousArticle,
      markdown: markdown,
    }
  }))
  .pipe(rename(function(path){
    path.basename = '' + basename
    path.extname = '.html'
  }))
  .on('error', onError)
  .pipe(gulp.dest('dist/portfolio'))
})




gulp.task('templates', ['portfolio', 'testimonials'], function() {
  gulp.src(['src/templates/*.pug', '!src/templates/_*.pug'])
  .pipe(pug({
    data: {
      'articles': orderByDate(articles, 'date').reverse(),
      'testimonials': testimonials,
      'tags': tags,
      'foo': 'bar',
      sortShowcase: sortShowcase,
      backgroundImage: backgroundImage,

    }
  }))
  .on('error', onError)
  .pipe(gulp.dest('./dist/'))
  .on('finish', browser.reload)
});


// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {

  var minifycss = $.if(isProduction, cleanCSS());

  return gulp.src('src/assets/scss/app.scss')
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    includePaths: PATHS.sass
  })
  .on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: COMPATIBILITY
  }))
  .pipe(minifycss)
  .pipe($.if(!isProduction, $.sourcemaps.write()))
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(browser.reload({ stream: true }));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .on('error', onError)
    .pipe(gulp.dest('dist/assets/js'))
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
    }))
    .pipe(gulp.dest('dist/assets/images'));
});





var spawn = require('child_process').spawn;

gulp.task('gulpfile-autoreload', function() {
  // console.info('are you going to reload?')
  // Store current process if any
  var p;

  gulp.watch('gulpfile.js', spawnChildren);
  // Comment the line below if you start your server by yourslef anywhere else
  spawnChildren();

  function spawnChildren(callback) {
    if(p) { p.kill(); }
    p = spawn('gulp', ['build'], { stdio: 'inherit' });

    if(callback) { callback(); }
  }
});



// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['templates', 'sass', 'javascript', 'copy', 'admin', 'resizeImages'], done);
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  // livereload.listen();
  browser.init({
    server: {
      baseDir: './dist',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    port: PORT,
  });
});


function onError(err) {
  console.log(err);
  this.emit('end');
}


// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(PATHS.assets, ['copy']);
  // gulp.watch(['src/casestudies/*'], ['build']);
  gulp.watch(['src/**/*.pug'], ['templates']);
  // gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], ['pages:reset']);
  gulp.watch(['src/assets/scss/**/{*.scss, *.sass}'], ['sass']);
  gulp.watch(['src/assets/javascript/**/*.js'], ['javascript']);
  // gulp.watch(['src/assets/img/**/*'], ['resizeImages']);
  gulp.watch(['src/admin/**/*'], ['admin']);
  gulp.watch(['src/data.json'], ['build']);
  // gulp.watch(['gulpfile.js'], ['gulpfile-autoreload']);
});
