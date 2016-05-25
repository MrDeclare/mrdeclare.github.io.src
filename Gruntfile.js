'use strict';

module.exports = function (grunt) {

    //https://www.npmjs.com/package/load-grunt-tasks
    require('load-grunt-tasks')(grunt);

    //require('time-grunt')(grunt);


    // Project configuration.
    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist'
        },

        connect: {
            server: {
                options: {
                    port: 9002,
                    base: 'dist',
                    keepalive: true
                }
            }
        },

        clean: {
            'html': [
                '<%= config.dist %>/**/*.html'
            ]
        },

        assemble: {
            options: { //global options
                flatten: false
            },

            hbsProduction: {
                expand: true,
                options: {
                    layoutdir: '<%= config.src %>/assemble/layouts',
                    layout: 'default.hbs',
                    data: [
                        '<%= config.src %>/assemble/data/site.yml',
                        '<%= config.src %>/assemble/data/production/site.yml'
                    ],
                    partials: '<%= config.src %>/assemble/partials/**/*.hbs'
                },
                cwd: '<%= config.src %>/assemble/pages/',
                dest: '<%= config.dist %>/',
                src: '**/*.hbs'
            }
        },

        /** Watcher Tasks */
        watch: {
            hbs: {
                files: [
                    '<%= config.src %>/assemble/**/*.{hbs,yml}'
                ],
                tasks: [
                    'assemble:hbsProduction'
                ]
            }
        }

    });


    var productionTasks = [
        'clean',

        //assemble build
        'assemble:hbsProduction'
    ];


    grunt.registerTask('production', productionTasks);

    grunt.registerTask('default', ["clean"]);
};
