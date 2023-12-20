<?php
class Queries {
    public $db_con;
    public $db = "gallerydb";
    public $table;

    function ConnectDB() {
        return $this->db_con = mysqli_connect("localhost", "Craig", getenv("SQL_PASS"), $this->db);
    }

    function DisconnectDB() {
        return $this->db_con->close();
    }
}