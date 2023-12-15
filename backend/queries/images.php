<?php 
require __DIR__ . "/query_base.php";
require $_SERVER["DOCUMENT_ROOT"] . "/models/images.php";

class ImageQueries extends Queries {
    public $table = 'images';

    function GetAllImages(){
        $this->ConnectDB();
        
        $query = "SELECT * FROM $this->table";
        $result = mysqli_query($this->db_con, $query);

        if ($result){
            $all = $result->fetch_all();
        } else {
            throw new Exception(mysqli_error($this->db_con));
        }

        $images = [];
        for ($i = 0; $i < count($all); $i++) {
            $image = new Image($all[$i][1], $all[$i][2], $all[$i][3], $all[$i][4], $all[$i][5]);
            array_push($images, $image);
        }

        $this->DisconnectDB();
        return $images;
    }

    function GetOneImage($id){
        $this->db_con = $this->ConnectDB();
        $query = "SELECT * FROM $this->table WHERE id = $id";
        $result = mysqli_query($this->db_con, $query);
        $image = $result->fetch_array();
        
        return new Image($image[1], $image[2], $image[3], $image[4], $image[5]);
    }

    function PostImage(Image $image){
        $this->ConnectDB();
        $created = date_format($image->created_on,"Y-m-d H:i:s");
        $query = "
        INSERT INTO $this->table (filename, title, tags, mediums, created)
        VALUES (
            '$image->filename',
            '$image->title',
            '$image->tags',
            '$image->mediums',
            '$created'
        );
        ";

        $result = mysqli_query($this->db_con, $query);
        $this->DisconnectDB();

        return ($result) ? true : false;
    }


    function DeleteImage($id){
        $this->ConnectDB();
        $query = "DELETE FROM $this->table WHERE id = $id";
        $result = mysqli_query($this->db_con, $query);

        $this->DisconnectDB();
        return ($result) ? True : False;
    }
}

return new ImageQueries();