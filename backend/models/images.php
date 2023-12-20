<?php
class Image {
    public string $title;
    public string $filename;
    public DateTime $created;

    public string $tags;
    public string $mediums;

    public array $imageSize;

    function __construct(string $filename, string $title, string $tags, string $mediums, $created=null) {
        $this->title = $title;
        $this->filename = $filename;

        $this->tags = $tags;
        $this->mediums = $mediums;

        $this->created = date_create($created);

        
        $sizes = getimagesize($_SERVER["DOCUMENT_ROOT"] . "/images/" . $this->filename);
        $this->imageSize = [ "x" => $sizes[0], "y" => $sizes[1] ];
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
            "created"=> date_format($this->created,"Y-m-d H:i:s"),
            "imageSize" => $this->imageSize
        ];

        return $image_object;
    }
}
