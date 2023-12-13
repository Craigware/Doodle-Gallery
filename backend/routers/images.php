<?php

$image_query = require $_SERVER["DOCUMENT_ROOT"] . "/queries/images.php";
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    switch ($request_path) {
        case (str_contains($request_path, "/GetAllImages/")):
            $images = $image_query->GetAllImages();
            $encoded_images = [];
            foreach ($images as $image) {
                array_push($encoded_images, $image->ToObject());
            }
            
            echo json_encode($encoded_images);
            return json_encode($encoded_images);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

}