'use strict';

var fs = require("fs");

var resultClasses = [],
    resultCss = "",
    relativePath = "";

    var sys = require('sys');
    var exec = require('child_process').exec;    

module.exports = function (grunt) {

    grunt.registerMultiTask('autocreationtests', 'Create tests from js-files for usage in requirejs projects', function () {

        var done = grunt.task.current.async();

        console.log(resultClasses);

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {

                grunt.log.writeln('File to parse: ' + f.src);

                return;

                // Concat specified files.
                var src = f.src.filter(function (filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }

                }).map(function (filepath) {

                    // Read file source.
                    return grunt.file.read(filepath);
                }
                ).join('');

                //set jsdom environment
                jsdom.env({
                    html: "<html><body></body></html>",
                    scripts: [
                        __dirname + "/jquery/jquery-extended.js"
                    ]
                }, function (err, window) {
                        var $ = window.jQuery;

                        $('body').append(src);

                        var arr = $('body').find('*');

                        $.each(arr, function (i, item) {
                            var list = $(item).classes();
                            $.each(list, function(index, value) {
                                if(!inArray(resultClasses, value)){
                                    resultClasses.push(value);
                                }
                            });                                
                        });

                        $.each(resultClasses, function (i, item) {
                            resultCss += "." + item + "{\n\n" +  "}\n"                          
                        });

                        function inArray(array, value) {
                            for(var i=0, l = array.length; i < l; i++) {
                                if(array[i] === value) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        relativePath = f.changedFilePath.replace(f.templateDir, "");
                        relativePath = f.stylesBaseDir + relativePath;
                        var lastIndex = relativePath.lastIndexOf(".");

                        relativePath = relativePath.substr(0, lastIndex);
                        relativePath = relativePath + ".css";

                        console.log(relativePath);

                        // Write the destination file. (File, if exist, must be cleaned in Gruntfile.js "clean" task)
                        grunt.file.write(relativePath, resultCss);

                        // Print a success message.
                        grunt.log.writeln('File "' + relativePath + '" created. / changed ' + f.changedFilePath);

                        if(f.openfile){
                            if(!f.editor) f.editor = "Sublime Text 2";
                            var command = 'open -a "' + f.editor + '" ' + relativePath;
                            exec(command);
                        }
                        
                        done();
                });
                
                //init all variables 
                grunt.event.on('regarde:file', function () {
                    resultClasses = [];
                    resultCss = "";
                    relativePath = "";
                });


            
        });

    });

};
