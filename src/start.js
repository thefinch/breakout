// the start state just shows a menu that will start the game
states.start = {
    // keep track of our entities
    button : null,

    // load our assets
    preload : function() {
        game.load.crossOrigin = true;
        game.load.image( 'button', 'assets/paddle.png' );
    },

    // run at the very beginning to add all entities
    create : function() {
        // add our text
        var style = { font: "bold 28px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        game.add.text( 30, 150, "Let's play some Breakout", style );

        // add the start button
        this.button = game.add.button( game.world.centerX - 60, game.world.centerY, 'button', this.onClick, this, 1, 1, 1 );
        this.button.scale.setTo( 4, 4 );

        // add button text
        style.fontSize = '20px';
        style.fill = 'black';
        game.add.text( 178, 204, "Sure", style );
    },

    // do nothing each frame
    update : function() {},

    // start the game when the start button is clicked
    onClick : function() {
        this.state.start( 'Game' );
    }
};

// add the state to the game
game.state.add( 'Start Menu', states.start );