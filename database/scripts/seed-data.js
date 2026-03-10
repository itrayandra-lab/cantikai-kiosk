/**
 * Seed Sample Data (Idempotent, Non-destructive)
 * Adds only missing sample banners, products, and articles.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });
const backendRoot = path.join(__dirname, '..', '..', 'backend');
const configuredDbPath = process.env.DATABASE_PATH || '../database/scripts/cantik_ai.db';
const dbPath = path.isAbsolute(configuredDbPath)
    ? configuredDbPath
    : path.resolve(backendRoot, configuredDbPath);
const db = new Database(dbPath);

const nowIso = new Date().toISOString();

const makeSlug = (text) => String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getUniqueSlug = (candidate, excludeId = null) => {
    const base = makeSlug(candidate) || `article-${Date.now()}`;
    let nextSlug = base;
    let suffix = 2;

    while (true) {
        const row = excludeId
            ? db.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?').get(nextSlug, excludeId)
            : db.prepare('SELECT id FROM articles WHERE slug = ?').get(nextSlug);
        if (!row) return nextSlug;
        nextSlug = `${base}-${suffix}`;
        suffix += 1;
    }
};

const normalizeExistingArticleSlugs = () => {
    const rows = db.prepare(`
        SELECT id, title
        FROM articles
        WHERE slug IS NULL OR TRIM(slug) = ''
        ORDER BY id ASC
    `).all();

    const updateSlugStmt = db.prepare('UPDATE articles SET slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

    for (const row of rows) {
        const nextSlug = getUniqueSlug(row.title || `article-${row.id}`, row.id);
        updateSlugStmt.run(nextSlug, row.id);
    }

    if (rows.length > 0) {
        console.log(`✅ Normalized slug for ${rows.length} existing article(s)`);
    }
};

const banners = [
    {
        title: 'Welcome to Cantik AI',
        image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200',
        link_url: '/analysis',
        description: 'Analisis kulit Anda dengan AI terbaru',
        is_active: 1,
        display_order: 1
    },
    {
        title: 'Skincare Consultation',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200',
        link_url: '/chat',
        description: 'Chat dengan AI skincare expert',
        is_active: 1,
        display_order: 2
    },
    {
        title: 'Product Recommendations',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
        link_url: '/products',
        description: 'Temukan produk yang cocok untuk kulit Anda',
        is_active: 1,
        display_order: 3
    }
];

const products = [
    {
        name: 'Gentle Cleanser',
        brand: 'CeraVe',
        category: 'Cleanser',
        description: 'Gentle foaming cleanser for all skin types',
        price: 150000,
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        ingredients: 'Ceramides, Hyaluronic Acid, Niacinamide',
        skin_type: 'All Types',
        concerns: 'Cleansing, Hydration',
        rating: 4.5,
        is_active: 1
    },
    {
        name: 'Vitamin C Serum',
        brand: 'The Ordinary',
        category: 'Serum',
        description: 'Brightening serum with pure vitamin C',
        price: 200000,
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
        ingredients: 'Ascorbic Acid, Vitamin E, Ferulic Acid',
        skin_type: 'All Types',
        concerns: 'Brightening, Anti-aging',
        rating: 4.7,
        is_active: 1
    },
    {
        name: 'Hydrating Moisturizer',
        brand: 'Neutrogena',
        category: 'Moisturizer',
        description: 'Oil-free hydrating gel moisturizer',
        price: 180000,
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        ingredients: 'Hyaluronic Acid, Glycerin, Dimethicone',
        skin_type: 'Oily, Combination',
        concerns: 'Hydration, Oil Control',
        rating: 4.3,
        is_active: 1
    },
    {
        name: 'Sunscreen SPF 50+',
        brand: 'La Roche-Posay',
        category: 'Sunscreen',
        description: 'Broad spectrum UV protection',
        price: 250000,
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        ingredients: 'Zinc Oxide, Titanium Dioxide, Vitamin E',
        skin_type: 'All Types',
        concerns: 'UV Protection, Anti-aging',
        rating: 4.8,
        is_active: 1
    }
];

const articles = [
    {
        slug: 'panduan-lengkap-skincare-untuk-pemula',
        title: 'Panduan Lengkap Skincare untuk Pemula',
        content: 'Memulai rutinitas skincare tidak harus rumit. Fokuslah pada tiga langkah inti: membersihkan wajah dengan lembut, menjaga kelembapan, dan melindungi kulit dari sinar UV. Setelah kulit mulai stabil, Anda bisa menambahkan serum sesuai kebutuhan seperti hidrasi, jerawat, atau mencerahkan.',
        excerpt: 'Panduan lengkap untuk memulai rutinitas skincare yang tepat.',
        image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200',
        author: 'Tim Cantik AI',
        category: 'Skincare Basics',
        tags: 'skincare,pemula,rutinitas',
        status: 'published',
        is_featured: 1
    },
    {
        slug: 'mengenal-jenis-kulit-dan-cara-merawatnya',
        title: 'Mengenal Jenis Kulit dan Cara Merawatnya',
        content: 'Jenis kulit umumnya dibagi menjadi normal, kering, berminyak, kombinasi, dan sensitif. Menentukan jenis kulit membantu Anda memilih tekstur produk, kadar aktif, dan frekuensi pemakaian yang tepat. Kulit berminyak butuh kontrol sebum, sementara kulit kering perlu fokus pada hidrasi dan perbaikan barrier.',
        excerpt: 'Panduan mengenali dan merawat berbagai jenis kulit.',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200',
        author: 'Tim Cantik AI',
        category: 'Skin Types',
        tags: 'jenis kulit,perawatan,skin type',
        status: 'published',
        is_featured: 1
    },
    {
        slug: 'pentingnya-sunscreen-dalam-rutinitas-harian',
        title: 'Pentingnya Sunscreen dalam Rutinitas Harian',
        content: 'Sunscreen adalah langkah anti-aging paling efektif dan terjangkau. Paparan UV dapat mempercepat keriput, hiperpigmentasi, dan memperburuk bekas jerawat. Gunakan sunscreen minimal SPF 30 setiap pagi dan ulangi pemakaian tiap 2-3 jam saat beraktivitas di luar.',
        excerpt: 'Mengapa sunscreen wajib digunakan setiap hari.',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
        author: 'Tim Cantik AI',
        category: 'Sun Protection',
        tags: 'sunscreen,uv protection,anti aging',
        status: 'published',
        is_featured: 1
    },
    {
        slug: 'rutinitas-pagi-skincare-5-menit',
        title: 'Rutinitas Pagi Skincare 5 Menit untuk Hari Sibuk',
        content: 'Rutinitas pagi singkat tetap bisa efektif: cleanser ringan, moisturizer, lalu sunscreen. Jika Anda punya waktu tambahan, tambahkan serum antioksidan seperti vitamin C untuk perlindungan dari radikal bebas. Kunci utamanya adalah konsisten setiap hari, bukan banyaknya langkah.',
        excerpt: 'Skincare pagi cepat dan efektif untuk jadwal padat.',
        image_url: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=1200',
        author: 'Dr. Aulia Rahma',
        category: 'Daily Routine',
        tags: 'rutinitas pagi,skincare cepat,produktif',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'rutinitas-malam-untuk-memperbaiki-skin-barrier',
        title: 'Rutinitas Malam untuk Memperbaiki Skin Barrier',
        content: 'Malam hari adalah waktu terbaik untuk pemulihan kulit. Gunakan pembersih lembut, serum hidrasi, lalu moisturizer dengan ceramide. Hindari terlalu banyak bahan aktif sekaligus agar barrier tidak makin teriritasi.',
        excerpt: 'Langkah malam sederhana untuk barrier kulit lebih sehat.',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        author: 'Dr. Nadia Putri',
        category: 'Barrier Repair',
        tags: 'skin barrier,ceramide,rutinitas malam',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'cara-patch-test-produk-baru-dengan-benar',
        title: 'Cara Patch Test Produk Baru dengan Benar',
        content: 'Sebelum memakai produk baru ke seluruh wajah, lakukan patch test di area kecil seperti bawah rahang atau belakang telinga. Amati reaksi selama 24-48 jam. Jika muncul kemerahan, rasa terbakar, atau gatal berlebihan, hentikan penggunaan.',
        excerpt: 'Panduan aman mencoba produk skincare baru.',
        image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200',
        author: 'Dr. Lina Pratama',
        category: 'Skincare Basics',
        tags: 'patch test,iritasi,produk baru',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'eksfoliasi-kimia-vs-fisik-mana-yang-tepat',
        title: 'Eksfoliasi Kimia vs Fisik: Mana yang Tepat?',
        content: 'Eksfoliasi fisik bekerja dengan gesekan, sedangkan eksfoliasi kimia menggunakan AHA/BHA/PHA untuk meluruhkan sel kulit mati. Kulit sensitif biasanya lebih cocok dengan eksfoliasi kimia ringan berfrekuensi rendah. Gunakan maksimal 1-3 kali seminggu untuk menghindari over-exfoliation.',
        excerpt: 'Perbedaan eksfoliasi kimia dan fisik serta cara memilihnya.',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
        author: 'Dr. Fajar Wibowo',
        category: 'Ingredients',
        tags: 'eksfoliasi,AHA,BHA,PHA',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'niacinamide-untuk-kulit-berminyak-dan-pori',
        title: 'Niacinamide untuk Kulit Berminyak dan Pori Besar',
        content: 'Niacinamide membantu menyeimbangkan produksi minyak, memperbaiki tekstur, dan mendukung skin barrier. Mulailah dari konsentrasi 4-5 persen untuk meminimalkan iritasi. Kombinasikan dengan sunscreen agar hasil mencerahkan lebih optimal.',
        excerpt: 'Manfaat niacinamide untuk sebum, pori, dan barrier.',
        image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200',
        author: 'Dr. Aulia Rahma',
        category: 'Ingredients',
        tags: 'niacinamide,pori,kulit berminyak',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'retinol-untuk-pemula-frekuensi-dan-kombinasi-aman',
        title: 'Retinol untuk Pemula: Frekuensi dan Kombinasi Aman',
        content: 'Retinol sebaiknya dimulai perlahan, misalnya 2 kali seminggu di malam hari. Gunakan metode sandwich moisturizer bila kulit mudah kering. Hindari pemakaian bersamaan dengan eksfolian kuat pada malam yang sama untuk menurunkan risiko iritasi.',
        excerpt: 'Panduan retinol pemula agar efektif tanpa iritasi.',
        image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
        author: 'Dr. Reza Santoso',
        category: 'Ingredients',
        tags: 'retinol,anti aging,iritasi',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'hyaluronic-acid-cara-pakai-yang-benar',
        title: 'Hyaluronic Acid: Cara Pakai yang Benar',
        content: 'Hyaluronic acid bekerja optimal pada kulit yang sedikit lembap, lalu dikunci dengan moisturizer. Jika dipakai pada kulit terlalu kering tanpa lapisan oklusif, kulit bisa terasa makin kering. Kombinasi HA dan ceramide cocok untuk hidrasi harian.',
        excerpt: 'Tips memakai hyaluronic acid agar hidrasi maksimal.',
        image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200',
        author: 'Dr. Nadia Putri',
        category: 'Hydration',
        tags: 'hyaluronic acid,hidrasi,moisturizer',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'ceramide-dan-skin-barrier-kenapa-penting',
        title: 'Ceramide dan Skin Barrier: Kenapa Penting?',
        content: 'Ceramide adalah lipid alami kulit yang membantu menjaga kelembapan dan pertahanan dari iritan luar. Saat barrier rusak, kulit cenderung kering, kemerahan, dan mudah berjerawat. Produk dengan ceramide membantu pemulihan dan membuat kulit lebih tahan terhadap bahan aktif.',
        excerpt: 'Peran ceramide untuk memperkuat barrier kulit.',
        image_url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
        author: 'Dr. Lina Pratama',
        category: 'Barrier Repair',
        tags: 'ceramide,barrier,kulit sensitif',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'skincare-untuk-kulit-berjerawat-dewasa',
        title: 'Skincare untuk Kulit Berjerawat Dewasa',
        content: 'Jerawat dewasa sering dipengaruhi hormon, stres, dan barrier yang lemah. Fokus pada cleanser lembut, treatment jerawat terukur, dan moisturizer non-komedogenik. Hindari mengganti terlalu banyak produk sekaligus agar lebih mudah mengevaluasi progres.',
        excerpt: 'Strategi skincare untuk acne pada usia dewasa.',
        image_url: 'https://images.unsplash.com/photo-1535916707207-35f97e715e1c?w=1200',
        author: 'Dr. Fajar Wibowo',
        category: 'Acne Care',
        tags: 'jerawat dewasa,hormonal acne,non-komedogenik',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'cara-mengatasi-bekas-jerawat-hitam-secara-bertahap',
        title: 'Cara Mengatasi Bekas Jerawat Hitam Secara Bertahap',
        content: 'Bekas jerawat hitam atau PIH membutuhkan kombinasi bahan pencerah, perlindungan UV, dan kesabaran. Niacinamide, azelaic acid, atau vitamin C dapat membantu meratakan warna kulit. Perbaikan biasanya terlihat dalam 8-12 minggu bila rutin.',
        excerpt: 'Pendekatan bertahap untuk memudarkan bekas jerawat hitam.',
        image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200',
        author: 'Dr. Reza Santoso',
        category: 'Acne Care',
        tags: 'bekas jerawat,PIH,brightening',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'urutan-layering-skincare-yang-tepat',
        title: 'Urutan Layering Skincare yang Tepat',
        content: 'Aturan sederhana layering adalah dari tekstur paling ringan ke paling berat. Mulai dari cleanser, toner/essence, serum, moisturizer, lalu sunscreen di pagi hari. Urutan yang tepat membantu penyerapan produk dan menurunkan risiko pilling.',
        excerpt: 'Susunan skincare step-by-step agar hasil maksimal.',
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200',
        author: 'Tim Cantik AI',
        category: 'Skincare Basics',
        tags: 'layering,urutan skincare,pagi malam',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'double-cleansing-kapan-diperlukan',
        title: 'Double Cleansing: Kapan Diperlukan?',
        content: 'Double cleansing berguna ketika memakai sunscreen tebal, makeup, atau banyak aktivitas di luar ruangan. Langkah pertama membersihkan minyak/kotoran larut lemak, langkah kedua membersihkan residu berbasis air. Jika kulit sangat kering, pilih formula lembut dan tidak perlu dilakukan berlebihan.',
        excerpt: 'Panduan double cleansing sesuai kebutuhan kulit.',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        author: 'Dr. Aulia Rahma',
        category: 'Cleansing',
        tags: 'double cleansing,cleanser,sunscreen',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'skincare-aman-untuk-remaja',
        title: 'Skincare Aman untuk Remaja',
        content: 'Remaja tidak perlu terlalu banyak produk aktif. Dasarnya cukup cleanser lembut, moisturizer ringan, dan sunscreen. Jika ada jerawat, pilih treatment sederhana dengan konsentrasi rendah dan hindari pemakaian berlapis yang berlebihan.',
        excerpt: 'Rekomendasi skincare minimalis dan aman untuk remaja.',
        image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200',
        author: 'Dr. Nadia Putri',
        category: 'Teen Skincare',
        tags: 'remaja,skincare aman,jerawat',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'perawatan-kulit-sensitif-saat-cuaca-panas',
        title: 'Perawatan Kulit Sensitif Saat Cuaca Panas',
        content: 'Cuaca panas meningkatkan risiko iritasi pada kulit sensitif akibat keringat, UV, dan polusi. Pilih formula ringan tanpa parfum menyengat serta tetap prioritaskan sunscreen. Kompres dingin dan moisturizer barrier-friendly dapat membantu menenangkan kemerahan.',
        excerpt: 'Tips menjaga kulit sensitif tetap nyaman di cuaca panas.',
        image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200',
        author: 'Dr. Lina Pratama',
        category: 'Sensitive Skin',
        tags: 'kulit sensitif,cuaca panas,iritasi',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'memilih-moisturizer-berdasarkan-jenis-kulit',
        title: 'Memilih Moisturizer Berdasarkan Jenis Kulit',
        content: 'Kulit berminyak cenderung cocok dengan gel-cream ringan, sementara kulit kering lebih nyaman dengan cream richer. Kulit sensitif sebaiknya memilih moisturizer dengan daftar bahan lebih sederhana. Cek juga respon kulit selama 1-2 minggu sebelum menilai cocok atau tidak.',
        excerpt: 'Panduan praktis memilih pelembap sesuai kebutuhan kulit.',
        image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
        author: 'Dr. Fajar Wibowo',
        category: 'Hydration',
        tags: 'moisturizer,jenis kulit,hidrasi',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'mineral-vs-chemical-sunscreen',
        title: 'Mineral vs Chemical Sunscreen',
        content: 'Mineral sunscreen bekerja memantulkan sebagian sinar UV dan cocok untuk kulit sensitif tertentu. Chemical sunscreen cenderung lebih ringan serta nyaman dipakai harian, terutama untuk reapply. Yang terpenting bukan jenisnya, melainkan konsistensi pemakaian dan jumlah aplikasi yang cukup.',
        excerpt: 'Perbedaan sunscreen mineral dan chemical secara praktis.',
        image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
        author: 'Dr. Reza Santoso',
        category: 'Sun Protection',
        tags: 'sunscreen mineral,chemical sunscreen,UV',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'cara-reapply-sunscreen-di-atas-makeup',
        title: 'Cara Reapply Sunscreen di Atas Makeup',
        content: 'Reapply sunscreen tetap penting meski menggunakan makeup. Gunakan sunscreen spray atau cushion sunscreen secara merata, lalu tap ringan agar base makeup tidak bergeser berlebihan. Pilih produk yang nyaman agar Anda konsisten mengulang pemakaian.',
        excerpt: 'Trik praktis reapply sunscreen tanpa merusak makeup.',
        image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200',
        author: 'Dr. Nadia Putri',
        category: 'Sun Protection',
        tags: 'reapply sunscreen,makeup,sun care',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'kebiasaan-harian-yang-memperburuk-jerawat',
        title: 'Kebiasaan Harian yang Memperburuk Jerawat',
        content: 'Menyentuh wajah terlalu sering, jarang mengganti sarung bantal, dan penggunaan produk rambut yang komedogenik dapat memperparah jerawat. Bersihkan ponsel secara rutin dan cuci wajah setelah berkeringat. Perubahan kecil yang konsisten sering memberi dampak besar.',
        excerpt: 'Kebiasaan sederhana yang perlu dihentikan untuk kulit berjerawat.',
        image_url: 'https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?w=1200',
        author: 'Dr. Lina Pratama',
        category: 'Acne Care',
        tags: 'kebiasaan buruk,jerawat,perawatan',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'mitos-skincare-yang-harus-dihentikan',
        title: 'Mitos Skincare yang Harus Dihentikan',
        content: 'Tidak semua kulit berminyak harus dihindari moisturizer, dan kulit berjerawat bukan berarti perlu dicuci sesering mungkin. Banyak mitos skincare justru membuat kulit makin stres. Gunakan prinsip evidence-based, respon kulit, dan evaluasi bertahap.',
        excerpt: 'Membongkar mitos skincare yang sering menyesatkan.',
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200',
        author: 'Tim Cantik AI',
        category: 'Skincare Basics',
        tags: 'mitos skincare,edukasi,fakta',
        status: 'published',
        is_featured: 0
    },
    {
        slug: 'checklist-skincare-saat-traveling',
        title: 'Checklist Skincare Saat Traveling',
        content: 'Saat traveling, bawa versi travel-size produk inti: cleanser, moisturizer, sunscreen, dan treatment paling penting. Hindari mencoba terlalu banyak produk baru saat perjalanan karena kulit lebih rentan stres. Simpan skincare di pouch tertutup agar higienis dan mudah diakses.',
        excerpt: 'Daftar skincare wajib bawa saat perjalanan.',
        image_url: 'https://images.unsplash.com/photo-1475776408506-9a5371e7a068?w=1200',
        author: 'Dr. Aulia Rahma',
        category: 'Lifestyle',
        tags: 'traveling,checklist,skincare routine',
        status: 'published',
        is_featured: 0
    }
];

try {
    console.log('🌱 Seeding sample data (insert only, no overwrite)...');

    const insertBanner = db.prepare(`
        INSERT INTO banners (title, image_url, link_url, description, is_active, display_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    let insertedBanners = 0;
    for (const banner of banners) {
        const existing = db.prepare('SELECT id FROM banners WHERE title = ? LIMIT 1').get(banner.title);
        if (!existing) {
            insertBanner.run(
                banner.title,
                banner.image_url,
                banner.link_url,
                banner.description,
                banner.is_active,
                banner.display_order
            );
            insertedBanners += 1;
        }
    }
    console.log(`✅ ${insertedBanners} banner(s) inserted, existing preserved`);

    const insertProduct = db.prepare(`
        INSERT INTO products (name, brand, category, description, price, image_url, ingredients, skin_type, concerns, rating, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    let insertedProducts = 0;
    for (const product of products) {
        const existing = db.prepare('SELECT id FROM products WHERE name = ? AND COALESCE(brand, \'\') = COALESCE(?, \'\') LIMIT 1').get(product.name, product.brand);
        if (!existing) {
            insertProduct.run(
                product.name,
                product.brand,
                product.category,
                product.description,
                product.price,
                product.image_url,
                product.ingredients,
                product.skin_type,
                product.concerns,
                product.rating,
                product.is_active
            );
            insertedProducts += 1;
        }
    }
    console.log(`✅ ${insertedProducts} product(s) inserted, existing preserved`);

    normalizeExistingArticleSlugs();

    const insertArticle = db.prepare(`
        INSERT INTO articles (
            slug, title, content, excerpt, image_url, featured_image, author, category, tags, status, published_at, is_featured, views, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    let insertedArticles = 0;
    for (const article of articles) {
        const desiredSlug = makeSlug(article.slug || article.title);
        const existingByTitle = db.prepare('SELECT id FROM articles WHERE title = ? LIMIT 1').get(article.title);
        const existingBySlug = db.prepare('SELECT id FROM articles WHERE slug = ? LIMIT 1').get(desiredSlug);

        if (!existingByTitle && !existingBySlug) {
            const finalSlug = getUniqueSlug(desiredSlug);
            insertArticle.run(
                finalSlug,
                article.title,
                article.content,
                article.excerpt,
                article.image_url,
                article.image_url,
                article.author,
                article.category,
                article.tags,
                article.status || 'published',
                article.published_at || nowIso,
                Number(Boolean(article.is_featured)),
                Number(article.views || 0)
            );
            insertedArticles += 1;
        }
    }
    console.log(`✅ ${insertedArticles} article(s) inserted, existing preserved`);

    console.log('✅ Sample data seeding complete!');
    console.log('📊 Database ready with stable existing content');
} catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
} finally {
    db.close();
}
