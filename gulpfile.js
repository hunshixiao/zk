var gulp=require('gulp');
var sass=require('gulp-sass');//编译sass
var uglify=require('gulp-uglify');//压缩js
var babel=require('gulp-babel');//压缩es5
var webserver=require('gulp-webserver');//起服务
var fs=require('fs');
var path=require('path');
var url=require('url');
//编译sass
gulp.task('sass',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'))
})
//监听
gulp.task('change',function(){
    gulp.watch('./src/scss/*.scss',gulp.series('sass'));
})
//压缩
gulp.task('ugli',function(){
    return gulp.src('./src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/main'))
})
//起服务
gulp.task('web',function(){
    gulp.src('./src/')
    .pipe(webserver({
        port:'8081',
        host:'localhost',
        middleware:[function(req,res,next){
            if(req.url==='/favicon.ico'){
                res.end('');
                return;
            }
            var pathname=url.parse(req.url).pathname;
            if(/^\/api/.test(req.url)){

            }else{
               pathname=pathname==='/'?'index.html':pathname;
               res.end(fs.readFileSync(path.join(__dirname,'src',pathname)));
            }
        }]
    }))
})
gulp.task('dev',gulp.series('sass','ugli','web','change'))
//把css输出到dist
gulp.task('sas',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css/'))
})
//把js输出到dist
gulp.task('js',function(){
    return gulp.src('./src/js/main/*.js')
    .pipe(gulp.dest('./dist/js/main/'))
})
//把html输出到dist
gulp.task('html',function(){
      return gulp.src('./src/*.html')
     .pipe(gulp.dest('./dist/'))
})