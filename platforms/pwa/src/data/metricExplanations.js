/**
 * Penjelasan Detail untuk 13 Metrik Kulit
 * Berbasis bukti ilmiah, komprehensif, mudah dipahami
 * Target: Pengguna Indonesia
 */

const metricExplanations = {
  acne: {
    title: "Analisis Jerawat",
    description: "Penilaian komprehensif tingkat keparahan jerawat, jenis, dan distribusi di kulit wajah Anda.",
    whatItMeans: {
      Clear: "Kulit Anda menunjukkan sangat sedikit atau tidak ada lesi jerawat aktif. Ini menandakan produksi sebum yang sehat dan kesehatan pori yang baik.",
      Mild: "Beberapa komedo (blackhead/whitehead) atau papula kecil terlihat. Ini umum terjadi dan dapat dikelola dengan perawatan yang tepat.",
      Moderate: "Beberapa lesi inflamasi termasuk papula dan pustula terlihat. Memerlukan pendekatan perawatan yang tertarget.",
      Severe: "Jerawat inflamasi ekstensif dengan kemungkinan nodul atau kista. Disarankan konsultasi dermatologis profesional."
    },
    factors: [
      "Fluktuasi hormonal (terutama saat menstruasi, kehamilan, atau stres)",
      "Produksi sebum berlebih yang menyumbat pori",
      "Pertumbuhan bakteri (Propionibacterium acnes)",
      "Inflamasi dan respons imun",
      "Diet (makanan indeks glikemik tinggi, produk susu)",
      "Pembersihan yang tidak memadai atau berlebihan",
      "Produk skincare yang komedogenik"
    ],
    recommendations: [
      "Gunakan produk non-comedogenic dan oil-free",
      "Bersihkan wajah 2x sehari dengan cleanser lembut pH-balanced",
      "Aplikasikan salicylic acid atau benzoyl peroxide",
      "Hindari menyentuh atau memencet jerawat",
      "Pertimbangkan retinoid untuk jerawat persisten",
      "Jaga konsistensi rutinitas skincare",
      "Konsultasi ke dokter kulit untuk kasus parah"
    ],
    prevention: [
      "Jaga tangan agar tidak menyentuh wajah",
      "Bersihkan layar HP dan sarung bantal secara rutin",
      "Hapus makeup sebelum tidur",
      "Tetap terhidrasi dan jaga pola makan seimbang",
      "Kelola tingkat stres",
      "Hindari produk yang menyumbat pori"
    ]
  },

  wrinkles: {
    title: "Analisis Kerutan & Garis Halus",
    description: "Penilaian tanda-tanda penuaan kulit termasuk kerutan dinamis dan statis, mengukur kedalaman, panjang, dan distribusi.",
    whatItMeans: {
      Minimal: "Sangat sedikit garis halus, biasanya hanya terlihat saat ekspresi wajah. Kulit mempertahankan elastisitas yang sangat baik.",
      Low: "Beberapa garis halus di sekitar mata (crow's feet) atau dahi. Normal untuk usia, dapat dicegah dengan perawatan.",
      Moderate: "Garis terlihat saat istirahat, terutama di sekitar mata, dahi, dan mulut. Produksi kolagen menurun.",
      High: "Kerutan dalam dan lipatan terlihat saat istirahat. Kehilangan kolagen dan elastin signifikan. Mungkin mendapat manfaat dari perawatan profesional."
    },
    factors: [
      "Proses penuaan alami (pemecahan kolagen dan elastin)",
      "Paparan UV (photoaging) - penyebab #1 kerutan prematur",
      "Merokok dan konsumsi alkohol",
      "Ekspresi wajah berulang",
      "Posisi tidur (tidur miring/tengkurap)",
      "Dehidrasi dan nutrisi buruk",
      "Genetik dan jenis kulit"
    ],
    recommendations: [
      "Sunscreen broad-spectrum SPF 30+ setiap hari (PALING PENTING)",
      "Retinoid (vitamin A) untuk meningkatkan produksi kolagen",
      "Serum Vitamin C untuk perlindungan antioksidan",
      "Pelembab kaya peptida",
      "Hyaluronic acid untuk hidrasi dan plumping",
      "Pertimbangkan perawatan profesional (Botox, filler, laser)",
      "Tidur telentang untuk mencegah sleep lines"
    ],
    prevention: [
      "Jangan pernah skip sunscreen, bahkan di dalam ruangan",
      "Pakai kacamata hitam untuk mencegah menyipitkan mata",
      "Tetap terhidrasi (8+ gelas air per hari)",
      "Berhenti merokok segera",
      "Tidur berkualitas 7-9 jam",
      "Makan makanan kaya antioksidan",
      "Gunakan sarung bantal sutra"
    ]
  },

  pores: {
    title: "Analisis Ukuran & Kepadatan Pori",
    description: "Evaluasi visibilitas pori, ukuran, dan kepadatan di berbagai zona wajah, terutama T-zone.",
    whatItMeans: {
      Good: "Pori hampir tidak terlihat, menunjukkan tekstur kulit yang sangat baik dan produksi sebum minimal.",
      Visible: "Pori terlihat, terutama di hidung dan pipi. Umum pada kulit berminyak atau kombinasi.",
      Enlarged: "Pori tampak melebar signifikan, sering karena minyak berlebih, penuaan, atau kerusakan matahari.",
      "Very Enlarged": "Pori sangat terlihat dan mungkin tersumbat. Memerlukan perawatan pore-refining intensif."
    },
    factors: [
      "Genetik (penentu utama ukuran pori)",
      "Produksi sebum berlebih",
      "Kehilangan elastisitas kulit seiring usia",
      "Kerusakan matahari (merusak kolagen)",
      "Pori tersumbat dari sel kulit mati",
      "Pembersihan yang tidak tepat",
      "Perubahan hormonal"
    ],
    recommendations: [
      "Double cleanse untuk menghilangkan semua kotoran",
      "Gunakan salicylic acid (BHA) untuk membersihkan dalam pori",
      "Aplikasikan niacinamide untuk meminimalkan tampilan pori",
      "Retinoid untuk meningkatkan cell turnover",
      "Clay mask 1-2x seminggu untuk menyerap minyak berlebih",
      "Jangan pernah tidur dengan makeup",
      "Pertimbangkan perawatan profesional (chemical peel, microneedling)"
    ],
    prevention: [
      "Rutinitas pembersihan konsisten",
      "Eksfoliasi teratur (2-3x seminggu)",
      "Selalu hapus makeup dengan menyeluruh",
      "Gunakan produk non-comedogenic",
      "Lindungi dari kerusakan matahari",
      "Hindari pore strip (dapat merusak kulit)",
      "Jangan memencet atau menggaruk pori"
    ]
  },

  pigmentation: {
    title: "Analisis Pigmentasi & Bintik Gelap",
    description: "Penilaian distribusi melanin, hiperpigmentasi, bintik gelap, dan kerataan warna kulit secara keseluruhan.",
    whatItMeans: {
      Even: "Warna kulit seragam dengan diskolorasi minimal. Distribusi melanin sangat baik.",
      Mild: "Beberapa bintik gelap kecil atau sedikit tidak rata. Sering dari bekas jerawat atau paparan matahari ringan.",
      Moderate: "Bercak gelap yang terlihat, melasma, atau hiperpigmentasi pasca-inflamasi. Memerlukan perawatan tertarget.",
      Severe: "Hiperpigmentasi ekstensif yang mempengaruhi area luas. Mungkin perlu intervensi profesional."
    },
    factors: [
      "Paparan UV (memicu produksi melanin)",
      "Hiperpigmentasi pasca-inflamasi (dari jerawat, luka)",
      "Perubahan hormonal (melasma saat kehamilan)",
      "Penuaan (age spots/liver spots)",
      "Genetik dan jenis kulit (kulit gelap lebih rentan)",
      "Obat-obatan tertentu",
      "Inflamasi"
    ],
    recommendations: [
      "Sunscreen SPF 50+ ketat setiap hari (ESENSIAL)",
      "Serum Vitamin C untuk mencerahkan",
      "Niacinamide untuk menghambat transfer melanin",
      "Alpha arbutin atau kojic acid untuk spot treatment",
      "Retinoid untuk cell turnover",
      "Chemical exfoliant (AHA) untuk memudarkan bintik",
      "Pertimbangkan perawatan profesional (laser, chemical peel)"
    ],
    prevention: [
      "Sunscreen setiap hari, aplikasikan ulang setiap 2 jam",
      "Pakai topi lebar saat di luar",
      "Hindari jam puncak matahari (10 pagi-4 sore)",
      "Obati jerawat segera untuk mencegah PIH",
      "Jangan menggaruk kulit",
      "Gunakan antioksidan setiap hari",
      "Bersabar - memudarkan butuh 3-6 bulan"
    ]
  },

  hydration: {
    title: "Analisis Tingkat Hidrasi Kulit",
    description: "Pengukuran kandungan air kulit dan kapasitas retensi kelembaban di zona wajah.",
    whatItMeans: {
      "Well Hydrated": "Kandungan air optimal. Kulit tampak kenyal, halus, dan bercahaya.",
      Normal: "Hidrasi memadai dengan kekeringan sesekali. Pertahankan rutinitas saat ini.",
      Dehydrated: "Kandungan air tidak cukup. Kulit mungkin terasa kencang, tampak kusam, dan menunjukkan garis halus.",
      "Severely Dehydrated": "Defisiensi air kritis. Kulit bersisik, kasar, dan tidak nyaman. Hidrasi segera diperlukan."
    },
    factors: [
      "Asupan air tidak cukup",
      "Cleanser keras yang menghilangkan minyak alami",
      "Faktor lingkungan (udara kering, AC, pemanas)",
      "Eksfoliasi berlebihan",
      "Skin barrier rusak",
      "Penuaan (produksi hyaluronic acid menurun)",
      "Obat-obatan atau kondisi kesehatan tertentu"
    ],
    recommendations: [
      "Minum 8-10 gelas air per hari",
      "Gunakan toner hidrasi dengan hyaluronic acid",
      "Aplikasikan essence atau serum saat kulit masih lembab",
      "Pelembab segera setelah cleansing",
      "Gunakan humektan (glycerin, hyaluronic acid)",
      "Seal dengan pelembab oklusif di malam hari",
      "Gunakan humidifier di lingkungan kering"
    ],
    prevention: [
      "Jangan skip pelembab, bahkan pada kulit berminyak",
      "Hindari air panas saat cleansing",
      "Batasi eksfoliasi 2-3x seminggu",
      "Lindungi skin barrier dengan ceramide",
      "Makan makanan kaya air (timun, semangka)",
      "Hindari produk berbasis alkohol",
      "Gunakan facial mist sepanjang hari"
    ]
  },

  texture: {
    title: "Analisis Tekstur & Kehalusan Kulit",
    description: "Evaluasi kualitas permukaan kulit, termasuk kekasaran, benjolan, dan kehalusan keseluruhan.",
    whatItMeans: {
      Smooth: "Tekstur sangat baik dengan ketidakteraturan minimal. Kulit terasa lembut dan rata.",
      "Slightly Rough": "Masalah tekstur ringan, mungkin dari penumpukan sel kulit mati atau keratosis pilaris ringan.",
      Rough: "Benjolan yang terlihat, permukaan tidak rata, atau bercak kasar. Memerlukan eksfoliasi dan perawatan.",
      "Very Rough": "Masalah tekstur signifikan yang mempengaruhi area luas. Mungkin perlu perawatan profesional."
    },
    factors: [
      "Penumpukan sel kulit mati",
      "Keratosis pilaris (kondisi genetik)",
      "Dehidrasi",
      "Kerusakan matahari",
      "Penuaan (cell turnover lebih lambat)",
      "Eksfoliasi tidak memadai",
      "Pori tersumbat"
    ],
    recommendations: [
      "Eksfoliasi teratur dengan AHA (glycolic, lactic acid)",
      "Gunakan BHA untuk kulit berminyak, rawan jerawat",
      "Aplikasikan urea atau salicylic acid untuk bercak kasar",
      "Retinoid untuk meningkatkan cell turnover",
      "Hidrasi dengan hyaluronic acid",
      "Pertimbangkan microdermabrasion profesional",
      "Gunakan eksfolian fisik lembut (bukan scrub kasar)"
    ],
    prevention: [
      "Eksfoliasi 2-3x seminggu secara konsisten",
      "Jangan over-eksfoliasi (menyebabkan lebih kasar)",
      "Jaga kulit tetap terhidrasi",
      "Lindungi dari kerusakan matahari",
      "Gunakan cleanser lembut, tidak mengeringkan",
      "Pelembab saat kulit masih lembab",
      "Bersabar - perbaikan tekstur butuh waktu"
    ]
  },

  redness: {
    title: "Analisis Kemerahan & Inflamasi",
    description: "Penilaian kemerahan wajah, inflamasi, dan visibilitas vaskular termasuk indikator rosacea.",
    whatItMeans: {
      Minimal: "Sedikit atau tidak ada kemerahan. Kulit sehat dan tenang dengan kontrol vaskular yang baik.",
      Mild: "Kemerahan ringan, mungkin dari sensitivitas atau iritasi sementara. Biasanya dapat dikelola.",
      Moderate: "Kemerahan yang terlihat, pembuluh darah terlihat, atau flushing persisten. Mungkin menunjukkan rosacea atau sensitivitas.",
      Severe: "Kemerahan ekstensif, inflamasi, atau rosacea. Memerlukan evaluasi dermatologis."
    },
    factors: [
      "Rosacea (kondisi inflamasi kronis)",
      "Kulit sensitif atau reaktif",
      "Kapiler pecah",
      "Reaksi alergi atau iritasi",
      "Kerusakan matahari",
      "Suhu ekstrem",
      "Makanan pedas, alkohol, minuman panas",
      "Stres dan hormon"
    ],
    recommendations: [
      "Gunakan produk lembut, bebas pewangi",
      "Aplikasikan bahan menenangkan (centella, niacinamide, azelaic acid)",
      "Hindari aktif keras saat flare-up",
      "Gunakan sunscreen mineral (zinc oxide)",
      "Pertimbangkan color corrector hijau",
      "Konsultasi dokter kulit untuk kemerahan persisten",
      "Perawatan laser untuk kapiler pecah"
    ],
    prevention: [
      "Identifikasi dan hindari pemicu",
      "Lindungi dari suhu ekstrem",
      "Gunakan air hangat, jangan panas",
      "Hindari produk berbasis alkohol",
      "Batasi makanan pedas dan alkohol",
      "Kelola tingkat stres",
      "Selalu patch test produk baru"
    ]
  },

  oiliness: {
    title: "Analisis Produksi Sebum & Minyak",
    description: "Pengukuran aktivitas kelenjar sebaceous dan produksi minyak di zona wajah, terutama T-zone.",
    whatItMeans: {
      Balanced: "Produksi sebum optimal. Kulit tidak terlalu berminyak atau kering.",
      "Slightly Oily": "Minyak berlebih ringan, terutama di T-zone. Umum dan dapat dikelola.",
      Oily: "Produksi minyak signifikan menyebabkan kilap dan potensi breakout. Memerlukan rutinitas oil-control.",
      "Very Oily": "Produksi sebum berlebihan sepanjang hari. Mungkin perlu perawatan profesional atau obat."
    },
    factors: [
      "Genetik (faktor utama)",
      "Fluktuasi hormonal",
      "Over-cleansing (memicu produksi minyak lebih)",
      "Cuaca panas dan lembab",
      "Stres",
      "Diet (makanan indeks glikemik tinggi)",
      "Produk skincare yang salah"
    ],
    recommendations: [
      "Gunakan cleanser lembut berbusa 2x sehari",
      "Aplikasikan pelembab oil-free, non-comedogenic",
      "Gunakan niacinamide untuk mengatur sebum",
      "Salicylic acid untuk menjaga pori bersih",
      "Clay mask 1-2x seminggu",
      "Blotting paper siang hari (jangan over-wash)",
      "Pertimbangkan retinoid untuk kasus parah"
    ],
    prevention: [
      "Jangan skip pelembab (dehidrasi menyebabkan lebih berminyak)",
      "Hindari cleanser keras yang mengeringkan",
      "Gunakan produk oil-free, water-based",
      "Blot, jangan cuci, siang hari",
      "Jaga rambut tidak menutupi wajah",
      "Bersihkan HP dan sarung bantal rutin",
      "Kelola stres dan diet"
    ]
  },

  uvDamage: {
    title: "Analisis Kerusakan UV & Paparan Matahari",
    description: "Penilaian tanda photoaging termasuk sun spot, perubahan tekstur, dan kerusakan matahari kumulatif.",
    whatItMeans: {
      Protected: "Kerusakan matahari minimal. Kebiasaan perlindungan matahari sangat baik.",
      Mild: "Tanda awal photoaging. Beberapa sun spot atau perubahan tekstur ringan.",
      Moderate: "Kerusakan matahari yang terlihat termasuk bintik, kerutan, dan masalah tekstur. Memerlukan perawatan perbaikan.",
      Severe: "Photoaging ekstensif dengan kerutan dalam, bintik signifikan, dan kerusakan tekstur. Perawatan profesional direkomendasikan."
    },
    factors: [
      "Paparan UV kumulatif sepanjang hidup",
      "Penggunaan sunscreen tidak memadai atau tidak ada",
      "Aktivitas outdoor tanpa perlindungan",
      "Tanning bed (sangat merusak)",
      "Tinggal di iklim cerah",
      "Kulit terang (perlindungan alami lebih sedikit)",
      "Obat-obatan tertentu (photosensitizing)"
    ],
    recommendations: [
      "Sunscreen broad-spectrum SPF 50+ setiap hari (NON-NEGOTIABLE)",
      "Aplikasikan ulang sunscreen setiap 2 jam di luar",
      "Serum Vitamin C untuk perlindungan antioksidan",
      "Retinoid untuk memperbaiki kerusakan matahari",
      "Niacinamide untuk perbaikan barrier",
      "Chemical exfoliant untuk memudarkan sun spot",
      "Pertimbangkan perawatan profesional (laser, IPL)"
    ],
    prevention: [
      "Sunscreen SETIAP HARI, hujan atau cerah, dalam atau luar",
      "Pakai pakaian pelindung, topi, kacamata hitam",
      "Cari tempat teduh saat jam puncak (10 pagi-4 sore)",
      "Jangan pernah gunakan tanning bed",
      "Gunakan antioksidan di bawah sunscreen",
      "Cek obat untuk photosensitivity",
      "Ingat: kerusakan matahari kumulatif dan permanen"
    ]
  },

  skinAge: {
    title: "Analisis Prediksi Usia Kulit",
    description: "Estimasi usia biologis kulit berbasis AI berdasarkan berbagai penanda penuaan dan perbandingan dengan usia kronologis.",
    whatItMeans: {
      Youthful: "Kulit tampak lebih muda dari usia kronologis. Kesehatan kulit dan pencegahan penuaan sangat baik.",
      "Age-Appropriate": "Usia kulit sesuai usia kronologis. Proses penuaan normal.",
      Mature: "Kulit menunjukkan tanda penuaan dipercepat. Mungkin mendapat manfaat dari perawatan anti-aging.",
      Advanced: "Penuaan prematur signifikan. Regimen anti-aging komprehensif direkomendasikan."
    },
    factors: [
      "Genetik (40-50% penuaan)",
      "Paparan matahari (faktor eksternal terbesar)",
      "Merokok dan alkohol",
      "Diet dan nutrisi",
      "Kualitas dan kuantitas tidur",
      "Tingkat stres",
      "Konsistensi rutinitas skincare",
      "Polusi lingkungan"
    ],
    recommendations: [
      "Rutinitas anti-aging komprehensif dengan retinoid",
      "Sunscreen SPF 50+ setiap hari",
      "Antioksidan (Vitamin C, E, ferulic acid)",
      "Peptida untuk stimulasi kolagen",
      "Hyaluronic acid untuk hidrasi",
      "Perawatan profesional (Botox, filler, laser)",
      "Gaya hidup sehat (tidur, diet, olahraga)"
    ],
    prevention: [
      "Mulai rutinitas anti-aging di usia 20-an",
      "Jangan pernah skip sunscreen",
      "Jangan merokok, batasi alkohol",
      "Tidur berkualitas 7-9 jam",
      "Kelola stres secara efektif",
      "Makan diet kaya antioksidan",
      "Tetap terhidrasi",
      "Olahraga teratur"
    ]
  },

  skinType: {
    title: "Klasifikasi Jenis Kulit",
    description: "Identifikasi jenis kulit utama Anda berdasarkan produksi sebum, hidrasi, dan pola sensitivitas.",
    whatItMeans: {
      Normal: "Sebum dan kelembaban seimbang. Sedikit masalah. Paling mudah dirawat.",
      Dry: "Produksi sebum rendah. Mungkin terasa kencang, bersisik. Butuh hidrasi ekstra.",
      Oily: "Produksi sebum berlebih. Rentan kilap dan breakout. Butuh oil control.",
      Combination: "T-zone berminyak, pipi kering. Jenis paling umum. Butuh pendekatan seimbang.",
      Sensitive: "Reaktif terhadap produk/lingkungan. Rentan kemerahan dan iritasi."
    },
    recommendations: {
      Normal: [
        "Pertahankan rutinitas saat ini",
        "Cleanser dan pelembab lembut",
        "SPF setiap hari",
        "Perawatan anti-aging preventif"
      ],
      Dry: [
        "Cleanser berbasis krim",
        "Pelembab kaya, emolien",
        "Hyaluronic acid dan ceramide",
        "Hindari eksfolian keras"
      ],
      Oily: [
        "Cleanser berbusa",
        "Pelembab oil-free, gel",
        "Salicylic acid dan niacinamide",
        "Clay mask mingguan"
      ],
      Combination: [
        "Cleanser gel lembut",
        "Pelembab ringan",
        "Multi-masking (masker berbeda untuk zona berbeda)",
        "Keseimbangan adalah kunci"
      ],
      Sensitive: [
        "Produk bebas pewangi",
        "Bahan minimal",
        "Bahan menenangkan (centella, aloe)",
        "Patch test semua produk"
      ]
    }
  },

  skinTone: {
    title: "Klasifikasi Warna Kulit Fitzpatrick",
    description: "Klasifikasi ilmiah respons kulit Anda terhadap paparan UV dan kandungan melanin (Tipe I-VI).",
    whatItMeans: {
      "Type I": "Sangat terang, selalu terbakar, tidak pernah tan. Perlindungan matahari tertinggi diperlukan.",
      "Type II": "Terang, biasanya terbakar, tan minimal. Perlindungan matahari tinggi diperlukan.",
      "Type III": "Medium, kadang terbakar, tan bertahap. Perlindungan matahari moderat diperlukan.",
      "Type IV": "Olive, jarang terbakar, tan mudah. Perlindungan matahari moderat diperlukan.",
      "Type V": "Coklat, sangat jarang terbakar, tan sangat mudah. Tetap butuh perlindungan matahari.",
      "Type VI": "Coklat gelap/hitam, tidak pernah terbakar, berpigmen dalam. Tetap butuh perlindungan matahari."
    },
    recommendations: [
      "Semua warna kulit butuh sunscreen (melanin tidak cukup untuk perlindungan)",
      "Warna gelap: Cari formula tanpa white cast",
      "Warna terang: SPF lebih tinggi, aplikasi ulang lebih sering",
      "Semua warna: Perlindungan broad-spectrum esensial",
      "Warna gelap: Lebih rentan hiperpigmentasi, gunakan bahan brightening",
      "Warna terang: Lebih rentan kemerahan, gunakan bahan menenangkan"
    ]
  },

  undertone: {
    title: "Analisis Undertone Kulit",
    description: "Identifikasi nuansa halus di bawah permukaan kulit yang mempengaruhi bagaimana warna terlihat pada Anda.",
    whatItMeans: {
      Warm: "Undertone kuning, peach, atau emas. Pembuluh darah tampak kehijauan. Perhiasan emas lebih cocok.",
      Cool: "Undertone pink, merah, atau kebiruan. Pembuluh darah tampak kebiruan. Perhiasan perak lebih cocok.",
      Neutral: "Campuran seimbang warm dan cool. Pembuluh darah tampak biru-hijau. Emas dan perak sama-sama cocok."
    },
    recommendations: [
      "Pilih shade makeup yang sesuai undertone Anda",
      "Warm: Foundation berbasis kuning, blush peach",
      "Cool: Foundation berbasis pink, blush rosy",
      "Neutral: Kebanyakan shade cocok, beruntung!",
      "Ini tidak berubah dengan tan",
      "Membantu memilih warna pakaian juga"
    ]
  }
};

export default metricExplanations;
