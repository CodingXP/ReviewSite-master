<?php 
include "database.php";
header("Access-Control-Allow-Origin: http://localhost:3000");
function Register($username, $password){
    $conn = openCon('localhost', 'root', '', 'reviewsite');

    $username = dataValidation($username, $conn);
    $password = dataValidation($password, $conn);

    $query = "INSERT INTO users (username, password)
                VALUES ('{$username}', '{$password}')";

    $conn -> query($query);
    closeCon($conn);
}

Register($_POST['username'], $_POST['password']);
?>
