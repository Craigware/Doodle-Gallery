<?php

$image_query = require $_SERVER["DOCUMENT_ROOT"] . "/queries/images.php";
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    switch ($request_path) {
        case (str_contains($request_path, "/GetAllImages/")):
            $images = $image_query->GetAllImages();

            $images = $image_query->OrderImageList($images);

            $encoded_images = [];
            foreach ($images as $image) {
                array_push($encoded_images, $image->ToObject());
            }
            echo json_encode($encoded_images);
            return json_encode($encoded_images);


        case (str_contains($request_path, "/GetSomeImages")):
            $searchQuery = explode("?", $_SERVER['REQUEST_URI']);
            $data = explode("&", $searchQuery[1]);

            $searchQueries = [];
            foreach ($data as $individualSQ){
                $individualSQ = explode("=", $individualSQ);
                $searchQueries[$individualSQ[0]] = "%" . $individualSQ[1] . "%";
            }

            if ($searchQueries["mediums"] == "%%" && $searchQueries["search"] != "%%") {
                $searchQueries["mediums"] = $searchQueries["search"];
            }
            if ($searchQueries["tags"] == "%%" && $searchQueries["search"] != "%%") {
                $searchQueries["tags"] = $searchQueries["search"];
            }
            
            
            $images = $image_query->SearchAllImages($searchQueries);
            $images = $image_query->OrderImageList($images);
            $encoded_images = [];
            foreach ($images as $image) {
                array_push($encoded_images, $image->ToObject());
            }

            echo json_encode($images);
            return json_encode($images);

        
        case (str_contains($request_path, "/GetImage/")):
            break;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    switch ($request_path) {
        case (str_contains($request_path, "/Upload/")):
            $image_data = json_decode(file_get_contents("php://input"));
            
            $data = explode( ',', $image_data->image_base64 );
            $image_file = fopen($image_data->filename, "w");
            fwrite( $image_file, base64_decode( $data[1] ) );
            fclose( $image_file ); 
            // CHANGE TO GENERATE NEW FILE NAME RATHER THAN USING SUPPLIED
            rename($image_data->filename, 'images/'. $image_data->filename );

            $image = new Image($image_data->filename, $image_data->title, $image_data->tags, $image_data->mediums, $image_data->created);
            $res = $image_query->PostImage($image);
            echo $res;
            return $res;
    }
}