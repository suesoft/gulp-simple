const { src, dest, series, watch } = require('gulp')
const del = require('del')

// gulp-uglify => plugins.uglify = require('gulp-uglify')
const plugins = require('gulp-load-plugins')();
const sass = require('gulp-sass')(require('sass'))
const browerSync = require('browser-sync').create();
const reload = browerSync.reload

// 压缩js uglifyjs
function js(cb) {
  src('./static/js/*.js')
  // 下一个处理环节
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))
    .pipe(reload({stream: true}))
  cb()
}

// 对scaa/less编译，压缩，输出css文件
function css(cb) {
  src('./static/css/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer({
      cascade: false,
      remove: false
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({stream: true}))
  cb()
}

// 监听这些文件的变化
function watcher() {
  watch('./static/js/*.js', js)
  watch('./static/css/*.scss', css)
}

// 删除dist目录中的内容
function clean(cb) {
  del('./dist')
  cb()
}


// server任务
function serve(cb) {
  browerSync.init({
    server: {
      baseDir: './'
    }
  })
  cb()
}

exports.scripts = js
exports.styles = css
exports.clean = clean
exports.default =series([
  clean,
  js,
  css,
  serve,
  watcher
])