/*
 * grunt-autocreationtests
 * 
 *
 * Copyright (c) 2013 Denis Savenok
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');


module.exports = function (grunt) {

    grunt.initConfig({
        regarde: {    
          js: {
            files: ['app/scripts/*.js', 'app/scripts/**/*.js', 'app/scripts/**/**/*.js', 'app/scripts/**/**/**/*.js'],
            //tasks: ['copy', 'clean', 'autocreationtests']
            //tasks: ['copy', 'clean', 'autocreationtests']
            tasks: ['autocreationtests']
          }
        },

        parsejs: {
                multiple: {
                    src: "app/scripts/ui.components/calendar/routeChooser.js"
                }
        },
        //for testing
        connect: {
          testing: {
            options: {
                port: 8877,
                base: '.'
            }
          }
        }
/*
        autocreationtests: {
                multiple: {
                    src: "app/scripts/ui.components/calendar/routeChooser.js",
                    specIndex: "test/spec/index.js"
                }
        }
*/
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-template');

    //grunt.registerTask('default', ['autocreationtests', 'regarde']);

    //grunt.registerTask('default', ['parsejs']);

    grunt.registerTask('r', ['connect', 'regarde']);//основное, default надо подредактировать

    grunt.registerTask('default', ['autocreationtests']);//parse with esmorph, create tests

    

    grunt.event.on('regarde:file', function (status, name, filepath, tasks, spawn) {
        var changedFilePath = filepath;

        console.log("Changed: " + changedFilePath)

        var srcScripts = [],
            filesToDelete = [],
            filesToCopy = [],
            relativePath,
            lastIndex;

        srcScripts.push(changedFilePath);//push to array, which is the value of parsejs.multiple.src

        var fileExtention = "js",
            destForCopyTask = 'copiedSpec/',
            editor = "Sublime Text 2";

        var scriptsBaseDir = "app/scripts",
            specBaseDir = "test/spec",
            specPrefix = "spec",
            specIndexJs = "test/SpecIndex.js",
            specTemplate = "templates/spec.js";

        relativePath = changedFilePath.replace(scriptsBaseDir, "");
        //relativePath = specBaseDir + relativePath;
        lastIndex = relativePath.lastIndexOf(".");
        relativePath = relativePath.substr(0, lastIndex);
        relativePath = relativePath + "." + fileExtention;

        console.log("relativePath: " + relativePath)

        filesToCopy.push(relativePath);
        filesToDelete.push(relativePath);

        grunt.initConfig({

            copy: {
              main: {
                files: [
                  {expand: true, src: filesToCopy, dest: destForCopyTask} // includes files in path
                ]
              }
            },
            // Before generating new file, remove previously-created css file.
            clean: {
                    tests: filesToDelete
            },

            autocreationtests: {
                multiple: {
                    src: srcScripts,
                    changedFilePath: changedFilePath,
                    specBaseDir: specBaseDir,
                    specIndex: specIndexJs, //here's must be listed all incoming tests (the same path structure as the source .js file)
                    specPrefix: specPrefix,
                    relativePath: relativePath, //computed relative path
                    specTemplate: specTemplate,
                    editor: editor,
                    openfile: true  //open file with editor?
                }
            }
        });
    });
};
