FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (hanya yang diperlukan)
RUN npm install --production

# Copy seluruh source code backend
COPY . .

# Memberikan izin akses (permission) tulis/baca secara rekursif
# agar Node.js bisa menulis file ke folder uploads nantinya
RUN chmod -R 777 /app

# Expose port sesuai aplikasi Anda
EXPOSE 8003

# Start command
CMD ["node", "src/index.js"]