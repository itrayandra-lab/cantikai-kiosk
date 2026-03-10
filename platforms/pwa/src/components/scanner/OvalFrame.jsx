/**
 * Soft Oval Frame Guide Component - VERY BIG to match face tracker
 * Provides visual guide for face positioning without blocking the face
 */
const OvalFrame = ({ isOptimal }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '92%',  // Increased from 85% - VERY BIG
            maxWidth: '480px',  // Increased from 400px - VERY BIG
            aspectRatio: '3/4',
            pointerEvents: 'none', 
            zIndex: 3,
            border: `2px solid ${isOptimal ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 190, 215, 0.4)'}`,
            borderRadius: '50%',
            boxShadow: isOptimal 
                ? '0 0 30px rgba(255, 255, 255, 0.25), inset 0 0 30px rgba(255, 255, 255, 0.1)' 
                : '0 0 20px rgba(255, 190, 215, 0.2), inset 0 0 20px rgba(255, 190, 215, 0.05)',
            transition: 'all 0.3s ease'
        }}>
            {/* Top corner guides */}
            <div style={{ 
                position: 'absolute', 
                top: '-2px', 
                left: '15%', 
                width: '20%', 
                height: '2px', 
                background: isOptimal ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 190, 215, 0.5)',
                transition: 'all 0.3s'
            }} />
            <div style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '15%', 
                width: '20%', 
                height: '2px', 
                background: isOptimal ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 190, 215, 0.5)',
                transition: 'all 0.3s'
            }} />
            
            {/* Bottom corner guides */}
            <div style={{ 
                position: 'absolute', 
                bottom: '-2px', 
                left: '15%', 
                width: '20%', 
                height: '2px', 
                background: isOptimal ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 190, 215, 0.5)',
                transition: 'all 0.3s'
            }} />
            <div style={{ 
                position: 'absolute', 
                bottom: '-2px', 
                right: '15%', 
                width: '20%', 
                height: '2px', 
                background: isOptimal ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 190, 215, 0.5)',
                transition: 'all 0.3s'
            }} />
            
            {/* Center crosshair - very subtle */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                border: `1px solid ${isOptimal ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 190, 215, 0.25)'}`,
                borderRadius: '50%',
                transition: 'all 0.3s'
            }} />
        </div>
    );
};

export default OvalFrame;
