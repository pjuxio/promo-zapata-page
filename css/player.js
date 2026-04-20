// Audio Player Functionality
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navVolumeBtn = document.getElementById('navVolumeBtn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.querySelector('.current-time');
const trackTitle = document.querySelector('.track-title');
const trackItems = document.querySelectorAll('.track-item');

let currentTrackIndex = 0;
const tracks = Array.from(trackItems).map(item => ({
  src: item.dataset.src,
  name: item.querySelector('.track-name').textContent,
  duration: parseInt(item.dataset.duration)
}));

// Initialize first track
audio.src = tracks[currentTrackIndex].src;

// Format time
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update track info
function updateTrackInfo() {
  trackTitle.textContent = tracks[currentTrackIndex].name;
  
  // Update active state in playlist
  trackItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentTrackIndex);
  });
}

// Play/Pause
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.classList.add('playing');
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
    `;
  } else {
    audio.pause();
    playBtn.classList.remove('playing');
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
  }
});

// Previous track
prevBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack();
});

// Next track
nextBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack();
});

// Load track
function loadTrack() {
  const wasPlaying = !audio.paused;
  audio.src = tracks[currentTrackIndex].src;
  updateTrackInfo();
  
  if (wasPlaying) {
    audio.play();
  }
}

// Playlist click
trackItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentTrackIndex = index;
    loadTrack();
    audio.play();
    playBtn.classList.add('playing');
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
    `;
  });
});

// Update time
audio.addEventListener('timeupdate', () => {
  const duration = tracks[currentTrackIndex].duration;
  const progress = (audio.currentTime / duration) * 100;
  progressFill.style.width = `${progress}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});


// Seek
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const duration = tracks[currentTrackIndex].duration;
  audio.currentTime = percent * duration;
});

// Auto play next
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack();
  audio.play();
});

// Volume button — drag up/down to adjust, click to mute
let volDragActive = false;
let volDragStartY = 0;
let volDragStartVolume = 1;
let volDragMoved = false;

const volumeIcons = {
  muted: 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  low: 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z',
  high: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
};

function updateVolumeIcon() {
  const muted = audio.muted || audio.volume === 0;
  const path = muted ? volumeIcons.muted : audio.volume < 0.5 ? volumeIcons.low : volumeIcons.high;
  navVolumeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="${path}"/></svg>`;
  navVolumeBtn.classList.toggle('muted', muted);
}

navVolumeBtn.addEventListener('mousedown', (e) => {
  volDragActive = true;
  volDragMoved = false;
  volDragStartY = e.clientY;
  volDragStartVolume = audio.muted ? 0 : audio.volume;
  e.preventDefault();
});

navVolumeBtn.addEventListener('touchstart', (e) => {
  volDragActive = true;
  volDragMoved = false;
  volDragStartY = e.touches[0].clientY;
  volDragStartVolume = audio.muted ? 0 : audio.volume;
  e.preventDefault();
}, { passive: false });

document.addEventListener('mousemove', (e) => {
  if (!volDragActive) return;
  const delta = volDragStartY - e.clientY;
  if (Math.abs(delta) > 4) volDragMoved = true;
  const newVol = Math.max(0, Math.min(1, volDragStartVolume + delta / 120));
  audio.volume = newVol;
  audio.muted = newVol === 0;
  updateVolumeIcon();
});

document.addEventListener('touchmove', (e) => {
  if (!volDragActive) return;
  const delta = volDragStartY - e.touches[0].clientY;
  if (Math.abs(delta) > 4) volDragMoved = true;
  const newVol = Math.max(0, Math.min(1, volDragStartVolume + delta / 120));
  audio.volume = newVol;
  audio.muted = newVol === 0;
  updateVolumeIcon();
}, { passive: true });

document.addEventListener('mouseup', () => { volDragActive = false; });
document.addEventListener('touchend', () => { volDragActive = false; });

navVolumeBtn.addEventListener('click', () => {
  if (volDragMoved) return;
  audio.muted = !audio.muted;
  updateVolumeIcon();
});

// Navbar toggle
const navToggle = document.getElementById('navToggle');
const navbar = document.querySelector('.navbar');

navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navbar.classList.toggle('open');
});

document.querySelectorAll('.navbar-menu a').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) navbar.classList.remove('open');
});

// Active nav link on scroll
const navLinks = document.querySelectorAll('.navbar-menu a');
const navSections = Array.from(navLinks)
  .map(link => {
    const href = link.getAttribute('href');
    const id = href === '#' ? null : href.slice(1);
    const el = id ? document.getElementById(id) : null;
    return { link, el };
  });

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  let activeLink = navSections[0].link;

  for (const { link, el } of navSections) {
    if (el && el.offsetTop <= scrollY) activeLink = link;
  }

  navLinks.forEach(l => l.classList.toggle('active', l === activeLink));
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Initialize
audio.volume = 1;
updateVolumeIcon();
updateTrackInfo();
