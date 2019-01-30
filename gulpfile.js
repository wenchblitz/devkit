const   gulp            =   require('gulp'),
        sass            =   require('gulp-sass'),
        autoprefixer    =   require('gulp-autoprefixer'),
        csscomb         =   require('gulp-csscomb'),
        rename          =   require('gulp-rename'),
        uglify          =   require('gulp-uglify'),
        sourcemaps      =   require('gulp-sourcemaps'),
        pump            =   require('pump'),
        browserSync     =   require('browser-sync').create(),
        reload          =   browserSync.reload,
        error           =   sass.logError;
 
// Static Server + watching scss/html files
gulp.task('server', function(){    
    // Starting the server
    browserSync.init({
        server: './',     
        // proxy: "http://localhost/wordpress/",
        notify: false, 
        browser: ['chrome'] // ['chrome', 'firefox'],        
    }); 

    // Watching php/html/css/js files
    const css = ['styles', 'debugger'];
    const minify = ['minify'];    
    gulp.watch('./src/sass/**/**/*.scss', css);        
    gulp.watch('./*.html', css).on('change', reload); 
    gulp.watch('./js/app.js', minify).on('change', reload);
    gulp.watch('./**/*.php').on('change', reload);
});

// Compile SASS into CSS & auto-inject into browsers 
// CSS Minify: Staging && Production
gulp.task('styles', function(){
    return gulp.src('./src/sass/main.scss')
        .pipe(sourcemaps.init())                    // Initialize sourcemaps
        .pipe(sass().on('error', error))            // Check if sass/scss has error
        .pipe(autoprefixer('last 2 version'))       // Vedor prefixes
        .pipe(csscomb())                            // Group CSS Properties
        .pipe(sass({outputStyle: 'compressed'}))    // Minify CSS
        .pipe(rename({basename: 'style'}))          // Rename main.scss to style.css
        .pipe(sourcemaps.write('./'))               // Generate sourcemaps for devtools
        .pipe(gulp.dest('./'))                      // Development || Staging 
        .pipe(browserSync.stream());                // Inject CSS
});

// SCSS to CSS Compiler || Debugger Mode
gulp.task('debugger', function () {
    return gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', error))            // Unminify CSS
        .pipe(autoprefixer('last 2 version'))       
        .pipe(csscomb())
        .pipe(rename({ basename: 'debugger' }))
        .pipe(gulp.dest('./'));
});

// Minify JS
gulp.task('minify', function (cb) {
    pump([
            gulp.src('js/app.js'),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('js')
        ],
        cb
    );
});

// Copy all build files to dist folder || Production ( Pre-released )
// Invoke this using: (npm run gulp build)
gulp.task('build', function(){    
    gulp.src('./*.{html,css,php,png}').pipe(gulp.dest('./dist/'));  
    gulp.src('./css/**/*.css').pipe(gulp.dest('./dist/css/'));
    gulp.src('./img/*.{png,jpg,jpeg,svg,mp4,webm}').pipe(gulp.dest('./dist/img/'));
    gulp.src('./js/**/*.js').pipe(gulp.dest('./dist/js/'));
});

// Default || npm start
gulp.task('default', ['server']);