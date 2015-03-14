function hemul_rainfall(widget){
	console.log("hemul_rainfall", widget);
	return '<div>' + widget.id + '</div>';
}

function hemul_electionresults(widget){
	return '<div ng-bind="customHtml">widget.id</div>';
}