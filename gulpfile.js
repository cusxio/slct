const path = require('path');
const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const sequence = require('gulp-sequence');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

const babelCommonJS = {
    presets: ['stage-0', ['es2015', { loose: true }]],
};

const babelES = {
    presets: ['stage-0', ['es2015', { loose: true, modules: false }]],
};

gulp.task('compile-commonjs', () => (
    gulp.src('src/**/*.js')
        .pipe(plumber())
        .pipe(babel(babelCommonJS))
        .pipe(gulp.dest('lib'))
));

gulp.task('compile-es', () => (
    gulp.src('src/**/*.js')
        .pipe(plumber())
        .pipe(babel(babelES))
        .pipe(gulp.dest('es'))
));

gulp.task('clean', () => (
    del(['lib', 'es', 'dist'])
));

gulp.task('compile', ['compile-es', 'compile-commonjs']);

gulp.task('watch', () => (
    gulp.watch('src/**/*.js', ['compile'])
));

gulp.task('build-umd', (cb) => {
    const compiler = createCompiler({ dev: true });

    webpack(compiler, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        if (stats.hasErrors()) {
            console.error(stats.toString('errors-only'));
            process.exit(1);
        }
        cb();
    });
});

gulp.task('build-umd:min', (cb) => {
    const compiler = createCompiler({ dev: false });

    webpack(compiler, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        if (stats.hasErrors()) {
            console.error(stats.toString('errors-only'));
            process.exit(1);
        }
        cb();
    });
});

gulp.task('build', ['build-umd', 'build-umd:min']);

gulp.task('default', (cb) => {
    sequence('clean', 'compile', 'watch', cb);
});

gulp.task('release', (cb) => {
    sequence('clean', 'compile', 'build', cb);
});

function createCompiler({ dev }) {
    const config = {};

    config.context = path.resolve('.', 'src');

    config.entry = {
        app: ['./index.js'],
    };

    config.output = {
        path: path.resolve('.', 'dist'),
        library: 'slct',
        libraryTarget: 'umd',
        filename: dev ? 'slct.js' : 'slct.min.js',
    };

    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
        }),
    ];

    config.module = {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['stage-0', ['es2015', { loose: true, modules: false }]],
                plugins: ['add-module-exports'],
            },
        }],
    };

    if (!dev) {
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                mangle: {
                    screw_ie8: false,
                },
                compress: {
                    unused: true,
                    dead_code: true,
                    unsafe: true,
                    warnings: false,
                    screw_ie8: false,
                },
                output: {
                    comments: false,
                    screw_ie8: false,
                },
            })
        );
    }
    return config;
}
