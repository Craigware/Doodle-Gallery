<?php 

class Image {
    public string $title;
    public string $filename;
    public DateTime $created_on;

    public array $tags;
    public array $mediums;

    function __construct(string $title, string $filename, DateTime $created_on, array $tags, array $mediums) {
        $this->title = $title;
        $this->filename = $filename;
        $this->created_on = $created_on;

        $this->tags = $tags;
        $this->mediums = $mediums;
    }
}



$db_con = mysqli_connect("localhost", "Craig", getenv("MYSQL_PASS"), "GalleryDB");

try {    
    $query = "SELECT * FROM images";
    $result = mysqli_query($db_con, $query);

    if ($result) {
        $all = $result->fetch_all();
    }
} catch (mysqli_sql_exception $e) {
    if (!$result) {
        // Creates table if it doesn't exist in database.
        $cr_table_query = "
            CREATE TABLE images (
                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(30) NOT NULL,
                title VARCHAR(30) NOT NULL,
                tags TINYTEXT NOT NULL,
                mediums TINYTEXT NOT NULL, 
                created DATE
            )
        ";

        $cr_table_result = mysqli_query($db_con, $cr_table_query);
    }
}

$db_con->close();
