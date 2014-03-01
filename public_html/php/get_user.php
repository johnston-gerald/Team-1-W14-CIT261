<?php
include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    $user = $db->query("SELECT * FROM `users` WHERE id = '" . $_POST['id'] . "'");
    
    if($user->num_rows){
        //get users lists and list items
        $user_data = $db->query("
			SELECT * FROM `user_list` 
			JOIN `lists` ON `lists`.`list_id` = `user_list`.`list_id` 
			JOIN `list_items` ON `list_items`.`list_id` = `lists`.`list_id` 
			JOIN `list_options` ON `list_options`.`list_id` = `lists`.`list_id` 
			WHERE user_id = " . $_POST['id']);
		echo json_encode($user_data->fetch_array());
    } else {
        //Add the user
        $db->query("INSERT INTO `users` (`id`, `user_name`, `email`)  VALUES (" . $_POST['id'] . ", '" . $_POST['user_name'] . "', '" . $_POST['email'] . "')");
    }
    
?>    