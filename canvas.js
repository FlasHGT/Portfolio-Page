const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.addEventListener('mousedown', MousePressed, false);

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight - 61;

canvas.width = windowWidth;
canvas.height = windowHeight;

var circles = [];
var projectText = ["C#", "UNITY", "WEB"];
var mainCircleRadius = 200;
var smallCircleRadius = 100;

function RandomIntFromRange (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function RandomIntExceptOneInt (min, max, except) {
    var number = RandomIntFromRange(min, max);
    
    while (number == except) {
        number = RandomIntFromRange(min, max);
    }

    return number;
}

function Distance (x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function Rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function ResolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = Rotate(particle.velocity, angle);
        const u2 = Rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = Rotate(v1, -angle);
        const vFinal2 = Rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        if (particle.velocity.x == 0) {
            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }else if (otherParticle.velocity.x == 0) {
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;
        }else {
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;
    
            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }
}

function MousePressed (event) {
    var mouseX = event.pageX;
    var mouseY = event.pageY;

    for (var i = 0; i < circles.length; i++) {
        circles[i].interacted(mouseX, mouseY);
    }
}

function MainCircle (xPos, yPos, radius, strokeColor) {
    this.x = xPos;
    this.y = yPos;
    this.radius = radius;
    this.color = strokeColor;
    this.mass = 1;
    this.velocity = {
        x: 0,
        y: 0
    };

    this.update = circles => {
        this.draw();

        for (var i = 0; i < circles.length; i++) {
            if (circles[i] != this) {
                if (Distance(this.x, this.y, circles[i].x, circles[i].y) - this.radius - smallCircleRadius <= 0 ) {
                    ResolveCollision(this, circles[i]);
                }
            }
        }
    }

    this.interacted = (mouseX, mouseY) => {
        if (Distance(this.x, this.y, mouseX, mouseY) - this.radius > 0) {
            for (var i = 0; i < circles.length; i++) {  
                    if (Distance(circles[i].x, circles[i].y, mouseX, mouseY) - smallCircleRadius < 0) {
                        this.color = 'rgb(187, 13, 13, 1)';
                        c.fillStyle = 'rgb(187, 13, 13, 1)';

                        break;
                    }else {
                        this.color = strokeColor;
                        c.fillStyle = this.color;
                    }
            }
          }

        this.draw();
    }

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }
}

function Circle (xPos, yPos, radius, strokeColor, text) {
    this.x = xPos;
    this.y = yPos;
    this.velocity = {
        x: RandomIntExceptOneInt(-1, 1, 0),
        y: RandomIntExceptOneInt(-1, 1, 0)
    };
    this.radius = radius;
    this.color = strokeColor;
    this.mass = 1;
    this.text = text;

    this.update = circles => {
        this.draw();

        for (var i = 0; i < circles.length; i++) {
            if (circles[i] != this) {
                if (i == 0) {
                    if (Distance(this.x, this.y, circles[i].x, circles[i].y) - this.radius - mainCircleRadius <= 0 ) {
                        ResolveCollision(this, circles[i]);
                    }
                }
                else {
                    if (Distance(this.x, this.y, circles[i].x, circles[i].y) - this.radius * 2 <= 0 ) {
                        ResolveCollision(this, circles[i]);
                    }
                }
            }
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= windowWidth) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= windowHeight) {
            this.velocity.y = -this.velocity.y;
        }

        if (this.velocity.x < 0 && -this.velocity.x < 0.5) {
            this.velocity.x = this.velocity.x - RandomIntFromRange(0, 0.5);
        }else if (this.velocity.x > 0 && this.velocity.x < 0.5) {
            this.velocity.x = this.velocity.x + RandomIntFromRange(0, 0.5);
        }   

        if (this.velocity.y < 0 && -this.velocity.y < 0.5) {
            this.velocity.y = this.velocity.y - RandomIntFromRange(0, 0.5);
        }else if (this.velocity.y > 0 && this.velocity.y < 0.5) {
            this.velocity.y = this.velocity.y + RandomIntFromRange(0, 0.5);
        }  

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    this.interacted = (mouseX, mouseY) => {
        if (Distance(circles[0].x, circles[0].y, mouseX, mouseY) - mainCircleRadius > 0) {
            if (Distance(this.x, this.y, mouseX, mouseY) - this.radius < 0) {
                this.color = 'rgb(187, 13, 13, 1)';
                c.fillStyle = 'rgb(187, 13, 13, 1)';
            }else {
                this.color = strokeColor;
                c.fillStyle = this.color;
            }
        }
        

        this.draw();
    }

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = this.color;
        c.stroke();
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = '50px Fira Code';
        c.fillStyle = this.color;
        c.fillText(this.text, this.x, this.y);
        c.closePath();
    }
}

function Init () {
    var mCX = windowWidth / 2;
    var mCY = windowHeight / 2; 
    var color = 'white';

    circles.push(new MainCircle(mCX, mCY, mainCircleRadius, color));

    for (var i = 0; i < 3; i++) {
        var x = RandomIntFromRange(smallCircleRadius, windowWidth - smallCircleRadius);
        var y = RandomIntFromRange(smallCircleRadius, windowHeight - smallCircleRadius);
        var text = projectText[i];

        for (var j = 0; j < circles.length; j++) {
            if (j == 0) {
                if (Distance(x, y, circles[j].x, circles[j].y) - mainCircleRadius - smallCircleRadius <= 0 ) {
                    x = RandomIntFromRange(smallCircleRadius, windowWidth - smallCircleRadius);
                    y = RandomIntFromRange(smallCircleRadius, windowHeight - smallCircleRadius);

                    j--;
                }
            }
            else {
                if (Distance(x, y, circles[j].x, circles[j].y) - smallCircleRadius * 2 <= 0 ) {
                    x = RandomIntFromRange(smallCircleRadius, windowWidth - smallCircleRadius);
                    y = RandomIntFromRange(smallCircleRadius, windowHeight - smallCircleRadius);

                    j = 0;
                }
            }
        }

        circles.push(new Circle(x, y, smallCircleRadius, color, text));
    }
}

function Animate () {
    requestAnimationFrame(Animate);

    c.clearRect(0, 0, windowWidth, windowHeight);

    circles.forEach(circle => {
        circle.update(circles);
    });
}

Init();
Animate();