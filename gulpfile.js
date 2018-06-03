var $        = require('gulp-load-plugins')();
var browser  = require('browser-sync');
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');

var slug        = require('slug')
var data        = require('gulp-data');
var pug         = require('gulp-pug');
var rename      = require('gulp-rename');
var imagemin    = require('gulp-imagemin');
var cleanCSS    = require('gulp-clean-css');
var frontMatter = require('gulp-front-matter');
var marked      = require('gulp-marked');
var layout      = require('gulp-layout');


// var md = require('jstransformer')(require('jstransformer-markdown-it'));

// var scraperjs   = require('scraperjs');
var fs          = require('fs')
// var moment      = require('moment')
// var oembed      = require('oembed')


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
    '!src/assets/{img,js,scss}/**/*'
  ],
  sass: [
    'node_modules/foundation-sites/scss',
    // 'node_modules/motion-ui/src/'
  ],
  javascript: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/foundation-sites/dist/js/foundation.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.autoload.js',
    'node_modules/lazyloadxt/dist/jquery.lazyloadxt.bg.js',
    'node_modules/wowjs/dist/wow.js',
    'src/assets/js/app.js'
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





gulp.task('portfolio', function(){
  articles = [];

  return gulp.src('./src/portfolio/*.md')
  .pipe(frontMatter({
    property: 'metadata',
    remove: true
  }))
  .pipe(marked())
  .pipe(layout(function(file){
    // console.log('file metadata: '+JSON.stringify(file.metadata))
    basename = slug(file.metadata.title || 'none', {lower: true })
    // var embed = getOembed(file.metadata.link);
    // console.info('embed: '+embed)

    article_data = {
      'title': file.metadata.title,
      'description': file.metadata.description,
      'slug': basename,
      'date': file.metadata.date,
      'gallery': file.metadata.gallery,
      // 'pretty_date': moment(file.metadata.date).format("L"),
      // 'category': file.metadata.category,
      // 'link': file.metadata.link,
      // 'contents': md.render(file.metadata.text + '').body,
      // 'oembed': embed
    }
    articles.push(article_data)

    return {
      pretty: true,
      layout: 'src/templates/_portfolio.pug',
      data: article_data,
      // file: homepage,
      // books: orderByDate(books, 'date'),
      // articles: orderByDate(articles, 'date'),
      // videos: orderByDate(videos, 'date'),
      // podcast: podcast

      // markdown: require('gulp-marked')
    }
  }))
  .pipe(rename(function(path){
    path.basename = '' + basename
    path.extname = '.html'
  }))
  .pipe(gulp.dest('dist/portfolio'))
})



// var homepage = {}

// gulp.task('homepage', ['portfolio'], function(){
//   return gulp.src('./src/homepage.md')
//   .pipe(frontMatter({
//     property: 'metadata',
//     remove: true
//   }))
//   .pipe(marked())
//   .pipe(layout(function(file){
//     basename = 'homepage'


//     homepage = {
//       'headline': file.metadata.headline,
//       'text': file.metadata.text,
//       'slug': basename
//     }

//     return {
//       pretty: true,
//       layout: 'src/templates/_homepage.pug',
//       // file: homepage,
//       // books: orderByDate(books, 'date'),
//       // articles: orderByDate(articles, 'date'),
//       // videos: orderByDate(videos, 'date'),
//       // podcast: podcast

//       // markdown: require('gulp-marked')
//     }
//   }))
//   .pipe(rename(function(path){
//     path.basename = 'index'
//     path.extname = '.html'
//   }))
//   .pipe(gulp.dest('dist'))
// })




gulp.task('templates', ['portfolio'], function() {
  gulp.src(['src/templates/*.pug', '!src/templates/_*.pug'])
  .pipe(data( function(file) {
    // delete require.cache[require.resolve('./src/data.json')]
    // var data = require('./src/data.json');

    return {
      // 'data': data,
      // 'pages':pages,
      // 'bloomberg': bloomberg,
      // 'books': orderByDate(books, 'date'),
      // 'articles': orderByDate(articles, 'date'),
      // 'videos': orderByDate(videos, 'date'),
      // 'podcast': podcast
    };
  } ))
  .pipe(pug({
    data: {
      'foo': 'bar',
      // 'videos': orderByDate(videos, 'date'),
      // 'pages': pages
    }
  }))
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
    .pipe(gulp.dest('dist/assets/js'))
    .on('finish', browser.reload);
});

// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
  var maybeImagemin = $.if(isProduction, imagemin({
    progressive: true,
    svgoPlugins: [
      {removeViewBox: false},
      {cleanupIDs: false}
    ]
  }));

  return gulp.src('src/assets/img/**/*')
  // .pipe(maybeImagemin)
  .pipe(gulp.dest('dist/assets/img'))
  .on('finish', browser.reload);
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['templates', 'sass', 'javascript', 'images', 'copy', 'admin'], done);
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  // livereload.listen();
  browser.init({
    server: 'dist', port: PORT
  });
});


// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(PATHS.assets, ['copy']);
  // gulp.watch(['src/casestudies/*'], ['build']);
  gulp.watch(['src/**/*.pug'], ['templates']);
  // gulp.watch(['src/{layouts,partials,helpers,data}/**/*'], ['pages:reset']);
  gulp.watch(['src/assets/scss/**/{*.scss, *.sass}'], ['sass']);
  gulp.watch(['src/assets/js/**/*.js'], ['javascript']);
  gulp.watch(['src/assets/img/**/*'], ['images']);
  gulp.watch(['src/data.json'], ['build']);
});
