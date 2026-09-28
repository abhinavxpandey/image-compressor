import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
const PORT = process.env.PORT || 3000;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 90 * 1024 * 1024 }

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
.rotate()
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

app.post("/passport", upload.single("passport"), async (req, res) => {

    try{

    const copies= Number(req.body.copies);
    if (!req.file) {
        return res.status(400).json({ error: "upload a passport image." });
    }

    if (!copies || copies < 1) {
        return res.status(400).json({ error: "specify the number of copies." });
    }

    const imagebuffer= req.file.buffer;

    const photowdith = 413;
    const photoheight = 531;

    const passportImage = await sharp(imagebuffer)
    .resize(photowdith, photoheight,{
        fit: "cover",
        position : "center"
    })
    .jpeg({
        quality: 80,
    })
    .toBuffer();


    const a4width = 2480;
    const a4height = 3508;

    const gap=30;

    const columns = 5

    const rows = 6

    if(rows * (photoheight + gap) - gap > a4height){
        return res.status(400).json({ error: "too many copies to fit on an A4 page." });
    }

    const composite = [];

    for (let i = 0; i < copies; i++) {
        const column = i % columns;
        const row = Math.floor(i / columns);
        composite.push({
            input: passportImage,
            top: row * (photoheight + gap),
            left: column * (photowdith + gap)
        });
    }

    const a4Image = await sharp({
        create: {
            width: a4width,
            height: a4height,
            channels: 3,
            background: "white"
        }
    })
    .composite(composite)
    .jpeg({
        quality: 80
    })
    .toBuffer();

    res.type("image/jpeg").send(a4Image);
} 
catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to process the passport image." });
}

});
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});