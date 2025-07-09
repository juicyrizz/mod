document.addEventListener('DOMContentLoaded', () => {
    
    class RainingCodeAnimation {
        constructor(canvas) {
            this.canvas = canvas; this.ctx = canvas.getContext('2d');
            this.codeChars = ['0', '1', '†', '‡', '█', '▒', '▓', '※', 'X'];
            this.colors = ['#FF0000', '#9A0000', '#4d0000', '#FFFFFF'];
            this.particles = []; this.animationId = 0;
            this.setup(); window.addEventListener('resize', () => this.setup());
        }
        setup() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createParticles();
        }
        createParticles() {
            const num = Math.floor((window.innerWidth * window.innerHeight) / 9000);
            this.particles = Array.from({ length: num }, () => ({
                x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
                char: this.codeChars[Math.floor(Math.random() * this.codeChars.length)],
                opacity: Math.random() * 0.7 + 0.3, speed: Math.random() * 1.5 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                size: Math.random() * 14 + 10
            }));
        }
        animate() {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                p.y += p.speed;
                if (p.y > window.innerHeight + 50) { p.y = -50; p.x = Math.random() * window.innerWidth; }
                this.ctx.font = `${p.size}px 'Roboto Mono', monospace`;
                this.ctx.fillStyle = p.color; this.ctx.globalAlpha = p.opacity;
                this.ctx.fillText(p.char, p.x, p.y);
            });
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    const canvas = document.getElementById('raining-juicy');
    if (canvas) { new RainingCodeAnimation(canvas).animate(); }

    const music = document.getElementById('background-music');
    const globalMuteBtn = document.getElementById('global-mute-button');
    const playlist = [
        { title: "Robot", src: "music/Robot.mp3" },
        { title: "Slamdunk", src: "music/Slamdunk.mp3" },
        { title: "Saan", src: "music/Saan.mp3" },
        { title: "Multo", src: "music/Multo.mp3" }
    ];

    const saveState = () => {
        if (!music) return;
        sessionStorage.setItem('music_isPlaying', !music.paused);
        sessionStorage.setItem('music_time', music.currentTime);
        sessionStorage.setItem('music_volume', music.volume);
        sessionStorage.setItem('music_index', parseInt(sessionStorage.getItem('music_index') || '0'));
    };
    
    const updateGlobalUI = () => {
        if (globalMuteBtn) {
            globalMuteBtn.querySelector('i').className = music.paused ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        }
    };

    const safePlay = () => {
        const promise = music.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.error("Playback failed:", error);
            });
        }
    };
    
    if (music && globalMuteBtn) {
        let songIndex = parseInt(sessionStorage.getItem('music_index') || '0');
        music.src = playlist[songIndex].src;
        music.volume = parseFloat(sessionStorage.getItem('music_volume') || '0.5');
        music.addEventListener('canplaythrough', () => {
            music.currentTime = parseFloat(sessionStorage.getItem('music_time') || '0');
            if (sessionStorage.getItem('music_isPlaying') === 'true') {
                safePlay();
            }
        }, { once: true });

        music.addEventListener('play', () => { saveState(); updateGlobalUI(); });
        music.addEventListener('pause', () => { saveState(); updateGlobalUI(); });
        
        globalMuteBtn.addEventListener('click', () => {
            if (music.paused) {
                safePlay();
            } else {
                music.pause();
            }
        });

        updateGlobalUI();
    }
});