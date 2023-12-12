<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./index.css" />
    <script src="index.js"></script>
    <title>Doodle Gallery</title>
</head>
<body>
    <div id="root" onclick="test()">
        <hr />
        <form id="search-form" >
            <input class="medium-text" type="text" name="search-text" placeholder="Search; 'Doodle', 'Painting', etc..."/>
            <select name="medium">
                <option value="0">Medium</option>
            </select>
            <select name="year">
                <option value="0">Year</option>
            </select>
            <select name="type">
                <option value="0">Type</option>
            </select>
            <button style="float:right;">Search</button>
        </form>
        <hr />
        <?php include("./src/view/gallery.php"); ?>
    </div>
</body>
</html>