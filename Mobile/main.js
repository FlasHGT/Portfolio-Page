$('nav a').on('click', function(e){
    if (this.hash !== '') {
        e.preventDefault();

        const hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        },650);
    }
});

$(".nav-dropdown-menu").on("click", function() {
    $("nav").toggleClass("open");
});

function ChangeTitle (sectionName) {
    document.title = "George T. - " + sectionName; 
}
