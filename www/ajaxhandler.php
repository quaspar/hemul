<?php
header("Access-Control-Allow-Origin: *");
if (!isset($_REQUEST['properties'])) {
	json_response(array('status' => 0, 'msg' => 'no data',));
}

$props = json_decode($_REQUEST['properties']);
print_r($props);


function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array);
	exit();
}
