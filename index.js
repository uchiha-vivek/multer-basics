const express = require('express')
const multer = require('multer')
const uuid = require('uuid').v4

//upload is a middleware
  

const app=  express ()
const PORT = 4000;

// single file upload
const upload  = multer({dest:"uploads/"})
app.post('/uploadSingleFile',upload.single("file"),function(req,res){
    res.json({status:"success"})
})


// multi file upload

const multiUploads = multer({dest:"uploads/"})
app.post('/uploadMultiFile',multiUploads.array("file",3),function(req,res){
    res.json({status:"multiple files uploaded successfully"})
})


//multiple feilds upload


const multiFieldUploads = upload.fields([
    {
       name:"avatar",
       maxCount:1
    },
    {
        name:"resume",
        maxCount:1
    }

])


app.post('/uploadMultiFeild',multiFieldUploads,function(req,res){
    console.log(req.files)
    res.json({status:"multifield executed successfully"})
})


// custom filename
 
 const storage = multer.diskStorage({

    function(req,file,cb){
        cb(null,"uploads/")

    },
    filename: function(req,file,cb){

        const {originalname} = file
        cb(null,`${uuid()} - ${originalname}`)

    }
})


// File Filtering

const fileFilter = function(req,file,cb){
    if(file.mimetype.split('/')[0] ==='image'){
        cb(null,true)
    } else{
        cd(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const uploadStorage = multer({storage,fileFilter,limits:{fileSize:1000000, files:2}})
app.post('/uploadStorage',uploadStorage.array("file"),function(req,res){
    res.json({ status:"Files successfully stored locally"})

})

// Error handling middleware

app.use((error,req,res,next) =>{
    if( error instanceof multer.MulterError){
        if (error.code === 'LIMIT_FILE_SIZE'){
            return res.json({ msg:"The file is too large"})
        }
    }

    if ( error.code === 'LIMIT_FILE_COUNT'){
        return res.json({msg:"File limit reached"})
    }
})



const server = () =>{
    app.listen(PORT,() =>
    console.log(`Server running on PORT ${PORT}`)  
    )
}

server()