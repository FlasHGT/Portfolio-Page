ChangeActiveDot();

$('nav a').on('click', function (e) {
  if (this.hash !== '') {
    e.preventDefault();

    const hash = this.hash;

    $('html, body')
      .stop().animate({
        scrollTop: $(hash).offset().top
      },800);
  }
});

function More () {
    let clName = document.getElementById("more-button-icon").className;
    let moreDisplay;

    if (clName == "fas fa-arrow-down") {
        moreDisplay = "block";
        clName = "fas fa-arrow-up";
    }else {
        moreDisplay = "none";
        clName = "fas fa-arrow-down";
    }

    document.getElementById("more").style.display = moreDisplay;
    document.getElementById("more-button-icon").className = clName;
}

function ChangeActiveDot (thisElement) {
    let dotElements = document.getElementsByClassName("manual-btn");

    if (thisElement  == null)
    {
        dotElements[0].style.background = "rgb(137, 26, 26)";
        return;
    }

    for (let x = 0; x < dotElements.length; x++)
    {
        if (dotElements[x] == thisElement)
        {
            dotElements[x].style.background = "rgb(137, 26, 26)";
        }else
        {
            dotElements[x].style.background = "rgb(25, 25, 25)";
        }
    }
}

function ContactValidation () {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let number = document.getElementById("number").value;
    let error = document.getElementById("error-message");

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    error.style.padding = "5px";
    
    if (name == "" || name.length < 5)
    {
        error.innerHTML = "Please enter a name!";
        return false;
    }else if (email == "" || !re.test(String(email).toLowerCase()))
    {
        error.innerHTML = "Please enter a valid e-mail!";
        return false;
    }else if (message == "")
    {
        error.innerHTML = "Please enter a message!";
        return false;
    }else if (number == "" || !(parseInt(number) >= 1 && parseInt(number) <= 4)) 
    {
        error.innerHTML = "Please enter a valid number!";
        return false;
    }
    else
    {
        error.innerHTML = "Message sent!";
        return true;
    }
}