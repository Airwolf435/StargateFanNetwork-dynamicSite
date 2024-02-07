<?php


//! This service handles retirving a set number of episodes.
//! You must send a post request with an int of how many episodes to retrieve.

// TODO: Create some logic on how to randomly pick a number of episodes from the entire table.
require_once("./inc/connect_pdo.php");

$movie_count = $_POST["movie_count"];


if ($movie_count) {
	$movie_count = $movie_count;
} else {
	$movie_count = "8";
}

function get_cover ($movie_cover_id,$dbo) {
	$query = "SELECT name
	FROM image
	WHERE image_id = '$movie_cover_id' ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_name = stripslashes($row["0"]);
	}
	
	return $image_name;
}



$query = "SELECT movie_id, name, cover_id
FROM movie
ORDER BY RAND() 
LIMIT 0,$movie_count";
//print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_cover_id = stripslashes($row["2"]);
	
	$movie["movie_id"] = $movie_id;
	$movie["movie_name"] = $movie_name;
	$movie["cover_id"] = $movie_cover_id;
	$cover = get_cover($movie_cover_id,$dbo);
	$movie["cover_name"] = $cover;
	
	$movies[] = $movie;
}

function getSeasonName($dbo, $sea){
	$query = "SELECT name
	FROM season
	WHERE season_id = '$sea' ";
	foreach($dbo->query($query) as $row) {
		$name = stripslashes($row["0"]);
	}
	return $name;
}


function getEpisode($dbo, $sea){
	$query = "SELECT name, episode, movie_id, cover_id, season
	FROM movie
	WHERE season = '$sea'
	ORDER BY episode, name ";
	foreach($dbo->query($query) as $row) {
		$name = stripslashes($row["0"]);
		$episode = stripslashes($row["1"]);
		$movie_id = stripslashes($row["2"]);
		$cover_id = stripslashes($row["3"]);
		$season = stripslashes($row["4"]);

		$cover = get_cover($movie_cover_id,$dbo);
		

		$stuff["movie_id"] = $movie_id;
		$stuff["name"] = $name;
		$stuff["season"] = $season;
		$stuff["episode"] = $episode;
		$stuff["cover_id"] = $cover_id;
		$stuff["cover_name"] = $cover;
		$more_stuff[] = $stuff;
	}
	return $more_stuff;
}

$query = "SELECT season
FROM movie
WHERE season > 0
GROUP BY season ";
//print("$query");
foreach($dbo->query($query) as $row) {
	$sea = stripslashes($row["0"]);
	$season["number"] = $sea;
	$season["name"] = getSeasonName($dbo, $sea);
	$season["episodes"] = getEpisode($dbo, $sea);
	$seasons[$sea] = $season;	
}

$data["seasons"] = $seasons;
$data["random_movies"] = $movies;


$data = json_encode($data);

header("Content-Type: application/json");

print($data);




?>