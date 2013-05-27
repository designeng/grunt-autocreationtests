'use strict';

var fs = require("fs"),
    esprima = require("esprima"),
    traverse = require('traverse'),
    http = require('http');

var relativePath = "",
    result = null,
    parsedCodeStr;

var sys = require('sys');
var exec = require('child_process').exec,
    child;    

module.exports = function (grunt) {

    grunt.registerMultiTask('parsejs', 'Parse js file and return AST object', function () {

        

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

    /*            
                var command = 'node tools/generate-test-fixture ' + f.src;
                child = exec(command,
                    function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error !== null) {
                          console.log('exec error: ' + error);
                        }
                });
*/
                result = esprima.parse(code);
                parsedCodeStr = JSON.stringify(result, adjustRegexLiteral, 4);

                //console.log(parsedCodeStr)

                //init all variables 
                grunt.event.on('regarde:file', function () {
                    relativePath = "";
                });

                // Special handling for regular expression literal since we need to
                // convert it to a string literal, otherwise it will be decoded
                // as object "{}" and the regular expression would be lost.
                function adjustRegexLiteral(key, value) {
                    if (key === 'value' && value instanceof RegExp) {
                        value = value.toString();
                    }
                    return value;
                }



                //objectRevision(result.body.expression.arguments);
/*
                var scrubbed = traverse(result).map(function (x) {
                    if (x === 'ReturnStatement') {
                        console.log(x);
                    }
                });
*/
                var resStr = "";
                var leaves = traverse(result).reduce(function (acc, x) {
                    if (this.isLeaf) acc.push(x);
                    resStr += x + "\n";
                    return acc;
                }, []);

                var len = leaves.length,
                retIndex,
                argObjectIndex;

                for(var i = len; i >= 0; i--){
                    if(leaves[i] === "ReturnStatement"){
                        argObjectIndex = i + 1;
                        //console.log(argObjectIndex);
                        console.log(argObjectIndex, leaves[argObjectIndex]);

                        if(leaves[argObjectIndex] === "Identifier") console.log("Object returned: " + leaves[argObjectIndex + 1]);
                        break;
                    }
                }

                

                var done = grunt.task.current.async();

                var server = http.createServer(function(req, res) {
                  res.writeHead(200);
                  res.end(resStr);
                });

                server.listen(8080);




            
        });

                       // grunt.file.write(relativePath, resultCss);

    });

};
