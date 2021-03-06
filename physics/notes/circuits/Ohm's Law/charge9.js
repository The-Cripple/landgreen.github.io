Charge.clickStart("charge9")

function charges9(el) {
  const q = []; //holds the charges
  Charge.setup(el, q);

  let pause = false;
  el.addEventListener("mouseleave", function () {
    pause = true;
  });
  el.addEventListener("mouseenter", function () {
    Charge.setCanvas(el);
    if (pause) requestAnimationFrame(cycle);
    pause = false;
  });

  //spawn p before e to avoid a bug in the class method allPhysics
  const separation = 40;
  const off = 100;
  for (let i = 0; i < Math.ceil((canvas.width + off * 2) / separation); ++i) {
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2 + separation
    });
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2
    });
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2 - separation
    });
  }
  for (let i = 0; i < Math.ceil((canvas.width + off * 2) / separation); ++i) {
    q[q.length] = new Charge(
      "e", {
        x: separation * i - off,
        y: canvas.height / 2 + separation
      }, {
        x: 2,
        y: 0
      }
    );
    q[q.length] = new Charge(
      "e", {
        x: separation * i - off,
        y: canvas.height / 2
      }, {
        x: 2,
        y: 0
      }
    );
    q[q.length] = new Charge(
      "e", {
        x: separation * i - off,
        y: canvas.height / 2 - separation
      }, {
        x: 2,
        y: 0
      }
    );
  }

  function cycle() {
    if (!pause) {
      Charge.physicsAll(q);
      Charge.teleport(q, 50);
      Charge.teleport(q, 200);
      Charge.scalarField(q);
      requestAnimationFrame(cycle);
    }
  }
  requestAnimationFrame(cycle);
}