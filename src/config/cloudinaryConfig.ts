import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dcpliec2q',
    api_key: '324821465467833',
    api_secret: 'YOUR_API_SECRET',
    secure: true,
});

export default cloudinary;
