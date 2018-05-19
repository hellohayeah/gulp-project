var gulp = require('gulp');
var header = require('gulp-header');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create(); // 載入 browser-sync

gulp.task('browserSync', function () {
  return browserSync.init({
    server: {
      baseDir: './dev' // 要瀏覽器同步的資料夾
    },
    files: './dev/**/*'
  });
})

gulp.task('sass', function () {
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  var processors = [autoprefixer({
    browsers: ['last 2 version']
  })];
  return gulp.src('src/sass/*.sass')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    })) // 出錯則顯示提示視窗，不中斷。
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(header('@charset "UTF-8";'))
    .pipe(gulp.dest('./dev/css'))
});

gulp.task('pug', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    })) // 出錯則顯示提示視窗，不中斷。
    .pipe(pug())
    .pipe(gulp.dest('./dev'))
});

gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    })) // 出錯則顯示提示視窗，不中斷。
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dev/js'))
});

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dev/img'));
});

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.sass', gulp.parallel('sass'));
  gulp.watch('src/pug/**/*.pug', gulp.parallel('pug'))
  gulp.watch('src/js/**/*.js', gulp.parallel('js'));
  gulp.watch('src/img/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('watch', 'browserSync', 'pug', 'sass', 'js'))