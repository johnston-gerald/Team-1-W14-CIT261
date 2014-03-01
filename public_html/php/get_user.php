<?php
include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }
    
    $user = $db->query("SELECT * FROM `users` WHERE id = " . $_POST['id']);
    
    if($user->num_rows){
        //get users lists
    } else {
        //Add the user
        $db->query("INSERT INTO `users` (`id`, `user_name`, `email`)  VALUES (" . $_POST['id'] . ", '" . $_POST['user_name'] . "', '" . $_POST['email'] . "')");
    }
    
?>    