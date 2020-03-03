window.onload = function() {
    var e, n, i, t, o, a, r = 0, d = 0, s = 0, c = window.innerWidth / 2, w = window.innerHeight / 2;
    function h() {
        c = window.innerWidth / 2,
        w = window.innerHeight / 2,
        n.aspect = window.innerWidth / window.innerHeight,
        n.updateProjectionMatrix(),
        t.setSize(window.innerWidth, window.innerHeight)
    }
    function p(e) {
        d = e.clientX - c,
        s = e.clientY - w
    }
    function l(e) {
        //1 === e.touches.length && (e.preventDefault(),
        d = e.touches[0].pageX - c,
        s = e.touches[0].pageY - w
    }
    function u(e) {
        //1 === e.touches.length && (e.preventDefault(),
        d = e.touches[0].pageX - c,
        s = e.touches[0].pageY - w
    }
    !function() {
        e = document.createElement("div", {
            id: "particles",
            class: "particles"
        }),
        document.getElementById("bilog-bilog").appendChild(e),
        (n = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,1e4)).position.z = 1e3,
        i = new THREE.Scene,
        o = new Array;
        for (var r = 2 * Math.PI, d = new THREE.SpriteCanvasMaterial({
            color: 15658734,
            program: function(e) {
                e.beginPath(),
                e.arc(0, 0, .3, 0, r, !0),
                e.fill()
            }
        }), s = 0, c = 0; c < 50; c++)
            for (var w = 0; w < 50; w++)
                (a = o[s++] = new THREE.Sprite(d)).position.x = 100 * c - 2500,
                a.position.z = 100 * w - 2500,
                i.add(a);
        (t = new THREE.CanvasRenderer).setPixelRatio(window.devicePixelRatio),
        (t = new THREE.CanvasRenderer({
            alpha: !0
        })).setSize(window.innerWidth, window.innerHeight),
        e.appendChild(t.domElement),
        document.addEventListener("mousemove", p, !1),
        document.addEventListener("touchstart", l, !1),
        document.addEventListener("touchmove", u, !1),
        window.addEventListener("resize", h, !1)
    }(),
    function e() {
        requestAnimationFrame(e),
        function() {
            n.position.x += .05 * (d - n.position.x),
            n.position.y += .05 * (-s - n.position.y),
            n.lookAt(i.position);
            for (var e = 0, c = 0; c < 50; c++)
                for (var w = 0; w < 50; w++)
                    (a = o[e++]).position.y = 50 * Math.sin(.3 * (c + r)) + 50 * Math.sin(.5 * (w + r)),
                    a.scale.x = a.scale.y = 4 * (Math.sin(.3 * (c + r)) + 1) + 4 * (Math.sin(.5 * (w + r)) + 1);
            t.render(i, n),
            r += .1
        }()
    }()
}
;
