<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");


header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$db_user = "root";
$db_pass = null;
$db_name = "todolistdb";

$mysqli = new mysqli($host, $db_user, $db_pass, $db_name);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
};
