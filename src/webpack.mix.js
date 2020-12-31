const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sass("resources/sass/style.scss", "public/css/style.min.css")
    .sass("resources/sass/home.scss", "public/css/home.min.css")
    .sass("resources/sass/queries.scss", "public/css/queries.min.css")
    .sass("resources/sass/home.queries.scss", "public/css/home.queries.min.css")
    
    .js("resources/js/scripts/scripts.js", "public/js/output/scripts.bundle.js")
    .js("resources/js/scripts/home.js", "public/js/output/home.bundle.js")
    .options({
        fileLoaderDirs: {
            images: 'storage/urls',
            fonts: 'fonts'
        }
    });