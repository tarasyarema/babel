<?php
$image = $_POST["image"];
$comment = $_POST["comment"];
$db = file_get_contents("db.json");
$json = json_decode($db);
$json->{$image} = $comment;
file_put_contents("db.json", json_encode($json));
?>
