
<?php

echo "
<hr />
<form id='search-form' >
    <input class='medium-text' type='text' name='search-text' placeholder='Search; Doodle, Painting, etc...'/>
    <select name='medium'>
        <option value='0'>Medium</option>
    </select>
    <select name='year'>
        <option value='0'>Year</option>
    </select>
    <select name='type'>
        <option value='0'>Type</option>
    </select>
    <button style='float:right;'>Search</button>
</form>
<hr />
";


function Gallery(){
    $image_query = include($_SERVER["DOCUMENT_ROOT"] . "/src/model/verify_images.php");
    $images = $image_query->GetAllImages();
    
    foreach($images as $image){
        $image_name = $image->filename;
        echo "
            <div class='gallery-item-container'>
                <img class='gallery-item' src='./public/img/$image_name' />
            </div>
        ";
    }
}

echo "<div class='gallery'>";
Gallery();
echo "</div>";
