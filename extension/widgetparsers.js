function hemul_waterInformation(widget){
	console.log("NearbyWaters", widget.data.NearbyWaters);
	return {markup: '<div id="waterContainer"><img src="https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=570x400&maptype=roadmap\
&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318\
&markers=color:red%7Clabel:C%7C40.718217,-73.998284"></img><div>', callback: 'waterInformationCallback'};
}

function waterInformationCallback(widget){
/*
	var s = document.createElement('script');
	// TODO: add "script.js" to web_accessible_resources in manifest.json
	s.src = chrome.extension.getURL('/injectedscript.js');
	s.onload = function() {
    	this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
	*/
}

function hemul_rainfall(widget){
	return {markup: '<div id="rainfallContainer"><div>', callback: 'rainfallCallback'};
}

function hemul_income(widget) {
	return {markup: '<div id="incomeContainer"></div>', callback: "incomeCallback"};
}

function hemul_electionresults(widget){
	var obj={markup: '<div id="electionsContainer"></div>', callback: "electionresultsCallback"};
	return obj;
}

// Nöjd region-index (Helheten) Kolada U00402
// Nöjd Region-Index - Bostäder U07406
function hemul_koladaU00402u00405u00408u07406(widget){
	return {markup: '<div id="koladaContainer"></div><div style="text-align: center;"><cite>Läs mer om <a href="http://www.scb.se/sv_/Vara-tjanster/Insamling-och-undersokning/Medborgarundersokningen/Resultat-2014">Medborgarundersökningen</a> hos SCB</cite></div>', callback: 'koladaCallback'};
}

function hemul_jobs(widget) {
	var myTable = '<table style="margin-top: 8px;" class="table table-stripped table-bordered">';
	$.each(widget.data.matchningslista, function(key, value) {
		if (key !== 'antal_sidor') {
			myTable += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
		}
	});
	myTable += '</table>';
	return {markup: myTable};
}

function koladaGetLatestYear(data) {
	var dataArray = [];
	for  (var kpi in data.data){
		var year = 0;
		dataArray[kpi] = [];
		for (var y in data.data[kpi]){
			var yy = parseInt(y);
			if (yy > year) {
				year = yy;
			}
		}
		dataArray.push(data.data[kpi][year].value);
	}
	return dataArray;
}

function koladaCallback(data){
	var titleList = {
		U00402: 'Nöjd på det hela taget',
		U00405: 'Nöjd med tryggheten',
		U00408: 'Nöjd med möjligheten till inflytande',
		U07406: 'Nöjd med bostadssituationen'
	}
	var dataArray = [];
	var labelArray = [];
	for  (var kpi in data.data){
		var year = 0;
		dataArray[kpi] = [];
		for (var y in data.data[kpi]){
			var yy = parseInt(y);
			if (yy > year) {
				year = yy;
			}
		}
		labelArray.push(titleList[kpi] + ' (' + year + ')');
		dataArray.push(data.data[kpi][year].value);
	}
    $('#koladaContainer').highcharts({

        chart: {
            polar: true,
            type: 'line',
            width: 570
        },

        title: {
            text: 'Så nöjda är invånarna i ' + data.municipality,
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: labelArray,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            lineWidth: 0,
            min: 0
        },
        
        legend: {
            enabled: false
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f} av 100</b><br/>'
        },

        series: [{
            name: 'Nöjdhet',
            color: '#FF6699',
            data: dataArray,
            pointPlacement: 'on',
            type: 'area'
        }]

    });	
}




function rainfallCallback(data){	
	var station = data.data.station;
	delete data.data.station;
	var dataArray = [];
	var labelArray = [];
    for (var key in data.data) {
       if (data.data.hasOwnProperty(key)) {
       	   labelArray.push(key);
       	   var total = parseInt(data.data[key][1]) + parseInt(data.data[key][0]);
       	   if (total > 150) {
           		dataArray.push(parseInt(100 * parseInt(data.data[key][1]) / total));
           }
           else {
           	dataArray.push(null);
           }
       }
    }

    $('#rainfallContainer').highcharts({
        chart: {
            type: 'spline',
			width: 570
        },
        title: {
            text: 'Andel dagar med nederbörd'
        },
        subtitle: {
            text: 'Station: ' + station
        }, 
        xAxis: {
            categories: labelArray
        },
        yAxis: {
            title: {
                text: 'Andel dagar med nederbörd'
            },
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            },
            min: 0, 
            max: 100
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
        	name: 'Station ' + station + ' (' + data.municipality + ')',
        	color: '#0000FF',
            marker: {
                symbol: 'diamond'
            },
            data: dataArray

        }]
    });
}

function incomeCallback(data) {
	
	var series = fixMyData(data.data);

	function fixMyData(obj) {
	    var men = [];
		var categories = [];
		var women = [];
	    for (var key in obj) {
	       if (obj.hasOwnProperty(key) && key !=='TOT') {
			   var value=obj[key];
	           men.push(parseFloat(value[1]));
			   women.push(parseFloat(value[2]));
			   categories.push(key);
	       }
	    }
    	return {categories: categories, men: men, women: women};
    }

	Highcharts.setOptions({
		colors: ['#8ac9f2', '#edabde']
	});

	$('#incomeContainer').highcharts({
        chart: {
            type: 'column',
			width: 570
        },
        title: {
            text: 'Förvärvsinkomst (tkr)'
        },
        xAxis: {
            categories: series.categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Antal personner'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Män',
            data: series.men

        }, {
            name: 'Kvinnor',
            data: series.women

        }]
	 });	
}

function objToArray(obj) {
    var result = [];
    for (var key in obj) {
       if (obj.hasOwnProperty(key) && $.isNumeric(obj[key])) {
           result.push([key,parseFloat(obj[key])]);
       }
    }
   	return result;
}

function electionresultsCallback(data) {
	var dataArray = objToArray(data.data);

	Highcharts.setOptions({
		colors: ['#b02522', '#c13b38', '#acc768', '#e7d960', '#78ae5a', '#378cab', '#366da3', '#88c7d9', '#c0c0c0']
	});

	$('#electionsContainer').highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            width: 570
	        },
	        title: {
	            text: 'Så röstade ' + data.municipality + ' i riksdagsvalet 2014'
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
				title: 'val2014',
	            data: dataArray,
	
	        }]
	
	    });
}
