/**
 * Product Knowledge Service
 * Loads detailed product information from knowledge base
 */

// Product Knowledge Database - Extracted from MD files
export const PRODUCT_KNOWLEDGE = {
    // UMADERM Mangosteen Sun Protector
    'umaderm-mangosteen-sun-protector': {
        name: 'UMADERM Mangosteen Sun Protector',
        category: 'Sunscreen',
        description: 'Sunscreen dengan perlindungan spektrum luas terhadap sinar UVA dan UVB',
        skinTypes: ['Semua jenis kulit', 'Kulit sensitif', 'Kulit kusam', 'Kulit kering', 'Kulit sering terpapar matahari'],
        benefits: [
            'Melindungi kulit dari sinar UVA dan UVB',
            'Mencegah sunburn, penuaan dini, dan hiperpigmentasi',
            'Membantu mencerahkan dan meratakan warna kulit',
            'Melembapkan dan menjaga skin barrier',
            'Memberikan efek glowing alami tanpa lengket',
            'Menenangkan kulit dan mengurangi kemerahan',
            'Non-comedogenic'
        ],
        activeIngredients: {
            'Mangosteen Extract': 'Antioksidan alami yang melawan radikal bebas, menenangkan kulit, dan menjaga kelembapan',
            'Niacinamide': 'Mencerahkan kulit, meratakan warna kulit, dan memperkuat skin barrier',
            'Allantoin': 'Menenangkan kulit, mengurangi iritasi, dan membantu regenerasi kulit',
            'UV Filter': 'Melindungi kulit dari paparan sinar UVA dan UVB',
            'Vitamin C alami': 'Mencerahkan kulit dan sebagai antioksidan',
            'Anthocyanin & Polifenol': 'Antioksidan dan anti-inflamasi'
        },
        usage: 'Gunakan pada pagi hari sebagai langkah terakhir skincare. Aplikasikan secara merata pada wajah dan leher. Gunakan 15-20 menit sebelum terpapar sinar matahari. Gunakan ulang setiap 2-3 jam untuk perlindungan maksimal.',
        bestFor: ['Hiperpigmentasi', 'Kulit kusam', 'Penuaan dini', 'Kulit sensitif', 'Perlindungan UV']
    },

    // BEAUTYLATORY Triple Action Skin Defense Sunscreen
    'beautylatory-triple-action-sunscreen': {
        name: 'BEAUTYLATORY Triple Action Skin Defense Sunscreen SPF 45',
        category: 'Sunscreen',
        description: 'Sunscreen dengan SPF 45 yang memberikan perlindungan terhadap sinar UVA, UVB, dan Blue Light',
        skinTypes: ['Semua jenis kulit', 'Kulit kering', 'Kulit berminyak', 'Kulit sensitif', 'Kulit sering terpapar gadget'],
        benefits: [
            'Melindungi kulit dari sinar UVA (penuaan dini)',
            'Melindungi kulit dari sinar UVB (sunburn)',
            'Melindungi dari efek negatif blue light',
            'Melembapkan dan menjaga hidrasi kulit',
            'Tekstur ringan, tidak lengket, tanpa whitecast',
            'Mengurangi risiko kerusakan kulit akibat radikal bebas'
        ],
        activeIngredients: {
            'Butyl Methoxydibenzoylmethane': 'UVA Filter - melindungi dari penuaan dini',
            'Octocrylene, Benzophenone-4, Titanium Dioxide': 'UVB Filter - mencegah sunburn',
            'Cerium Oxide': 'Blue Light Protection - melindungi dari radikal bebas cahaya gadget',
            'Sunflower Seed Oil': 'Melembapkan, menenangkan kulit, cocok untuk kulit sensitif',
            'Glycerin': 'Menarik kelembapan ke dalam kulit'
        },
        usage: 'Gunakan pada pagi hari sebagai langkah terakhir skincare. Aplikasikan secara merata pada wajah dan leher. Gunakan 15-20 menit sebelum terpapar sinar matahari. Gunakan ulang setiap 2-3 jam.',
        bestFor: ['Perlindungan UV', 'Blue light protection', 'Kulit kering', 'Hidrasi', 'Penggunaan sehari-hari']
    },

    // BEAUTYLATORY Mugwort Deep Cleansing Facial Wash
    'beautylatory-mugwort-facial-wash': {
        name: 'BEAUTYLATORY Mugwort Deep Cleansing Facial Wash Acne Treatment',
        category: 'Facial Wash',
        description: 'Facial wash khusus kulit berjerawat dengan mild surfactant yang lembut di kulit',
        skinTypes: ['Kulit berminyak', 'Kulit berjerawat', 'Kulit kombinasi', 'Kulit sensitif berjerawat'],
        benefits: [
            'Membersihkan wajah dari kotoran, debu, dan minyak berlebih',
            'Melawan bakteri penyebab jerawat',
            'Mengontrol produksi sebum',
            'Mengurangi munculnya jerawat dan komedo',
            'Menenangkan kulit yang meradang',
            'Menjaga kelembapan alami kulit',
            'Membuat kulit terasa segar dan bersih'
        ],
        activeIngredients: {
            'Mugwort Extract': 'Menenangkan kulit, mengurangi kemerahan, dan meredakan peradangan',
            'Salicylic Acid': 'Membersihkan pori-pori, mengangkat sel kulit mati, dan mencegah jerawat',
            'Tea Tree Leaf Water': 'Melawan bakteri penyebab jerawat',
            'Glycerin': 'Menjaga kelembapan kulit',
            'Dipotassium Glycyrrhizate': 'Menenangkan kulit dan mengurangi iritasi',
            'Allantoin': 'Mempercepat regenerasi kulit',
            'Very Berry Extracts': 'Kaya antioksidan untuk melindungi kulit dari radikal bebas'
        },
        usage: 'Basahi wajah dengan air bersih. Tuangkan facial wash secukupnya ke telapak tangan. Usapkan dan pijat lembut ke seluruh wajah hingga berbusa. Bilas dengan air hingga bersih. Gunakan 2 kali sehari (pagi dan malam).',
        bestFor: ['Jerawat', 'Kulit berminyak', 'Pori tersumbat', 'Komedo', 'Kontrol sebum', 'Kulit berjerawat sensitif']
    },

    // HYDROGLOW BI-PHASE SERUM SPRAY
    'hydroglow-bi-phase-serum': {
        name: 'HYDROGLOW BI-PHASE SERUM SPRAY',
        category: 'Serum',
        description: 'Serum wajah dalam bentuk spray mist dengan teknologi dua fase (air + oil) untuk hidrasi cepat dan nutrisi ekstra',
        skinTypes: ['Semua jenis kulit', 'Kulit kering', 'Kulit kombinasi', 'Kulit berminyak', 'Kulit sensitif'],
        ageRange: '18 tahun ke atas',
        benefits: [
            'Memberikan hidrasi instan saat kulit terasa kering',
            'Menyegarkan wajah yang lelah',
            'Menciptakan efek glowing alami yang sehat',
            'Mencerahkan kulit kusam',
            'Menjaga kelembutan kulit',
            'Merawat skin barrier',
            'Membantu menyamarkan tanda-tanda penuaan dini',
            '3-in-1: Serum + Face Mist + Glow Setting Spray'
        ],
        activeIngredients: {
            'White Truffle': 'Antioksidan kuat untuk menjaga keremajaan kulit',
            'Vitamin E': 'Antioksidan untuk melindungi kulit',
            'Niacinamide': 'Mencerahkan dan meratakan warna kulit',
            'Avocado Oil': 'Memberikan nutrisi intens dan menjaga kelembapan',
            'Sunflower Oil': 'Memperkuat skin barrier',
            'Sodium Hyaluronate': 'Menjaga kadar air kulit agar tetap kenyal dan lembap',
            'Bifida Ferment Lysate': 'Menenangkan kulit dan memperbaiki barrier yang lemah',
            '9-Herb Complex': 'Meredakan kulit stres akibat polusi'
        },
        usage: 'Kocok botol terlebih dahulu agar fase air dan oil menyatu sempurna. Semprotkan 2-4 kali ke wajah dengan jarak sekitar 20 cm sambil menutup mata. Dapat digunakan setelah mencuci wajah, sebelum skincare lain, di atas makeup sebagai glow setting spray, atau kapan saja saat wajah terasa kering.',
        bestFor: ['Hidrasi', 'Kulit kusam', 'Glow booster', 'Kulit lelah', 'Skin barrier', 'Penuaan dini', 'Kulit kering']
    },

    // LUMIBIOME RADIANCE DUO
    'lumibiome-radiance-duo': {
        name: 'LUMIBIOME RADIANCE DUO',
        category: 'Serum & Cream',
        description: 'Double Serum & Cream (2 in 1) dengan teknologi dual chamber untuk custom skincare',
        skinTypes: ['Semua jenis kulit', 'Kulit normal', 'Kulit kering', 'Kulit kombinasi', 'Kulit sensitif', 'Kulit kusam', 'Kulit mature'],
        ageRange: '20-50 tahun ke atas',
        benefits: [
            'Mencerahkan tampilan kulit',
            'Memperbaiki skin barrier',
            'Menjaga kelembapan intensif',
            'Menenangkan kulit sensitif',
            'Mencegah tanda-tanda penuaan dini',
            'Mendukung regenerasi kulit',
            'Menjaga keseimbangan microbiome kulit',
            'Custom skincare - sesuaikan rasio serum dan cream'
        ],
        activeIngredients: {
            'PhytoPDRN Panax Ginseng': 'Regenerasi kulit, meningkatkan elastisitas, perbaikan kulit lelah',
            'Niacinamide PC': 'Mencerahkan kulit, meratakan warna kulit, menyamarkan bekas jerawat, memperkuat skin barrier',
            'TX-Pep (Tranexamoyl Dipeptide-23)': 'Menyamarkan flek dan hiperpigmentasi',
            'Hymagic 4D Hyaluronic Acid': 'Hidrasi multi-layer, kulit kenyal dan lembap',
            'Ceramide Complex': 'Memperbaiki lapisan pelindung kulit',
            'preBIULIN FOS': 'Mendukung microbiome kulit yang seimbang',
            'Centella Extract': 'Menenangkan kulit kemerahan dan recovery barrier',
            'Vitamin E': 'Perlindungan antioksidan terhadap radikal bebas'
        },
        usage: 'Pagi: Campurkan serum dan cream di telapak tangan, ratakan ke wajah, lanjutkan dengan sunscreen. Malam: Gunakan porsi cream lebih banyak. Kulit berminyak: 2 serum : 1 cream. Kulit kombinasi: 1:1. Kulit kering/sensitif: 1 serum : 2 cream.',
        bestFor: ['Kulit kusam', 'Bekas jerawat', 'Hiperpigmentasi', 'Dehidrasi', 'Skin barrier rusak', 'Penuaan dini', 'Flek', 'Kulit lelah']
    },

    // PHYTOSYNC UV Defense Hybrid Sunscreen
    'phytosync-uv-defense-sunscreen': {
        name: 'BEAUTYLATORY PHYTOSYNC UV Defense Hybrid Sunscreen',
        category: 'Sunscreen',
        description: 'Tabir surya sistem hybrid filter dengan perlindungan UV dan manfaat superfood botani',
        skinTypes: ['Semua jenis kulit'],
        benefits: [
            'Perlindungan UV dengan sistem hybrid filter',
            'Menjaga tampilan kulit tetap cerah dan lembap',
            'Menenangkan kulit',
            'Mendukung tampilan kulit terhidrasi dan cerah optimal',
            'Tekstur cream yang nyaman'
        ],
        activeIngredients: {
            'Niacinamide': 'Mencerahkan dan meratakan warna kulit',
            'Centella Hydrosol': 'Menenangkan dan melembapkan kulit',
            'Vitamin E': 'Antioksidan untuk melindungi kulit',
            'Baba GN 2.0': 'Antioksidan kompleks botani eksklusif'
        },
        usage: 'Oleskan secara merata pada wajah di pagi hari. Ulangi penggunaan setiap 2-3 jam sekali untuk perlindungan yang optimal.',
        bestFor: ['Perlindungan UV', 'Kulit kusam', 'Hidrasi', 'Semua jenis kulit']
    },

    // PHYTOSYNC Urban Shield Serum
    'phytosync-urban-shield-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Urban Shield Serum',
        category: 'Serum',
        description: 'Serum perlindungan urban dengan superfood botani untuk melindungi dari polusi dan blue light',
        skinTypes: ['Semua jenis kulit'],
        benefits: [
            'Melindungi kulit dari polusi udara & cahaya gadget',
            'Menjaga elastisitas kulit dan mencegah penuaan dini',
            'Mengurangi kemerahan & inflamasi akibat stres lingkungan',
            'Memberi hidrasi seimbang dan kesegaran instan',
            'Membantu kulit tetap bercahaya & sehat'
        ],
        activeIngredients: {
            'Phyrosaccharide AP': 'Membentuk lapisan pelindung dari polusi mikro',
            'Niacinamide': 'Mencerahkan dan meratakan warna kulit',
            'Argireline': 'Menyamarkan garis halus',
            'Baba GN 2.0': 'Kompleks botani eksklusif antioksidan',
            'Cerium Oxide': 'Anti Blue Light'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum ke telapak tangan, usapkan merata ke wajah dan leher. Gunakan pagi dan malam hari sebelum pelembap. Gunakan sunscreen di pagi hari.',
        bestFor: ['Perlindungan polusi', 'Blue light protection', 'Penuaan dini', 'Kulit stres', 'Urban lifestyle']
    },

    // PHYTOSYNC Soothing Recovery Serum
    'phytosync-soothing-recovery-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Soothing Recovery Serum',
        category: 'Serum',
        description: 'Serum pemulihan dengan superfood botani untuk menenangkan dan memperbaiki skin barrier',
        skinTypes: ['Semua jenis kulit', 'Kulit sensitif', 'Kulit iritasi', 'Kulit rusak'],
        benefits: [
            'Menenangkan kemerahan & rasa panas kulit',
            'Mengembalikan kelembapan & kelembutan',
            'Memperkuat skin barrier yang rusak',
            'Membantu pemulihan kulit pasca paparan krim berbahaya',
            'Memberi proteksi antioksidan'
        ],
        activeIngredients: {
            'Niacinamide': 'Barrier repair & redakan kemerahan',
            'Panthenol (Vitamin B5)': 'Penyembuhan & hidrasi',
            'Allantoin': 'Soothing mendalam, mengurangi perih/gatal',
            'Ceramide Complex': 'Mengembalikan lapisan pelindung kulit',
            'BABA-GN 2.0': 'Antioksidan & stabilizer alami'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum, usapkan merata terutama area yang iritasi. Gunakan pagi & malam sebelum pelembap. Gunakan sunscreen saat siang hari.',
        bestFor: ['Kulit sensitif', 'Iritasi', 'Kemerahan', 'Skin barrier rusak', 'Kulit pasca treatment', 'Kulit perih']
    },

    // PHYTOSYNC Acne Recovery Serum
    'phytosync-acne-recovery-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Acne Recovery Serum',
        category: 'Serum',
        description: 'Serum anti-jerawat dengan superfood botani untuk mengurangi jerawat dan menyamarkan bekas jerawat',
        skinTypes: ['Kulit berjerawat', 'Kulit berminyak', 'Kulit kombinasi'],
        benefits: [
            'Mengurangi jerawat aktif dan komedo',
            'Menenangkan kemerahan & inflamasi',
            'Membantu penyembuhan kulit lebih cepat',
            'Mengontrol minyak berlebih tanpa membuat kulit kering',
            'Menjaga hidrasi seimbang & kilau sehat alami',
            'Proteksi antioksidan'
        ],
        activeIngredients: {
            'Salicylic Acid (BHA)': 'Membersihkan pori-pori, mengurangi komedo & jerawat',
            'Niacinamide': 'Mengurangi inflamasi, mengontrol minyak, memperkuat skin barrier',
            'Zinc PCA': 'Efek sebum-control, menyeimbangkan kulit berjerawat',
            'BABA-GN 2.0': 'Antioksidan & anti-inflamasi alami'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum, usapkan merata ke wajah dan area berjerawat. Gunakan pagi dan malam hari sebelum pelembap. Gunakan sunscreen di pagi hari untuk mencegah hiperpigmentasi pasca-jerawat.',
        bestFor: ['Jerawat', 'Komedo', 'Kulit berminyak', 'Pori tersumbat', 'Bekas jerawat', 'Inflamasi', 'Kontrol sebum']
    },

    // PHYTOSYNC Bright Complex Serum
    'phytosync-bright-complex-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Bright Complex Serum',
        category: 'Serum',
        description: 'Serum brightening dengan superfood botani untuk menyamarkan noda hitam dan meratakan warna kulit',
        skinTypes: ['Semua jenis kulit'],
        benefits: [
            'Membantu menyamarkan noda hitam dan pigmentasi tidak merata',
            'Meningkatkan kecerahan kulit dalam 14 hari pemakaian teratur',
            'Mendukung perlindungan antioksidan & memperkuat skin barrier',
            'Formula ringan, cepat meresap, tanpa lengket',
            'Memberi hidrasi seimbang sehingga kulit terasa segar dan kenyal'
        ],
        activeIngredients: {
            'Tranexamic Acid': 'Menghambat transfer melanin pada tingkat seluler',
            'Niacinamide': 'Meratakan warna kulit, mengurangi inflamasi, memperkuat skin barrier',
            'Citus Junos Fruit Extract': 'Bentuk vitamin C membantu mencerahkan kulit',
            'Licorice Extract': 'Membantu mencerahkan kulit dan menyamarkan noda gelap',
            'BABA-GN 2.0': 'Antioksidan & anti-browning alami'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum, usapkan merata ke wajah dan leher. Gunakan pagi dan malam hari sebelum pelembap. Gunakan sunscreen di pagi hari untuk hasil optimal.',
        bestFor: ['Hiperpigmentasi', 'Noda hitam', 'Kulit kusam', 'Flek', 'Bekas jerawat', 'Warna kulit tidak merata', 'Brightening']
    },

    // PHYTOSYNC Golden Age Serum
    'phytosync-golden-age-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Golden Age Serum',
        category: 'Serum',
        description: 'Serum anti-aging dengan superfood botani untuk kulit mature 50+ tahun',
        skinTypes: ['Kulit mature', 'Kulit kering', 'Kulit aging'],
        ageRange: '50+ tahun',
        benefits: [
            'Membantu meningkatkan elastisitas & kekencangan kulit',
            'Mengurangi tampilan garis halus & kerutan',
            'Memberi hidrasi intensif dan kelembutan ekstra',
            'Menenangkan kulit sensitif & mengurangi kemerahan',
            'Menjaga vitalitas kulit di usia 50+ agar tetap sehat bercahaya',
            'Memberikan proteksi antioksidan tambahan'
        ],
        activeIngredients: {
            'Peptides': 'Merangsang produksi kolagen & elastin, menjaga kekencangan kulit',
            'Hymagic 4D Hyaluronic Acid': 'Memberikan hidrasi mendalam dan mengurangi tampilan garis halus',
            'Niacinamide': 'Memperkuat skin barrier, mengurangi noda, dan menenangkan inflamasi',
            'Argireline': 'Menyamarkan garis halus',
            'BABA-GN 2.0': 'Antioksidan & anti-browning alami'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum, usapkan merata ke wajah dan leher. Gunakan pagi dan malam hari sebelum pelembap. Gunakan sunscreen di siang hari untuk perlindungan tambahan.',
        bestFor: ['Penuaan dini', 'Garis halus', 'Kerutan', 'Kulit mature', 'Elastisitas menurun', 'Kulit kering', 'Anti-aging']
    },

    // PHYTOSYNC Materna Gentle Serum
    'phytosync-materna-gentle-serum': {
        name: 'BEAUTYLATORY PHYTOSYNC Materna Gentle Serum',
        category: 'Serum',
        description: 'Serum gentle untuk ibu hamil & menyusui dengan superfood botani yang aman',
        skinTypes: ['Semua jenis kulit', 'Kulit sensitif', 'Ibu hamil', 'Ibu menyusui'],
        benefits: [
            'Membantu menyamarkan kulit kusam dan meratakan warna kulit',
            'Memberikan hidrasi ringan tanpa rasa lengket',
            'Menenangkan kemerahan & kulit sensitif akibat perubahan hormonal',
            'Menjaga skin barrier tetap kuat selama kehamilan',
            'Membantu kulit wajah tetap sehat, segar, dan bercahaya',
            'Melindungi kulit dari stres oksidatif'
        ],
        activeIngredients: {
            'Niacinamide': 'Meratakan warna kulit, mengurangi inflamasi, memperkuat skin barrier',
            'Panthenol (Vitamin B5)': 'Menenangkan & melembapkan kulit',
            'Allantoin': 'Menenangkan iritasi, mendukung perbaikan kulit',
            'Ceramide': 'Memperkuat lapisan pelindung kulit, menjaga hidrasi',
            'BABA-GN 2.0': 'Antioksidan alami, aman untuk kehamilan'
        },
        usage: 'Bersihkan wajah, teteskan 2-3 drop serum, usapkan merata ke wajah dan leher. Gunakan pagi dan malam hari sebelum pelembap. Konsultasikan dengan dokter bila ragu.',
        bestFor: ['Ibu hamil', 'Ibu menyusui', 'Kulit sensitif', 'Perubahan hormonal', 'Kulit kusam', 'Pregnancy-safe']
    }
};

/**
 * Get product knowledge by slug or name
 */
export function getProductKnowledge(identifier) {
    // Try exact match by slug
    if (PRODUCT_KNOWLEDGE[identifier]) {
        return PRODUCT_KNOWLEDGE[identifier];
    }

    // Try fuzzy match by name
    const lowerIdentifier = identifier.toLowerCase();
    for (const [slug, product] of Object.entries(PRODUCT_KNOWLEDGE)) {
        if (product.name.toLowerCase().includes(lowerIdentifier) || 
            lowerIdentifier.includes(product.name.toLowerCase())) {
            return product;
        }
    }

    return null;
}

/**
 * Get all products knowledge
 */
export function getAllProductKnowledge() {
    return Object.values(PRODUCT_KNOWLEDGE);
}

/**
 * Find products suitable for specific skin concerns
 */
export function findProductsForConcerns(concerns = []) {
    const products = [];
    
    for (const product of Object.values(PRODUCT_KNOWLEDGE)) {
        const matchScore = concerns.filter(concern => 
            product.bestFor.some(bf => 
                bf.toLowerCase().includes(concern.toLowerCase()) ||
                concern.toLowerCase().includes(bf.toLowerCase())
            )
        ).length;

        if (matchScore > 0) {
            products.push({ ...product, matchScore });
        }
    }

    // Sort by match score (highest first)
    return products.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Format product knowledge for AI prompt
 */
export function formatProductKnowledgeForAI() {
    const products = getAllProductKnowledge();
    
    return products.map(product => ({
        name: product.name,
        category: product.category,
        description: product.description,
        skinTypes: product.skinTypes.join(', '),
        benefits: product.benefits.join('; '),
        activeIngredients: Object.entries(product.activeIngredients)
            .map(([name, benefit]) => `${name}: ${benefit}`)
            .join('; '),
        usage: product.usage,
        bestFor: product.bestFor.join(', ')
    }));
}
