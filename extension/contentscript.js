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
  var hemuldiv = '<div id="hemul" class="gallery-item item-1" ng-app="hemul"><div><label>Name:</label><input type="text" ng-model="yourName" placeholder="Enter a name here"><hr><h1>Hello {{yourName}}!</h1></div></div>';
  $("#item-gallery div.item-0").after(hemuldiv);
  $("#item-info>div.header").hide();
}





$( document ).ready(function() {
	send_props_to_server(handle_ajax_success);
    init_hemul();
});








