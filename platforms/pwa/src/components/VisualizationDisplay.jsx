import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Visualization Display Component - 15 MODES
 * Shows all 15 generated visualization modes
 * Features: Carousel navigation, Grid view, Download all, Individual download
 */
export default function VisualizationDisplay({ visualizationImage, originalImage }) {
    const [currentMode, setCurrentMode] = useState(0);
    const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'grid'

    // visualizationImage is now an array of 15 modes
    const visualizations = Array.isArray(visualizationImage) ? visualizationImage : [];

    if (visualizations.length === 0 && !originalImage) {
        return null;
    }

    // Navigation
    const nextMode = () => {
        setCurrentMode((prev) => (prev + 1) % visualizations.length);
    };

    const prevMode = () => {
        setCurrentMode((prev) => (prev - 1 + visualizations.length) % visualizations.length);
    };

    // Download single visualization
    const handleDownloadSingle = (viz, index) => {
        const link = document.createElement('a');
        link.href = viz.image;
        link.download = `cantik-ai-${viz.mode.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Download all visualizations
    const handleDownloadAll = () => {
        visualizations.forEach((viz, index) => {
            setTimeout(() => {
                handleDownloadSingle(viz, index);
            }, index * 500); // Stagger downloads
        });
    };

    return (
        <div className="visualization-display">
            <div className="visualization-header">
                <h3>📊 15-Mode Professional Skin Analysis</h3>
                <div className="controls">
                    <div className="view-toggle">
                        <button
                            className={viewMode === 'carousel' ? 'active' : ''}
                            onClick={() => setViewMode('carousel')}
                        >
                            🎠 Carousel
                        </button>
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                        >
                            📱 Grid
                        </button>
                    </div>
                    <button className="download-all-btn" onClick={handleDownloadAll}>
                        <Download size={18} />
                        Download All (15)
                    </button>
                </div>
            </div>

            {viewMode === 'carousel' && visualizations.length > 0 && (
                <div className="carousel-view">
                    <div className="carousel-container">
                        <button className="nav-btn prev" onClick={prevMode}>
                            <ChevronLeft size={32} />
                        </button>

                        <div className="carousel-content">
                            <div className="mode-info">
                                <h4>{visualizations[currentMode].mode}</h4>
                                <div className="score-badge" style={{ background: getScoreColor(visualizations[currentMode].score) }}>
                                    Score: {Math.round(visualizations[currentMode].score)}/100
                                </div>
                            </div>

                            <img
                                src={visualizations[currentMode].image}
                                alt={visualizations[currentMode].mode}
                                className="visualization-image"
                            />

                            <div className="mode-description">
                                <p>{visualizations[currentMode].description}</p>
                            </div>

                            <button
                                className="download-single-btn"
                                onClick={() => handleDownloadSingle(visualizations[currentMode], currentMode)}
                            >
                                <Download size={16} />
                                Download This Mode
                            </button>
                        </div>

                        <button className="nav-btn next" onClick={nextMode}>
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div className="carousel-indicators">
                        {visualizations.map((viz, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentMode ? 'active' : ''}`}
                                onClick={() => setCurrentMode(index)}
                                title={viz.mode}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mode-counter">
                        Mode {currentMode + 1} of {visualizations.length}
                    </div>
                </div>
            )}

            {viewMode === 'grid' && visualizations.length > 0 && (
                <div className="grid-view">
                    {visualizations.map((viz, index) => (
                        <div key={index} className="grid-item">
                            <div className="grid-item-header">
                                <h5>{viz.mode}</h5>
                                <span className="score-badge-small" style={{ background: getScoreColor(viz.score) }}>
                                    {Math.round(viz.score)}
                                </span>
                            </div>
                            <img
                                src={viz.image}
                                alt={viz.mode}
                                className="grid-image"
                                onClick={() => {
                                    setCurrentMode(index);
                                    setViewMode('carousel');
                                }}
                            />
                            <p className="grid-description">{viz.description}</p>
                            <button
                                className="download-grid-btn"
                                onClick={() => handleDownloadSingle(viz, index)}
                            >
                                <Download size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="visualization-legend">
                <h4>15 Analysis Modes:</h4>
                <div className="legend-grid">
                    <div className="legend-item">1. RGB Pores - Pore visibility</div>
                    <div className="legend-item">2. RGB Color Spot - Spot detection</div>
                    <div className="legend-item">3. RGB Texture - Texture analysis</div>
                    <div className="legend-item">4. PL Roughness - Surface roughness</div>
                    <div className="legend-item">5. UV Acne - Acne detection</div>
                    <div className="legend-item">6. UV Color Spot - UV spots</div>
                    <div className="legend-item">7. UV Roughness - UV surface</div>
                    <div className="legend-item">8. Skin Color Evenness - Tone uniformity</div>
                    <div className="legend-item">9. Brown Area - Pigmentation</div>
                    <div className="legend-item">10. UV Spot - UV damage</div>
                    <div className="legend-item">11. Skin Aging - Aging signs</div>
                    <div className="legend-item">12. Skin Whitening - Brightness</div>
                    <div className="legend-item">13. Wrinkles Map - Wrinkle detection</div>
                    <div className="legend-item">14. Redness Map - Redness distribution</div>
                    <div className="legend-item">15. Overall Analysis - Complete view</div>
                </div>
            </div>

            <style jsx>{`
                .visualization-display {
                    margin: 20px 0;
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .visualization-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .visualization-header h3 {
                    margin: 0;
                    font-size: 22px;
                    color: #333;
                }

                .controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .view-toggle {
                    display: flex;
                    gap: 5px;
                }

                .view-toggle button {
                    padding: 8px 16px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                }

                .view-toggle button.active {
                    background: #FF69B4;
                    color: white;
                    border-color: #FF69B4;
                }

                .download-all-btn {
                    padding: 8px 16px;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s;
                }

                .download-all-btn:hover {
                    background: #059669;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                /* CAROUSEL VIEW */
                .carousel-view {
                    position: relative;
                }

                .carousel-container {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .nav-btn {
                    background: #FF69B4;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }

                .nav-btn:hover {
                    background: #FF1493;
                    transform: scale(1.1);
                }

                .carousel-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .mode-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    justify-content: center;
                }

                .mode-info h4 {
                    margin: 0;
                    font-size: 24px;
                    color: #333;
                }

                .score-badge {
                    padding: 8px 16px;
                    border-radius: 20px;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }

                .visualization-image {
                    width: 100%;
                    max-width: 800px;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .mode-description {
                    text-align: center;
                    padding: 15px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    max-width: 600px;
                }

                .mode-description p {
                    margin: 0;
                    color: #555;
                    font-size: 14px;
                }

                .download-single-btn {
                    padding: 10px 20px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                }

                .download-single-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                }

                .carousel-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 20px;
                }

                .indicator {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #e0e0e0;
                    background: white;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .indicator.active {
                    background: #FF69B4;
                    color: white;
                    border-color: #FF69B4;
                    transform: scale(1.2);
                }

                .indicator:hover {
                    border-color: #FF69B4;
                }

                .mode-counter {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 16px;
                    color: #666;
                    font-weight: bold;
                }

                /* GRID VIEW */
                .grid-view {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .grid-item {
                    background: #f9f9f9;
                    border-radius: 12px;
                    padding: 15px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                    position: relative;
                }

                .grid-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                }

                .grid-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .grid-item-header h5 {
                    margin: 0;
                    font-size: 14px;
                    color: #333;
                }

                .score-badge-small {
                    padding: 4px 8px;
                    border-radius: 12px;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                }

                .grid-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .grid-image:hover {
                    transform: scale(1.05);
                }

                .grid-description {
                    margin: 10px 0;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.4;
                }

                .download-grid-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(16, 185, 129, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .download-grid-btn:hover {
                    background: #10b981;
                    transform: scale(1.1);
                }

                /* LEGEND */
                .visualization-legend {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f5f5f5;
                    border-radius: 8px;
                }

                .visualization-legend h4 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #333;
                }

                .legend-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 10px;
                }

                .legend-item {
                    padding: 8px 12px;
                    background: white;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #555;
                    border-left: 3px solid #FF69B4;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .visualization-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .controls {
                        width: 100%;
                        flex-direction: column;
                    }

                    .view-toggle {
                        width: 100%;
                    }

                    .view-toggle button {
                        flex: 1;
                    }

                    .download-all-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .carousel-container {
                        flex-direction: column;
                    }

                    .nav-btn {
                        width: 40px;
                        height: 40px;
                    }

                    .grid-view {
                        grid-template-columns: 1fr;
                    }

                    .legend-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

// Helper function to get score color
function getScoreColor(score) {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    if (score >= 40) return '#ef4444'; // Red
    return '#dc2626'; // Dark Red
}
