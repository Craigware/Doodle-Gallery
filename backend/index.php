<?php
    $request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: http://localhost:5500");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
    
    $routes = [
        "/api/images" => "./routers/images.php"
    ];

    foreach ($routes as $route => $router) {
        if (str_contains($request_path, $route)){
            include($routes[$route]);
        }
    }

?>
