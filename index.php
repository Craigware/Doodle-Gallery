<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./index.css" />
    <title>Doodle Gallery</title>
</head>
<body>
    <div id="root">
        <form>
            <input type="text" name="search-text" />
            <select name="medium">
                <option value="0">Medium</option>
            </select>
            <select name="year">
                <option value="0">Year</option>
            </select>
            <select name="type">
                <option value="0">Type</option>
            </select>
            <button>Search</button>
        </form>

        <?php include("./src/view/gallery.php"); ?>
    </div>
</body>
</html>