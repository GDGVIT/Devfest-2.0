const gulp=require('gulp');
const browserify=require('browserify');
const babelify=require('babelify');
const concat=require('gulp-concat');
const source=require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const connect=require('gulp-connect');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const ghPages = require('gulp-gh-pages');
const cssAssets = [
    `${__dirname}/src/css/materialize.css`,
    `${__dirname}/src/css/timelinecss.css`,
    `${__dirname}/src/css/mouse.css`,
    `${__dirname}/src/css/animate.css`,
    `${__dirname}/src/css/styles.css`
];
gulp.task('server',function () {
    connect.server({
        base:'http://localhost',
        port:'8000',
        root:'./dist',
        livereload:true
    });
});
gulp.task('js',function () {
    browserify(`${__dirname}/src/js/script.js`)
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(`${__dirname}/dist/js`))
        .pipe(connect.reload());
});
gulp.task('css',function () {
   gulp.src(cssAssets)
       .pipe(concat('bundle.css'))
       .pipe(cleanCSS())
       .pipe(gulp.dest(`${__dirname}/dist/css`));
   gulp.src(`${__dirname}/src/scss/effect.css`)
       .pipe(cleanCSS())
       .pipe(gulp.dest(`${__dirname}/dist/css`))
       .pipe(connect.reload());
});
gulp.task('images',function () {
    gulp.src(`${__dirname}/src/img/*`)
        .pipe(imagemin([imagemin.optipng({optimizationLevel: 7})]))
        .pipe(gulp.dest(`${__dirname}/dist/img`))
        .pipe(connect.reload());
});
gulp.task('manifest',function () {
    gulp.src(`${__dirname}/src/manifest.json`)
        .pipe(gulp.dest(`${__dirname}/dist`))
        .pipe(connect.reload());
});
gulp.task('html',function () {
    gulp.src(`${__dirname}/src/index.html`)
        .pipe(htmlmin({
                collapseWhitespace:true,
                minifyCSS:true,
                minifyJS:true,
                removeComments:true
            })
        )
        .pipe(gulp.dest(`${__dirname}/dist`))
        .pipe(connect.reload());
});
gulp.task('watch',function () {
    gulp.watch(`${__dirname}/src/index.html`,['html']);
    gulp.watch(`${__dirname}/src/manifest.json`,['manifest']);
    gulp.watch(`${__dirname}/src/css/*`,['css']);
    gulp.watch(`${__dirname}/src/js/*`,['js']);
    gulp.watch(`${__dirname}/src/img/*`,['images']);
});
gulp.task('deploy', function() {
    return gulp.src(`${__dirname}/dist/**/*`)
        .pipe(ghPages());
});
gulp.task('default',['css','js','images','html','manifest','server','watch'],function () {
   console.log('Server connected at http://localhost:8000');
   console.log('Watching for changes.');
});