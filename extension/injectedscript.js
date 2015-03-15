	alert("hej från injectedscript.js");
	var mapOptions = {
          center: { lat: -34.397, lng: 150.644},
          zoom: 8
        };
     var hemulmap = new google.maps.Map(document.getElementById('waterContainer'),
    	 mapOptions);