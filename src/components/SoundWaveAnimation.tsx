'use client';

interface SoundWaveAnimationProps {
  isActive: boolean;
}

const SoundWaveAnimation = ({ isActive }: SoundWaveAnimationProps) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="sound-wave-container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    }}>
      <svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        style={{ overflow: 'visible' }}
      >
        {/* Animated sound wave bars */}
        <rect 
          x="20" 
          y="30" 
          width="8" 
          height="60" 
          fill="#000" 
          rx="4"
          className="sound-bar"
          style={{ 
            animation: 'soundWave 1.2s ease-in-out infinite',
            animationDelay: '0s'
          }}
        />
        <rect 
          x="36" 
          y="20" 
          width="8" 
          height="80" 
          fill="#000" 
          rx="4"
          className="sound-bar"
          style={{ 
            animation: 'soundWave 1.2s ease-in-out infinite',
            animationDelay: '0.15s'
          }}
        />
        <rect 
          x="52" 
          y="25" 
          width="8" 
          height="70" 
          fill="#000" 
          rx="4"
          className="sound-bar"
          style={{ 
            animation: 'soundWave 1.2s ease-in-out infinite',
            animationDelay: '0.3s'
          }}
        />
        <rect 
          x="68" 
          y="15" 
          width="8" 
          height="90" 
          fill="#000" 
          rx="4"
          className="sound-bar"
          style={{ 
            animation: 'soundWave 1.2s ease-in-out infinite',
            animationDelay: '0.45s'
          }}
        />
        <rect 
          x="84" 
          y="30" 
          width="8" 
          height="60" 
          fill="#000" 
          rx="4"
          className="sound-bar"
          style={{ 
            animation: 'soundWave 1.2s ease-in-out infinite',
            animationDelay: '0.6s'
          }}
        />
      </svg>
    </div>
  );
};

export default SoundWaveAnimation;

