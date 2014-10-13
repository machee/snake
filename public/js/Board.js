define(function() {
    function Board(size) {
        this.size = size;
        
        this.occupied    = {};
        this.spaces      = {};
        this.emptySpaces = [];
        for (var x = 0; x < this.size; x++) {
            this.spaces[x] = {};
            for (var y = 0; y < this.size; y++) {
                this.spaces[x][y] = { x: x, y: y };
                this.emptySpaces.push(this.spaces[x][y]);
            }
        }
    }
    
    Board.prototype.occupy = function(x, y) {
        var crash = -1 !== [-1, this.size].indexOf(x);
        crash = crash || -1 !== [-1, this.size].indexOf(y);
        crash = crash || (this.occupied[x] && this.occupied[x][y]);
        
        if (crash) {
            return false;
        }
        
        this.emptySpaces.splice(
            this.emptySpaces.indexOf(this.spaces[x][y]), 1
        );
        if (!this.occupied[x]) {
            this.occupied[x] = {};
        }
        this.occupied[x][y] = true;
        
        return true;
    };
    
    Board.prototype.free = function(x, y) {
        this.occupied[x][y] = false;
        this.emptySpaces.push(this.spaces[x][y]);
    };
    
    Board.prototype.getEmptySpace = function() {
        if (!this.emptySpaces.length) {
            return null;
        }
        
        return this.emptySpaces[
            Math.floor(this.emptySpaces.length * Math.random())
        ];
    };
    
    return Board;
});
