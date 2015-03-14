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
include 'kolada.php';
$hemul->koladaData = $kolada;

$directive = explode('_', $_REQUEST['directive']);

$funcname = 'get' . ucfirst($directive[0]);
$param = isset($directive[1]) ? $directive[1] : NULL;

if (method_exists($hemul, $funcname)) {
	json_response(array('status' => 1, 'id' => $_REQUEST['directive'], 'data' => $hemul->$funcname($param)));
}
else {
	json_response(array('status' => 0, 'msg' => 'unknown directive'));
}

function json_response($array) {
	header('Content-Type: application/json');
	echo json_encode($array, JSON_FORCE_OBJECT);
	exit();
}
