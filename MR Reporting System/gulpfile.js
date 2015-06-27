var gulp = require('gulp');

var durandal = require('gulp-durandal');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var util = require('gulp-util');
var minifyCss = require('gulp-minify-css');

gulp.task('default', function () {
    return durandal({
        baseDir: 'app',
        main: 'main.js',
        output: 'main-gulp.js',
        almond: true,
        minifiy: true,
        verbose: true
    }).pipe(gulp.dest('app'));
});

gulp.task('mainMinify', function () {
    return gulp.src('app/main-gulp.js')
      .pipe(rename('main-gulp.min.js'))
      .pipe(uglify().on('error', util.log))
      .pipe(gulp.dest('app'));
});

gulp.task('scripts', function () {
    return gulp.src(['lib/procoor-scripts.js', 'app/main-gulp.js'])
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./'))
      .pipe(rename('app.min.js'))
      .pipe(uglify().on('error', util.log))
      .pipe(gulp.dest('./'));
});

gulp.task('scripts2', function () {
    return gulp.src([
            'lib/jquery-2.1.1.js',
            'lib/underscore.js',
            'lib/calendar.js',
            'lib/jquery-ui-1.11.1.js',
            'lib/dropzone.js',
            'lib/jquery.validate.js',
            'lib/select2.js',
            'lib/bootstrap.js',
            'lib/bootstrap-editable.js',
            'lib/bootstrap-datepicker.js',
            'lib/jquery.bootstrap.wizard.js',
            'lib/bootstrap-switch.min.js',
            'lib/bootstrap-select.min.js',
            'lib/app.config.js',
            'lib/SmartNotification.js',
            'lib/jarvis.widget.js',
            'lib/app.js',
            'lib/jquery.mb.browser.js',
            'lib/fastclick.js',
            'lib/summernote.js',
            'lib/knockout-3.2.0.js',
            'lib/knockout-mapping.min.js',
            'lib/nicescroll.min.js',
            'lib/nicescroll.plus.js',
            'lib/moment.min.js',
            'lib/daterangepicker.js',
            'lib/core-min.js',
            'lib/enc-base64-min.js',
            'lib/highslide-full.min.js',
            'lib/highslide.config.js',
            'lib/highcharts.js',
            'lib/data.js',
            'lib/exporting.js',
            'lib/sand-signika.js',
            'lib/linq.min.js',
            'lib/FileSaver.js',
            'lib/jszip.js',
            'lib/jspdf.min.js',
            'lib/jspdf.plugin.autotable.js',
            'lib/bootstrap-timepicker.js',
            'lib/html2canvas.js',
            'lib/jquery.nestable.min.js',
            'lib/jquery.scrollbar.js',
            'lib/koGrid-2.1.1.js',
            'lib/slick.min.js'
        ])
        .pipe(concat('procoor-scripts.js'))
        .pipe(gulp.dest('lib'));
});

gulp.task('styles', function () {
    return gulp.src([
            'css/bootstrap-datetimepicker.css',
            'css/bootstrap-editable.css',
            'css/bootstrap-sortable.css',
            'css/bootstrap-select.min.css',
            'css/bootstrap-switch.min.css',
            'css/bootstrap.css',
            'css/daterangepicker-bs3.css',
            'css/durandal.css',
            'css/font-awesome.min.css',
            'css/highslide.css',
            'css/lockscreen.min.css',
            'css/smartadmin-production.css',
            'css/smartadmin-skins.css',
            'css/smartadmin-rtl.css',
            'css/smartadmin-production-plugins.css',
            'css/datepicker3.css',
            'css/main.css',
            'css/calendar.css',
            'css/slick.css',
            'css/slick-theme.css'
    ]).pipe(concat('styles.css'))
      .pipe(gulp.dest('css'))
      .pipe(rename('styles.min.css'))
      .pipe(minifyCss({ compatibility: 'ie8' }))
      .pipe(gulp.dest('css'));
});