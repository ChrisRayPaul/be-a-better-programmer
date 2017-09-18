window.onload = function () {
    var keyCode = {
        "left": "37", "right": "39", "up": "38", "down": "40",
        "shoot": "83", "rotate_left": "65", "rotate_right": "68"
    };
    var keyBuf = {};
    addEventListener("keydown", function (e) {
        keyBuf[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keyBuf[e.keyCode] = false;
    }, false);
    var c = window.document.getElementById("c");
    var h = 500, w = 1000;
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    var sz = 30, x = w / 2, y = sz;
    var vx = 0, vy = 0, ax = 0, ay = 0, f = 0.2, fr = 0.1, loss = 0.8, g = 0.08;
    var enemy_x = 20, enemy_y = 20, enemy_width = 20, enemy_height = 20;
    var speed_x = 5, speed_y = 0;
    var shoot_x = new Array(), shoot_y = new Array(), shoot_vx = new Array(), shoot_vy = new Array(),
        shoot_speed = 5, shoot_flag = 0, boom_num = 0;
    var last_state = false;
    var plane_x = 400, plane_y = 300, plane_vx = 0, plane_vy = 0, plane_ax = 0, plane_ay = 0, plane_angle = Math.PI;
    var fire_len = 20, frame_count = 0;

    function update() {
        (function init_world() {
            ax = 0, ay = g;
            plane_ax = 0, plane_ay = 0;

        }());
        (function event_trigger() {
            if (keyBuf[keyCode.left]) {
                plane_ax = -f;
            }
            if (keyBuf[keyCode.right]) {
                plane_ax = f;
            }
            if (keyBuf[keyCode.up]) {
                plane_ay = -f;
            }
            if (keyBuf[keyCode.down]) {
                plane_ay = f;
            }
            if (keyBuf[keyCode.shoot] && last_state != keyBuf[keyCode.shoot]) {
                shoot_x[boom_num] = plane_x;
                shoot_y[boom_num] = plane_y;
                shoot_vx[boom_num] = -Math.sin(plane_angle) * shoot_speed;
                shoot_vy[boom_num] = Math.cos(plane_angle) * shoot_speed;
                boom_num++;
            }
            if (keyBuf[keyCode.rotate_left]) {
                plane_angle -= 0.01;
            }
            if (keyBuf[keyCode.rotate_right]) {
                plane_angle += 0.01;
            }
            last_state = keyBuf[keyCode.shoot];
        }());
        (function step_world() {
            plane_vx += plane_ax;
            plane_vy += plane_ay;
            plane_vx *= (1 - fr);
            plane_vy *= (1 - fr);//fraction
            plane_x += plane_vx;
            plane_y += plane_vy;
        }());
        (function hit_check() {
            if (x < sz || x > w - sz) {
                x -= vx;
                vx = -vx * loss;
            }
            if (y < sz || y > h - sz) {
                y -= vy;
                vy = -vy * loss;
            }
        }());

        (function enemy_move() {
            enemy_x += speed_x;
            if (enemy_x < 0 || enemy_x > w - enemy_width) {
                enemy_x -= speed_x;
                speed_x = -speed_x;
            }
            if (enemy_y < 0 || enemy_y > h - enemy_height) {
                enemy_y -= speed_y;
                speed_y = -speed_y;
            }
        }());

        (function plane_shot() {
            for (var i = 0; i < boom_num; i++) {
                shoot_x[i] += shoot_vx[i];
                shoot_y[i] += shoot_vy[i];
            }
        }());
        frame_count++;
        fire_len = Math.sin(frame_count / 5.7) * 10 - 15;

    };
    (function draw() {
        update();
        requestAnimationFrame(draw);//new api for animation
        var g = c.getContext("2d");
        g.fillStyle = "black";
        g.fillRect(0, 0, c.width, c.height);
        (function draw_bg() {
            g.lineWidth = 5;
            g.strokeRect(0, 0, w, h);
            g.fillStyle = "green";
            g.fillText("KeyPress", w - 150, h - 50);
            g.fillText("←", w - 100, h - 100);
            g.fillText("↑", w - 80, h - 120);
            g.fillText("→", w - 65, h - 100);
            g.fillText("↓", w - 80, h - 80);
            g.fillText("S : shoot", w - 150, h - 80);
        }());
        (function draw_sprite() {
            g.beginPath();
            g.fillStyle = "orange";
            g.arc(x, y, sz, 0, Math.PI * 2);
            g.fill();
            g.closePath();
        }());

        (function draw_enemy() {
            g.fillStyle = "red";
            //console.log(enemy_x);
            g.fillRect(enemy_x, enemy_y, enemy_width, enemy_height);
        }());

        (function draw_boom() {
            for (var i = 0; i < boom_num; i++) {
                g.beginPath();
                g.fillStyle = "cyan";
                g.arc(shoot_x[i], shoot_y[i], 5, 0, Math.PI * 2);
                g.fill();
                g.closePath();
                console.log(shoot_y[i]);
            }
        }());

        function draw_one_fire(x, y) {
            g.beginPath();
            g.fillStyle = "yellow";
            g.moveTo(x, y);
            g.lineTo(x + 10, y);
            g.lineTo(x + 5, y + fire_len);
            g.fill();
            g.closePath();
        }

        function draw_fire() {
            draw_one_fire(-20, 0);
            draw_one_fire(10, 0);
        }

        (function draw_plane() {
            g.save();
            var cos = Math.cos(plane_angle);
            var sin = Math.sin(plane_angle);
            g.transform(cos, sin, -sin, cos, plane_x, plane_y);
            console.log(plane_y);
            g.beginPath();
            g.fillStyle = "blue";
            g.moveTo(-30, -10);//A1
            g.lineTo(-20, 30);
            g.lineTo(-15, 10);
            g.lineTo(-10, 10);
            g.lineTo(-2, 40);
            g.lineTo(0, 40);
            g.lineTo(-4, 10);
            g.lineTo(4, 10);
            g.lineTo(0, 40);
            g.lineTo(2, 40);
            g.lineTo(10, 10);
            g.lineTo(15, 10);
            g.lineTo(20, 30);
            g.lineTo(30, -10);
            g.lineTo(20, 0);
            g.lineTo(-20, 0);
            g.lineTo(-30, -10);
            g.fill();
            draw_fire();
            g.restore();
            //g.closePath();
        }());
    }());
}