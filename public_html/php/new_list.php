<?php
include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    //Add the list
    $db->query("INSERT INTO `lists` (`title`)  VALUES ('" . $_POST['list_name'] . "')");
    $db->query("INSERT INTO `user_list` (`user_id`, `list_id`)  VALUES ('" . $_POST['user_id'] . "', '" . $db->insert_id . "')");
    echo 'true';
?>    