(function() {
// todo: http://learn.ionicframework.com/formulas/backend-data/
  var app = angular.module('Hemul', []);
  
  app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    chrome.extension.getURL('/') + '**',
    'http://hemul.fria.nu/**'
  ]);
});

  app.directive('hemulWidget', function() {
    return {
        restrict: 'E',
        // templateUrl: chrome.extension.getURL('/widget.tpl'),
        template: '<section class="hemul-widget">\
					{{WidgetCtrl.getMarkup(widget.id)}}\
				  </section>', 
  	};
  });
  
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
  	
  	this.getMarkup = function (wid){
  		return 'hej' + wid;
  	}
  	  	
  	this.loadWidget = function (widget){
  		if (typeof widget !== 'undefined' && widget && widget.constructor === Array){

  			for (var i = 0; i < widget.length; i++){
  				widgetCtrl.loadWidget(widget[i]);
 			}
  		}
  		else {

  			var url = 'http://hemul.fria.nu/ajaxhandler.php?directive='
  				+ widget 
  				+ '&properties=' + widgetCtrl.properties;
	  		$http.get(url)
  				.success(function(data){
  				console.log("success");
  				console.log(data);
  					if (data.status == 1){
  						widgetCtrl.widgets[data.id].data = data[data.id];
  						widgetCtrl.widgets[data.id].id = [data.id];
  						widgetCtrl.widgets[data.id].status = data.status;
  					}			
  				}).error(function(data){
  					console.log("fail! " + data.id);
  				});
  		}
  	}
  	
  	this.loadWidget(["rainfall", "electionresults"]);


  }]);
  
  function getProperties(){
    var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/properties = (.*)/.exec(script_tag[0].text);
	return match[1];
  }
  
})();
