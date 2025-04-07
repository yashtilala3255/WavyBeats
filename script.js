document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('bi-moon');
      icon.classList.add('bi-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      icon.classList.remove('bi-sun');
      icon.classList.add('bi-moon');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Set initial theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.remove('bi-moon');
    themeToggle.querySelector('i').classList.add('bi-sun');
  }

  // Local songs configuration
  const songs = [
    {
      title: "Wavy",
      artist: "Karan Aujla",
      src: "song/first.mp3",
      cover: "covers/Wavy.jpg",
      duration: "2:41"
    },
    {
      title: "Dhoom Taana",
      artist: "None",
      src: "song/Dhoom Taana-yt.savetube.me.mp3",
      cover: "covers/dhoom.jpg",
      duration: "6:13"
    },
   
    {
      title: "Sanson Ki Mala",
      artist: "None",
      src: "song/Sanson Ki Mala-yt.savetube.me.mp3",
      cover: "covers/saso.jpg",
      duration: "4:45"
    },
    {
      title: "Tera Chehra",
      artist: "None",
      src: "song/Tera Chehra-yt.savetube.me.mp3",
      cover: "covers/tera.jpg",
      duration: "4:34"
    },
    {
      title: "Ye Tune Kiya",
      artist: "for U ..",
      src: "song/YE TUNE KYA KIYA-yt.savetube.me.mp3",
      cover: "covers/yetunekiya.jpg",
      duration: "5:14"
    },
    {
      title: "Wishes X Samjho Na",
      artist: "",
      src: "song/Wishes X Samjho Na-yt.savetube.me.mp3",
      cover: "covers/wisha.jpg",
      duration: "3:04"
    },
    {
      title: "O Rangerz",
      artist: "Apne Hi Rang Mai Rang De",
      src: "song/O Rangrez - Lyrical Video _ Bhaag Milkha Bhaag _ Farhan, Sonam _ Shreya Ghoshal, Javed Bashir-yt.savetube.me.mp3",
      cover: "covers/apnerang.jpg",
      duration: "6:25"
    },
    {
      title: "Mere Dholna 3.0",
      artist: " ",
      src: "song/Mere Dholna 3.0 (Sonu Nigam Version) (From _Bhool Bhulaiyaa 3_)-yt.savetube.me.mp3",
      cover: "covers/dhloa.jpg",
      duration: "4:26"
    },
    {
      title: "O Meri Laila",
      artist: " ",
      src: "song/O Meri Laila - Lyrical _ Laila Majnu _ Atif Aslam & Jyotica Tangri _ Avinash Tiwary & Tripti Dimri-yt.savetube.me.mp3",
      cover: "covers/laila.jpg",
      duration: "4:48"
    },
    {
      title: "Wishes X Samjho Na",
      artist: "",
      src: "song/Wishes X Samjho Na-yt.savetube.me.mp3",
      cover: "covers/wisha.jpg",
      duration: "3:04"
    },
  ];
  // Player elements
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const progress = document.getElementById('progress');
  const progressBar = document.querySelector('.progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const songTitle = document.getElementById('song-title');
  const artistEl = document.getElementById('artist');
  const albumArt = document.getElementById('album-art');
  const playlist = document.getElementById('playlist');
  const favoriteBtn = document.createElement('button'); // We'll add this dynamically
  
  // Now playing elements
  const nowPlayingImg = document.getElementById('now-playing-img');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingArtist = document.getElementById('now-playing-artist');
  const nowPlayingFavorite = document.getElementById('now-playing-favorite');
  const nowPlayingPlay = document.getElementById('now-playing-play');

  // Player state
  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Initialize player
  function initPlayer() {
    // Add favorite button to main controls (between next and repeat)
    const controls = document.querySelector('.controls');
    favoriteBtn.className = 'control-btn favorite';
    favoriteBtn.innerHTML = '<i class="bi bi-heart"></i>';
    favoriteBtn.id = 'favorite';
    controls.insertBefore(favoriteBtn, document.getElementById('repeat'));
    
    loadSong(currentSongIndex);
    renderPlaylist();
    updateFavoriteButton();
    
    // Set up event listeners
    setupEventListeners();
  }

  // Load song into player
  function loadSong(index) {
    const song = songs[index];
    songTitle.textContent = song.title;
    artistEl.textContent = song.artist;
    albumArt.src = song.cover;
    audio.src = song.src;
    durationEl.textContent = song.duration || '0:00';
    
    // Update now playing bar
    updateNowPlaying(song);
    
    // Update favorite button state
    updateFavoriteButton();
    
    // If song was playing, continue playing
    if (isPlaying) {
      audio.play().catch(e => console.error("Playback failed:", e));
    }
  }

  // Update now playing bar
  function updateNowPlaying(song) {
    nowPlayingImg.src = song.cover;
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
  }

  // Play song
  function playSong() {
    audio.play().then(() => {
      isPlaying = true;
      document.body.classList.add('playing');
      playBtn.querySelector('i').classList.remove('bi-play-fill');
      playBtn.querySelector('i').classList.add('bi-pause-fill');
      nowPlayingPlay.querySelector('i').classList.remove('bi-play-fill');
      nowPlayingPlay.querySelector('i').classList.add('bi-pause-fill');
    }).catch(e => {
      console.error("Playback failed:", e);
      alert("Could not play the song. Please check the file path.");
    });
  }

  // Pause song
  function pauseSong() {
    audio.pause();
    isPlaying = false;
    document.body.classList.remove('playing');
    playBtn.querySelector('i').classList.remove('bi-pause-fill');
    playBtn.querySelector('i').classList.add('bi-play-fill');
    nowPlayingPlay.querySelector('i').classList.remove('bi-pause-fill');
    nowPlayingPlay.querySelector('i').classList.add('bi-play-fill');
  }

  // Toggle play/pause
  function togglePlay() {
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  }

  // Previous song
  function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
    highlightCurrentSong();
  }

  // Next song
  function nextSong() {
    if (isShuffle) {
      currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
      currentSongIndex++;
      if (currentSongIndex > songs.length - 1) {
        if (isRepeat) {
          currentSongIndex = 0;
        } else {
          pauseSong();
          currentSongIndex = songs.length - 1;
          return;
        }
      }
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
    highlightCurrentSong();
  }

  // Update progress bar
  function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
    
    if (!isNaN(duration)) {
      durationEl.textContent = formatTime(duration);
    }
  }

  // Set progress bar
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  }

  // Format time (seconds to MM:SS)
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Render playlist
  function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
      const songItem = document.createElement('div');
      songItem.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
      
      // Add favorite icon to each playlist item
      const isFavorite = favorites.includes(song.title);
      const favoriteIcon = isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart';
      
      songItem.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div class="playlist-item-info">
          <div class="playlist-item-title">${song.title}</div>
          <div class="playlist-item-artist">${song.artist}</div>
        </div>
        <div class="playlist-item-actions">
          <button class="playlist-favorite-btn ${isFavorite ? 'active' : ''}" data-index="${index}">
            <i class="bi ${favoriteIcon}"></i>
          </button>
          <div class="playlist-item-duration">${song.duration || '0:00'}</div>
        </div>
      `;
      
      songItem.addEventListener('click', (e) => {
        // Don't change song if clicking on favorite button
        if (!e.target.closest('.playlist-favorite-btn')) {
          currentSongIndex = index;
          loadSong(currentSongIndex);
          playSong();
          highlightCurrentSong();
        }
      });
      
      playlist.appendChild(songItem);
    });
    
    // Add event listeners to playlist favorite buttons
    document.querySelectorAll('.playlist-favorite-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const index = parseInt(this.getAttribute('data-index'));
        toggleFavorite(index);
      });
    });
  }

  // Highlight current song in playlist
  function highlightCurrentSong() {
    const items = playlist.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      if (index === currentSongIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Toggle favorite
  function toggleFavorite(index = currentSongIndex) {
    const songTitle = songs[index].title;
    const favoriteIndex = favorites.indexOf(songTitle);
    
    if (favoriteIndex === -1) {
      favorites.push(songTitle);
    } else {
      favorites.splice(favoriteIndex, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton();
    
    // Update the favorite button in playlist if toggled from there
    if (index !== currentSongIndex) {
      const playlistBtn = document.querySelector(`.playlist-favorite-btn[data-index="${index}"]`);
      if (playlistBtn) {
        const isFavorite = favorites.includes(songTitle);
        playlistBtn.classList.toggle('active', isFavorite);
        const icon = playlistBtn.querySelector('i');
        icon.classList.toggle('bi-heart', !isFavorite);
        icon.classList.toggle('bi-heart-fill', isFavorite);
        icon.classList.toggle('text-danger', isFavorite);
      }
    }
  }

  // Update favorite button state
  function updateFavoriteButton() {
    const currentSong = songs[currentSongIndex].title;
    const isFavorite = favorites.includes(currentSong);
    
    // Update main favorite button
    favoriteBtn.classList.toggle('active', isFavorite);
    const favoriteIcon = favoriteBtn.querySelector('i');
    favoriteIcon.classList.toggle('bi-heart', !isFavorite);
    favoriteIcon.classList.toggle('bi-heart-fill', isFavorite);
    
    // Update now playing favorite button
    nowPlayingFavorite.classList.toggle('active', isFavorite);
    const nowPlayingIcon = nowPlayingFavorite.querySelector('i');
    nowPlayingIcon.classList.toggle('bi-heart', !isFavorite);
    nowPlayingIcon.classList.toggle('bi-heart-fill', isFavorite);
  }

  // Toggle shuffle
  function toggleShuffle() {
    isShuffle = !isShuffle;
    const shuffleBtn = document.getElementById('shuffle');
    if (isShuffle) {
      shuffleBtn.classList.add('text-primary');
    } else {
      shuffleBtn.classList.remove('text-primary');
    }
  }

  // Toggle repeat
  function toggleRepeat() {
    isRepeat = !isRepeat;
    const repeatBtn = document.getElementById('repeat');
    if (isRepeat) {
      repeatBtn.classList.add('text-primary');
    } else {
      repeatBtn.classList.remove('text-primary');
    }
  }

  // Set up event listeners
  function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    nowPlayingPlay.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressBar.addEventListener('click', setProgress);
    favoriteBtn.addEventListener('click', () => toggleFavorite());
    nowPlayingFavorite.addEventListener('click', () => toggleFavorite());
    document.getElementById('shuffle').addEventListener('click', toggleShuffle);
    document.getElementById('repeat').addEventListener('click', toggleRepeat);
    
    // Error handling
    audio.addEventListener('error', function() {
      console.error("Error loading audio file:", audio.src);
      alert("Error loading song. Please check the file path and make sure the server is running.");
    });
  }

  // Initialize the player
  initPlayer();
});