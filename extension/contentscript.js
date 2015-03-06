function handle_ajax_succes(response = null){
	alert("success!");
	return null;
};

function send_props_to_server(){
	var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/var properties = (.*)/.exec(script_tag[0].text);
	var postdata = "properties=" + match[1];
	console.log(postdata); // debug
	// Note that any URL fetched here must be matched by a permission in
	// the manifest.json file!
	var jqxhr = $.post('http://hemul.fria.nu/ajaxhandler.php', postdata, handle_ajax_success).fail(function() {
    	alert( "error");
	})
}

function init_hemul(){
  var hemuldiv = '<div id="hemul" class="gallery-item item-1"><h1>Här ska vi visa massa hemuldata!</h1></div>';
  $("#item-gallery div.item-0").after(hemuldiv);
  $("#item-info>div.header").hide();
}





$( document ).ready(function() {
	send_props_to_server();
    init_hemul();
});








