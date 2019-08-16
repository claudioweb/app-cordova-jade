// Requiring necessary packages
var gulp = require('gulp')
watch = require('gulp-watch'),
jade = require('gulp-jade'),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
bless = require('gulp-bless'),
imageMin = require('gulp-imagemin'),
cssNano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
changed = require('gulp-changed'),
livereload = require('gulp-livereload'),
cordova = require('gulp-cordova');

var config = {
	"routes": {
		"source": "src/",
		"dist": "www/"
	},
	"output": {
		"cssFile": "style.min.css",
		"jsFile": "main.min.js"
	}
};

// Prevent errors from shutting down Gulp
function swallowError (error) {
	console.log(error.toString())
	this.emit('end')
}

gulp.task('cordova', function() {
	gulp.src('./cordova.json')
	.pipe(cordova())
});

gulp.task('server', function() {
	setTimeout(function(){
		gulp.src('./server.json')
		.pipe(cordova());
	},1000);
});

// Compile jade files to HTML (single file)
gulp.task('html', function() {
	gulp.src([config.routes.source + '/*.jade'])
	.pipe(changed(config.routes.dist), {extension: 'html'})
	.pipe(jade({
		pretty: true
	}))
	.on('error', swallowError)
	.pipe(gulp.dest(config.routes.dist));
});

// Compile SCSS files to CSS (single file)
gulp.task('css', function() {
	gulp.src(config.routes.source + '/scss/main.scss')
	.pipe(changed(config.routes.dist + '/css'), {extension: 'css'})
	.pipe(concat(config.output.cssFile))
	.pipe(sass())
	.on('error', swallowError)
	.pipe(autoprefixer())
	.pipe(bless())
	.pipe(cssNano())
	.pipe(gulp.dest(config.routes.dist + '/css'));
});

gulp.task('css-libs', function() {
	gulp.src(config.routes.source + '/js/libs/*.css')
	.pipe(changed(config.routes.dist + '/js/libs'), {extension: 'css'})
	.on('error', swallowError)
	.pipe(gulp.dest(config.routes.dist + '/js/libs'));
});

// Compile JS files into a single file
gulp.task('js', function() {
	gulp.src(config.routes.source + '/js/**/*.js')
	.pipe(changed(config.routes.dist + '/js'), {extension: 'js'})
	.pipe(concat(config.output.jsFile))
	.pipe(uglify())
	.on('error', swallowError)
	.pipe(gulp.dest(config.routes.dist + '/js'));
});

gulp.task('js-libs', function() {
	gulp.src(config.routes.source + '/js/libs/*.js')
	.pipe(changed(config.routes.dist + '/js/libs'), {extension: 'js'})
	.pipe(uglify())
	.on('error', swallowError)
	.pipe(gulp.dest(config.routes.dist + '/js/libs'));
});

// Compile fonts on the dist folder
gulp.task('fonts', function() {
	gulp.src(config.routes.source + '/fonts/**/*.*')
	.pipe(gulp.dest(config.routes.dist + '/fonts'));
});

// Minifies all images like TinyPNG
gulp.task('img', function() {
	gulp.src(config.routes.source + '/img/**/*.*')
	.pipe(changed(config.routes.dist + '/img'))
	.pipe(imageMin())
	.pipe(gulp.dest(config.routes.dist + '/img'));
});

// Watch all editable files for browser-sync reload method
gulp.task('watch', function() {
	var html = gulp.watch([config.routes.source + '/*.jade', config.routes.source + '/jade/**/*.jade'], ['html']);
	var css = gulp.watch([config.routes.source + '/scss/**/*.scss'], ['css']);
	var js = gulp.watch([config.routes.source + '/js/**/*.js'], ['js']);
	var cordova = gulp.watch([config.routes.source + '/**/**.**'], ['server']);
});

// Global task
gulp.task('default', ['html', 'css', 'css-libs', 'js', 'js-libs', 'img', 'fonts', 'watch', 'cordova']);