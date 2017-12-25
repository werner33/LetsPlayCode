'use strict';

const HeaderView = Mn.View.extend({
  template: '#header'
});


const StringInfoView = Mn.View.extend({
  template: '#string-info'
});

const WordCardView = Mn.View.extend({
  template: '#word-card',

  className: 'word-card',

  attributes: function(){
    return {
      type: this.model.get('type')
    }
  },

  events: {
    'click' : 'toggleSelected'
  },

  initialize(options){
    this.model = options.model || new Backbone.Model({text: "'bus'"});
  },

  toggleSelected: function(){
    this.$el.toggleClass('selected')
  }
});

const WordCardsCollectionView = Mn.CollectionView.extend({
  childView: WordCardView,
  initialize: function(options){
    this.collection =  options.collection;
  }
});

const ClickAllThatApplyView = Mn.View.extend({
    template: '#problem-module',
    className: 'challenge-module',
    regions: {
      problemSection: '#problem-section'
    },

    events: {
      'click #restart' : 'resetChallenge',
      'click #submit' :'submitSolution'
    },

    initialize: function(){

      this.model = new Backbone.Model({
        title: 'Select All the Strings',
        description: 'Click on the boxes that are "strings". Remember that the' +
        ' easiest way to recognize a string is to check if it is surrounded by "" or \'\'.'
      });

      var data = [
        {text: 'true', type: 'boolean', image: "images/thumbs_up.png"},
        {text: '"School Bus"', type: 'string', image: "images/school_bus.png"},
        {text: 43, type: "integer", image: "images/43.png"},
        {text: "'4 girls'", type: 'string', image: "images/four_girls.png"}
      ];

      shuffleArray(data);

      var collection = new Backbone.Collection(data);

      this.wordCardsColletionView = new WordCardsCollectionView({collection: collection});
    },

    onRender: function(){
      this.getRegion('problemSection').show(this.wordCardsColletionView);
    },

    submitSolution: function(){
      let answers = this.$el.find('.selected');
      try {
        let solved = (
            _.all(answers, answer => answer.attributes.type.value === 'string')
            &&
            answers.length == 2)
        if(solved){
          this.$el.find('#unsolved').hide();
          this.$el.find('#solved').css('display', 'inline-block');
        } else {
          this.$el.find('#solved').hide();
          this.$el.find('#unsolved').css('display', 'inline-block');
        }
      } catch(err){
        console.log(err);
      }
    },

    resetChallenge: function(){
      this.$el.find('.word-card').removeClass('selected');
    }
});

const DragAndDropCodeFragmentView = Mn.View.extend({
	template: '#code-fragment',

  className: 'code-fragment',

  initialize: function(options){
    this.model = options.model;
  },

  attributes: function(){
    return {
      type: this.model.get('type')
    }
  }

});

const DragAndDropCollectionView = Mn.CollectionView.extend({

  childView: DragAndDropCodeFragmentView,

  className: 'puzzle-pieces',

  onRender: function(){
  	this.$el.sortable({
      connectWith: "#solution-area"
    });
  }
});

const DragAndDropTypeView = Mn.View.extend({
  template: '#challenge1',

  events: {
    'click #submit': 'submitSolution',
    'click #restart': 'resetChallenge'
  },

  regions: {
  	puzzlePieces: '#puzzle-pieces-container'
  },

	initialize: function(){
    this.model = new Backbone.Model({
      title: "Drag and Drop All The Strings",
      description: "Drag all the strings to the solution area.",
      type: "string",
      length: 3
    });

    var data = [
      {text: "243", type: 'integer'},
      {text: "'Elvis Presley'", type: 'string'},
      {text: '"The Wheels on the Bus"', type: 'string'},
      {text: 43.345, type: 'integer'},
      {text: false, type: 'boolean'},
      {text: '"There are three ways to get there."', type: 'string'}
    ];

    shuffleArray(data);

  	this.collection = new Backbone.Collection(data);
  },

  onRender: function() {

    this.$el.find('#solution-area').sortable({
       connectWith: ".puzzle-pieces"
     });

    var dragAndDropCollectionView = new DragAndDropCollectionView({collection: this.collection});

    this.getRegion('puzzlePieces').show(dragAndDropCollectionView);
  },

  submitSolution: function() {
    var type = this.model.get('type');
    var codeFragments = $('#solution-area').children();
    var types = _.map(codeFragments, codeFragment => codeFragment.attributes.type.value)
    try {
      if (_.all(types, (ele) => ele === type) && types.length== this.model.get('length')) {
        this.$el.find('#unsolved').hide();
        this.$el.find('#solved').css('display', 'inline-block');
      } else {
        this.$el.find('#solved').hide();
        this.$el.find('#unsolved').css('display', 'inline-block');
      }
    } catch (e) {
      console.log('incorrect');
      this.$el.find('#solved').hide();
      this.$el.find('#unsolved').css('display', 'inline-block');
    }
  },

  resetChallenge: function() {
    $('#solved, #unsolved').hide();
    var codeFragments = $('#solution-area .code-fragment').detach();
    $('.puzzle-pieces').append(codeFragments);
  }

});

const MainView = Mn.View.extend({
  template: '#main',
  onRender(){
    this.getRegion('header').show(new HeaderView());
    this.getRegion('stringInfo').show(new StringInfoView());
    this.getRegion('clickAll').show(new ClickAllThatApplyView());
    this.getRegion('dragAndDrop').show(new DragAndDropTypeView());
  },
  regions: {
    header: '#header-section',
    stringInfo: '#string-info-section',
    clickAll: '#click-all-section',
    dragAndDrop: '#drag-and-drop-section'
  }
});
