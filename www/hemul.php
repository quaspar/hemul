<?php
class hemul {
	public function __construct($lat, $lon, $adr) {
		$this->lat = $lat;
		$this->lon = $lon;
		$this->adr = $adr;
	}	

	public function getRain() {
		$key = $this::smhiGetKey();
		$url = "http://opendata-download-metobs.smhi.se/api/version/latest/parameter/5/station/$key.json";
		return "it's raining";		
	}

	public function getSnow() {
		$url = "http://opendata-download-metobs.smhi.se/api/version/latest/parameter/8/station/$key.json";
	}

	private function smhiGetKey() {
		/* http://opendata.smhi.se/apidocs/metobs/version.html */
		/* todo cache all the tations from http://opendata-download-metobs.smhi.se/api/version/latest/parameter/5 mysql? */
	}

}
