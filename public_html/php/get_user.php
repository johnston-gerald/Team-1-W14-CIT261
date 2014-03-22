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
			SELECT lists.list_id,user_list.access_level,lists.title,list_item_id,list_items.title,list_items.status FROM `user_list` 
			JOIN `lists` ON `lists`.`list_id` = `user_list`.`list_id` 
			JOIN `list_items` ON `list_items`.`list_id` = `lists`.`list_id` 
			WHERE user_id = " . $_POST['id'] . " AND lists.is_deleted = 0");
        echo "
			SELECT * FROM `user_list`
			JOIN `lists` ON `lists`.`list_id` = `user_list`.`list_id`
			JOIN `list_items` ON `list_items`.`list_id` = `lists`.`list_id`
			JOIN `list_options` ON `list_options`.`list_id` = `lists`.`list_id`
			WHERE user_id = " . $_POST['id'];
		echo json_encode($user_data->fetch_all());
    } else {
        //Add the user
        $db->query("INSERT INTO `users` (`id`, `user_name`, `email`)  VALUES (" . $_POST['id'] . ", '" . $_POST['user_name'] . "', '" . $_POST['email'] . "')");
    }
    
?>    