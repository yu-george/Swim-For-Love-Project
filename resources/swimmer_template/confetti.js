let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let maxConfettis = 150;
let particles = [];
let Done = false;
let count = 0;
let drawed = false;
const possibleColors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W; // x  
    this.y = Math.random() * H - H; // y  
    this.r = randomFromTo(11, 33); // radius  
    this.d = Math.random() * maxConfettis + 11;
    this.out = false;
    this.out_checked = false;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function() {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };

    this.check_out = function() {
        if (this.out == true) {
            this.out_checked = true;
        }
        if (this.x > W + 30 || this.x < -30 || this.y > H + 1) {
            this.out = true;
        }
    };
}

function Draw() {
    drawed = true;
    const results = [];

    // Magical recursive functional love  
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < particles.length; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < particles.length; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,    // bring it back to above the viewport and let if re-fall.  
        if (Done == true) {
            particle.check_out();
            if (particle.out == true) {
                if (particle.out_checked == false) {
                    count++;
                }
            }
            if (count == particles.length) {
                particles = [];
                break;
            }
        }
        if (Done == false) {
            if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
            }
        }

        setTimeout(function() {
            Done = true;
        }, CONFETTI_TIMEOUT);

    }
    return results;
}

window.addEventListener("resize", function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, false);


for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
}




// Initialize
canvas.width = W;
canvas.height = H;

function Check_Draw(laps) {
    if (laps >= BRONZE_MEDAL_LAP_COUNT) {
        Draw();
    }

}

$(document).ready(() => {
    $.ajaxSetup({
        cache: false
    }); // no cache    // Initialize    
    $.getJSON(SWIMMER_DATA_FILE, raw => {
        Check_Draw(raw.laps);
    });
    setInterval(() => {
        $.getJSON(SWIMMER_DATA_FILE, raw => {
            if (drawed == false) {
                Check_Draw(raw.laps);
            }

        });
    }, 2000);
}); // Draw();