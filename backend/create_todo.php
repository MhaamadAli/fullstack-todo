<?php 
include "./connection.php";

$description = $_POST['description'];
$isdone = $_POST['isCompleted'];
$user_id = $_POST['user_id'];

$query = $mysqli ->prepare('INSERT INTO todos(description, isCompleted, user_id) VALUES (?, ?, ?)');
$query ->bind_param('sis', $description, $isdone, $user_id);
if($query->execute()) {
    $response['message'] = "todo created";
    $response['id'] = $mysqli->insert_id;
} else {
    $response['message'] = "todo not created";
}
echo json_encode($response);

$mysqli ->close();