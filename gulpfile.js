const gulp = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

const DEST = "dist";

function dom() {
    const dir = "dom";
    return gulp.src(`src/${dir}/**/*.js`)
        .pipe(concat(`${dir}.min.js`))
        .pipe(uglify())
        .pipe(gulp.dest(DEST));
}

exports.default = gulp.series(dom);
