<?php
/* debug */
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
/* ***** */

header("Access-Control-Allow-Origin: *");

if (!isset($_REQUEST['properties']) || !isset($_REQUEST['directive'])) {
	json_response(array('status' => 0, 'msg' => 'missing argument',));
}

$props = json_decode($_REQUEST['properties']);
$coordinates = $props[0]->coordinate;
$adress = $props[0]->location_name;

if (!isset($coordinates[0]) || !isset($coordinates[1]) || !isset($adress)) {
	json_response(array('status' => 0, 'msg' => 'error parsing data'));
}

include 'hemul.php';
$hemul = new hemul($coordinates[0], $coordinates[1], $adress);
$kommunArray = $hemul->getKommunfromcoordinates();
$kommun = isset($kommunArray['MunicipalityName']) ? $kommunArray['MunicipalityName'] : $adress;
if (substr($_REQUEST['directive'], 0, 6) == 'kolada') {
	$params = str_split($_REQUEST['directive'], 6);
	$directive = $params[0];
	unset($params[0]);
	$param = implode(',', $params);
}
else {
	$directive = $_REQUEST['directive'];
	$param = NULL;
}

$funcname = 'get' . ucfirst($directive);

if (method_exists($hemul, $funcname)) {
	json_response(array('status' => 1, 'id' => $_REQUEST['directive'], 'data' => $hemul->$funcname($param), 'municipality' => $kommun));
}
else {
	json_response(array('status' => 0, 'msg' => 'unknown directive'));
}

function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array, JSON_FORCE_OBJECT);
	exit();
}
