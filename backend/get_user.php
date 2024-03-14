<?php 
include('./connection.php');

$query = $mysqli ->prepare('SELECT * FROM users');
$query ->execute();
$query ->store_result();

$query ->bind_result($id, $username, $email, $password, $score);

$response = [];
while($query ->fetch()) {
    $user = [
        'id' => $id,
        'user_name' => $username,
        'email' => $email,
        'password' => $password,
        'score' => $score
    ];
    $response[] = $user;
}