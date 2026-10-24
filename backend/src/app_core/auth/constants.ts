import * as dotenv from 'dotenv';
// Self-contained load (bukan andalkan urutan import main.ts) supaya process.env.JWT_SECRET
// sudah terisi walau file ini dievaluasi lebih dulu lewat rantai import module lain.
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET belum diset di .env -- wajib diisi acak & unik per environment, jangan pernah hardcode di source.');
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET
};
