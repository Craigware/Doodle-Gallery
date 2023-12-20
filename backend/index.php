<?php
    $request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: http://192.168.0.238:5500");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    $routes = [
        "/api/images" => "./routers/images.php"
    ];

    foreach ($routes as $route => $router) {
        if (str_contains($request_path, $route)){
            include($routes[$route]);
        }
    }

?>
