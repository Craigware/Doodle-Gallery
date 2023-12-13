<?php
class Queries {
    public $db_con;
    public $db = "GalleryDB";
    public $table;

    function ConnectDB() {
        return $this->db_con = mysqli_connect("localhost", "Craig", getenv("MYSQL_PASS"), $this->db);
    }

    function DisconnectDB() {
        return $this->db_con->close();
    }
}