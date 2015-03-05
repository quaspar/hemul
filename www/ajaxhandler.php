<?php
if (!isset($_REQUEST['properties'])) {
	json_response(array('status' => 0, 'msg' => 'no data',));
}

$props = json_decode($_REQUEST['properties']);
debug($props);


function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array);
	exit();
}

function debug($var) {
	echo "<pre>" . print_r($var, true) . "</pre>";
}
