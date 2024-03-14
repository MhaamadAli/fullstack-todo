<?php 
include('./connection.php');

$userid = $_GET['userid'];

$query = $mysqli ->prepare('SELECT * FROM todos WHERE userid=?');

$query ->bind_param('i', $userid);

$query ->execute();
$query ->store_result();

$query ->bind_result($todo_id,$description, $isdone, $user_id);




$response = [];
while($query ->fetch()) {
    $todo = [
        'todo_id' => $todo_id,
        'description' => $description,
        'isdone' => $isdone,
        'user_id' => $user_id
    ];
    $response[] = $todo;
}