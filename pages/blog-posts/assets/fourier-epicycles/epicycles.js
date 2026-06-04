// Albanian Eagle path data is loaded from path_data.js
// Function getAlbanianEaglePath() is defined in path_data.js

// Discrete Fourier Transform with both positive and negative frequencies
function computeDFT(points) {
  const X = [];
  const N = points.length;

  // Compute for both positive and negative frequencies
  // Range from -N/2 to N/2 (similar to frequencies -50:50 in the R code)
  const maxFreq = Math.floor(N / 2);

  for (let k = -maxFreq; k <= maxFreq; k++) {
    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {
      const phi = (Math.PI * 2 * k * n) / N;
      const x = points[n][0];
      const y = points[n][1];

      // Complex multiplication: (x + iy) * e^(-i*phi)
      re += x * Math.cos(phi) + y * Math.sin(phi);
      im += -x * Math.sin(phi) + y * Math.cos(phi);
    }

    re = re / N;
    im = im / N;

    const freq = k;
    const amp = Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);

    X.push({ re, im, freq, amp, phase });
  }

  // Sort by amplitude (larger circles first for better visualization)
  X.sort((a, b) => b.amp - a.amp);

  return X;
}

// Animation State
let canvas, ctx;
let fourierCoefficients;
let originalPath;
let time = 0;
let isPlaying = true;
let maxEpicycles = 150;
let pathHistory = [];
const dt = 0.0015; // Time step (slower animation)
let fillDuration = 0; // How long to show the filled eagle
const scale = 2.5; // Scale factor to make the drawing bigger

// Initialize
function init() {
  canvas = document.getElementById("epicyclesCanvas");
  ctx = canvas.getContext("2d");

  // Get the original path
  originalPath = getAlbanianEaglePath();

  // Compute Fourier coefficients
  fourierCoefficients = computeDFT(originalPath);

  // Center the canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Set up controls
  setupControls();

  // Start animation
  animate();
}

function setupControls() {
  const slider = document.getElementById("epicycles");
  const sliderValue = document.getElementById("epicyclesValue");
  const playPauseBtn = document.getElementById("playPause");
  const resetBtn = document.getElementById("reset");

  slider.addEventListener("input", (e) => {
    maxEpicycles = parseInt(e.target.value);
    sliderValue.textContent = maxEpicycles;
    pathHistory = [];
  });

  playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
  });

  resetBtn.addEventListener("click", () => {
    time = 0;
    pathHistory = [];
  });
}

// Drawing function
function drawEpicycles(x, y, rotation, coeffs, numCircles) {
  let currentX = x;
  let currentY = y;

  for (let i = 0; i < Math.min(numCircles, coeffs.length); i++) {
    const prevX = currentX;
    const prevY = currentY;

    const freq = coeffs[i].freq;
    const radius = coeffs[i].amp * scale;
    const phase = coeffs[i].phase;
    const angle = freq * rotation + phase;

    currentX += radius * Math.cos(angle);
    currentY += radius * Math.sin(angle);

    // Draw circle
    ctx.beginPath();
    ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw radius line
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = "rgba(0, 102, 204, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw point at end of radius
    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 102, 204, 0.9)";
    ctx.fill();
  }

  return { x: currentX, y: currentY };
}

// Animation loop
function animate() {
  // Clear canvas with red background (Albanian flag color - balanced red)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#ff8080";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);

  // Draw the original path (faint reference)
  ctx.beginPath();
  ctx.strokeStyle = "rgba(150, 150, 150, 0.2)";
  ctx.lineWidth = 2;
  for (let i = 0; i < originalPath.length; i++) {
    if (i === 0) {
      ctx.moveTo(originalPath[i][0] * scale, originalPath[i][1] * scale);
    } else {
      ctx.lineTo(originalPath[i][0] * scale, originalPath[i][1] * scale);
    }
  }
  ctx.closePath();
  ctx.stroke();

  // Draw epicycles
  const rotation = time * Math.PI * 2;
  const result = drawEpicycles(
    0,
    0,
    rotation,
    fourierCoefficients,
    maxEpicycles,
  );

  // Add current point to path history
  pathHistory.push({ x: result.x, y: result.y });

  // Draw the traced path in black (like Albanian flag)
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
  ctx.lineWidth = 3;
  for (let i = 0; i < pathHistory.length; i++) {
    if (i === 0) {
      ctx.moveTo(pathHistory[i].x, pathHistory[i].y);
    } else {
      ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
    }
  }
  ctx.stroke();

  // When path is complete, fill it in black for a moment (like the Albanian flag)
  if (time >= 0.99) {
    fillDuration++;
    if (fillDuration < 90) {
      // Show filled for about 1.5 seconds (90 frames at 60fps)
      ctx.beginPath();
      for (let i = 0; i < pathHistory.length; i++) {
        if (i === 0) {
          ctx.moveTo(pathHistory[i].x, pathHistory[i].y);
        } else {
          ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fill();
    }
  } else {
    fillDuration = 0;
  }

  // Draw current point
  ctx.beginPath();
  ctx.arc(result.x, result.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fill();

  // Update time
  if (isPlaying) {
    // Only advance time if we're not in the fill duration
    if (fillDuration === 0 || fillDuration >= 90) {
      time += dt;

      // Reset when complete and fill duration is done
      if (time > 1 && fillDuration >= 90) {
        time = 0;
        pathHistory = [];
        fillDuration = 0;
      }
    }
  }

  requestAnimationFrame(animate);
}

// Start when page loads
window.addEventListener("DOMContentLoaded", init);
