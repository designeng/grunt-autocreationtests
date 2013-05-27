require.config({
  baseUrl: "/app/js",
  urlArgs: 'cb=' + Math.random(),
  paths: {
    jquery: 'lib/jquery.min',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    'backbone.eventbinder': 'lib/backbone.eventbinder', // amd version
    'backbone.babysitter': 'lib/backbone.babysitter', // amd version
    marionette: 'lib/backbone.marionette',  // amd version
    'backbone.wreqr': 'lib/backbone.wreqr', // amd version
    text: 'lib/requirejs-text/text',
    i18n: 'lib/i18n',

    spec: '../../test/spec/'
  },
  /*
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
  */

  shim: {        
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        marionette: ['backbone']
    },
    locale: function(){
        return "ru";
    }()
});

require(['jquery', 'spec/index'], function($, index) {
  var jasmineEnv = jasmine.getEnv(),
      htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  $(function() {
    require(index.specs, function() {
      jasmineEnv.execute();
    });
  });
});
