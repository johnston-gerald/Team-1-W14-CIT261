<?php
include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    //Add the list
    $db->query("INSERT INTO `list_items` (`title`,`list_id`)  VALUES ('" . $_POST['list_item_name'] . "', '" . $_POST['list_id'] . "')");
    echo 'true';
?>    