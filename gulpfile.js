const gulp = require("gulp");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");

const { spawn } = require("child_process");

const babel = require("gulp-babel");

function babelAndUglify(resolve) {
  const projectName = gutil.env.p;
  gulp
    .src("./src/" + projectName + "/*.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist/" + projectName));
  resolve();
}

function copyJson(resolve) {
  const projectName = gutil.env.p;
  gulp
    .src("./src/" + projectName + "/.clasp.json")
    .pipe(gulp.dest("./dist/" + projectName));
  gulp
    .src("./src/" + projectName + "/appsscript.json")
    .pipe(gulp.dest("./dist/" + projectName));
  resolve();
}

function claspPush(resolve) {
  gutil.log("clasp push start");
  const projectName = gutil.env.p;
  const child = spawn("clasp", ["push"], {
    cwd: "./dist/" + projectName,
  });
  child.on("close", function (code) {
    if (code) throw Error(code);
    else resolve();
  });
}

function watch() {
  const projectName = gutil.env.p;
  gulp.watch("./src/**/*.js", gulp.series(babelAndUglify, claspPush));
}

gulp.task("build", gulp.series(gulp.parallel(babelAndUglify, copyJson)));

gulp.task("default", gulp.series(babelAndUglify, claspPush, watch));
