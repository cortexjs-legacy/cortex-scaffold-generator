'use strict';

var gulp = require('gulp');
var compiler = require('gulp-cortex-handlebars-compiler');
var less = require('gulp-less');
var path = require('path');

gulp.task('img', function(){
  gulp.src('./img/**/*')
    .pipe(gulp.dest('./src/img/'));
});

gulp.task('less', function() {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'less')
      ]
    }))
    .on('error', console.error)
    .pipe(gulp.dest('src/css/'));

  gulp.src('./less/img/**/*.*')
    .pipe(gulp.dest('src/css/img'));
});

gulp.task('handlebar', function() {
  gulp.src(["handlebar/**/*.html"])
    .pipe(compiler({
      // `cortex build` might be executed inside a sub directory
      cwd: __dirname,
      href_root: process.env.CORTEX_EFTE_HREF_ROOT,
      js_ext: process.env.CORTEX_EFTE_JS_EXT || '.js',
      css_ext: process.env.CORTEX_EFTE_CSS_EXT || '.css'
    }).compile())
    .on('error', console.error)
    .pipe(gulp.dest("src/"));
});

gulp.task('default', ['less', 'handlebar'])