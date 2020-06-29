const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const del = require('del');
const pug = require('gulp-pug');
const imagemin = require('gulp-image');
const copy = require('gulp-contrib-copy');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const paths = {
    partials: './dev/views/shared/*.pug',
    scripts: ['./dev/assets/scripts/common.js'],
    styles: './dev/assets/styles/**/*.sass',
    html: './dist/*.html',
    templates: './dev/views/*.pug',
    images: './dev/assets/images/*.*',
    copy: ['./dev/favicon.ico'],
};

gulp.task('clean', function () {
    return del.sync(['dist/**/*']); //Clean must be sync to avoid from errors
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('copy', ['clean'], function () {
    gulp.src(paths.copy)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(copy())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('html', function () {
    gulp.src(paths.html)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(browserSync.stream());
});

gulp.task('partials', function () {
    gulp.src(paths.partials)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(pug())
        .pipe(browserSync.stream());
});

gulp.task('templates', function () {
    gulp.src(paths.templates)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(pug({pretty: true})) // do this while developing
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    gulp.src(paths.scripts)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        //.pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('styles', function () {
    gulp.src(paths.styles)
        .pipe(plumber(function (error) {
            gutil.log(error);
            this.emit('end');
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('bundle.min.css'))
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    console.log('--- Gulp watching changes! ---')
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.partials, ['templates', 'partials']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.html, ['html']);
});

gulp.task('default', function () {
    runSequence(
        'clean',
        'copy',
        'images',
        'scripts',
        'partials',
        'templates',
        'styles',
        'browser-sync',
        'watch'
    );
});
