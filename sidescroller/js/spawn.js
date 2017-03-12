//main object for spawning things in a level
const spawn = {
    pickList: [],
    fullPickList: ['chaser', 'chaser', 'shooter', 'chaseShooter', 'hopper', 'burster', 'burster', 'puller', 'laserer', 'striker', 'striker', 'springer', 'ghoster', 'blinker', 'drifter', 'sneakAttacker', 'exploder', 'spawner'],
    setSpawnList: function() { //this is run at the start of each new level to give the mobs on each level a flavor
        this.pickList = [];
        for (let i = 0; i < 1 + Math.ceil(Math.random() * Math.random() * 3); ++i) {
            this.pickList.push(this.fullPickList[Math.floor(Math.random() * this.fullPickList.length)]);
        }
    },
    randomMob: function(x, y) {
        const pick = this.pickList[Math.floor(Math.random() * this.pickList.length)]
        this[pick](x, y);
    },
    randomSmallMob: function(x, y, num = 1, size = 16 + Math.ceil(Math.random() * 15)) {
        const pick = this.pickList[Math.floor(Math.random() * this.pickList.length)]
        for (let i = 0; i < num; ++i) {
            this[pick](x + i * size * 2.5, y, size);
        }
    },
    randomBoss: function(x, y) {
        const pick = this.pickList[Math.floor(Math.random() * this.pickList.length)]
        this.nodeBoss(x, y, pick);
    },
    //basic mob templates**********************************************************************************************
    //*****************************************************************************************************************
    shooter: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(215,100,215,1)'
        mobs.spawn(x, y, 3, radius, 'rgba(215,100,215,', ["seePlayerCheck", 'fireAt']);
		let me = mob[mob.length - 1]
        me.isStatic = true;
        me.seePlayerFreq = 59;
        me.memory = 20; //memory+memory*Math.random()
        //me.fireDelay = 40;
        me.fireDelay = Math.ceil(10 + 2000 / radius)
    },
    springer: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(223,2,58,1)'
        mobs.spawn(x, y, 0, radius, 'rgba(223,2,58,', ['gravity', "seePlayerCheck", "fallCheck"]);
		let me = mob[mob.length - 1]
        me.g = 0.0005; //required if using 'gravity'
        me.accelMag = 0.0012;
        me.memory = 240; //memory+memory*Math.random() in cycles
        me.seePlayerFreq = 120;
        cons[cons.length] = Constraint.create({
            pointA: me.seePlayer.position,
            bodyB: me,
            stiffness: 0.001,
        })
        cons[cons.length - 1].length = 0;

    },
    chaser: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(110,150,200,1)'
        mobs.spawn(x, y, 4, radius, 'rgba(110,150,200,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
		let me = mob[mob.length - 1]
        me.g = 0.0005; //required if using 'gravity'
        me.accelMag = 0.0012;
        me.memory = 240; //memory+memory*Math.random() in cycles
    },
    chaseShooter: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(140,100,250,1)'
        mobs.spawn(x, y, 3, radius, 'rgba(140,100,250,', ['gravity', "seePlayerCheck", "fallCheck", 'fireAt', "attraction"]);
		let me = mob[mob.length - 1]
        me.accelMag = 0.0002;
        me.g = 0.0001; //required if using 'gravity'
        me.frictionAir = 0.0002;
        me.memory = 180; //memory+memory*Math.random() in cycles
        //me.fireDelay = 65;
        me.fireDelay = Math.ceil(30 + 2000 / radius)
        me.faceOnFire = false; //prevents rotation on fire
    },
    hopper: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(0,200,150,1)'
        mobs.spawn(x, y, 4, radius, 'rgba(0,200,150,', ['gravity', "seePlayerCheck", "fallCheck", "burstAttraction"]);
		let me = mob[mob.length - 1]
        me.accelMag = 0.09;
        me.g = 0.002; //required if using 'gravity'
        me.frictionAir = 0.035;
        //me.memory = 60; //memory+memory*Math.random()
        me.restitution = 0;
        me.delay = 90;
    },
    burster: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(0,200,180,1)'
        mobs.spawn(x, y, 6, radius, 'rgba(0,200,180,', ["seePlayerCheck", "fallCheck", "burstAttraction"]);
		let me = mob[mob.length - 1]
        me.accelMag = 0.1;
        me.frictionAir = 0.02;
        //me.memory = 240; //memory+memory*Math.random()
        me.restitution = 1;
        me.delay = 140;
    },
    puller: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(0,10,30,1)'
        mobs.spawn(x, y, 7, radius, 'rgba(0,10,30,', ['gravity', "seePlayerCheck", "fallCheck", "attraction", 'pullPlayer']);
		let me = mob[mob.length - 1]
        me.delay = 360;
        me.g = 0.0002; //required if using 'gravity'
        me.accelMag = 0.0003;
        me.memory = 240; //memory+memory*Math.random() in cycles
    },
    laserer: function(x, y, radius = 15 + Math.ceil(Math.random() * 15)) { //'rgba(255,0,170,1)'
        mobs.spawn(x, y, 4, radius, 'rgba(255,0,170,', ["seePlayerCheck", "attraction", 'repulsion', "fallCheck", 'laser']);
		let me = mob[mob.length - 1]
        me.repulsionRange = 200000; //squared
        me.seePlayerFreq = 3;
        me.accelMag = 0.0006;
        me.frictionStatic = 0;
        me.friction = 0;
        me.onHit = function(k) { //run this function on hitting player
            mob[k].death()
        }
    },
    striker: function(x, y, radius = 15 + Math.ceil(Math.random() * 25)) { //'rgba(221,102,119,1)'
        mobs.spawn(x, y, 5, radius, 'rgba(221,102,119,', ["seePlayerCheck", "attraction", 'gravity', "fallCheck", 'strike']);
		let me = mob[mob.length - 1]
        me.accelMag = 0.0004;
        me.g = 0.0002; //required if using 'gravity'
        me.frictionStatic = 0;
        me.friction = 0;
        me.delay = 60;
        Matter.Body.rotate(me, Math.PI * 0.1)
    },
    ghoster: function(x, y, radius = 50 + Math.ceil(Math.random() * 70)) { //'rgba(255,255,255,1)'
        //pulls the background color, converts to rgba without the a
        let bgColor = 'rgba' + document.body.style.backgroundColor.substr(3, 20).replace(/.$/, ",")
        let me
        if (Math.random() > 0.5) { //fast
            mobs.spawn(x, y, 0, radius, bgColor, ["seePlayerCheck", "fallCheck", "attraction"]);
			me = mob[mob.length - 1]
            me.accelMag = 0.00025;
        } else { //slow but can yank
            mobs.spawn(x, y, 7, radius, bgColor, ["seePlayerCheck", "fallCheck", "attraction", 'yank']);
			me = mob[mob.length - 1]
            me.delay = 250 + Math.random() * 150;
            me.accelMag = 0.00015;
        }
        me.collisionFilter.mask = 0x001100; //move through walls
        me.memory = 720; //memory+memory*Math.random()
    },
    blinker: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(0,200,255,1)'
        mobs.spawn(x, y, 6, radius, 'rgba(0,200,255,', ["seePlayerCheck", "fallCheck", 'blink']);
        let me = mob[mob.length - 1]
        me.blinkRate = 40 + Math.round(Math.random() * 60); //required for blink
        me.blinkLength = 150 + Math.round(Math.random() * 200); //required for blink
        me.collisionFilter.mask = 0x001100; //move through walls
        me.isStatic = true;
        me.memory = 360; //memory+memory*Math.random()
        me.seePlayerFreq = 47;
        // if (Math.random() > 0.5) { //option for slower, but repelling bullets
        //     me.do.push('repelBullets');
        //     me.blinkRate = Math.ceil(me.blinkRate*2);
		// 	me.blinkLength += 100;
        // }
    },
    drifter: function(x, y, radius = 15 + Math.ceil(Math.random() * 40)) { //'rgba(0,200,255,1)'
        mobs.spawn(x, y, 4.5, radius, 'rgba(0,200,255,', ["seePlayerCheck", "fallCheck", 'drift']);
        Matter.Body.rotate(mob[mob.length - 1], Math.random() * 2 * Math.PI)
        let me = mob[mob.length - 1]
        me.blinkRate = 30 + Math.round(Math.random() * 30); //required for blink/drift
		me.blinkLength = 150; //required for blink/drift
        me.collisionFilter.mask = 0x001100; //move through walls
        me.isStatic = true;
        me.memory = 360; //memory+memory*Math.random()
        me.seePlayerFreq = 74;
    },
    sneakAttacker: function(x, y, radius = 15 + Math.ceil(Math.random() * 30)) { //'rgba(235,235,235,1)'
        mobs.spawn(x, y, 6, radius, 'rgba(235,235,235,', ['gravity', "fallCheck", 'sneakAttack']);
        let me = mob[mob.length - 1]
        me.g = 0.0005 //required if using 'gravity'
        me.collisionFilter.mask = 0x000001 //can't be hit by bullets or player
        Matter.Body.rotate(me, Math.PI * 0.17)
        me.fill = 'transparent'
    },
    spawner: function(x, y, radius = 55 + Math.ceil(Math.random() * 50)) { //'rgba(255,150,0,1)'
        mobs.spawn(x, y, 5, radius, 'rgba(255,150,0,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
        let me = mob[mob.length - 1]
        me.g = 0.0004 //required if using 'gravity'
        me.accelMag = 0.001
        me.memory = 240 //memory+memory*Math.random() in cycles
        me.onDeath = function(that) { //run this function on hitting player
            for (let i = 0; i < Math.ceil(that.mass * 0.35); ++i) {
                spawn.spawns(that.position.x + (Math.random() - 0.5) * radius*2, that.position.y + (Math.random() - 0.5) * radius*2)
				Matter.Body.setVelocity(mob[mob.length - 1], {
					x: (Math.random()-0.5)*50,
					y: (Math.random()-0.5)*50
				});
            }
        }
    },
    spawns: function(x, y, radius = 15 + Math.ceil(Math.random() * 5)) { //'rgba(255,0,0,,1)'
        mobs.spawn(x, y, 4, radius, 'rgba(255,0,0,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
        let me = mob[mob.length - 1]
        me.onHit = function(k) { //run this function on hitting player
			spawn.explode(k)
        }
        me.g = 0.00015; //required if using 'gravity'
        me.accelMag = 0.0004;
    },
    exploder: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(255,0,0,,1)'
        mobs.spawn(x, y, 7, radius, 'rgba(255,0,0,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
        let me = mob[mob.length - 1]
        me.onHit = function(k) { //run this function on hitting player
			spawn.explode(k)
        }
        me.g = 0.0004; //required if using 'gravity'
        me.accelMag = 0.0014;
    },
	explode: function(k){
		mech.damage(0.1 * Math.sqrt(mob[k].mass) * game.dmgScale)
		game.drawList.push({ //add dmg to draw queue
			x: mech.pos.x,
			y: mech.pos.y,
			radius: 80*Math.sqrt(mob[k].mass),
			color: 'rgba(255,0,0,0.25)',
			time: 5
		});
		mob[k].death(false)
	},
    dot: function(k, num = 3, delay = 1000) { //adds a damage over time to the mob onHit method
		//sometimes causes the player to have undefined health (and be unkillable)
        for (let i = 0; i < num; ++i) { //dots
            setTimeout(function() {
                mech.damage(0.01 * Math.sqrt(mob[k].mass) * game.dmgScale)
                game.drawList.push({ //add dmg to draw queue
                    x: mech.pos.x,
                    y: mech.pos.y,
                    radius: 50,
                    color: 'rgba(125,100,150,0.5)',
                    time: 1
                });
            }, (i + 1) * 1000)
        }
        game.drawList.push({ //add dmg to draw queue
            x: mech.pos.x,
            y: mech.pos.y,
            radius: 100,
            color: 'rgba(125,100,150,0.5)',
            time: 5
        });

    },

    //complex constrained mob templates******************************************************************************
    //***************************************************************************************************************
	turret: function(x, y, radius = 25) { //'rgba(140,100,250,1)'
		mobs.spawn(x, y, 3, radius, 'rgba(140,100,250,', ["seePlayerCheck", "fallCheck", 'fireAt']);
		let me = mob[mob.length - 1]
		me.frictionAir = 0.02;
		me.memory = 180; //memory+memory*Math.random() in cycles
		me.fireDelay = Math.ceil(30 + 2000 / radius)
		me.faceOnFire = false; //prevents rotation on fire
	},
	gunner: function(x, y, radius = 50) { //'rgba(110,150,200,1)'
		mobs.spawn(x, y, 4, radius, 'rgba(110,150,200,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
		let me = mob[mob.length - 1]
		me.g = 0.0005; //required if using 'gravity'
		me.accelMag = 0.0012;
		me.memory = 240; //memory+memory*Math.random() in cycles
		spawn.turret(x,y-100);
		consBB[consBB.length] = Constraint.create({
			bodyA: mob[mob.length - 1],
			bodyB: mob[mob.length - 2],
			stiffness: 0.0005
		})
		me.onDeath = function(that) { //run this function on hitting player

		}
	},
	swinger: function(x, y, radius = 25 + Math.ceil(Math.random() * 50)) { //'rgba(110,150,200,1)'
		mobs.spawn(x, y, 4, radius, 'rgba(110,150,200,', ['gravity', "seePlayerCheck", "fallCheck", "attraction"]);
		let me = mob[mob.length - 1]
		me.g = 0.0005; //required if using 'gravity'
		me.accelMag = 0.0012;
		me.memory = 240; //memory+memory*Math.random() in cycles
		spawn.bodyRect(x, y+100, 50, 50); //center platform
		consBB[consBB.length] = Constraint.create({
			bodyA: mob[mob.length - 1],
			bodyB: body[body.length - 1],
			stiffness: 0.05
		})
	},
    snake: function(x, y, r = 25, l = 70, stiffness = 0.05, num = 6, faceRight = false) {
        if (faceRight) l *= -1
        mobs.spawn(x - l * 0.4, y, 4, r * 1.6, 'rgba(235,55,55,', ["seePlayerCheck", "fallCheck", "attraction"]);
        mob[mob.length - 1].accelMag = 0.0006 * mob[mob.length - 1].mass * Math.sqrt(num);
        mob[mob.length - 1].friction = 0;
        mob[mob.length - 1].frictionStatic = 0;
        mob[mob.length - 1].memory = 340; //memory+memory*Math.random() in cycles
        for (let i = 0; i < num; i += 2) {
            mobs.spawn(x + l * (i + 1), y, 4, r, 'rgba(0,0,0,', ['gravity', "fallCheck"]);
            mob[mob.length - 1].g = 0.0001; //required if using 'gravity'
            mob[mob.length - 1].density = 0.00001;
            mob[mob.length - 1].friction = 0;
            mob[mob.length - 1].frictionStatic = 0;
            consBB[consBB.length] = Constraint.create({
                bodyA: mob[mob.length - 1],
                bodyB: mob[mob.length - 2],
                stiffness: stiffness
            })
            mobs.spawn(x + l * (i + 2), y, 4, r, 'rgba(235,55,55,', ['gravity', "fallCheck"]);
            mob[mob.length - 1].g = 0.0001; //required if using 'gravity'
            mob[mob.length - 1].density = 0.00001;
            mob[mob.length - 1].friction = 0;
            mob[mob.length - 1].frictionStatic = 0;
            consBB[consBB.length] = Constraint.create({
                bodyA: mob[mob.length - 1],
                bodyB: mob[mob.length - 2],
                stiffness: stiffness
            })
        }
        for (let i = 0; i < num - 1; ++i) { //add constraint between mobs that are one apart
            consBB[consBB.length] = Constraint.create({
                bodyA: mob[mob.length - 1 - i],
                bodyB: mob[mob.length - 3 - i],
                stiffness: stiffness
            })
        }
    },
    squid: function(x, y, radius = 30, length = 500, stiffness = 0.001, num = 7) {
        //almost a blinker
        mobs.spawn(x, y, 6, radius * 6, 'rgba(0,15,30,', ["seePlayerCheck", "fallCheck", 'blink']); //,'pullPlayer','repelBullets']);
        mob[mob.length - 1].collisionFilter.mask = 0x001100; //move through walls
        mob[mob.length - 1].isStatic = true;
        mob[mob.length - 1].memory = 360; //memory+memory*Math.random()
        for (let i = 0; i < num; ++i) {
            this.burster(x + 2 * radius * i - (num - 1) * radius, y - length * 0.8 - length * 0.4 * Math.random() - radius * 2, radius);
            consBB[consBB.length] = Constraint.create({
                bodyA: mob[mob.length - i - 2],
                bodyB: mob[mob.length - 1],
                stiffness: stiffness
            })
        }
    },
    nodeBoss: function(x, y, spawn = 'striker',
        nodes = Math.ceil(Math.random() * 3) + 4,
        radius = Math.ceil(Math.random() * 10) + 17,
        l = Math.ceil(Math.random() * 100) + 70,
        stiffness = Math.random() * 0.07 + 0.01) {
        if (spawn === 'shooter' || spawn === 'hopper' || spawn === 'puller' || spawn === 'blinker' || spawn === 'pullSploder' || spawn === 'drifter') nodes = Math.ceil(Math.random() * 2) + 2 //keeps the bad bosses from having too many nodes
        let px = 0;
        let py = 0;
        let a = 2 * Math.PI / nodes;
        for (let i = 0; i < nodes; ++i) {
            px += l * Math.cos(a * i);
            py += l * Math.sin(a * i);
            this[spawn](x + px, y + py, radius);
        }
        this.constrainAllMobCombos(nodes, stiffness);
    },
    //constraints *****************************************************************************************************************
    //*****************************************************************************************************************************
    constrainAllMobCombos: function(num, stiffness) { //runs thourgh every combination of last 'num' bodies and constrains them
        let a = []
        for (let i = 1; i < num + 1; ++i) {
            for (let j = i + 1; j < num + 1; ++j) {
                consBB[consBB.length] = Constraint.create({
                    bodyA: mob[mob.length - i],
                    bodyB: mob[mob.length - j],
                    stiffness: stiffness
                })
            }
        }
        return a
    },
    constraintPB: function(x, y, bodyIndex, stiffness) {
        cons[cons.length] = Constraint.create({
            pointA: {
                x: x,
                y: y
            },
            bodyB: body[bodyIndex],
            stiffness: stiffness,
        })
    },
    constraintBB: function(bodyIndexA, bodyIndexB, stiffness) {
        consBB[consBB.length] = Constraint.create({
            bodyA: body[bodyIndexA],
            bodyB: body[bodyIndexB],
            stiffness: stiffness,
        })
    },
    // body and map spawns ********************************************************************************************
    //*****************************************************************************************************************
    bodyRect: function(x, y, width, height, properties) { //speeds up adding reactangles to map array
        body[body.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties);
		body[body.length-1].health = 1;
    },
    bodyVertex: function(x, y, vector, properties) { //addes shape to body array
        body[body.length] = Matter.Bodies.fromVertices(x, y, Vertices.fromPath(vector), properties);
    },
    mapRect: function(x, y, width, height, action, properties) { //addes reactangles to map array
        var len = map.length;
        map[len] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties);
        if (action) {
            map[len].action = action;
        }
    },
    mapVertex: function(x, y, vector, action, properties) { //addes shape to map array
        var len = map.length;
        map[len] = Matter.Bodies.fromVertices(x, y, Vertices.fromPath(vector), properties);
        if (action) map[len].action = action;
    },
    //complex map templates
    spawnBuilding: function(x, y, w, h, leftDoor, rightDoor, walledSide) {
        this.mapRect(x, y, w, 25); //roof
        this.mapRect(x, y + h, w, 35); //ground
        if (walledSide === 'left') {
            this.mapRect(x, y, 25, h); //wall left
        } else {
            this.mapRect(x, y, 25, h - 150); //wall left
            if (leftDoor) {
                this.bodyRect(x + 5, y + h - 150, 15, 150, this.propsFriction); //door left
            }
        }
        if (walledSide === 'right') {
            this.mapRect(x - 25 + w, y, 25, h); //wall right
        } else {
            this.mapRect(x - 25 + w, y, 25, h - 150); //wall right
            if (rightDoor) {
                this.bodyRect(x + w - 20, y + h - 150, 15, 150, this.propsFriction); //door right
            }
        }
    },
    spawnStairs: function(x, y, num, w, h, stepRight) {
        w += 50;
        if (stepRight) {
            for (let i = 0; i < num; i++) {
                this.mapRect(x - w / num * (1 + i), y - h + i * h / num, w / num + 50, h - i * h / num + 50);
            }
        } else {
            for (let i = 0; i < num; i++) {
                this.mapRect(x + i * w / num, y - h + i * h / num, w / num + 50, h - i * h / num + 50);
            }
        }


    },
    //premade property options*****************************************************************************************************
    //*****************************************************************************************************************************
    //Object.assign({}, propsHeavy, propsBouncy, propsNoRotation)      //will combine properties into a new object
    propsFriction: {
        friction: 0.5,
        frictionAir: 0.02,
        frictionStatic: 1,
    },
    propsBouncy: {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 1,
    },
    propsSlide: {
        friction: 0.01,
        frictionAir: 0.01,
        frictionStatic: 0.1,
        restitution: 0.1,
    },
    propsLight: {
        density: 0.001
    },
    propsOverBouncy: {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 1.05,
    },
    propsHeavy: {
        density: 0.01 //default density is 0.001
    },
    propsNoRotation: {
        inertia: Infinity, //prevents rotation
    },
    propsDoor: {
        density: 0.001, //default density is 0.001
        friction: 0,
        frictionAir: 0.03,
        frictionStatic: 0,
        restitution: 0,
    },
}
