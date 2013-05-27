define(
	[
	"marionette",
	'hbars!../../../templates/ui.components/combobox/input',
	"vent",
	"ui.components/combobox/settings"
	],
	function(Marionette, ComboboxTemplate, InputTemplate, DropDownListTemplate, Vent, Settings){
	
	Settings.initialValue = "initialValue123";

	var InputView = Backbone.Marionette.View.extend({
		template: InputTemplate,

		events: {
	      "click #input-wrapper": "firstHandler"
	    },

		render: function() {
 			var data = _.extend({}, this.model, Settings);
	        var templateHtml = this.template(data);
	        this.$el.html(templateHtml);
	        return this;
	    },

	    onRender: function() {
	       console.log("InputView onRender")
	    },
    
	    onShow: function() {
	        console.log("InputView onShow")
	    },

	    firstHandler: function(event) {
	      	console.log("InputView firstHandler");
	    }
	});

	return InputView;
});