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
    <?php
        $request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $routes = [
            "/" => "./src/view/gallery.php",
            "/contact/" => "./src/view/contact.php",
            "/admin_login/" => "./src/view/login.php"
        ];

        if (array_key_exists($request_path, $routes)) {
            include $routes[$request_path];
        } else {
            http_response_code(404);
            echo "404 not found";
        }
    ?>
</body>
<footer>
    <a >Contact Me</a>
    <a>Admin Login</a>
</footer>
</html>