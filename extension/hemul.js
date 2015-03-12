(function() {
// todo: http://learn.ionicframework.com/formulas/backend-data/
  var app = angular.module('hemul', []);

  app.controller('TabController', function(){
    this.tab = 0;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

  app.controller('ContainerController', ['$container', function(){

  }]);
  
  app.controller('HemulController',function(){
  	this.containers = [
    {
      name: 'Nederbörd',
      text: "Här regnar det i snitt 8 dagar i månaden. Rikssnittet är 5 dagar i månaden.",
      data: [],
      betyg: 43,
      image: "images/gem-02.gif",
      displayfunction: displayRainContainer
    },
    {
      name: 'Valresultat',
      text: "Det största partiet i kommunen är Socialdemokraterna.",
	  data:[{s: 45},{m: 20},{fp: 12},{v: 8},{kd: 11}],
	  jfr: null,
      images: [],
      displayfunction: displayElectionResultContainer
    }
  ];
  });
})();
