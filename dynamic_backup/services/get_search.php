<?php

require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);

$searchText = addSlashes($_POST["searchText"]);
$searchCount = addslashes($_POST["searchCount"]);

// $searchText = "star";
// $searchCount = 5;

$data = array();

if($searchText && $searchCount && $dbo){
    $query = "SELECT movie_id, name, season, episode, isMovie
    FROM movie
    WHERE name LIKE '%$searchText%'
    ORDER BY date_me
    LIMIT 0, $searchCount";

    foreach($dbo->query($query) as $rec){
        $data[] = array(
            "id" => $rec[0],
            "episodeName" => $rec[1],
            "seasonNum" => $rec[2],
            "episodeNum" => $rec[3],
            "isMovie" => $rec[4]
        );
    }
    $payload = json_encode($data);
}else{
    $payload = json_encode("Error: A required variable was not supplied.");
}

header("Content-Type: application/json");

print($payload);
