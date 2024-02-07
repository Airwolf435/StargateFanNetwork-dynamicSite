<?php
/**
 * ! Gets a set number of random records from the database and returns just their ID's 
 */
require_once("./inc/connect_pdo.php");
$data = array();
$query = "SELECT movie_id FROM movie WHERE isMovie = 1 ORDER BY Rand()";
foreach($dbo->query($query) as $record){
    $data[] = $record[0];
}
$payload["movies"] = $data;
$payload = json_encode($payload);
header("Content-Type: application/json");

print($payload);