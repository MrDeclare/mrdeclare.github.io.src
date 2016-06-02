'use strict';

module.exports = function (grunt) {

    //https://www.npmjs.com/package/load-grunt-tasks
    require('load-grunt-tasks')(grunt);

    //require('time-grunt')(grunt);


    // Project configuration.
    grunt.initConfig({

        config: {
            src: 'src',
            dest: 'dist'
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
                '<%= config.dest %>/**/*.html'
            ]
        },

        /** Watcher Tasks */
        watch: {
            "smith-content": {
                files: [
                    '<%= config.src %>/templates/**/*.{hbs,hbt,md}'
                ],
                tasks: [
                    'shell:build-smith'
                ]
            }
        },

        shell : {
            "build-smith" : "node index.js"
        }

    });

    //grunt.registerTask('production', productionTasks);

    grunt.registerTask('default', ["watch:smith-content"]);
};
