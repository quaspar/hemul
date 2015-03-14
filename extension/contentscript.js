function init_hemul() {
	var hemulHtml = chrome.extension.getURL('/hemul.html');
	var hemulDiv = '<div id="hemul" ng-app="Hemul" ng-include="\'' + hemulHtml + '\'"></div>';
  	var hemulModal = '<div id="hemulModal" class="modal fade" role="dialog" aria-labelledby="mymodallabel" aria-hidden=true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h2 class="modal-title" id="myModalLabel">Hemul</h2></div><div class="modal-body" style="min-height: 500px;">' + hemulDiv + '</div><div class="modal-footer">' + hemulFooter() + '</div></div></div></div></div>';
	$('#page-container').append(hemulModal);
	$("#item-actions").append("<a class='button' href='#' id='hemulPopup' style='margin-left: 8px;'><span><i class='fa fa-line-chart'> </i>Hemul");
	$('#item-actions').on('click', '#hemulPopup', function() {
		$('#hemulModal').modal('toggle');
		return false;
	});
	
}

function hemulFooter() {
	return	'<img src="' + chrome.extension.getURL('/images/af.jpg') + '" style="margin-right: 8px;max-height: 25px;">' +
		'<img src="' + chrome.extension.getURL('/images/rka.png') + '" style="margin-right: 8px;max-height: 25px;">' +
		'<img src="' + chrome.extension.getURL('/images/smhi.png') + '" style="margin-right: 8px;max-height: 25px;">' +
		'<img src="' + chrome.extension.getURL('/images/scb.png') + '" style="margin-right: 8px; max-height: 25px;">';
}

init_hemul();

