<?php 
require __DIR__ . "/query_base.php";
require $_SERVER["DOCUMENT_ROOT"] . "/models/images.php";

class ImageQueries extends Queries {
    public $table = 'images';

    function OrderImageList($images, $rules=""){
        switch ($rules) {
            case "":
                $images = array_reverse($images);
                return $images;
        }
    }

    function GetAllImages(){
        $this->ConnectDB();
        // unsafe, technically doesnt need to be safe because it isnt sensitive data but still
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

    function SearchAllImages($searchQueries){
        $this->db_con = $this->ConnectDB();
        $query = "SELECT * FROM $this->table WHERE id > -1 ";

        // Checks if value has something
        // for mediums and tags checks if they are same as search if they are can be either one
        // UNSAFE NEEDS UPDATE
        foreach ($searchQueries as $key => $value) {
            switch ($key){
                case "search":
                    if ($value == "%%"){ break; }
                    $query .= "AND title LIKE '%$value%' ";
                    break;
                case "mediums":
                    if ($value == "%%"){ break; }
                    if ($value == $searchQueries["search"]) { $query .= "OR "; } else { $query .= "AND "; }
                    $query .= "mediums LIKE '%$value%' "; 
                    break;
                case "tags":
                    if ($value == "%%"){ break; }
                    if ($value == $searchQueries["search"]) { $query .= "OR "; } else { $query .= "AND "; }
                    $query .= "tags LIKE '%$value%' "; 
                    break;
                case "created":
                    if ($value == "%%"){ break; }
                    $query .= "AND created LIKE '%$value%' ";
                    break;
            }
        }

        $result = mysqli_query($this->db_con, $query);

        $all = mysqli_fetch_all($result);
        $images = [];
        for ($i = 0; $i < count($all); $i++) {
            $image = new Image($all[$i][1], $all[$i][2], $all[$i][3], $all[$i][4], $all[$i][5]);
            array_push($images, $image);
        }

        $this->DisconnectDB();

        return $images;
    }

    function PostImage(Image $image){
        $this->ConnectDB();
        $created = date_format($image->created,"Y-m-d");
        //SECURE USE AS EXAMPLE
        $query = "INSERT INTO $this->table (filename, title, tags, mediums, created)
        VALUES (?, ?, ?, ?, ?)";

        $stmt = mysqli_prepare($this->db_con, $query);
        mysqli_stmt_bind_param($stmt, "sssss", $image->filename, $image->title, $image->tags, $image->mediums, $created);

        $result = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $this->DisconnectDB();

        return $result ? true : false;
    }
}

return new ImageQueries();