// the win state
states.winner = {
    // keep track of our entities
    button : null,

    // load up our assets
    preload : function() {
        game.load.crossOrigin = true;
        game.load.image( 'button', 'assets/paddle.png' );
    },

    // put the text and the button on the screen
    create : function() {
        // add our text
        var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        game.add.text( 5, 4, "Hey you finally won. Play again?", style );

        // add the start button
        this.button = game.add.button( game.world.centerX - 60, game.world.centerY, 'button', this.onClick, this, 1, 1, 1 );
        this.button.scale.setTo( 4, 4 );

        // add button text
        style.fontSize = '20px';
        style.fill = 'black';
        game.add.text( 175, 204, "again!", style );
    },

    // do nothing each frame
    update : function() {},

    // start the game when the button is clicked
    onClick : function() {
        this.state.start( 'Game' );
    }
};

// add the state to the game
game.state.add( 'You Win', states.winner );