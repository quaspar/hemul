/*
function handle_ajax_success(response){
	console.log("Svar från servern:"); // debug
	console.log(response); // debug
	return null;
};

function send_props_to_server(success_callback){
	var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/properties = (.*)/.exec(script_tag[0].text);
	var postdata = "properties=" + match[1];
	console.log(postdata); // debug
	// Note that any URL fetched here must be matched by a permission in
	// the manifest.json file!
	var jqxhr = $.post('http://hemul.fria.nu/ajaxhandler.php', postdata, success_callback).fail(function() {
    	alert( "error"); // debug
	})
}
*/


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
  var hemulHtml = chrome.extension.getURL('/hemul.html');
  var hemuldiv = '<div id="hemul" class="gallery-item item-1" ng-app="Hemul" ng-include="\'' + hemulHtml + '\'"></div>';
  $("#item-gallery div.item-0").not(".cloned").after(hemuldiv);
  $("#item-info>div.header").hide();
}





// $( document ).ready(function() {
	// send_props_to_server(handle_ajax_success);
    init_hemul();
// });








