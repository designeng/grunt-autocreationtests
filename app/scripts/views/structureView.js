define([
	'backbone', 
	'underscore', 
	'marionette', 
	'Handlebars', 
	'vent', 
	'hbars!/templates/structure',
	'i18n!nls/general'
	], function(Backbone, _, Marionette, Handlebars, vent, StructureTemplate, GeneralText) {

    'use strict';

    var StructureView = Marionette.ItemView.extend({

	    template: StructureTemplate,

	    render: function() {	    	
	    	var obj = {
	    		test_test_test: this.model,
	    	}
	        var templateParams = _.extend({}, this.model, obj, GeneralText),
	            renderedTemplate = this.template(templateParams);

	        this.$el.html(renderedTemplate);

	        return this;
	    }
	});
    
    return StructureView;
});