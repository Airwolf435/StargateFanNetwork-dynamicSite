<?php

require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);
$movieID = addslashes($_POST["movieID"]);
$data = array();

if($movieID && $dbo){
    $query = "SELECT 
    movie.movie_id,
    movie.name,
    movie.cover_id,
    image.name,
    image.descript
    FROM movie
    RIGHT JOIN image ON movie.cover_id = image.image_id
    WHERE movie_id!=$movieID AND isMovie=1";
    foreach($dbo->query($query) as $record){
        $data[] = array(
            "movieID" => stripslashes($record[0]),
            "movieName" => stripslashes($record[1]),
            "imageID" => stripslashes($record[2]),
            "imageName" => stripslashes($record[3]),
            "imageDescript" => stripslashes($record[4]),
        );
    }
    $payload = json_encode($data);
}else{
    // Sets an empty payload for sending back.
    $payload = json_encode(Array("ERROR"=>"Error occured, the requestedEpisode value was invalid: $characterID"));
}

header("Content-Type: application/json");

print($payload);