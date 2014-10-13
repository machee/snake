define(['DIRS'], function(DIRS) {
    function Renderer(game, canvas) {
        this.game       = game;
        this.canvasElem = canvas;
        this.canvas     = canvas.getContext('2d');
        
        this.adjustSize();
        
        window.onresize = this.adjustSize.bind(this);
        this.requestAnimationFrame();
    }
    
    Renderer.prototype.adjustSize = function(e) {
        this.pixels = Math.min(window.innerWidth, window.innerHeight) - 10;
        if (this.pixels < 100) {
            this.pixels = 100;
        }
        this.canvasElem.width = this.canvasElem.height = this.pixels;
    };
    
    Renderer.prototype.draw = function() {
        var canvas = this.canvas,
            head   = this.game.dragonHead,
            tail   = this.game.dragonTail,
            bodies = this.game.dragonBodies,
            pellet = this.game.pellet,
            interp;
            
        if (this.game.paused) {
            interp = this.game.paused;
        } else {
            interp = this.game.tickNext - Date.now();
        }
        
        interp /= this.game.tickSpeed;
        
        var t = this.pixels/this.game.board.size;
            
        if (interp < 0) {
            interp = 0;
        }
        
        canvas.clearRect(0, 0, this.pixels, this.pixels);
        
        // body
        canvas.fillStyle = "rgb(200, 200, 200)";
        bodies.forEach(function(body) {
            canvas.fillRect(body.x * t, body.y * t, t, t);
            canvas.strokeRect(body.x * t, body.y * t, t, t);
        });
        
        // tail
        if (tail.dir) {
            canvas.fillRect(
                (tail.x - interp * DIRS[tail.dir].x) * t,
                (tail.y - interp * DIRS[tail.dir].y) * t, t, t);
            canvas.strokeRect(
                (tail.x - interp * DIRS[tail.dir].x) * t,
                (tail.y - interp * DIRS[tail.dir].y) * t, t, t);
        }
        canvas.fillRect(tail.x * t, tail.y * t, t, t);
        canvas.strokeRect(tail.x * t, tail.y * t, t, t);
        
        // head
        if (this.game.gameOver) {
            canvas.fillStyle = "rgb(0, 0, 0)";
        }
        canvas.fillRect(
            (head.x - interp * DIRS[head.dir].x) * t,
            (head.y - interp * DIRS[head.dir].y) * t, t, t );
        canvas.strokeRect(
            (head.x - interp * DIRS[head.dir].x) * t,
            (head.y - interp * DIRS[head.dir].y) * t, t, t );

        // pellet
        canvas.beginPath();
        canvas.arc(
            (pellet.x + 0.5) * t,
            (pellet.y + 0.5) * t,
            t * 0.3,
            0,
            Math.PI * 2
        );
        canvas.stroke();

        this.requestAnimationFrame();
    };
    
    Renderer.prototype.requestAnimationFrame = function() {
        window.requestAnimationFrame(this.draw.bind(this));
    }
    
    return Renderer;
});
