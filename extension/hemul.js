(function() {
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

/*  app.directive('hemulWidget', function($compile) {
    return {
        restrict: 'E',
        // templateUrl: chrome.extension.getURL('/widget.tpl'),
        link: function (scope, ele, attrs) {
        	// ele.html(WidgetCtrl.getMarkup(WidgetCtrl.widgets["rainfall"]));
        	//ele.html("<div>"+"sdlfjsldkfjslkdjf"+"</div>");
        	//$compile(ele.contents());
        	console.log("scope", scope['widget']);
   		}
       /* template: '<section class="hemul-widget">\
					{{WidgetCtrl.getMarkup(widget.id)}}\
				  </section>', 
  	};
  });
  */
app.directive('hemulWidget', function($compile, $http){
  return {
    link: function(scope, element, attrs) {
    	console.log("link function", attrs['$attr']);
    	for (var property in attrs['$attr']) {
    	console.log(property);
   			if (attrs['$attr'].hasOwnProperty(property)) {
        		$http.get('http://hemul.fria.nu/ajaxhandler.php?directive='+property+'&properties='+scope.properties).success(function (result) {
        			console.log("RESULT",result);
    				var rendered = window["hemul_"+result.id](result);
    				var markup = '<div>' + rendered.markup + '</div>';
       				element.html($compile(markup)(scope));
       				rendered.callback(result);
      			});	
    		}
		}
    }
  }
})
  
  
  app.controller('TabController', function(){
    this.tab = 0;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });
  
  app.controller('WidgetController',['$http', '$scope',function($http, $scope){
	$scope.properties = getProperties();  	
	console.log("CONTROLLER", $scope);
  	var widgetCtrl = this;
  	
  	/*
  	this.getMarkup = function (wid){
  		return hemul_rainfall(widgetCtrl.widgets[wid]);
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
  						widgetCtrl.widgets[data.id] = data;
  					}			
  				}).error(function(data){
  					console.log("fail! " + data.id);
  				});
  		}
  	}
  	
  	
  	this.widgets = {
  	  	rainfall: {},
  		electionresults: {}
  	};  	
  	this.loadWidget(["rainfall", "electionresults"]);
*/

  }]);
  
  function getProperties(){
    var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/properties = (.*)/.exec(script_tag[0].text);
	return match[1];
  }
  
})();
