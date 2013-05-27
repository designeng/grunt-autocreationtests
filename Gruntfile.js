/*
 * grunt-cssfromhtml
 * 
 *
 * Copyright (c) 2013 Denis Savenok
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        regarde: {    
          js: {
            files: ['app/scripts/*.js', 'app/scripts/**/*.js', 'app/scripts/**/**/*.js', 'app/scripts/**/**/**/*.js'],
            //tasks: ['copy', 'clean', 'autocreationtests']
            tasks: ['copy', 'clean', 'parsejs']
          }
        },

        parsejs: {
                multiple: {
                    src: "app/scripts/ui.components/calendar/routeChooser.js"
                }
        },

        parsejsesmorph: {
                multiple: {
                    src: "app/scripts/ui.components/calendar/routeChooser.js"
                }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-connect');

    //grunt.registerTask('default', ['autocreationtests', 'regarde']);

    grunt.registerTask('default', ['parsejs']);

    grunt.registerTask('r', ['regarde']);//основное, default надо подредактировать

    grunt.registerTask('e', ['parsejsesmorph']);//parse with esmorph, create tests

    

    grunt.event.on('regarde:file', function (status, name, filepath, tasks, spawn) {
        var changedFilePath = filepath;

        console.log("Changed: " + changedFilePath)

        var srcScripts = [],
            filesToDelete = [],
            filesToCopy = [],
            relativePath,
            lastIndex;

        srcScripts.push(changedFilePath);//push to array, which is the value of parsejs.multiple.src

        var templateDir = 'app/templates',
            stylesBaseDir = "app/styles/less",
            fileExtention = "js",
            destForCopyTask = 'copiedCss/',
            editor = "Sublime Text 2";

        relativePath = changedFilePath.replace(templateDir, "");
        relativePath = stylesBaseDir + relativePath;
        lastIndex = relativePath.lastIndexOf(".");
        relativePath = relativePath.substr(0, lastIndex);
        relativePath = relativePath + "." + fileExtention;

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

            parsejs: {
                multiple: {
                    src: srcScripts,
                    changedFilePath: changedFilePath,
                    templateDir: templateDir,
                    stylesBaseDir: stylesBaseDir, //here must be saved created .css with the same path structure as the source html-template file 
                    editor: editor,
                    openfile: true  //open file with editor?
                }
            },

            cssfromhtml: {
                multiple: {
                    src: srcScripts,
                    changedFilePath: changedFilePath,
                    templateDir: templateDir,
                    stylesBaseDir: stylesBaseDir, //here must be saved created .css with the same path structure as the source html-template file 
                    editor: editor,
                    openfile: true  //open file with editor?
                }
            }
        });
    });
};
