'use strict';

var fs = require("fs"),
    esprima = require("esprima"),
    esmorph = require('../lib/esmorph'),
    traverse = require('traverse'),
    http = require('http');

var relativePath = "",
    result = null,
    tree,
    functionList = [],
    parsedCodeStr;

var sys = require('sys');
var exec = require('child_process').exec,
    child;    

module.exports = function (grunt) {

    grunt.registerMultiTask('parsejsesmorph', 'Parse js file with esmorph', function () {

        

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {

                grunt.log.writeln('File to parse: ' + f.src);

                // Concat specified files.

                var code = f.src.filter(function (filepath) {

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

    

                tree = esprima.parse(code, { range: true, loc: true, tolerant: true });

                //errors in code handling
                if (tree.errors.length === 0) {
                    grunt.log.ok();
                } else {
                    grunt.log.write('\n');
                    tree.errors.forEach(function (e) {
                        grunt.log.error(e.message);
                    });
                    return;
                }

                functionList = esmorph.collectFunction(code, tree);

                //console.log(functionList);

                functionList.forEach(processFunction);

                function processFunction(func){
                    //in common case, the first obtained function is Anonymous, and has "[Anonymous]" name in Abstract syntax tree
                    //in requireJS environment it must return Class name, defined in requireJS module, as usial
                    if(func.name === "[Anonymous]" && func.exit !== null && func.exit.argument.type === 'Identifier'){
                        console.log("Anonymous func with name: ", func.name, " and return object ", func.exit.argument.name)
                    } else{
                        console.log("NAME: ", func.name)
                    }


                    if(typeof func.exit === "object" && func.exit !== null) {
                        console.log("RETURN: ", func.exit.argument)
                    } else {
                        console.log("EXIT is not Object: ")
                    }
                }

                //init all variables 
                grunt.event.on('regarde:file', function () {
                    relativePath = "";
                });

                

                var done = grunt.task.current.async();

/*
                var server = http.createServer(function(req, res) {
                  res.writeHead(200);
                  res.end(resStr);
                });

                server.listen(8123);
*/



            
        });

                       // grunt.file.write(relativePath, resultCss);

    });

};
