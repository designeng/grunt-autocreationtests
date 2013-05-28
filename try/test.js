var fs = require("fs"),
filepath = __dirname + "/../test/spec/index.js";

var lineToInsert ="ZZZZZZZZZ";
var data = insertLine(filepath, lineToInsert);
console.log(data)





function insertLine(filepath, codeLine){
	var lines = fs.readFileSync(filepath, 'utf8').split('\n'),
	rawData = '',
	re = /\[/i;
	for (var l in lines){
	    var line = lines[l];    
		var found = line.match(re);
		if(found) {
			rawData += line + "\n";
			rawData += "\t'" + codeLine + "'," + "\n";
		} else{
	    	rawData += line + "\n";
		}
	}
	return rawData;
}
