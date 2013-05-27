define(['backbone',
        'marionette', 
        'underscore', 
        'ui.components/combobox/combobox',
        'ui.components/calendar/routeChooser', 
        'views/structureView',
        'vent'], 
    function(Backbone, Marionette, _, Combobox,  RouteChooser, StructureView, vent) {
    'use strict';

    var app = new Marionette.Application(),
    combobox,
    routeChooser;   

    // these regions correspond to #ID's in the index.html 
    app.addRegions({
        content: "#content",
        view: "#view"
    });

    // marionette app events...
    app.on("initialize:after", function() {
        Backbone.history.start();
    });

    
    
    // pass in router/controller via options
    app.addInitializer(function(options) {
        // configure for loading templates stored externally...
        Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
            // Marionette expects "templateId" to be the ID of a DOM element.
            // But with RequireJS, templateId is actually the full text of the template.
            var template = templateId;

            // Make sure we have a template before trying to compile it
            if (!template || template.length === 0) {
                var msg = "Could not find template: '" + templateId + "'";
                var err = new Error(msg);
                err.name = "NoTemplateError";
                throw err;
            }

            return template;
        };

    }); 

    app.addInitializer(function () {
            
            combobox = new Combobox({
                //model: {qwerty: "12345657"}
            }); 

             

            routeChooser = new RouteChooser({});  

            this.content.show(routeChooser);
    });

    // export the app
    return app;
});