CREATE DATABASE IF NOT EXISTS gallerydb;

USE gallerydb;

CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    filename VARCHAR(30) NOT NULL,
    title VARCHAR(30) NOT NULL,
    tags TINYTEXT NOT NULL,
    mediums TINYTEXT NOT NULL,
    created DATE NULL,
    descript MEDIUMTEXT NULL,
    orientation VARCHAR(10)
);