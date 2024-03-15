<?php
include './connection.php';

$user_id = $_POST['user_id'];
$todo_id = $_POST['todo_id'];
$isdone = isset($_POST['isCompleted'])? $_POST['isCompleted'] : null;
$description = isset($_POST['description'])? $_POST['description'] : null;


if($description) {
    $query = $mysqli ->prepare('UPDATE todos SET description= ? WHERE todo_id= ? AND user_id= ? ');
    $query->bind_param('sii', $description, $todo_id, $user_id);
}elseif($isdone) {
    $query = $mysqli ->prepare('UPDATE todos SET isCompleted= ? WHERE todo_id= ? AND user_id= ? ');
    $query->bind_param('s', $isdone, $todo_id, $user_id);
}elseif ($isdone && $description) {
    $query = $mysqli ->prepare('UPDATE todos SET description= ?, isdone= ? WHERE todo_id= ? AND user_id= ? ');
    $query->bind_param('ss', $description, $isdone, $todo_id, $user_id);
}
if($query->execute()){
    $response['message'] = "edited successfully";
} else {
    $response['message'] = "error not updated";
}

echo json_encode($response);

$mysqli ->close();