import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
const PORT = process.env.PORT || 3000;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 }

});

const app= express();
app.use(cors({
    origin: "https://compress-img-now.vercel.app"
}));

app.post("/upload",upload.single("image"),async (req,res)=>{
try{
if(!req.file){
    res.status(400).json({error: "please upload a file"});
}
const OriginalImage = req.file.buffer;

const CompressedImage= await sharp(OriginalImage)
.resize({
    width:1600,
    withoutEnlargement:true,
})
.jpeg({
    quality:80,
})
.toBuffer();

res.type("image/jpeg").send(CompressedImage);

} catch(error){
    console.error(error);

    res.status(500).json({error: "failed to proceed"});
}

} );


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});