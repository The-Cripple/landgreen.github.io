(() => {
  let width = 580;
  let height = 180;

  const canvas = document.getElementById("canvas3");
  const ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function resizeCanvas() {
    //fit canvas to window and fix issues with canvas blur on zoom
    if (document.body.clientWidth > width) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const scale = window.devicePixelRatio;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
    }
  }

  function intro() {
    ctx.font = "300 30px Arial";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "center";
    ctx.fillText("click to start simulation", width / 2, height / 2);
  }
  window.addEventListener("load", intro);
  window.addEventListener("resize", intro);
  canvas.addEventListener("click", collisionSim);

  function collisionSim() {
    canvas.removeEventListener('click', collisionSim);
    window.removeEventListener("resize", intro);

    // module aliases
    var Engine = Matter.Engine,
      World = Matter.World,
      Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    var engine = Engine.create();
    var scale = 1;
    //adjust gravity to fit simulation
    engine.world.gravity.scale = 0.000001 * scale;
    engine.world.gravity.y = 0;

    var mass = [];

    canvas.addEventListener("mousedown", function () {
      if (engine.timing.timeScale === 1) {
        World.clear(engine.world, true); //clear matter engine, leave static
        mass = []; //clear mass array
        spawn();
      }
    });

    spawn();

    function spawn() {
      spawnMass(100, 125, 180, 0, 40, "lightgreen");
      spawnMass(300, 125, 120, 0, 70, "#419eff");
      spawnMass(600, 125, -60, 0, 60, "orange");
    }

    function spawnMass(xIn, yIn, VxIn, VyIn, length, color) {
      //spawn mass
      var i = mass.length;
      mass.push();
      mass[i] = Bodies.rectangle(xIn * scale, yIn * scale, length * scale, length * scale, {
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        restitution: 0.988,
        length: length,
        color: color
      });

      Body.setVelocity(mass[i], {
        x: (VxIn / 60) * scale,
        y: (-VyIn / 60) * scale
      });
      //Matter.Body.setAngularVelocity(mass[i], 0.4);
      World.add(engine.world, mass[i]);
    }

    // run the engine
    Engine.run(engine);

    //render
    (function render() {
      var bodies = Composite.allBodies(engine.world);
      window.requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);
      // ctx.fillStyle = 'rgba(255,255,255,0.4)';  //trails
      // ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000";
      for (var i = 0; i < bodies.length; i += 1) {
        var vertices = bodies[i].vertices;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (var j = 1; j < vertices.length; j += 1) {
          ctx.lineTo(vertices[j].x, vertices[j].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
        if (bodies[i].color) {
          ctx.fillStyle = bodies[i].color;
        } else {
          ctx.fillStyle = "#ccc";
        }
        ctx.fill();
        ctx.stroke();
      }


      ctx.textAlign = "center";
      ctx.font = "18px Arial";
      ctx.fillStyle = "#000";
      var p = 0;
      for (var k = 0, length = mass.length; k < length; k++) {
        ctx.fillText(mass[k].mass.toFixed(2) + " kg", mass[k].position.x, mass[k].position.y - mass[k].length / 2 - 22);
        ctx.fillText(mass[k].velocity.x.toFixed(2) + " m/s", mass[k].position.x, mass[k].position.y - mass[k].length / 2 - 2);
        p += mass[k].mass * mass[k].velocity.x;
      }
      ctx.textAlign = "left";
      ctx.fillText("mv  +  mv  + mv  =  total momentum", 5, height - 5);
      ctx.fillText("(" + mass[0].mass.toFixed(2) + ")(" + mass[0].velocity.x.toFixed(2) + ") + (" + mass[1].mass.toFixed(2) + ") (" + mass[1].velocity.x.toFixed(2) + ") + (" + mass[0].mass.toFixed(2) + ")(" + mass[0].velocity.x.toFixed(2) + ") = " + p.toFixed(2), 5, 22);
    })();
  }
})();