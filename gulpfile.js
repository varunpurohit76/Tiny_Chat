var gulp = require('gulp');
var browserSync = require('browser-sync').create()

gulp.task('watch',['browserSync'],function(){
	gulp.watch('app/*.js',['scripts']);
	gulp.watch('app/*.html',['views']);
});

gulp.task('browserSync',function(){
	browserSync.init({
		server : {
			baseDir: 'app'
		},
	})
});

gulp.task('scripts',function(){
	return gulp.src('app/*.js')
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('views',function(){
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({
		stream: true
	}))
});
