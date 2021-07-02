//This package is used to load the contents of all active BrowserWindow Instances within Electron when the source files are changed.28 May 2020
// https://www.google.com/search?q=purpose+of+hotreload+file+electorn&sxsrf=ALeKk03jCT5ziHeoBqzfeDpJ6Y9cHlmu4A%3A1625237973057&ei=1SnfYPLoAo3nkgWQ-q3gCg&oq=purpose+of+hotreload+file+electorn&gs_lcp=Cgdnd3Mtd2l6EAMyBAghEBU6BwgAEEcQsAM6BwghEAoQoAFKBAhBGABQyhZYyCdg8ShoAXABeAGAAfMEiAH3D5IBCTItNC4wLjEuMZgBAKABAaoBB2d3cy13aXrIAQjAAQE&sclient=gws-wiz&ved=0ahUKEwiyp7yg08TxAhWNs6QKHRB9C6wQ4dUDCA4&uact=5
// Hot reload works by injecting updated source code files into the running Dart Virtual Machine (VM). After the VM updates 
// classes with the new versions of fields and functions, the Flutter framework automatically rebuilds the widget tree,
// allowing you to quickly view the effects of your changes.
const { series, src, dest } = require('gulp');
const inject = require('gulp-inject-string');

const browserSync = require('browser-sync').create();

function startBrowserSync(done) {
  browserSync.init(
    {
      ui: false,
      localOnly: true,
      port: 35829,
      ghostMode: false,
      open: false,
      notify: false,
      logSnippet: false,
    },
    function (error) {
      done(error);
    },
  );
}

function injectBrowserSync() {
  return src('app/renderer/index.html')
    .pipe(inject.before('</body>', browserSync.getOption('snippet')))
    .pipe(
      inject.after('script-src', " 'unsafe-eval' " + browserSync.getOption('urls').get('local')),
    )
    .pipe(dest('build/renderer'));
}

function reloadBrowser(done) {
  browserSync.reload();
  done();
}

startBrowserSync.displayName = 'start-hotreload';
injectBrowserSync.displayName = 'inject-hotreload';
reloadBrowser.displayName = 'reload-hotreload';

exports.start = series(startBrowserSync, injectBrowserSync);
exports.inject = injectBrowserSync;
exports.reload = reloadBrowser;
