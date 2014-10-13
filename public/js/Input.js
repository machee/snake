define(['DIRS'], function(DIRS) {
    var KEYS = {};
    KEYS[38] = KEYS[87] = KEYS[104] = DIRS.UP;
    KEYS[39] = KEYS[68] = KEYS[102] = DIRS.RIGHT;
    KEYS[40] = KEYS[83] = KEYS[98]  = DIRS.DOWN;
    KEYS[37] = KEYS[65] = KEYS[100] = DIRS.LEFT;
    
    function Input(game) {
        this.game = game;

        window.onkeydown = function(e) {
            if (e.repeat) {
                return;
            }
            
            if (KEYS[e.keyCode]) {
                this.game.move(KEYS[e.keyCode]);
                return;
            }
            
            if (32 === e.keyCode) {
                this.game.pause();
            }
        }.bind(this);
        
        this.game.onclick(this.game.pause.bind(this.game));
        
        window.addEventListener('touchstart', function(e) {
            this.touch = {
                x: e.changedTouches[0].screenX,
                y: e.changedTouches[0].screenY
            };
        }.bind(this));
        
        window.addEventListener('touchend', function(e) {
            var touchEnd = {
                x: e.changedTouches[0].screenX,
                y: e.changedTouches[0].screenY
            };
            
            var x = touchEnd.x - this.touch.x;
            var y = touchEnd.y - this.touch.y;
            
            if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > 50) {
                if (Math.abs(x) > Math.abs(y)) {
                    this.game.move(x > 0 ? DIRS.RIGHT : DIRS.LEFT);
                } else {
                    this.game.move(y > 0 ? DIRS.DOWN : DIRS.UP);
                }
            }
        }.bind(this));
    }
    
    return Input;
});
