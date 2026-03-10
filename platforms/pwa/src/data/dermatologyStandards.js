/**
 * Dermatology Standards - Medical-Grade Scoring System
 * Based on clinical dermatology research and professional guidelines
 */

export const DERMATOLOGY_STANDARDS = {
    acne: {
        name: 'Acne',
        unit: '',
        ranges: [
            { 
                min: 0, max: 20, 
                severity: 'Clear', 
                color: '#4ade80',
                description: 'No active acne lesions',
                medicalNote: 'Skin is clear with no visible comedones, papules, or pustules'
            },
            { 
                min: 21, max: 40, 
                severity: 'Mild', 
                color: '#fbbf24',
                description: 'Few comedones or papules',
                medicalNote: 'Less than 10 non-inflammatory lesions (blackheads/whiteheads) or few inflammatory papules'
            },
            { 
                min: 41, max: 60, 
                severity: 'Moderate', 
                color: '#fb923c',
                description: 'Multiple lesions present',
                medicalNote: '10-40 comedones and/or inflammatory lesions (papules and pustules)'
            },
            { 
                min: 61, max: 80, 
                severity: 'Severe', 
                color: '#ef4444',
                description: 'Many inflammatory lesions',
                medicalNote: 'More than 40 inflammatory lesions, possible nodules'
            },
            { 
                min: 81, max: 100, 
                severity: 'Very Severe', 
                color: '#991b1b',
                description: 'Cystic acne with scarring',
                medicalNote: 'Widespread nodules and cysts, active scarring, requires immediate medical attention'
            }
        ],
        recommendations: {
            'Clear': [
                'Maintain current skincare routine',
                'Use non-comedogenic products',
                'Gentle cleansing twice daily',
                'SPF 30+ sunscreen daily'
            ],
            'Mild': [
                'Salicylic acid cleanser (2%)',
                'Benzoyl peroxide spot treatment (2.5-5%)',
                'Non-comedogenic moisturizer',
                'Consider retinol for prevention'
            ],
            'Moderate': [
                'Consult dermatologist for prescription treatment',
                'Topical retinoids (tretinoin, adapalene)',
                'Benzoyl peroxide + antibiotic combination',
                'Oral antibiotics may be needed'
            ],
            'Severe': [
                'Immediate dermatologist consultation required',
                'Oral isotretinoin (Accutane) may be necessary',
                'Combination topical + oral therapy',
                'Regular monitoring for side effects'
            ],
            'Very Severe': [
                'Urgent dermatologist visit required',
                'Systemic treatment mandatory',
                'Isotretinoin therapy likely needed',
                'Scar prevention and treatment plan'
            ]
        }
    },

    wrinkles: {
        name: 'Wrinkles',
        unit: '',
        ranges: [
            { 
                min: 0, max: 20, 
                severity: 'Youthful', 
                color: '#4ade80',
                description: 'No visible wrinkles',
                medicalNote: 'Smooth skin with no fine lines or wrinkles at rest or with expression'
            },
            { 
                min: 21, max: 40, 
                severity: 'Early Signs', 
                color: '#fbbf24',
                description: 'Fine lines when smiling',
                medicalNote: 'Dynamic wrinkles visible only with facial expressions, no static lines'
            },
            { 
                min: 41, max: 60, 
                severity: 'Moderate', 
                color: '#fb923c',
                description: 'Visible lines at rest',
                medicalNote: 'Static wrinkles visible at rest, moderate depth, primarily in expression areas'
            },
            { 
                min: 61, max: 80, 
                severity: 'Advanced', 
                color: '#ef4444',
                description: 'Deep wrinkles and folds',
                medicalNote: 'Deep static wrinkles, nasolabial folds prominent, skin laxity present'
            },
            { 
                min: 81, max: 100, 
                severity: 'Severe', 
                color: '#991b1b',
                description: 'Very deep wrinkles',
                medicalNote: 'Severe rhytides, significant skin laxity, advanced photoaging'
            }
        ],
        recommendations: {
            'Youthful': [
                'Daily SPF 50+ sunscreen (prevention)',
                'Antioxidant serum (Vitamin C, E)',
                'Retinol 0.25-0.5% (preventive)',
                'Hydrating moisturizer'
            ],
            'Early Signs': [
                'Prescription retinoid (tretinoin 0.025%)',
                'Peptide serum',
                'Vitamin C serum (L-ascorbic acid)',
                'Consider preventive Botox'
            ],
            'Moderate': [
                'Prescription retinoid (tretinoin 0.05-0.1%)',
                'Botox for dynamic wrinkles',
                'Dermal fillers for volume loss',
                'Chemical peels or laser treatments'
            ],
            'Advanced': [
                'Dermatologist/cosmetic consultation',
                'Combination injectable treatments',
                'Laser resurfacing (CO2, Fraxel)',
                'Radiofrequency or ultrasound therapy'
            ],
            'Severe': [
                'Comprehensive cosmetic dermatology plan',
                'Surgical options (facelift, brow lift)',
                'Aggressive laser treatments',
                'Combination of multiple modalities'
            ]
        }
    },

    pores: {
        name: 'Pores',
        unit: '/cm²',
        ranges: [
            { 
                min: 0, max: 50, 
                severity: 'Refined', 
                color: '#4ade80',
                description: 'Barely visible pores',
                medicalNote: 'Pores are minimally visible, smooth skin texture'
            },
            { 
                min: 51, max: 100, 
                severity: 'Normal', 
                color: '#a3e635',
                description: 'Normal pore size',
                medicalNote: 'Pores visible but not enlarged, normal for skin type'
            },
            { 
                min: 101, max: 150, 
                severity: 'Enlarged', 
                color: '#fbbf24',
                description: 'Visibly enlarged pores',
                medicalNote: 'Pores noticeably enlarged, especially in T-zone'
            },
            { 
                min: 151, max: 200, 
                severity: 'Very Enlarged', 
                color: '#fb923c',
                description: 'Significantly enlarged',
                medicalNote: 'Pores significantly dilated, rough texture, possible sebaceous hyperplasia'
            },
            { 
                min: 201, max: 500, 
                severity: 'Severely Enlarged', 
                color: '#ef4444',
                description: 'Extremely enlarged pores',
                medicalNote: 'Severely dilated pores, significant texture issues, may indicate chronic sun damage'
            }
        ],
        recommendations: {
            'Refined': [
                'Maintain with gentle cleansing',
                'Light exfoliation 1-2x weekly',
                'Oil-free moisturizer',
                'Daily sunscreen'
            ],
            'Normal': [
                'Regular cleansing routine',
                'Niacinamide serum (pore-refining)',
                'Clay mask 1x weekly',
                'Non-comedogenic products'
            ],
            'Enlarged': [
                'Salicylic acid cleanser (2%)',
                'Niacinamide 10% serum',
                'Retinol/retinoid treatment',
                'Professional chemical peels'
            ],
            'Very Enlarged': [
                'Prescription retinoid',
                'Professional treatments (microneedling)',
                'Laser therapy (Fraxel, CO2)',
                'Dermatologist consultation'
            ],
            'Severely Enlarged': [
                'Dermatologist evaluation required',
                'Aggressive retinoid therapy',
                'Laser resurfacing treatments',
                'Possible sebaceous hyperplasia treatment'
            ]
        }
    },

    pigmentation: {
        name: 'Pigmentation',
        unit: '',
        ranges: [
            { 
                min: 0, max: 30, 
                severity: 'Even', 
                color: '#4ade80',
                description: 'Uniform skin tone',
                medicalNote: 'No hyperpigmentation, even melanin distribution'
            },
            { 
                min: 31, max: 50, 
                severity: 'Mild', 
                color: '#fbbf24',
                description: 'Slight unevenness',
                medicalNote: 'Minor hyperpigmentation, few small spots or patches'
            },
            { 
                min: 51, max: 70, 
                severity: 'Moderate', 
                color: '#fb923c',
                description: 'Visible dark spots',
                medicalNote: 'Multiple areas of hyperpigmentation, sun spots, or melasma patches'
            },
            { 
                min: 71, max: 90, 
                severity: 'Severe', 
                color: '#ef4444',
                description: 'Significant pigmentation',
                medicalNote: 'Extensive hyperpigmentation, large melasma patches, post-inflammatory hyperpigmentation'
            },
            { 
                min: 91, max: 100, 
                severity: 'Very Severe', 
                color: '#991b1b',
                description: 'Extensive pigmentation',
                medicalNote: 'Widespread severe hyperpigmentation, may indicate underlying condition'
            }
        ],
        recommendations: {
            'Even': [
                'Daily SPF 50+ (prevention)',
                'Antioxidant serum',
                'Vitamin C for brightness',
                'Maintain current routine'
            ],
            'Mild': [
                'Vitamin C serum (15-20%)',
                'Niacinamide 5-10%',
                'Alpha arbutin',
                'Strict sun protection'
            ],
            'Moderate': [
                'Hydroquinone 2-4% (prescription)',
                'Tretinoin + hydroquinone combination',
                'Tranexamic acid',
                'Chemical peels (glycolic, lactic)'
            ],
            'Severe': [
                'Dermatologist consultation required',
                'Prescription triple combination cream',
                'Laser treatments (Q-switched, IPL)',
                'Oral tranexamic acid'
            ],
            'Very Severe': [
                'Comprehensive dermatology evaluation',
                'Rule out underlying conditions',
                'Aggressive combination therapy',
                'Multiple laser treatment sessions'
            ]
        }
    },

    hydration: {
        name: 'Hydration',
        unit: '%',
        ranges: [
            { 
                min: 0, max: 30, 
                severity: 'Very Dry', 
                color: '#991b1b',
                description: 'Severely dehydrated',
                medicalNote: 'Severe transepidermal water loss, compromised barrier function'
            },
            { 
                min: 31, max: 50, 
                severity: 'Dry', 
                color: '#fb923c',
                description: 'Needs moisture',
                medicalNote: 'Low hydration levels, visible dryness, possible flaking'
            },
            { 
                min: 51, max: 70, 
                severity: 'Normal', 
                color: '#fbbf24',
                description: 'Balanced hydration',
                medicalNote: 'Adequate hydration, normal barrier function'
            },
            { 
                min: 71, max: 85, 
                severity: 'Well-Hydrated', 
                color: '#a3e635',
                description: 'Healthy moisture',
                medicalNote: 'Good hydration levels, healthy skin barrier'
            },
            { 
                min: 86, max: 100, 
                severity: 'Optimal', 
                color: '#4ade80',
                description: 'Perfectly hydrated',
                medicalNote: 'Optimal hydration, excellent barrier function, plump skin'
            }
        ],
        recommendations: {
            'Very Dry': [
                'Rich emollient moisturizer',
                'Hyaluronic acid serum',
                'Ceramide-based products',
                'Avoid harsh cleansers'
            ],
            'Dry': [
                'Hydrating cleanser',
                'Hyaluronic acid + glycerin',
                'Occlusive moisturizer at night',
                'Humidifier in bedroom'
            ],
            'Normal': [
                'Maintain current routine',
                'Light moisturizer',
                'Hyaluronic acid serum',
                'Drink adequate water'
            ],
            'Well-Hydrated': [
                'Continue current regimen',
                'Lightweight hydration',
                'Antioxidant protection',
                'Maintain lifestyle habits'
            ],
            'Optimal': [
                'Maintain excellent routine',
                'Focus on prevention',
                'Antioxidant serums',
                'Continue healthy habits'
            ]
        }
    },

    redness: {
        name: 'Redness',
        unit: '',
        ranges: [
            { 
                min: 0, max: 20, 
                severity: 'Calm', 
                color: '#4ade80',
                description: 'No redness',
                medicalNote: 'No erythema, normal skin tone'
            },
            { 
                min: 21, max: 40, 
                severity: 'Mild', 
                color: '#fbbf24',
                description: 'Slight sensitivity',
                medicalNote: 'Mild erythema, possible sensitivity'
            },
            { 
                min: 41, max: 60, 
                severity: 'Moderate', 
                color: '#fb923c',
                description: 'Visible irritation',
                medicalNote: 'Moderate erythema, visible redness, possible rosacea'
            },
            { 
                min: 61, max: 80, 
                severity: 'Severe', 
                color: '#ef4444',
                description: 'Inflamed skin',
                medicalNote: 'Severe erythema, inflammation, possible rosacea or dermatitis'
            },
            { 
                min: 81, max: 100, 
                severity: 'Very Severe', 
                color: '#991b1b',
                description: 'Highly inflamed',
                medicalNote: 'Severe inflammation, possible rosacea subtype 2-3, requires medical attention'
            }
        ],
        recommendations: {
            'Calm': [
                'Gentle skincare routine',
                'Mineral sunscreen',
                'Antioxidant protection',
                'Avoid irritants'
            ],
            'Mild': [
                'Gentle, fragrance-free products',
                'Niacinamide (anti-inflammatory)',
                'Centella asiatica (cica)',
                'Avoid hot water and triggers'
            ],
            'Moderate': [
                'Dermatologist consultation',
                'Azelaic acid 10-20%',
                'Metronidazole gel (prescription)',
                'Avoid triggers (alcohol, spicy food)'
            ],
            'Severe': [
                'Dermatologist evaluation required',
                'Prescription treatments (metronidazole, ivermectin)',
                'Oral antibiotics (doxycycline)',
                'Laser therapy (IPL, PDL)'
            ],
            'Very Severe': [
                'Immediate dermatologist consultation',
                'Systemic treatment required',
                'Oral isotretinoin for severe rosacea',
                'Comprehensive trigger management'
            ]
        }
    },

    oiliness: {
        name: 'Oiliness',
        unit: '',
        ranges: [
            { 
                min: 0, max: 30, 
                severity: 'Dry', 
                color: '#fb923c',
                description: 'Low sebum production',
                medicalNote: 'Insufficient sebum production, possible barrier dysfunction'
            },
            { 
                min: 31, max: 50, 
                severity: 'Normal', 
                color: '#4ade80',
                description: 'Balanced sebum',
                medicalNote: 'Normal sebaceous gland activity, balanced oil production'
            },
            { 
                min: 51, max: 70, 
                severity: 'Slightly Oily', 
                color: '#fbbf24',
                description: 'T-zone shine',
                medicalNote: 'Mild seborrhea, primarily in T-zone'
            },
            { 
                min: 71, max: 85, 
                severity: 'Oily', 
                color: '#fb923c',
                description: 'Visible shine',
                medicalNote: 'Increased sebaceous activity, visible shine throughout day'
            },
            { 
                min: 86, max: 100, 
                severity: 'Very Oily', 
                color: '#ef4444',
                description: 'Excessive sebum',
                medicalNote: 'Seborrhea, excessive oil production, may contribute to acne'
            }
        ],
        recommendations: {
            'Dry': [
                'Gentle oil-based cleanser',
                'Rich moisturizer',
                'Facial oils (squalane, jojoba)',
                'Avoid harsh products'
            ],
            'Normal': [
                'Balanced cleanser',
                'Light moisturizer',
                'Maintain current routine',
                'Niacinamide for regulation'
            ],
            'Slightly Oily': [
                'Gel cleanser',
                'Niacinamide serum (sebum control)',
                'Oil-free moisturizer',
                'Blotting papers as needed'
            ],
            'Oily': [
                'Salicylic acid cleanser',
                'Niacinamide 10%',
                'Clay mask 2x weekly',
                'Mattifying products'
            ],
            'Very Oily': [
                'Benzoyl peroxide or salicylic acid',
                'Prescription retinoid',
                'Oil-control treatments',
                'Dermatologist for severe cases'
            ]
        }
    },

    uvDamage: {
        name: 'UV Damage',
        unit: '',
        ranges: [
            { 
                min: 0, max: 20, 
                severity: 'Protected', 
                color: '#4ade80',
                description: 'No sun damage',
                medicalNote: 'No signs of photoaging or UV damage'
            },
            { 
                min: 21, max: 40, 
                severity: 'Mild', 
                color: '#fbbf24',
                description: 'Early sun damage',
                medicalNote: 'Early signs of photoaging, few lentigines'
            },
            { 
                min: 41, max: 60, 
                severity: 'Moderate', 
                color: '#fb923c',
                description: 'Visible sun damage',
                medicalNote: 'Moderate photoaging, solar lentigines, some texture changes'
            },
            { 
                min: 61, max: 80, 
                severity: 'Severe', 
                color: '#ef4444',
                description: 'Significant photoaging',
                medicalNote: 'Severe photoaging, multiple solar lentigines, texture changes, possible actinic keratoses'
            },
            { 
                min: 81, max: 100, 
                severity: 'Very Severe', 
                color: '#991b1b',
                description: 'Extensive sun damage',
                medicalNote: 'Extensive photoaging, requires dermatologist evaluation for pre-cancerous lesions'
            }
        ],
        recommendations: {
            'Protected': [
                'Continue SPF 50+ daily',
                'Antioxidant serums',
                'Preventive care',
                'Regular skin checks'
            ],
            'Mild': [
                'Strict SPF 50+ daily',
                'Vitamin C serum',
                'Retinol for repair',
                'Avoid peak sun hours'
            ],
            'Moderate': [
                'SPF 50+ + reapplication',
                'Prescription retinoid',
                'Chemical peels',
                'Laser treatments (IPL)'
            ],
            'Severe': [
                'Dermatologist evaluation',
                'Aggressive retinoid therapy',
                'Laser resurfacing',
                'Screen for skin cancer'
            ],
            'Very Severe': [
                'Immediate dermatologist consultation',
                'Skin cancer screening',
                'Comprehensive photoaging treatment',
                'Strict sun avoidance'
            ]
        }
    }
};

/**
 * Get severity information for a metric
 * @param {string} metricType - Type of metric (acne, wrinkles, etc.)
 * @param {number} score - Score value
 * @returns {object} Severity info with color, description, recommendations
 */
export const getSeverityInfo = (metricType, score) => {
    const standards = DERMATOLOGY_STANDARDS[metricType];
    if (!standards) {
        console.warn(`No standards found for metric: ${metricType}`);
        return null;
    }
    
    const range = standards.ranges.find(r => score >= r.min && score <= r.max);
    if (!range) {
        console.warn(`Score ${score} out of range for ${metricType}`);
        return standards.ranges[standards.ranges.length - 1]; // Return last range as fallback
    }
    
    return {
        ...range,
        recommendations: standards.recommendations[range.severity] || [],
        unit: standards.unit
    };
};

/**
 * Get color for severity level
 * @param {string} severity - Severity level
 * @returns {string} Hex color code
 */
export const getSeverityColor = (severity) => {
    const colorMap = {
        'Clear': '#4ade80',
        'Youthful': '#4ade80',
        'Refined': '#4ade80',
        'Even': '#4ade80',
        'Optimal': '#4ade80',
        'Calm': '#4ade80',
        'Protected': '#4ade80',
        'Normal': '#a3e635',
        'Well-Hydrated': '#a3e635',
        'Mild': '#fbbf24',
        'Early Signs': '#fbbf24',
        'Enlarged': '#fbbf24',
        'Slightly Oily': '#fbbf24',
        'Moderate': '#fb923c',
        'Very Enlarged': '#fb923c',
        'Dry': '#fb923c',
        'Oily': '#fb923c',
        'Severe': '#ef4444',
        'Advanced': '#ef4444',
        'Very Oily': '#ef4444',
        'Very Severe': '#991b1b',
        'Severely Enlarged': '#991b1b',
        'Very Dry': '#991b1b'
    };
    
    return colorMap[severity] || '#9ca3af';
};

export default {
    DERMATOLOGY_STANDARDS,
    getSeverityInfo,
    getSeverityColor
};
