document.addEventListener('DOMContentLoaded', () => {
    class RainingCodeAnimation {
        constructor(canvas) {
            this.canvas = canvas; this.ctx = canvas.getContext('2d');
            this.codeChars = ['0', '1', '†', '‡', '█', '▒', '▓', '※', 'X'];
            this.colors = ['#FF0000', '#9A0000', '#4d0000', '#FFFFFF'];
            this.particles = []; this.animationId = 0;
            this.setup(); window.addEventListener('resize', () => this.setup());
        }
        setup() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; this.createParticles(); }
        createParticles() {
            const num = Math.floor((window.innerWidth * window.innerHeight) / 9000);
            this.particles = Array.from({ length: num }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, char: this.codeChars[Math.floor(Math.random() * this.codeChars.length)], opacity: Math.random() * 0.7 + 0.3, speed: Math.random() * 1.5 + 0.5, color: this.colors[Math.floor(Math.random() * this.colors.length)], size: Math.random() * 14 + 10 }));
        }
        animate() {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => { p.y += p.speed; if (p.y > window.innerHeight + 50) { p.y = -50; p.x = Math.random() * window.innerWidth; } this.ctx.font = `${p.size}px 'Roboto Mono', monospace`; this.ctx.fillStyle = p.color; this.ctx.globalAlpha = p.opacity; this.ctx.fillText(p.char, p.x, p.y); });
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    const canvas = document.getElementById('raining-juicy');
    if (canvas) { new RainingCodeAnimation(canvas).animate(); }
    const music = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitleElement = document.getElementById('song-title');
    const playlist = [ { title: "Now Playing: Robot", src: "music/Robot.mp3" }, { title: "Now Playing: Slamdunk", src: "music/Slamdunk.mp3" }, { title: "Now Playing: Saan", src: "music/Saan.mp3" }, { title: "Now Playing: Multo", src: "music/Multo.mp3" } ];
    let currentSongIndex = parseInt(sessionStorage.getItem('music_index') || '0');

    const saveState = () => {
        sessionStorage.setItem('music_isPlaying', !music.paused);
        sessionStorage.setItem('music_time', music.currentTime);
        sessionStorage.setItem('music_volume', music.volume);
        sessionStorage.setItem('music_index', currentSongIndex);
    };

    const updateUI = () => {
        const isPlaying = !music.paused;
        playPauseBtn.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        songTitleElement.textContent = isPlaying ? playlist[currentSongIndex].title : 'Awaiting Signal...';
    };

    const playMusic = () => { music.play(); saveState(); updateUI(); };
    const pauseMusic = () => { music.pause(); saveState(); updateUI(); };
    const loadSong = (index, shouldPlay) => {
        currentSongIndex = index;
        music.src = playlist[index].src;
        if (shouldPlay) {
            music.play();
        }
        saveState();
        updateUI();
    };

    if (music) {
        music.addEventListener('volumechange', saveState);
        music.addEventListener('timeupdate', saveState);
        music.addEventListener('ended', () => { loadSong((currentSongIndex + 1) % playlist.length, true); });
        music.src = playlist[currentSongIndex].src;
        music.volume = parseFloat(sessionStorage.getItem('music_volume') || '0.5');
        volumeSlider.value = music.volume;
        music.addEventListener('loadedmetadata', () => {
            music.currentTime = parseFloat(sessionStorage.getItem('music_time') || '0');
            if (sessionStorage.getItem('music_isPlaying') === 'true') {
                music.play().catch(e => console.error(e));
            }
            updateUI();
        });
        playPauseBtn.addEventListener('click', () => music.paused ? playMusic() : pauseMusic());
        nextBtn.addEventListener('click', () => { loadSong((currentSongIndex + 1) % playlist.length, true); });
        prevBtn.addEventListener('click', () => { loadSong((currentSongIndex - 1 + playlist.length) % playlist.length, true); });
        volumeSlider.addEventListener('input', (e) => music.volume = e.target.value);
    }
    const statusTextElement = document.querySelector('.profile-status');
    if (statusTextElement) {
        const fullText = "// Who's Carl?";
        let charIndex = 0, isDeleting = false;
        const typeWriter = () => {
            const currentText = isDeleting ? fullText.substring(0, charIndex - 1) : fullText.substring(0, charIndex + 1);
            statusTextElement.textContent = currentText;
            statusTextElement.classList.add('typing');
            charIndex += isDeleting ? -1 : 1;
            if (!isDeleting && charIndex === fullText.length) { isDeleting = true; setTimeout(typeWriter, 2000); } 
            else if (isDeleting && charIndex === 0) { isDeleting = false; setTimeout(typeWriter, 500); } 
            else { setTimeout(typeWriter, isDeleting ? 60 : 100); }
        };
        setTimeout(typeWriter, 1500);
    }
});