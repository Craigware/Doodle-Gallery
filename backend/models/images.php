<?php
class Image {
    public string $title;
    public string $filename;
    public DateTime $created_on;

    public string $tags;
    public string $mediums;

    function __construct(string $filename, string $title, string $tags, string $mediums, $created_on=null) {
        $this->title = $title;
        $this->filename = $filename;
        $this->created_on = date_create($created_on);

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
            "created"=> date_format($this->created_on,"Y-m-d H:i:s")
        ];

        return $image_object;
    }
}
