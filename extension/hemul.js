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
    				console.log(rendered);
    				var markup = '<div>' + rendered.markup + '</div>';
       				element.html($compile(markup)(scope));
       				if (typeof rendered.callback !== 'undefined' && rendered.callback){
       					window[rendered.callback](result);
       				}
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
  	var widgetCtrl = this;
  }]);
  
  function getProperties(){
    var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/properties = (.*)/.exec(script_tag[0].text);
	return match[1];
  }
  
})();
