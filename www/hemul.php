<?php
class hemul {
	public function __construct($lat, $lon, $adr) {
		include '../../hemul.mysql.php';
		$this->sql = getMySqlConnection();
		$this->lat = $lat;
		$this->lon = $lon;
		$this->adr = $adr;
		$this->viss = '826f42a326945049d0309a48a01b1a68';
	}
	
	/* http://opendata.smhi.se/apidocs/metobs/ */	
	public function getRainfall() {
		$regn = 5;
		$data = $this::smhiArchive($regn, 2, 3);
		/*		
		$valueFreq = array_count_values($data);
		$regnfriadagar = $valueFreq['0.0'];
		$regndagar = count($data) - $regnfriadagar;
		*/
		// return array('observations' => $data, 'rainydays' => $regndagar, 'noraindays' => $regnfriadagar);
		return $data;
	}

	public function getSnowdepth() {
		return $this::smhiArchive(8, 0, 2);
	}

	public function getMiddletemperature() { 
		return $this::smhiArchive(2, 2, 3);
	}

	public function getMaxtemperature() { 
		return $this::smhiArchive(20, 2, 3);
	}

	public function getMintemperature() { 
		return $this::smhiArchive(19, 2, 3);
	}

	/* https://github.com/Hypergene/kolada */	
	public function getKolada($kpi) {
		if ($kpi === NULL) return;
		if (!$kommun = $this::scbGetKommun()) return NULL; /* kolada uses the same municipality codes as scb */
		/*$kpi = implode(',', array_values($this->koladaData));*/
		$trans = array_flip($this->koladaData);
		$url = "http://api.kolada.se/v2/data/kpi/$kpi/municipality/" . $kommun;
		$url .= isset($this->koladaYear) ? "/year/" . $this->koladaYear : '';
		$data = json_decode(file_get_contents($url), true);
		if (!$data) return NULL;
		$array = array();
		foreach($data['values'] as $elt) {
			$array[$trans[$elt['kpi']]][$elt['period']] = $elt['values'][0];
		}		
		return $array;
	}
	
	/* http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__ME__ME0104__ME0104C/ME0104T3/?rxid=9b9a346e-08c6-48c1-81ec-ee3ac6ec5eaa  */
	public function getElectionresults() {
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
		$result = $this::postRequest($url, json_encode($data), true);
		if (!$result) return NULL;
		$result = json_decode($this::removeBom($result), true);
		$result = $this::fixScbResponse($result, 1);
		return array(
			'V' => $result['V'],
			'S' => $result['S'],
			'MP' => $result['MP'],
			'SD' => $result['SD'],
			'C' => $result['C'],
			'FP' => $result['FP'],
			'KD' => $result['KD'],
			'M' => $result['M'],
			'Övriga' => $result['ÖVRIGA'], 
		);
	}

	/* http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0603/Skyddadnatur/?rxid=850093b7-fe55-4247-be6d-ac214d16c806 */
	public function getProtectednature() {
		if (!$kommun = $this::scbGetKommun()) return NULL;
		$url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0603/Skyddadnatur";
		$data = array (
			'query' => array (
				0 => array('code' => 'Region', 'selection' => array('filter' => 'vs:RegionKommun07EjAggr', 'values' => array(0 => $kommun))),
		    		1 => array ('code' => 'Tid', 'selection' => array ('filter' => 'item', 'values' => array (0 => '2013'))),
			),
			'response' => array ('format' => 'json'),
  		);
		$result = $this::postRequest($url, json_encode($data), true);
		if (!$result) return NULL;
		$result = json_decode($this::removeBom($result), true);
		return $this::fixScbResponse($result, 1, array(0, 1, 3));

	}

	/* http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__HE__HE0110__HE0110A/SamForvInk2/?rxid=9b9a346e-08c6-48c1-81ec-ee3ac6ec5eaa  */
	public function getIncome() {
		if (!$kommun = $this::scbGetKommun()) return NULL;
		$url = "http://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2";
		$data = array(
			'query' => array(
				0 => array('code' => 'Region', 'selection' => array('filter' => 'vs:RegionKommun07EjAggr', 'values' => array(0 => $kommun))),
				1 => array('code' => 'Kon', 'selection' => array('filter' => 'item', 'values' => array(0  => '1', 1 => '2'))),
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
				4 => array('code' => 'ContentsCode', 'selection' => array('filter' => 'item', 'values' => array(0 => 'HE0110K3'))),
				5 => array('code' => 'Tid', 'selection' => array('filter' => 'item', 'values' => array(0 => '2013')))
			),
			'response' => array('format' => 'json')
		);
		$result = $this::postRequest($url, json_encode($data), true);
		if (!$result) return NULL;
		$result = json_decode($this::removeBom($result), true);
		$array = array();
		foreach($result['data'] as $elt) {
			$array[$elt['key'][3]][$elt['key'][1]] = $elt['values'][0];
		}
		return $array;
	}

	/* http://www.arbetsformedlingen.se/download/18.362b127c14924e08e87137a/1424696315134/tekniskbeskr_ledigajobb.pdf */
	public function getJobs() {
		$kommun = $this::scbGetKommun();
		if (!$kommun) return NULL;
		$url = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?kommunid=" . $kommun;
		$opts = array(
		'http'=>array(
			'method'=>"GET",
			'header'=>"Accept: application/json\r\n" .  
				  "Accept-Language: sv\r\n" 
		 ));
		$context = stream_context_create($opts);
		$data = json_decode(file_get_contents($url, false, $context), true);
		unset($data['matchningslista']['matchningdata']);
		return $data;
	}

	/* http://viss.lansstyrelsen.se/api  */
	public function getWaterinformation() {
		return $this::requestVISS();	
	}

	public function getKommunfromcoordinates() {
		$res = $this::requestVISS();
		return array(
			'MunicipalityCode' => $res['MunicipalityCode'],
			'MunicipalityName' => $res['MunicipalityName'],
		);
	}


/*
** private functions 
*/

	private function removeBOM($string) {
		$bom = pack('H*','EFBBBF');
		return preg_replace("/^$bom/", '', $string);
	}

	private function requestVISS() {
		$url = "http://viss.lansstyrelsen.se/api?method=coordinateinfo&apikey=" . $this->viss . "&format=json&x=" . $this->lat . "&y=" . $this->lon . "&coordinateformat=WGS84";
		$result = file_get_contents($url);
		return json_decode($result, true);

	}

	private function smhiGetClosest() {
		/* http://fr.scribd.com/doc/2569355/Geo-Distance-Search-with-MySQL */
		$query = "SELECT * , 3956 *2 * ASIN( SQRT( POWER( SIN( ( $this->lat - ABS( smhi.lat ) ) * PI( ) /180 /2 ) , 2 ) + COS( $this->lat * PI( ) /180 ) * COS( ABS( smhi.lat ) * PI( ) /180 ) * POWER( SIN( ( $this->lon - smhi.lon ) * PI( ) /180 /2 ) , 2 ) ) ) AS distance FROM smhi ORDER BY distance LIMIT 1";
		return $this->sql->query($query)->fetch_assoc();
	}

	private function scbGetKommun() {
		$query = "select scbId from scb where kommun like '$this->adr'";
		$res = $this->sql->query($query)->fetch_assoc();
		return isset($res['scbId']) ? $res['scbId'] : NULL;
	}

	private function fixScbResponse($data, $keyIndex, $contents = NULL) { /* contents motsvarar raden/raderna i "tabellinnehåll" på SCBs hemsida */
		$array = array();
		foreach ($data['data'] as $elt) {
			if ($contents) {
				foreach ($contents as $content) {
					$array[$elt['key'][$keyIndex]][$content] = $elt['values'][$content];
				}
			}
			else {
				$array[$elt['key'][$keyIndex]] = $elt['values'][0];
			}
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

	private function smhiArchive($parameter, $key = 0, $value = 1, $debug = false) {
		$closest = $this::smhiGetClosest();
		$station = $closest['stationId'];
		$url = "http://opendata-download-metobs.smhi.se/api/version/latest/parameter/$parameter/station/$station/period/corrected-archive/data.csv";
		$csv = file_get_contents($url);
		if (!$csv) return NULL;
		if ($debug) {
			return $this::smhiCsvDebug($csv, $key, $value);
		}
		else {
			return $this::smhiCsvHandler($csv, $key, $value);
		}
	}

	private function smhiCsvHandler($csv, $key, $value) { /* $key och $values är kolumner från csv filen */
		$lines = explode(PHP_EOL, $csv);
		$data = array();
		$years = array();
		foreach ($lines as $line) {
			$row = str_getcsv($line, ';');
			if (isset($row[$key]) && preg_match('/^\d\d\d\d-\d\d-\d\d$/', $row[$key])) {
				$date = $row[$key];
				$year = substr($date,0,4);
				$years[$year] = array();
				if ($row[$value] == '0.0'){
					$years[$year][0] ++;
				}
				else {
					$years[$year][1] ++;				
				}
				/*
				array_push($data, array(
					'year' => $year,
					'month' => substr($date,5,2),
					'day' => substr($date,8,2),
					'value' => $row[$value]
				));
				*/
			}
		}
		return $years;
	}

	private function smhiCsvDebug($csv) {
		$lines = explode(PHP_EOL, $csv);
		$data = array();
		foreach ($lines as $line) {
			$data[] = str_getcsv($line, ';');
		}
		return $data;
	}


	private function getLan() {
		$kommun = $this::scbGetKommun();
		if (!$kommun) return NULL;
		$laner = array(
			'01' => 'Stockholms län',
			'03' => 'Uppsala län',
			'04' => 'Södermanlands län',
			'05' => 'Östergötlands län',
			'06' => 'Jönköpings län',
			'07' => 'Kronobergs län',
			'08' => 'Kalmar län',
			'09' => 'Gotlands län',
			'10' => 'Blekinge län',
			'12' => 'Skåne län',
			'13' => 'Hallands län',
			'14' => 'Västra Götalands län',
			'17' => 'Värmlands län',
			'18' => 'Örebro län',
			'19' => 'Västmanlands län',
			'20' => 'Dalarnas län',
			'21' => 'Gävleborgs län',
			'22' => 'Västernorrlands län',
			'23' => 'Jämtlands län',
			'24' => 'Västerbottens län',
			'25' => 'Norrbottens län',
		);
		return $laner[substr($kommun, 0, 2)];	
	}
}
