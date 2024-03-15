<?php
include './connection.php';

$user_id = $_POST['user_id'];
$todo_id = $_POST['todo_id'];
$isdone = isset($_POST['isCompleted']) ? $_POST['isCompleted'] : null;
$description = isset($_POST['description']) ? $_POST['description'] : null;

$query = null;

if ($description && $isdone) {
    // Update both description and isCompleted
    $query = $mysqli->prepare('UPDATE todos SET description = ?, isdone = ? WHERE todo_id = ? AND user_id = ?');
    $query->bind_param('siii', $description, $isdone, $todo_id, $user_id);
} elseif ($description) {
    // Update only description
    $query = $mysqli->prepare('UPDATE todos SET description = ? WHERE todo_id = ? AND user_id = ?');
    $query->bind_param('sii', $description, $todo_id, $user_id);
} elseif ($isdone !== null) {
    // Update only isCompleted
    $query = $mysqli->prepare('UPDATE todos SET isdone = ? WHERE todo_id = ? AND user_id = ?');
    $query->bind_param('iii', $isdone, $todo_id, $user_id);
}

if ($query) {
    if ($query->execute()) {
        $response['message'] = "edited successfully";
    } else {
        $response['message'] = "error not updated";
    }
} else {
    $response['message'] = "nothing to update";
}

echo json_encode($response);

$mysqli->close();
?>
