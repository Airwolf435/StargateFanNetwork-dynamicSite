<?php
/**
 * ! Gets a set number of random records from the database and returns just their ID's 
 */
require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);
$numRecords = $_POST["numRecords"];
// $numRecords = 5;
$data = array();
if($numRecords){
    $query = "SELECT movie_id FROM movie WHERE isMovie = 0 ORDER BY Rand() LIMIT $numRecords";
    foreach($dbo->query($query) as $record){
        $data[] = $record[0];
    }

    $payload["episodes"] = $data;
}else{
    $payload = "";
}
$payload = json_encode($payload);
header("Content-Type: application/json");

print($payload);