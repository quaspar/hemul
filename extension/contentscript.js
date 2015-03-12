function handle_ajax_success(response){
	console.log("Svar från servern:"); // debug
	console.log(response); // debug
	return null;
};

function send_props_to_server(success_callback){
	var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/var properties = (.*)/.exec(script_tag[0].text);
	var postdata = "properties=" + match[1];
	console.log(postdata); // debug
	// Note that any URL fetched here must be matched by a permission in
	// the manifest.json file!
	var jqxhr = $.post('http://hemul.fria.nu/ajaxhandler.php', postdata, success_callback).fail(function() {
    	alert( "error"); // debug
	})
}


function init_hemul(){
  var numberOfSlides = $("#item-gallery div.gallery-item").length - 3;
  var newNumber = numberOfSlides + 1;
  var classOfLastSlide = "item-" + numberOfSlides;
  $("#item-gallery div.gallery-item").not(".item-0").each(function(index, e){
  	if ($(this).hasClass("item-" + numberOfSlides)){
  		$(this).removeClass("item-" + numberOfSlides).addClass("item-" + newNumber);
  	}
  	else {
     var newClass = $(this).next().attr("class");
     $(this).attr("class", newClass);
    }
  });  
  $("#item-gallery div." + classOfLastSlide).removeClass(classOfLastSlide).addClass("item-" + newNumber);
  
  var hemuldiv = 
  	'<div id="hemul" class="gallery-item item-1" ng-app="hemul">\
  		<section class="tab" ng-controller="TabController as tabs">\
        <ul class="nav nav-pills">\
          <li ng-class="{active:tabs.isSet(0)}">\
            <a ng-click="tabs.setTab(0)" href>Översikt</a></li>\
          <li ng-class="{active:tabs.isSet(1)}">\
            <a ng-click="tabs.setTab(1)" href>Miljö</a></li>\
          <li ng-class="{active:tabs.isSet(2)}">\
            <a ng-click="tabs.setTab(2)" href>Människor</a></li>\
          <li ng-class="{active:tabs.isSet(3)}">\
            <a ng-click="tabs.setTab(3)" href>Samhälle</a></li>\
        </ul>\
        <div ng-show="tabs.isSet(0)">\
          <h4>Översikt</h4>\
          <blockquote>test översikt</blockquote>\
        </div>\
        <div ng-show="tabs.isSet(1)">\
          <h4>Miljö</h4>\
          <blockquote>test miljö</blockquote>\
        </div>\
        <div ng-show="tabs.isSet(2)">\
          <h4>Människor</h4>\
          <blockquote>test människor</blockquote>\
        </div>\
        <div ng-show="tabs.isSet(3)">\
          <h4>Samhälle</h4>\
          <blockquote>test samhälle</blockquote>\
        </div>\
        </section>\
  	</div>';
  $("#item-gallery div.item-0").not(".cloned").after(hemuldiv);
  $("#item-info>div.header").hide();
}





$( document ).ready(function() {
	send_props_to_server(handle_ajax_success);
    init_hemul();
});








