// the game state where the player loases
states.loser = {
    // keep track of our entities
    button : null,

    // load up assets
    preload : function() {
        game.load.crossOrigin = true;
        game.load.image( 'button', 'assets/paddle.png' );
    },

    // add our text and button to the screen
    create : function() {
        // add our text
        var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        game.add.text( 40, 160, "Looks like you lost. Play again?", style );

        // add the start button
        this.button = game.add.button( game.world.centerX - 60, game.world.centerY, 'button', this.onClick, this, 1, 1, 1 );
        this.button.scale.setTo( 4, 4 );

        // add button text
        style.fontSize = '20px';
        style.fill = 'black';
        game.add.text( 175, 204, "Yeah!", style );
    },

    // do nothing each frame
    update : function() {},

    // start the game when the button is clicked
    onClick : function() {
        this.state.start( 'Game' );
    }
};

// add the state to the game
game.state.add( 'You Lose', states.loser );