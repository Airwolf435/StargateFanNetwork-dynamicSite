<?php

require_once("./inc/connect_pdo.php");
// Credit to https://stackoverflow.com/questions/1282909/php-post-array-empty-upon-form-submission for the fix to get $_POST to populate the JSON data im sending it.
$_POST = json_decode(file_get_contents("php://input"), true);
$characterID = addslashes($_POST["characterID"]);
$data = array();

if($characterID && $dbo){
    // TODO: Code for querying an episode, and prep it for sending to the user.
    $query = "SELECT characters.id, characters.image_id, image.name, image.descript, characters.character_name, characters.descript 
    FROM characters
    RIGHT JOIN image ON characters.image_id = image.image_id 
    WHERE id=$characterID";

    foreach($dbo->query($query) as $record){
        $data["id"] = stripslashes($record[0]);
        $data["imageID"] = stripslashes($record[1]);
        $data["imageName"] = stripslashes($record[2]);
        $data["imageDescript"] = stripslashes($record[3]);
        $data["characterName"] = stripslashes($record[4]);
        $data["characterDescript"] = stripslashes($record[5]);
    }
    $payload = json_encode($data);
}else{
    // Sets an empty payload for sending back.
    $payload = json_encode(Array("ERROR"=>"Error occured, the requestedEpisode value was invalid: $characterID"));
}
header("Content-Type: application/json");

print($payload);