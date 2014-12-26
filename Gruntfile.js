module.exports = function(grunt) {
    'use strict';

    var libs;

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    libs = [
        'bower_components/jquery/jquery.js'
    ];

    grunt.initConfig({
        // Read package information so we can use it later on
        pkg: grunt.file.readJSON('package.json'),
        // Concatenates multiple js files into one
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';\n'
            },
            // The oryjs source
            source: {
                // the files to concatenate
                src: [
                    'src/*.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            },
            // The libs, oryjs uses
            libs: {
                // the files to concatenate
                src: libs,
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>-libs.js'
            }
        },
        // Minigy js files
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= concat.source.dest %>'],
                    '<%= pkg.name %>-libs.min.js': ['<%= concat.libs.dest %>']
                }
            }
        },
        // Copy files when we're in dev mode
        copy: {
            dev: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'dist/', src: ['*.js'], dest: './'},
                ]
            },
        },
        // Run code analysis
        jshint: {
            // define the files to lint
            files: ['src/*.js']
        },
        // Watching for changes
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat', 'copy:dev']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('dev', ['watch']);
};