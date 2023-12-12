
<?php

function Gallery(){
    $folder = $_SERVER["DOCUMENT_ROOT"] . "/public/img/";
    $images = scandir($folder);
    
    foreach ($images as $image) {
        if ($image == "." || $image == "..") { continue; }
        echo "
            <div class='gallery-item-container'>
                <img class='gallery-item' src='public/img/$image' />
            </div>    
        ";
    }
}

echo "<div class='gallery'>";
Gallery();
echo "</div>";

?>