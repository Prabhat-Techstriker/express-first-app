const Image = require('../models/image');
const cloudinaryHelper = require('../helper/cloudinaryHelper');
const cloudinary = require('./../config/cloudinary');
const fs = require('fs');
const response = require('../utils/responseHandler'); // Assuming you have a response utility for consistent responses

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "File is required. Please upload an image."
            })
        }
        console.log('Post file:', req.file);

        const result = await cloudinaryHelper.uploadImage(req.file);
        console.log('Image uploaded to Cloudinary in Controller:', result.imageUrl);

        if (!result) {
            return res.status(400).json({ message: 'Image upload failed' });
        }

        console.log("imageId:", result.imageId);
        console.log("user id:", req.userInfoData);

        /* const dummyImages = Array.from({ length: 25 }, (_, index) => ({
            image_url: `https://res.cloudinary.com/demo/image/upload/v${Date.now() + index}/sample_image_${index + 1}.jpg`,
            imageId: `sample_image_id_${index + 1}`,
            userId: "683598108bae83eddff00148",
            createdAt: new Date(),
            updatedAt: new Date(),
        })) */

        const image = await Image.create({
            image_url: result.imageUrl,
            imageId: result.imageId,
            userId: req.userInfoData.userId
        });

        // const image = await Image.insertMany(dummyImages)

        fs.unlinkSync(req.file.path);

        if (image) {
            response.success(res, {
                data: image,
                message: "Image uploaded successfully"
            });
        } else {
            response.error(res, {
                message: "Image upload failed",
                statusCode: 400
            });
        }
    } catch (error) {
        console.error('Error uploading image from controller:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });

    }
}

const fetchImages = async (req, res) => {
    try {
        // get all images from the table
        // const allImage = await Image.find({});
        console.log('User Info Data:', req.userInfoData.userId); // getting new ObjectId from the userInfoData
        // Fetch all images for the authenticated user
        // const allImages = await Image.find({ userId: '683598108bae83eddff00148' }).populate('userId', 'name email');
        console.log("qry page ======>", req.query.page);
        const page = parseInt(req.query.page) || 1
        console.log("page ======>", page);

        const itemperpage = parseInt(req.query.itemperpage) || 5;
        const skip =
            (page - 1) * itemperpage // logic is if you are on page 2 then skip the 5 images of page 1
        // const sort = req.param.sort || 'createdAt'
        // const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;


        const allImages = await Image.find({ userId: req.userInfoData.userId })
            .skip(skip)
            .limit(itemperpage)
            .sort({ 'createdAt': -1 }) // newly first
        // console.log('All Images:', allImages.length);
        if (allImages.length != 0) {
            const total = await ImageModel.countDocuments();
            response.success(res, {
                data: allImages,
                message: "All images fetched successfully",
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / itemperpage)
                }
            });
        } else {
            response.error(res, {
                message: "No images found",
                statusCode: 404
            });
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        response.error(res, {
            message: error.message || 'Internal server error while fetching images',
            statusCode: 500
        });
    }
}

const deleteImagesByUser = async (req, res) => {
    try {
        // delete image who only upload
        const getImageID = req.params.id;

        console.log("getImageID", getImageID);
        console.log("userId", req.userInfoData.userId);
        // return false

        const image = await Image.findById(getImageID)
        /* console.log("image object ------>", image);
        return false */

        if (image.userId.toString() !== req.userInfoData.userId.toString()) {
            // console.log("Jai Shree Shayam");
            return response.error(res, {
                message: `You are not authorized to delete this image because you haven't uploaded it`,
            })
        }

        await cloudinary.uploader.destroy(image.imageId);
        const deleteImageById = await Image.findByIdAndDelete({ _id: getImageID })

        if (deleteImageById) {
            response.success(res, {
                message: "Image deleted successfully."
            })
        } else {
            response.error(res, {
                message: "You are not able to delete this image!!!"
            })
        }
    } catch (error) {
        console.log('Error fetching images:', error);
        response.error(res, {
            message: error.message || 'Internal server error while deleteing the image.'
        })
    }
}

module.exports = {
    uploadImage, fetchImages, deleteImagesByUser
};