let scene, camera, renderer, starGeo, stars;

function init() {

    var container = document.querySelector('.scene');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 50, 10000);
    camera.position.z = 1;
    //camera.rotation.x = Math.PI / 2;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    starGeo = new THREE.Geometry();
    for (let i = 0; i < 12000; i++) {
        star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        star.velocity = 0.1;
        star.accleration = 0;
        starGeo.vertices.push(star);
    }

    let sprite = new THREE.TextureLoader().load('assets/star.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
    animate();
}

function animate() {
    starGeo.vertices.forEach(p => {
        p.velocity += p.accleration;
        p.x -= p.velocity;

        if (p.x < -200) {
            p.x = 200;
            p.velocity = 0.1;
        }
    });

    starGeo.verticesNeedUpdate = true;
    stars.rotation.z += 0.0001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();

function onWindowResize() {
    var container = document.querySelector('.scene');

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

    if ($(window).innerWidth() > 800) {
        anm = 1;
    } else {
        anm = 0;
    }
}

window.addEventListener('resize', onWindowResize);

let anm = 0;
if ($(window).innerWidth() > 800) {
    anm = 1;
}

$(document).ready(function() {

    let i = 0;
    let j = 0;

    $(window).scroll(function() {
        if (anm == 1) {
            if ($(document).scrollTop() > 50) {
                $("#nav-transition").css("backgroundColor", "black");
                j = 1;

            } else {
                $("#nav-transition").css("backgroundColor", "transparent");
                j = 0;
            }
        }
    });


    $(".links .nav-links").mouseenter(function() {
        if (i == 0 && j == 0 && anm == 1) {
            $("#nav-transition").css("backgroundColor", "black").animate({ height: '50vh' }, "fast").animate({ height: '15vh' }, "fast");
            i = 1;
        }
        if (i == 1 && anm == 1) {
            $("#nav-transition").mouseleave(function() {
                if (j == 0) {
                    $("#nav-transition").css("backgroundColor", "transparent");
                    i = 0;
                }
            });
        }

    });

});

$("#home-link").click(function() {
    var $before = $(".active");
    $before.removeClass("active");
    $(this).addClass("active");
    nav.classList.toggle('open');

});
$("#bio-link").click(function() {
    var $before = $(".active");
    $before.removeClass("active");
    $(this).addClass("active");
    nav.classList.toggle('open');
});
$("#projects-link").click(function() {
    var $before = $(".active");
    $before.removeClass("active");
    $(this).addClass("active");
    nav.classList.toggle('open');
});
$("#cv-link").click(function() {
    var $before = $(".active");
    $before.removeClass("active");
    $(this).addClass("active");
    nav.classList.toggle('open');
});


$(window).scroll(function() {

    let zero = $('#nav-transition').offset().top;
    let home = Math.abs($('.content').offset().top - zero);
    let bio = Math.abs($('.bio').offset().top - zero);
    let projects = Math.abs($('.projects').offset().top - zero);
    let cv = Math.abs($('.cv').offset().top - zero);

    arr = [home, bio, projects, cv];
    var min = arr[0];
    var minIndex = 0;


    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    if (minIndex == 0) {

        var $before = $(".active");
        $before.removeClass("active");
        $('#home-link').addClass("active");

    }
    if (minIndex == 1) {

        var $before = $(".active");
        $before.removeClass("active");
        $('#bio-link').addClass("active");

    }
    if (minIndex == 2) {

        var $before = $(".active");
        $before.removeClass("active");
        $('#projects-link').addClass("active");

    }
    if (minIndex == 3) {

        var $before = $(".active");
        $before.removeClass("active");
        $('#cv-link').addClass("active");

    }
});



const brg = document.querySelector('.burger');
const nav = document.querySelector('.links .nav-links');

brg.addEventListener('click', () => {
    nav.classList.toggle('open');
});
