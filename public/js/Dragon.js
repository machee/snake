define(['Board', 'DIRS', 'Input', 'Renderer'], function(Board, DIRS, Input, Renderer) {
    function Dragon() {
        document.getElementById('dragon')
            .innerHTML = '<canvas id="canvas"></canvas>';
        
        this.newGame();

        this.renderer = new Renderer(this, document.getElementById('canvas'));
        new Input(this);
    }
    
    Dragon.prototype.newGame = function() {
        this.board = new Board(16);
        
        var dx = 1,
            dy = this.board.size - 1;
            
        this.dragonHead   =   { x: dx + 2, y: dy, dir: DIRS.RIGHT };
        this.dragonTail   =   { x: dx    , y: dy, dir: DIRS.RIGHT };
        this.dragonBodies = [ { x: dx + 1, y: dy, dir: DIRS.RIGHT } ];
        
        this.board.occupy(dx    , dy);
        this.board.occupy(dx + 1, dy);
        this.board.occupy(dx + 2, dy);

        this.dragonGrow = 0;
        
        this.pellet = { x: Math.floor(this.board.size/2) };
        this.pellet.y = this.pellet.x;
        
        this.tickNext = Date.now();
        this.tickSpeed = 5000/this.board.size;
        
        this.dirNext = DIRS.RIGHT;
        this.dirLog = [ DIRS.RIGHT ];
        
        this.autoDrive = true;
        
        this.gameOver = false;
        
        this.gameLoopId = setTimeout(this.gameLoop.bind(this), 0);
    };
    
    Dragon.prototype.gameLoop = function() {
        if (this.paused || this.gameOver) {
            throw new Error('game loop while paused/gameOver');
        }
        var ticks = 0;
        while (this.tickNext <= Date.now()) {
            ticks++;
            this.tick();
            if (this.gameOver) {
                return;
            }
        }
        if (ticks > 1) {
            console.log(ticks, 'ticks', this.tickSpeed);
        }
        this.gameLoopId =
            setTimeout(this.gameLoop.bind(this), this.tickNext - Date.now());
    };
    
    Dragon.prototype.move = function(dir) {
        this.dirNext = dir;
    };
    
    Dragon.prototype.pause = function() {
        if (this.gameOver) {
            return this.newGame();
        }
        
        if (!this.paused) {
            clearTimeout(this.gameLoopId);
            this.paused = this.tickNext - Date.now();
            if (!this.paused) {
                this.paused = 1;
            }
        } else {
            this.tickNext = this.paused + Date.now();
            this.gameLoopId = setTimeout(this.gameLoop.bind(this), this.paused);
            this.paused = 0;
        }
    };
    
    Dragon.prototype.onclick = function(cb) {
        this.renderer.canvasElem.onclick = cb;
    };
    
    Dragon.prototype.tick = function() {
        var head     = this.dragonHead,
            tail     = this.dragonTail,
            bodies   = this.dragonBodies,
            body;
        
        if (this.dragonGrow) {
            this.dragonGrow--;
            
            body = {
                x: head.x,
                y: head.y,
                dir:head.dir
            };
            
            bodies.unshift(body);
            
            tail.dir = false;
        } else {
            body = bodies.pop();
            
            this.board.free(tail.x,tail.y);

            tail.x   = body.x;
            tail.y   = body.y;
            tail.dir = body.dir;
            
            // reuse body
            body.x   = head.x;
            body.y   = head.y;
            body.dir = head.dir;
            
            bodies.unshift(body);
        }
        
        if (this.dirNext === DIRS[head.dir].blocks) {
            this.dirNext = head.dir;
        }
        
        var go = DIRS[this.dirNext];

        head.x += go.x;
        head.y += go.y;
        head.dir = this.dirNext;
        
        this.dirLog.push(head.dir);
        
        var crash = !this.board.occupy(head.x, head.y);
        
        if (crash) {
            console.log('crash!');
            this.gameOver = true;
        } else {
            if (head.x === this.pellet.x && head.y === this.pellet.y) {
                console.log('pellet get!');
                var newPellet = this.board.getEmptySpace();
                if (!newPellet) {
                    console.log('win!');
                    this.gameOver = true;
                } else {
                    this.pellet.x = newPellet.x;
                    this.pellet.y = newPellet.y;
                    
                    this.dragonGrow += 1;
                    
                    if (this.tickSpeed > 50) {
                        this.tickSpeed *= 0.95;
                    }
                }
            }
        }
        
        this.tickNext += this.tickSpeed;
    };
    
    return Dragon;
});
