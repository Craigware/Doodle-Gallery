<?php
class Image {
    public string $title;
    public string $filename;
    public $created_on;

    public string $tags;
    public string $mediums;

    function __construct(string $filename, string $title, string $tags, string $mediums, $created_on) {
        $this->title = $title;
        $this->filename = $filename;
        $this->created_on = $created_on;

        $this->tags = $tags;
        $this->mediums = $mediums;
    }

    static function Decode($object){
        $image = new Image(
            $object["filename"],
            $object["title"],
            $object["tags"],
            $object["mediums"],
            $object["created"]
        );

        return $image;
    }

    function ToObject(){
        $image_object = [
            "title" => $this->title,
            "filename" => $this->filename,
            "tags"=> $this->tags,
            "mediums"=> $this->mediums,
            "created"=> $this->created_on
        ];

        return $image_object;
    }
}
