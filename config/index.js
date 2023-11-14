const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3002' : 'https://project-3-harvest-coffee-bar-web-service.onrender.com';