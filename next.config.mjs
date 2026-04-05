/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['client.iamabhi.me'],
    images: {
        domains: [
            "res.cloudinary.com"
        ],
    }
};

export default nextConfig;
