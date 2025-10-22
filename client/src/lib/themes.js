
// Theme definitions
const themes = {
  scifi: {
    name: 'Sci-Fi',
    display: '#03030a',
    background: 'linear-gradient(to bottom, #08081c, #03030a)',
    text: {
      primary: '#00FF00',
      secondary: '#00FA9A',
      error: '#FF00FF',
      link: '#00FF00'
    },
    ui: {
      overlay: 'rgba(0,0,0,0.5)',
      border: '#00FF00'
    },
    space: {
      star: '#FFF6D5',
      starEmissive: '#FFD966',
      starLight: '#FFE08A',
      flare: '#00FFFF',
      moon: '#00FFFF',
      ring: '#FF00FF',
      starsColor: '#ffffff'
    },
    planets: [
      '#FF00FF', // Neon magenta
      '#00FFFF', // Neon cyan
      '#FF1493', // Deep pink
      '#00FF00', // Neon green
      '#FF69B4', // Hot pink
      '#1E90FF', // Dodger blue
      '#FFD700', // Gold
      '#FF4500', // Orange red
      '#9400D3'  // Violet
    ]
  },
  sepia: {
    name: 'Sepia',
    display: '#E8D7C3',
    background: 'linear-gradient(to bottom, #F5E6D3, #E8D7C3)', // Light sepia background
    text: {
      primary: '#4A3C28',  // Dark brown
      secondary: '#6B5D54', // Medium brown
      error: '#8B4513',    // Saddle brown
      link: '#4A3C28'      // Dark brown
    },
    ui: {
      overlay: 'rgba(245, 230, 211, 0.8)', // Light sepia overlay
      border: '#4A3C28'
    },
    space: {
      star: '#8B7355',      // Burlywood dark
      starEmissive: '#704214', // Dark brown
      starLight: '#8B6914',    // Darker goldenrod
      flare: '#A0826D',        // Tan
      moon: '#8B7355',         // Burlywood
      ring: '#6B4423',         // Dark brown
      starsColor: '#8B7355'    // Burlywood for stars
    },
    planets: [
      '#8B4513', // Saddle brown
      '#A0522D', // Sienna
      '#704214', // Dark brown
      '#8B7355', // Burlywood
      '#654321', // Dark brown
      '#8B6914', // Darker goldenrod
      '#A0826D', // Tan
      '#6B4423', // Dark brown
      '#8B7D6B'  // Light brown
    ]
  },
  navy: {
    name: 'Navy & White',
    display: '#0f1823',
    background: 'linear-gradient(to bottom, #1a2332, #0f1823)',
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      error: '#87CEEB',
      link: '#FFFFFF'
    },
    ui: {
      overlay: 'rgba(26, 35, 50, 0.8)',
      border: '#FFFFFF'
    },
    space: {
      star: '#FFFEFA',
      starEmissive: '#FFFFFF',
      starLight: '#FFFFFF',
      flare: '#87CEEB',
      moon: '#B0C4DE',
      ring: '#4682B4',
      starsColor: '#FFFFFF'
    },
    planets: [
      '#FFFFFF', // White
      '#F8F8FF', // Ghost white
      '#F0F8FF', // Alice blue
      '#F5F5F5', // White smoke
      '#FAFAFA', // Snow
      '#F0FFFF', // Azure
      '#FFF8DC', // Cornsilk
      '#FFFAF0', // Floral white
      '#FAF0E6'  // Linen
    ]
  }
};

export default themes;
