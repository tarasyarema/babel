<?php
$image = $_POST["image"];
$comment = $_POST["comment"];
$db = file_get_contents("db.json");
$json = json_decode($db);
array_push($json, Array($image => $comment));
?>
