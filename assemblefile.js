var assemble = require('assemble')
var extname = require('gulp-extname');
var app = assemble();

var config = {
    "dest" : 'dist'
};

//loadHelpers();
app.helper('markdown', require('helper-markdown'));

//app.cwd = 'src/assemble/pages/';

//var data = require('./hbs_context.json');
//assemble.data(data);
//app.data({root: process.cwd() + '/src/assemble/pages'});
app.data({'cwd' : app.data().cwd + '/src/assemble/pages'});
app.data().cwd = app.data().cwd + '/src/assemble/pages/';
console.log('app.data', app.data().cwd);

// load global site data
//assemble.data(['path/to/site.json']);

//quess, here is an internal object created -> so you can use "app.posts()"
app.create('posts');

//should be default
//app.engine('md', require('engine-handlebars'));

app.task('load', function (cb) {
    app.partials('src/assemble/partials/*.hbs');

    app.layouts('src/assemble/layouts/*.hbs');

    app.posts('src/assemble/pages/blog/posts/**/*.md');

    app.option('layout', 'markdown.hbs');

    cb();
});

app.task('default', ['load'], function () {
    return app.toStream('posts')
        .on('err', console.log)
        .pipe(app.renderFile())
        .on('err', console.log)
        .pipe(extname())
        .pipe(app.dest(config.dest));
});

app.build(['default'], function(err) {
  if (err) throw err;
  console.log('done!');
});

module.exports = app;
