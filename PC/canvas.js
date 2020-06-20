const canvas = document.querySelector('canvas');
const githubProjectLink = document.getElementById('github-project a');
const c = canvas.getContext('2d');

const canvasOffset = 61;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight - canvasOffset;

canvas.width = windowWidth;
canvas.height = windowHeight;

canvas.addEventListener('mousemove', MouseMove, false);
canvas.addEventListener('click', MousePressed, false);

var circles = [];
var projectText = ["C#", "UNITY", "WEB"];
var projectName = ["Car tuner app", "Spaflash", "This webpage"];
var projectDescOne = ["An app that allows to connect", "A never-ending experience", "Portfolio page that allows me"];
var projectDescTwo = ["to a car and modify it realtime", "after which you get dizzy", "to showcase my projects"];

var mainCircleRadius = 200;
var smallCircleRadius = 100;

var additionalImage = ["", "img/play.jpg", ""];
var additionalLink = ["", "https://play.google.com/store/apps/details?id=com.flash.spaflash", ""];
var githubLink = ["https://github.com/FlasHGT/Windows-APP", "https://github.com/FlasHGT/Spaflash", "https://github.com/FlasHGT/Webpage-V2"];
var githubProjectImage = new Image();
var newImage = new Image();
var xNewImage = windowWidth / 2 + 30;
var xGitImage = windowWidth / 2 - 130;
var heightOfImages = windowHeight / 2 + 20;
var imageSize = 100;

var toggle = false;

var mouseX;
var mouseY;

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

function MouseMove (event) {
    mouseX = event.pageX;
    mouseY = event.pageY;

    for (var i = 0; i < circles.length; i++) {
        circles[i].interacted();
    }
}

function MousePressed () {
    for (var i = 1; i < circles.length; i++) {
        circles[i].imagesPressed();
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

    this.interacted = () => {
        if (Distance(this.x, this.y + canvasOffset, mouseX, mouseY) - this.radius > 0) {
            for (var i = 0; i < circles.length; i++) {  
                if (Distance(circles[i].x, circles[i].y + canvasOffset, mouseX, mouseY) - smallCircleRadius < 0) {
                    this.color = 'rgb(187, 13, 13, 1)';
                    c.fillStyle = 'rgb(187, 13, 13, 1)';

                    break;
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

function Circle (xPos, yPos, radius, strokeColor, text, projectName, projectDescOne, projectDescTwo, githubLink, additionalLink, circleSpotInArray) {
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
    this.projectName = projectName;
    this.projectDescOne = projectDescOne;
    this.projectDescTwo = projectDescTwo;
    this.toggle = false;
    this.githubLink = githubLink;
    this.additionalLink = additionalLink;
    this.circleSpotInArray = circleSpotInArray;

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

    this.interacted = () => {
        if (Distance(circles[0].x, circles[0].y + canvasOffset, mouseX, mouseY) - mainCircleRadius > 0) {
            if (Distance(this.x, this.y + canvasOffset, mouseX, mouseY) - this.radius < 0) {
                this.toggle = true;
                this.color = 'rgb(187, 13, 13, 1)';
                c.fillStyle = this.color;
            }else {
                for (var i = 1; i < circles.length; i++) {
                    if (circles[i].toggle && circles[i] != this) {
                        this.toggle = false;
                        this.color = strokeColor;
                        c.fillStyle = this.color;
                    }
                }
            }
        }

        this.draw();
    }

    this.imagesPressed = () => {
        if (this.toggle) {
            this.linkPressed(githubLink, additionalLink);
        }        
    }

    this.linkPressed = (gitLink, addLink) => {
        if (additionalImage[this.circleSpotInArray] != "") {
            if (xNewImage - 2 < mouseX && xNewImage + 100 > mouseX && heightOfImages + 58 < mouseY && heightOfImages + 160 > mouseY) {
                window.open(addLink);
            }else if (xGitImage - 7 < mouseX && xGitImage + 103 > mouseX && heightOfImages + 58 < mouseY && heightOfImages + 160 > mouseY) {
                window.open(gitLink);
            }
        }else {
            if (windowWidth / 2 + 50 > mouseX && windowWidth / 2 - 60 < mouseX && windowHeight / 2 + 180 > mouseY && windowHeight / 2 + 70 < mouseY) {
                window.open(gitLink);
            }
        }
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
        c.lineWidth = 5;
        c.fillText(this.text, this.x, this.y);
        if (this.toggle) {
            c.font = '35px Fira Code';
            c.fillText(this.projectName, windowWidth / 2, windowHeight / 2 - 100);
            c.font = '20px Fira Code';
            c.fillText(this.projectDescOne, windowWidth / 2, windowHeight / 2 - 50);
            c.fillText(this.projectDescTwo, windowWidth / 2, windowHeight / 2 - 25);
            CreateProjectPictures(additionalImage[this.circleSpotInArray], this.githubLink, this.additionalLink);
        }
        c.closePath();
    }
}

function CreateProjectPictures (addImage) {
    githubProjectImage.src = 'img/github_white.png';
    newImage.src = addImage;

    if (addImage != "") {        
        c.drawImage(newImage, xNewImage, heightOfImages, imageSize, imageSize);
        c.drawImage(githubProjectImage, xGitImage, heightOfImages, imageSize, imageSize);
    }else {
        c.drawImage(githubProjectImage, windowWidth / 2 - 50, windowHeight / 2 + 18, imageSize, imageSize);
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
        var name = projectName[i];
        var descOne = projectDescOne[i];
        var descTwo = projectDescTwo[i];
        var git = githubLink[i];
        var aLink = additionalLink[i];

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

        circles.push(new Circle(x, y, smallCircleRadius, color, text, name, descOne, descTwo, git, aLink, i));
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