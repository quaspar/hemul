function handle_ajax_response(response){
	return null;
};

function send_props_to_server(){
	var script_tag = $('script[type="text/javascript"]:contains("window.initMap")');
	var match=/(var properties.*)/.exec(script_tag[0].text);
	var postdata = "properties=" + match; // match.substring(17);
	console.log(postdata); // debug
	make_post_request(handle_ajax_response, postdata);
}

function init_hemul(){
  var hemuldiv = '<div id="hemul" class="gallery-item item-1"><h1>Här ska vi visa massa hemuldata!</h1></div>';
  $("#item-gallery div.item-0").after(hemuldiv);
  $("#item-info>div.header").hide();
}



function make_post_request(callback, postdata) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = xhr.responseText;
        callback(data);
      } else {
        callback(null);
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  var url = 'http://hemul.fria.nu/ajaxhandler.php';
  xhr.open('POST', url, true);
  xhr.send(postdata);
}






$( document ).ready(function() {
	send_props_to_server();
    init_hemul();
});








