define([
		'underscore',
		'Handlebars'
	], function(_, Handlebars){

	/**
	 * Helper for i18n support for Handlebars 
	 */
	Handlebars.registerHelper('_', function(text){
		if(arguments.length > 2){
			var str = arguments[0],
				params = _.toArray(arguments).slice(1,-1),
				param;
			while(str.indexOf("%s") != -1){
				param = params.length==1 ? params[0] : params.shift();
				str = str.replace(/%s/, param);
			}
			text = str;
		}else{
			//@TODO
			//Get string from lang config (scripts/lang/)
		}
		return text;
	});

	Handlebars.registerHelper("key_value", function(obj, fn) {
        var buffer = "",
            key;
     
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += fn({key: key, value: obj[key]});
            }
        }
     
        return buffer;
    });

	// usage: {{toLowerCase someString}}
	Handlebars.registerHelper('toLowerCase', function(value) {
        return (value && _.isString(value)) ? value.toLowerCase() : '';
    });

	// usage: {{debug}} or {{debug someValue}}
    Handlebars.registerHelper("debug", function(optionalValue, options) {
	     console.group("Handlebar Debug:");	     
	     if (_.isObject(optionalValue) && _.isObject(optionalValue.hash)) {
	       // this means that the {{debug}} was called without params
	       console.log(this);
	     }
	     else {
	       console.log(optionalValue);
	     }
	     console.groupEnd();
    });



})