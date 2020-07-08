const gulp = require("gulp");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");

const { spawn } = require("child_process");

const babel = require("gulp-babel");

function claspPush(resolve) {
  gutil.log("clasp push start");
  const child = spawn("clasp", ["push"], {
    cwd: "./dist",
  });
  child.on("close", function (code) {
    if (code) throw Error(code);
    else resolve();
  });
}

gulp.task("uglify", function (resolve) {
  gulp
    .src("./src/**/*.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
  // src 폴더 아래의 모든 js 파일을 minify 해서 dist 폴더에 저장
  // minify 한 후 dist 폴더 내의 js 파일 clasp push
  claspPush(resolve);
});

gulp.task("watch", function () {
  gulp.watch("./src/**/*.js", gulp.series("uglify"));
});

gulp.task("default", gulp.series("uglify", "watch"));
