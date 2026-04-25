# Gunakan Node.js sebagai base image
FROM node:18

# Buat direktori kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy semua file project ke dalam container
COPY . .

# Expose port yang digunakan Hugging Face (7860)
ENV PORT=7860
EXPOSE 7860

# Jalankan aplikasi
CMD ["npm", "start"]
