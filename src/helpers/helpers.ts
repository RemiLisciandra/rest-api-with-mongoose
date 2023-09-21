import crypto from 'crypto';

if (!process.env.SECRET) {
    throw new Error("SERVER : Missing environment variables");
}

const SECRET: string = process.env.SECRET;

export const random = () => crypto.randomBytes(128).toString('base64');

export const auth = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}
