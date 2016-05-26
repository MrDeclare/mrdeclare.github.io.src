"use strict";

var config = {
    "src" : "src",
    "dest" : "dist"
};

var Metalsmith = require('metalsmith');
var layouts  = require('metalsmith-layouts');
var markdown   = require('metalsmith-markdown');
var inPlaceTemplates = require('metalsmith-in-place');

Metalsmith(__dirname) //allegedly Metalsmith should look for a src folder itself
    .source('./src/templates/content')
    .metadata({
        partials: {
            button: '../partials/button', //starts from the laouts folder, depends on .use(templates)
        }
    })

    //===================================================================
    //plugin chain
    //===================================================================
    .use(markdown()) //order counts, befor all other seems to be right

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
