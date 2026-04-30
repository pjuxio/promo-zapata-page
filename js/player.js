// Audio Player Functionality
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navVolumeBtn = document.getElementById('navVolumeBtn');
const listenStartBtn = document.getElementById('listenStartBtn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.querySelector('.current-time');
const playbackStatusEl = document.getElementById('playbackStatus');
const trackTitle = document.querySelector('.track-title');
const trackItems = document.querySelectorAll('.track-item');
const signupForm = document.querySelector('.signup-form');

let currentTrackIndex = 0;
const tracks = Array.from(trackItems).map(item => ({
  src: item.dataset.src,
  name: item.querySelector('.track-name').textContent,
  duration: parseInt(item.dataset.duration)
}));

let isBuffering = false;

// Keep the first track selected in UI, but don't fetch audio until interaction.
function ensureCurrentTrackLoaded() {
  if (!audio.getAttribute('src')) {
    audio.src = tracks[currentTrackIndex].src;
  }
}

function getTrackDuration(index) {
  if (index === currentTrackIndex && Number.isFinite(audio.duration) && audio.duration > 0) {
    return audio.duration;
  }
  return tracks[index].duration;
}

function updateCurrentTimeDisplay(seconds) {
  currentTimeEl.textContent = formatTime(seconds);
}

function setPlaybackStatus(message = '') {
  if (!playbackStatusEl) return;
  playbackStatusEl.textContent = message;
}

function setBufferingState(buffering) {
  isBuffering = buffering;
  setPlaybackStatus(buffering ? 'Loading audio...' : '');
  updateCurrentTimeDisplay(audio.currentTime);
}

function setPlayState(playing) {
  playBtn.classList.toggle('playing', playing);
  playBtn.innerHTML = playing
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
}

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
  setPlaybackStatus('');
  
  // Update active state in playlist
  trackItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentTrackIndex);
  });
}

// Play/Pause
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    ensureCurrentTrackLoaded();
    setBufferingState(true);
    audio.play().then(() => setPlayState(true)).catch(() => setPlayState(false));
  } else {
    audio.pause();
    setPlayState(false);
  }
});

// Listen button in player header — start playing from current track
listenStartBtn.addEventListener('click', () => {
  ensureCurrentTrackLoaded();
  setBufferingState(true);
  audio.play().then(() => setPlayState(true)).catch(() => setPlayState(false));
});

// Previous track
prevBtn.addEventListener('click', () => {
  const shouldAutoplay = !audio.paused;
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(shouldAutoplay);
});

// Next track
nextBtn.addEventListener('click', () => {
  const shouldAutoplay = !audio.paused;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(shouldAutoplay);
});

// Load track
function loadTrack(autoplay = false) {
  audio.src = tracks[currentTrackIndex].src;
  updateTrackInfo();
  setBufferingState(false);

  if (autoplay) {
    setBufferingState(true);
    audio.play().then(() => setPlayState(true)).catch(() => setPlayState(false));
  }
}

// Playlist click
trackItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentTrackIndex = index;
    loadTrack(true);
  });
});

// Update time
audio.addEventListener('timeupdate', () => {
  const duration = getTrackDuration(currentTrackIndex);
  if (!Number.isFinite(duration) || duration <= 0) {
    updateCurrentTimeDisplay(audio.currentTime);
    return;
  }
  const progress = (audio.currentTime / duration) * 100;
  progressFill.style.width = `${progress}%`;
  updateCurrentTimeDisplay(audio.currentTime);
});


// Seek
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const duration = getTrackDuration(currentTrackIndex);
  if (!Number.isFinite(duration) || duration <= 0) return;
  audio.currentTime = percent * duration;
});

// Auto play next
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(true);
});

audio.addEventListener('loadstart', () => {
  setBufferingState(true);
});

audio.addEventListener('loadedmetadata', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    tracks[currentTrackIndex].duration = audio.duration;
  }
});

audio.addEventListener('playing', () => {
  setBufferingState(false);
  setPlayState(true);
});

audio.addEventListener('waiting', () => {
  if (!audio.paused) {
    setBufferingState(true);
  }
});

audio.addEventListener('canplay', () => {
  setBufferingState(false);
});

audio.addEventListener('error', () => {
  setBufferingState(false);
  setPlayState(false);
  setPlaybackStatus('Audio unavailable. Please try another track.');
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
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        const navOffset = navbar.offsetHeight + 12;
        const targetY = target.offsetTop - navOffset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    navbar.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) navbar.classList.remove('open');
});


// Poster modal
const posterModal = document.getElementById('posterModal');
const posterModalImg = document.getElementById('posterModalImg');
const posterModalClose = document.getElementById('posterModalClose');
let lastFocusedElement = null;

function openPosterModalFromImage(img) {
  if (!img || !posterModal || !posterModalImg) return;
  lastFocusedElement = document.activeElement;
  posterModalImg.src = img.src;
  posterModalImg.alt = img.alt;
  posterModal.hidden = false;
  document.body.style.overflow = 'hidden';
  posterModalClose.focus();
}

document.querySelectorAll('.poster-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    openPosterModalFromImage(img);
  });
});

document.querySelectorAll('.media-column img, .image-wrapper img, .album-art img, .full-width-image img').forEach(img => {
  if (img.closest('.poster-trigger')) return;
  img.addEventListener('click', () => {
    openPosterModalFromImage(img);
  });
});

function closeModal() {
  posterModal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

posterModalClose.addEventListener('click', closeModal);
posterModal.addEventListener('click', e => { if (e.target === posterModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !posterModal.hidden) closeModal(); });

// Email signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(signupForm);
    try {
      await fetch('/', { method: 'POST', body: new URLSearchParams(data) });
      signupForm.closest('.footer-signup').innerHTML =
        '<p class="signup-success">Thanks for signing up. We\'ll be in touch.</p>';
    } catch {
      signupForm.closest('.footer-signup').innerHTML =
        '<p class="signup-error">Something went wrong. Please try again later.</p>';
    }
  });
}

// Initialize
audio.volume = 1;
updateVolumeIcon();
updateTrackInfo();
updateCurrentTimeDisplay(0);
