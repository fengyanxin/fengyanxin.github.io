var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
// var imagemin = require('gulp-imagemin');
var imagemin = import('gulp-imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');

// 压缩css文件
gulp.task('minify-css', function() {
  return gulp.src('./public/**/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('./public'));
});
// 压缩html文件
gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
  .pipe(htmlclean())
  .pipe(htmlmin({
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }))
  .pipe(gulp.dest('./public'))
});
// 压缩js文件
gulp.task('minify-js', function() {
    return gulp.src(['./public/**/.js','!./public/js/**/*min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});
// 压缩 public/images 目录内图片(Version<3)
// gulp.task('minify-images', function() {
//    gulp.src('./public/images/**/*.*')
//        .pipe(imagemin({
//           optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//           progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//           interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//           multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
//        }))
//        .pipe(gulp.dest('./public/uploads'));
//});

// 压缩 public/images 目录内图片(Version>3)
// gulp.task('minify-images', function (done) {
//    gulp.src('./public/images/**/*.*')
//        .pipe(imagemin([
//            imageminGifsicle({interlaced: true}),
//            // imagemin.jpegtran({progressive: true}),
//            imageminMozjpeg({progressive: true}),
//            imageminOptipng({optimizationLevel: 5}),
//            imageminSvgo({
//                plugins: [
//                    {removeViewBox: true},
//                    {cleanupIDs: false}
//                ]
//            })
//        ]))
//        .pipe(gulp.dest('./public/images'));
//    done();
//});

//4.0以前的写法 
//gulp.task('default', [
//  'minify-html', 'minify-css', 'minify-js', 'minify-images'
//]);

//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.series(gulp.parallel('minify-html', 'minify-css', 'minify-js')), function () {
    console.log("----------gulp Finished----------");
    // Do something after a, b, and c are finished.
});
