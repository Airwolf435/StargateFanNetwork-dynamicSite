<?php
require_once("./inc/connect_pdo.php");
/*
This Route will return all episode records, but only the ID and Name.
*/

$query = "SELECT
    movie_id,
    name
    FROM movie
    ORDER BY movie_id ASC";

$data = array();

foreach($dbo->query($query) as $rec){
    $id = stripslashes($rec[0]);
    $name = stripslashes($rec[1]);
    $data[] = array("id" => $id, "name" => $name);
}

$payload = json_encode($data);
header("Content-Type: application/json");
print($payload);

?>