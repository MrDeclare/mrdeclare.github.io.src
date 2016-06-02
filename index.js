"use strict";

var config = {
    "src" : "src",
    "dest" : "dist"
};

var Metalsmith = require('metalsmith');

var drafts = require('metalsmith-drafts');
var markdown   = require('metalsmith-markdown');
var layouts  = require('metalsmith-layouts');
var inPlaceTemplates = require('metalsmith-in-place');

var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');

Metalsmith(__dirname) //allegedly Metalsmith should look for a src folder itself
    .source('./src/templates/content')
    // .metadata({
    //     partials: {
    //         button: '../partials/button', //starts from the laouts folder, depends on .use(templates)
    //     }
    // })

    //===================================================================
    //plugin chain
    //===================================================================

    //add original filenames to the metadata
    .use(function(files, metalsmith, done) {
        var path = require('path');

        Object.keys(files).forEach(function (file) {
            var extname = path.extname(file);
            var basename = path.basename(file, extname);
            files[file].original_basename = basename;
            files[file].original_extname = extname;
        });
        done();
    })

    .use(drafts())

    .use(collections({
        //pages: {
        //    pattern: 'content/pages/*.md'
        //},
        posts: {
            pattern: 'blog/posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))

    // Log plugin!
    // .use(function(files, metalsmith, done) {
    //     console.log('Files: ');
    //     console.log(files);
    //
    //     console.log();
    //     console.log('Metalsmith: ');
    //     console.log(metalsmith);
    //
    //     console.log(' ');
    //     console.log('Metalsmith metadata.collections: ');
    //     console.log(metalsmith._metadata.collections);
    //
    //     done();
    // })

    .use(markdown()) //order counts, befor all other seems to be right

    .use(permalinks({
        pattern : "blog/posts/:date/:original_basename"
    }))

    .use(layouts({
        "engine": 'handlebars',
        "directory": 'src/templates/layouts',
        "default" : 'default.hbt',
        "partials": 'src/templates/partials'
        //"rename": true
    }))

    .use(inPlaceTemplates({ //order counts -> after layouts seems to be right
        "engine": "handlebars",
        "partials": 'src/templates/partials',
        "pattern": "**/*.hbs",
        "rename": true
    }))
    //===================================================================
    //===================================================================

    .destination('./dist')
    .clean(false) //dont delete the content of dist folder, bec of the contending git repo
    .build( (err) => {
        if(err) console.log(err);
        if(!err) console.log('Site build complete!');
    });
