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

	public function getElectionResults() {
		if (!$kommun = $this::scbGetKommun()) return NULL;
		$url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3";
		$data = array (
			'query' => array (
		    		0 => array ('code' => 'Region', 'selection' => array ('filter' => 'vs:RegionKommun07+BaraEjAggr', 'values' => array (0 => $kommun,),),),
		    		1 => array ('code' => 'ContentsCode', 'selection' => array ('filter' => 'item', 'values' => array (0 => 'ME0104B7',),),),
		    		2 => array ('code' => 'Tid', 'selection' => array ('filter' => 'item', 'values' => array (0 => '2014',),),),
			),
			'response' => array ('format' => 'json',),
  		);
		return $this::postRequest($url, json_encode($data), true);
	}


	private function smhiGetClosest() {
		if (isset($this->smhiClosest) && is_array($this->smhiClosest)) return;
		/* http://fr.scribd.com/doc/2569355/Geo-Distance-Search-with-MySQL */
		$query = "SELECT * , 3956 *2 * ASIN( SQRT( POWER( SIN( ( $this->lat - ABS( smhi.lat ) ) * PI( ) /180 /2 ) , 2 ) + COS( $this->lat * PI( ) /180 ) * COS( ABS( smhi.lat ) * PI( ) /180 ) * POWER( SIN( ( $this->lon - smhi.lon ) * PI( ) /180 /2 ) , 2 ) ) ) AS distance FROM smhi ORDER BY distance LIMIT 1";
		$this->smhiClosest = $this->sql->query($query)->fetch_assoc();
	}

	private function scbGetKommun() {
		$query = "select scbId from scb where kommun like '$this->adr'";
		$res = $this->sql->query($query)->fetch_assoc();
		return isset($res['scbId']) ? $res['scbId'] : NULL;
	}

	private function postRequest($url, $data, $json=false) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		if ($json) {
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Content-Type: application/json',                                                                                
				'Content-Length: ' . strlen($data))                                                                  
			); 
		}
		$result = curl_exec($ch);
		curl_close($ch);
		return $result;
	}
}
