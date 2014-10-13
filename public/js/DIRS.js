define(function() {
    var DIRS = {
        UP    : 1,
        RIGHT : 2,
        DOWN  : 3,
        LEFT  : 4
    };

    DIRS[DIRS.UP]    = { x:  0, y: -1, blocks: DIRS.DOWN  };
    DIRS[DIRS.RIGHT] = { x:  1, y:  0, blocks: DIRS.LEFT  };
    DIRS[DIRS.DOWN]  = { x:  0, y:  1, blocks: DIRS.UP    };
    DIRS[DIRS.LEFT]  = { x: -1, y:  0, blocks: DIRS.RIGHT };
    
    return DIRS;
});
