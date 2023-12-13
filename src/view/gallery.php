
<?php
include($_SERVER["DOCUMENT_ROOT"] . "/src/model/verify_images.php");
function Gallery(){
    $folder = $_SERVER["DOCUMENT_ROOT"] . "/public/img/";
    $images = scandir($folder);
    
    foreach ($images as $image) {
        if ($image == "." || $image == "..") { continue; }
        echo "
            <div onmouseover='' class='gallery-item-container'>
                <img class='gallery-item' alt='' src='public/img/$image' />
            </div>    
        ";
    }
}

echo "<div class='gallery'>";
Gallery();
echo "</div>";

?>