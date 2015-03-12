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
	
	public function kolada($kpi, $year = NULL) { /* https://github.com/Hypergene/kolada */
		if (!$this::scbGetKommun()) return NULL;
		$url = "http://api.kolada.se/v2/data/kpi/$kpi/municipality/" . $this->kommunKod;
		$url .= $year ? "/year/$year" : '';
		return $this::fixKoladaResponse(json_decode(file_get_contents($url), true));
	}
	
	public function getElectionResults() {
		if (!$this::scbGetKommun()) return NULL;
		$url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3";
		$data = array (
			'query' => array (
		    		0 => array ('code' => 'Region', 'selection' => array ('filter' => 'vs:RegionKommun07+BaraEjAggr', 'values' => array (0 => $this->kommunKod,),),),
		    		1 => array ('code' => 'ContentsCode', 'selection' => array ('filter' => 'item', 'values' => array (0 => 'ME0104B7',),),),
		    		2 => array ('code' => 'Tid', 'selection' => array ('filter' => 'item', 'values' => array (0 => '2014',),),),
			),
			'response' => array ('format' => 'json',),
  		);
		$result = $this::postRequest($url, json_encode($data), true);
		if (!$result) return NULL;
		$result = json_decode($this::removeBom($result), true);
		return $this::fixScbResponse($result, 1);
	}

	public function getIncome() {
		if (!$kommun = $this::scbGetKommun()) return NULL;
		$url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2";
		$data = array(
			'query' => array(
				0 => array('code' => 'Region', 'selection' => array('filter' => 'vs:RegionKommun07EjAggr', 'values' => array(0 => $this->kommunKod))),
				1 => array('code' => 'Kon', 'selection' => array('filter' => 'item', 'values' => array(0  => '1+2'))),
				2 => array('code' => 'Alder', 'selection' => array('filter' => 'item', 'values' => array(0 => 'tot16+'))),
				3 => array('code' => 'Inkomstklass', 'selection' => array('filter' => 'item', 'values' => array(
					0 => "TOT",
          				1 => "0",
          				2 => "1-19",
          				3 => "20-39",
          				4 => "40-59",
          				5 => "60-79",
          				6 => "80-99",
          				7 => "100-119",
          				8 => "120-139",
          				9 => "140-159",
          				10 => "160-179",
          				11 => "180-199",
          				12 => "200-219",
          				13 => "220-239",
          				14 => "240-259",
          				15 => "260-279",
          				16 => "280-299",
          				17 => "300-319",
          				18 => "320-339",
          				19 => "340-359",
          				20 => "360-379",
          				21 => "380-399",
          				22 => "400-499",
          				23 => "500-599",
          				24 => "600-799",
          				25 => "800-999",
          				26 => "1000+"))),
				4 => array('code' => 'ContentsCode', 'selection' => array('filter' => 'item', 'values' => array(0 => 'HE0110K1'))),
				5 => array('code' => 'Tid', 'selection' => array('filter' => 'item', 'values' => array(0 => '2013')))
			),
			'response' => array('format' => 'json')
		);
		$result = $this::postRequest($url, json_encode($data), true);
		if (!$result) return NULL;
		$result = json_decode($this::removeBom($result), true);
		return $this::fixScbResponse($result, 3);
	}

	private function removeBOM($string) {
		$bom = pack('H*','EFBBBF');
		return preg_replace("/^$bom/", '', $string);
	}

	private function smhiGetClosest() {
		if (isset($this->smhiClosest) && is_array($this->smhiClosest)) return;
		/* http://fr.scribd.com/doc/2569355/Geo-Distance-Search-with-MySQL */
		$query = "SELECT * , 3956 *2 * ASIN( SQRT( POWER( SIN( ( $this->lat - ABS( smhi.lat ) ) * PI( ) /180 /2 ) , 2 ) + COS( $this->lat * PI( ) /180 ) * COS( ABS( smhi.lat ) * PI( ) /180 ) * POWER( SIN( ( $this->lon - smhi.lon ) * PI( ) /180 /2 ) , 2 ) ) ) AS distance FROM smhi ORDER BY distance LIMIT 1";
		$this->smhiClosest = $this->sql->query($query)->fetch_assoc();
	}

	private function scbGetKommun() {
		if (isset($this->kommunKod)) return $this->kommunKod;
		$query = "select scbId from scb where kommun like '$this->adr'";
		$res = $this->sql->query($query)->fetch_assoc();
		$this->kommunKod = isset($res['scbId']) ? $res['scbId'] : NULL;
		return $this->kommunKod;
	}

	private function fixScbResponse($data, $keyIndex) {
		$array = array();
		foreach ($data['data'] as $elt) {
			$array[$elt['key'][$keyIndex]] = $elt['values'][0];
		}
		return $array;
	}

	private function fixKoladaResponse($data) {
		$array = array();
		foreach($data['values'] as $elt) {
			$array[$elt['period']] = $elt['values'][0];
		} 
		return $array;
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
