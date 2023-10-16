<?php 
include 'database.php';

function loadUser($user){
    $conn = openCon("localhost", "root", "", "reviewsite");

    $query = "SELECT username, passsword FROM users WHERE username = '{$user}'";
    $result = $conn->query($query);

    $row = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($row);

    closeCon($conn);
}

function logUser($user, $pass) {
    $conn = openCon("localhost", "root", "", "reviewsite");

    $user = dataValidation($user, $conn);
    $pass = dataValidation($pass, $conn);

    $userQuery = "SELECT * FROM users WHERE username = '$user' AND PASSWORD = '$pass'";
    $userResult = $conn->query($userQuery);

    $userCount = mysqli_num_rows($userResult);

    if ($userCount === 1) {
        $userRow = $userResult->fetch_assoc();
        $result = array("username" => $userRow['username']);
        echo json_encode($result);
    }

    closeCon($conn);
}
if (isset($_POST['username'])){
    logUser($_POST['username'], $_POST['password']);
}

else if (isset($_GET['username'])){
    loadUser($_GET['username']);
}

?>