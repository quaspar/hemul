(function() {
// todo: http://learn.ionicframework.com/formulas/backend-data/
  var app = angular.module('Hemul', []);

  app.controller('TabController', function(){
    this.tab = 0;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });
  
  app.controller('WidgetController',['$http',function($http){
	this.properties = getProperties();  	
  	this.widgets = {
  	  	rainfall: {},
  		electionresults: {}
  	};
  	var widgetCtrl = this;
  	
  	$http.get('http://hemul.fria.nu/ajaxhandler.php?directive=rainfall&properties=' + widgetCtrl.properties)
  		.success(function(data){
  			if (data.status == 1){
  				console.log(data);
  				widgetCtrl.widgets.rainfall = data.rainfall;
  				widgetCtrl.widgets.rainfall.status = data.status;
  				console.log(widgetCtrl.widgets.rainfall); // debug  	
  			}			
  		}).error(function(){
  			console.log("fail rain!");
  		});
  		
  	$http.get('http://hemul.fria.nu/ajaxhandler.php?directive=electionresults&properties=' + widgetCtrl.properties)
  		.success(function(data){
  			if (data.status == 1){
  				widgetCtrl.widgets.electionresults = data.electionresults;
  				widgetCtrl.widgets.electionresults.status = data.status;
  				console.log(widgetCtrl.widgets.electionresults); // debug  	
  			}
  		}).error(function(){
  			console.log("fail elections!");
  		});

  }]);
  
  function getProperties(){
    var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/properties = (.*)/.exec(script_tag[0].text);
	return match[1];
  }
  
})();
