<?php

require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);
$castID = addslashes($_POST["castID"]);
$data = array();

if($castID && $dbo){
    $query = "SELECT 
    character_related.movie_id,
    movie.cover_id,
    image.name,
    image.descript,
    movie.name,
    movie.isMovie,
    movie.season,
    movie.episode
    FROM character_related
    RIGHT JOIN movie ON character_related.movie_id = movie.movie_id
    RIGHT JOIN image ON movie.cover_id = image.image_id
    WHERE character_id=$castID
    ORDER BY Rand() LIMIT 10";
    foreach($dbo->query($query) as $record){
        $data[] = array(
            "movieID" => stripslashes($record[0]),
            "imageID" => stripslashes($record[1]),
            "imageName" => stripslashes($record[2]),
            "imageDescript" => stripslashes($record[3]),
            "movieName" => stripslashes($record[4]),
            "isMovie" => stripslashes($record[5]),
            "season" => stripslashes($record[6]),
            "episode" => stripslashes($record[7])
        );
    }
    $payload = json_encode($data);
}else{
    // Sets an empty payload for sending back.
    $payload = json_encode(Array("ERROR"=>"Error occured, the requestedEpisode value was invalid: $characterID"));
}

header("Content-Type: application/json");

print($payload);