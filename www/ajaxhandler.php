<?php
/* debug */
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
/* ***** */

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
$array = array(
	'status' => 1,
	'rain' => $hemul->getRain(),
	'elections' => $hemul->getElectionResults(),
	'income' => $hemul->getIncome(),
	'andel ekologisk mat i kommunens verksamhet 2014' => $hemul->kolada('U07409', '2014'),
	'andel män som vabbar' => $hemul->kolada('N00945'),
	'skattesats totalt 2014' => $hemul->kolada('N00900', '2014'),
);
json_response($array);	

function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array, JSON_FORCE_OBJECT);
	exit();
}
