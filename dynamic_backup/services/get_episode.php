<?php

require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);
$requestedEpisode = $_POST["requestedEpisode"];
$data = array();

if($requestedEpisode && $dbo){
    // TODO: Code for querying an episode, and prep it for sending to the user.
    $query = "SELECT movie.movie_id, movie.isMovie, movie.season, movie.episode, movie.previous_ep, movie.next_ep, movie.name, movie.cover_id, image.name, movie.hour_me, movie.minute_me, movie.date_me, movie.descript FROM movie RIGHT JOIN image ON movie.cover_id = image.image_id WHERE movie.movie_id = $requestedEpisode";

    foreach($dbo->query($query) as $record){
        $data["id"] = stripslashes($record[0]);
        $data["isMovie"] = stripslashes($record[1]);
        $data["season"] = stripslashes($record[2]);
        $data["episode"] = stripslashes($record[3]);
        $data["previous_ep"] = stripslashes($record[4]);
        $data["next_ep"] = stripslashes($record[5]);
        $data["name"] = stripslashes($record[6]);
        $data["coverID"] = stripslashes($record[7]);
        $data["coverName"] = stripslashes($record[8]);
        $data["hour_me"] = stripslashes($record[9]);
        $data["minute_me"] = stripslashes($record[10]);
        $data["date_me"] = stripslashes($record[11]);
        $data["descript"] = stripslashes($record[12]);
    }
    $payload = json_encode($data);
}else{
    // Sets an empty payload for sending back.
    $payload = json_encode(Array("ERROR"=>"Error occured, the requestedEpisode value was invalid: $requestedEpisode"));
}
header("Content-Type: application/json");

print($payload);