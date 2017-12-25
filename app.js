'use strict';

const App = Mn.Application.extend({
  region: '#main-region',

  onBeforeStart(app, options) {
  },

  onStart(app, options) {
    this.showView(new MainView());

    Backbone.history.start();
  }
});

const app = new App();

app.start();
