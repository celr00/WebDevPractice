const {src, dest, watch, parallel} = require('gulp');

//Dependencias de CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Dependencias de Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//Dependencias de JavaScript
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss')        //Identificar archivo SASS
        .pipe( sourcemaps.init())
        .pipe( plumber() )
        .pipe( sass() )             //Compilar archivo SASS
        .pipe( postcss([autoprefixer(), cssnano()]))
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') ); //Almacenar en el disco duro
    done();
}

function imagenes(done){

    const opciones = {
        optimizationLevel: 3
    };
    
    src('src/img/**/*.{png,jpg}')  //Identificar archivos JPG y PNG
        .pipe( cache( imagemin() ) )
        .pipe( dest('build/img') );
    done();
}

function versionWebp ( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')  //Identificar archivos JPG y PNG
        .pipe( webp(opciones) )     //Convierte a webp
        .pipe( dest('build/img') ); //Guarda en disco duro

    done();
}

function versionAvif ( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')  //Identificar archivos JPG y PNG
        .pipe( avif(opciones) )     //Convierte a webp
        .pipe( dest('build/img') ); //Guarda en disco duro

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe( sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.imagenes = imagenes;

exports.dev = parallel(imagenes, versionWebp, versionAvif, dev);