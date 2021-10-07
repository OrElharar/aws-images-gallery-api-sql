const express = require("express");
const { Readable } = require("stream");

const { uploadImageToS3, deleteImageFromS3, getImageFromS3 } = require("../middlewares/s3-handlers");

const Image = require("../models/imageModel");
const { QueryTypes } = require('sequelize');
const sequelize = require("../db/sequelize");

const router = new express.Router();
// 
router.post("/upload-image", uploadImageToS3, async (req, res) => {

    if (req.file == null) {
        return res.status(422).send({
            code: 422,
            message: "File was not uploaded"
        })
    }

    const imageData = {
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        key: req.file.key
    }
    try {
        const image = await Image.create(imageData)
        return res.status(201).send(image)
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }

})

router.get("/images", async (req, res) => {
    try {
        const images = await sequelize.query(
            'SELECT * FROM images',
            {
                type: QueryTypes.SELECT
            }
        );

        // console.log({ images }); 
        if (images.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "None images matches"
            })
        }
        res.send(images);
    } catch (err) {
        res.status(500).send(err.image)
    }
})

router.get("/get-image", getImageFromS3, async (req, res) => {
    const imageName = req.query.name
    const stream = Readable.from(req.imageBuffer)
    console.log({ imageName, isBufferExist: req.imageBuffer != null });
    res.setHeader(
        "Content-Disposition",
        "inline; filename=" + imageName
    )
    stream.pipe(res)
})



router.delete("/delete-image", deleteImageFromS3, async (req, res) => {
    const imageId = req.body.id;

    try {
        const deleteImage = await sequelize.query(
            'Delete FROM images WHERE id = :search_id',
            {
                replacements: {
                    search_id: imageId
                },
                type: QueryTypes.SELECT
            }
        );
        console.log({ deleteImage });
        if (deleteImage == null) {
            return res.status(404).send({
                status: 404,
                message: "Image not found."
            })
        }

        res.send(deleteImage)
    } catch (err) {
        res.status(500).send()
    }
})

// router.patch("/images/:id", async (req, res) => {
//     const allowedUpdates = ["content"]
//     const updates = Object.keys(req.body);
//     const isValidOperation = updates.every((update) => { return allowedUpdates.includes(update) })
//     if (!isValidOperation) {
//         return res.status(400).send({
//             status: 400,
//             message: "Invalid update key."
//         })
//     }
//     const _id = req.params.id;
//     const reqObj = req.body;
//     try {
//         const image = await image.findOne({ _id })
//         if (image == null) {
//             return res.status(404).send({
//                 status: 404,
//                 message: "image not found"
//             })
//         }
//         updates.forEach((update) => { ad[update] = reqObj[update] })
//         await image.save()
//         res.send(image);
//     } catch (err) {
//         res.status(400).send({
//             status: 400,
//             message: "Invalid update value."
//         })
//     }
// })


module.exports = router;