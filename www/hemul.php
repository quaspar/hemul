<?php
class hemul {
	public function __construct($lat, $lon, $adr) {
		include '../../hemul.mysql.php';
		$this->sql = getMySqlConnection();
		$this->lat = $lat;
		$this->lon = $lon;
		$this->adr = $adr;
	}	

	public function getRain() {
		$this::smhiGetClosest();
		$key = $this->smhiClosest['stationId'];
		$url = "http://opendata-download-metobs.smhi.se/api/version/latest/parameter/5/station/$key.json";
		return $url;		
	}
	
	public function getSnow() {
		$this::smhiGetClosest();
		$key = $this->smhiClosest['stationId'];
		$url = "http://opendata-download-metobs.smhi.se/api/version/latest/parameter/8/station/$key.json";
		return $url;
	}

	public function smhiGetClosest() {
		if (isset($this->smhiClosest) && is_array($this->smhiClosest)) return;
		/* http://fr.scribd.com/doc/2569355/Geo-Distance-Search-with-MySQL */
		$query = "SELECT * , 3956 *2 * ASIN( SQRT( POWER( SIN( ( $this->lat - ABS( smhi.lat ) ) * PI( ) /180 /2 ) , 2 ) + COS( $this->lat * PI( ) /180 ) * COS( ABS( smhi.lat ) * PI( ) /180 ) * POWER( SIN( ( $this->lon - smhi.lon ) * PI( ) /180 /2 ) , 2 ) ) ) AS distance FROM smhi ORDER BY distance LIMIT 1";
		$this->smhiClosest = $this->sql->query($query)->fetch_assoc();
	}

}
