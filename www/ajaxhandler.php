<?php
header("Access-Control-Allow-Origin: *");

if (!isset($_REQUEST['properties'])) {
	json_response(array('status' => 0, 'msg' => 'no data',));
}

$props = json_decode($_REQUEST['properties']);
//print_r($props);
$coordinates = $props[0]->coordinate;
$adress = $props[0]->location_name;

if (!isset($coordinates[0]) || !isset($coordinates[1]) || !isset($adress)) {
	json_response(array('status' => 0, 'msg' => 'error parsing data'));
}


include 'hemul.php';
$hemul = new hemul($coordinates[0], $coordinates[1], $adress);
json_response(array('status' => 1, 'rain' => $hemul->getRain()));	

function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array);
	exit();
}
