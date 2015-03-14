function hemul_rainfall(widget){
	return {markup: '<div id="rainContainer">REGN</div>'};
}

function hemul_income(widget) {
	return {markup: '<div id="incomeContainer"></div>', callback: "incomeCallback"};
}

function hemul_electionresults(widget){
	var obj={markup: '<div id="electionsContainer"></div>', callback: "electionresultsCallback"};
	return obj;
}

function incomeCallback(data) {
	
	var series = fixMyData(data.data);
console.log(series.men);
console.log(series.women);
console.log(series.categories);

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

	function fixMyData2(obj, sex) {
	    var result = [];
	    for (var key in obj) {
	       if (obj.hasOwnProperty(key) && key !=='TOT') {
			   var value=obj[key];
			   var income=key.split('-');
			console.log(income[0] + ' : ' + income[1]);
			   var incomeMedel=income[1] ? (parseInt(income[0])+parseInt(income[1]))/2 : income[0];
			console.log(incomeMedel);
	           result.push([parseFloat(value[sex]), 1000*parseFloat(incomeMedel)]);
	       }
	    }
    	return result;
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

function electionresultsCallback(data) {
	var dataArray = objToArray(data.data);

	function objToArray(obj) {
	    var result = [];
	    for (var key in obj) {
	       if (obj.hasOwnProperty(key) && $.isNumeric(obj[key])) {
	           result.push([key,parseFloat(obj[key])]);
	       }
	    }
    	    return result;
	}


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
