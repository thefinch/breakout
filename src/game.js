// the game state
states.game = {
    // keep track of our entities
    paddle : null,
    ball : null,
    blocks : null,
    text : null,
    livesText : null,
    scoreText : null,
    levelText : null,
    lives : 0,
    score : 0,
    level : 1,
    levels : [
        [
            [ 'block', [ 64, 32 ] ],
            [ 'block', [ 132, 32 ] ],
            [ 'block', [ 200, 32 ] ],
            [ 'block', [ 268, 32 ] ],
            [ 'block', [ 336, 32 ] ],
            [ 'block', [ 30, 48 ] ],
            [ 'block', [ 98, 48 ] ],
            [ 'block', [ 166, 48 ] ],
            [ 'block', [ 234, 48 ] ],
            [ 'block', [ 302, 48 ] ],
            [ 'block', [ 370, 48 ] ],
            [ 'block', [ 64, 64 ] ],
            [ 'block', [ 132, 64 ] ],
            [ 'block', [ 200, 64 ] ],
            [ 'block', [ 268, 64 ] ],
            [ 'block', [ 336, 64 ] ],
            [ 'block', [ 30, 80 ] ],
            [ 'block', [ 98, 80 ] ],
            [ 'block', [ 166, 80 ] ],
            [ 'block', [ 234, 80 ] ],
            [ 'block', [ 302, 80 ] ],
            [ 'block', [ 370, 80 ] ],
            [ 'block', [ 64, 96 ] ],
            [ 'block', [ 132, 96 ] ],
            [ 'block', [ 200, 96 ] ],
            [ 'block', [ 268, 96 ] ],
            [ 'block', [ 336, 96 ] ],
        ],
        [
            [ 'block', [ 30, 32 ] ],
            [ 'block', [ 98, 32 ] ],
            [ 'block', [ 132, 32 ] ],
            [ 'block', [ 166, 32 ] ],
            [ 'block', [ 234, 32 ] ],
            [ 'block', [ 268, 32 ] ],
            [ 'block', [ 302, 32 ] ],
            [ 'block', [ 370, 32 ] ],
            [ 'block', [ 30, 48 ] ],
            [ 'block', [ 98, 48 ] ],
            [ 'block', [ 166, 48 ] ],
            [ 'block', [ 234, 48 ] ],
            [ 'block', [ 302, 48 ] ],
            [ 'block', [ 370, 48 ] ],
            [ 'block', [ 30, 64 ] ],
            [ 'block', [ 98, 64 ] ],
            [ 'block', [ 166, 64 ] ],
            [ 'block', [ 234, 64 ] ],
            [ 'block', [ 302, 64 ] ],
            [ 'block', [ 370, 64 ] ],
            [ 'block', [ 30, 80 ] ],
            [ 'block', [ 98, 80 ] ],
            [ 'block', [ 166, 80 ] ],
            [ 'block', [ 234, 80 ] ],
            [ 'block', [ 302, 80 ] ],
            [ 'block', [ 370, 80 ] ],
            [ 'block', [ 30, 96 ] ],
            [ 'block', [ 64, 96 ] ],
            [ 'block', [ 98, 96 ] ],
            [ 'block', [ 166, 96 ] ],
            [ 'block', [ 200, 96 ] ],
            [ 'block', [ 234, 96 ] ],
            [ 'block', [ 302, 96 ] ],
            [ 'block', [ 336, 96 ] ],
            [ 'block', [ 370, 96  ]]
        ],
        [
            [ 'block', [ 132, 48 ] ],
            [ 'block', [ 268, 48 ] ],
            [ 'block', [ 30, 64 ] ],
            [ 'block', [ 64, 64 ] ],
            [ 'block', [ 98, 64 ] ],
            [ 'block', [ 132, 64 ] ],
            [ 'block', [ 166, 64 ] ],
            [ 'extra', [ 200, 64 ] ],
            [ 'block', [ 234, 64 ] ],
            [ 'block', [ 268, 64 ] ],
            [ 'block', [ 302, 64 ] ],
            [ 'block', [ 336, 64 ] ],
            [ 'block', [ 370, 64 ] ],
            [ 'block', [ 132, 80 ] ],
            [ 'block', [ 268, 80 ] ],
        ],
    ],
    soundEffects : {},

    // keep track of our vars
    ballLaunched : null,
    ballVelocity : null,

    // load up assets
    preload : function() {
        game.load.crossOrigin = true;
        
        // load images
        game.load.image( 'paddle', 'assets/paddle.png' );
        game.load.image( 'block', 'assets/paddle.png' );
        game.load.image( 'extra', 'assets/extra.png' );
        game.load.image( 'ball', 'assets/ball.png' );
        
        // load sound effects
        game.load.audio( 'ball_hits_paddle', 'assets/ball_hits_paddle.wav' );
        game.load.audio( 'ball_hits_block', 'assets/ball_hits_block.wav' );
    },
    
    // build the level that was requested
    buildLevel : function( level ) {
        // make a new set of blocks
        this.blocks = new Map();
        
        // build the blocks
        for( block = 0; block < this.levels[ level ].length; ++block ) {
            this.blocks.set( 'block' + block, this.createBlock( this.levels[ level ][ block ][ 0 ], this.levels[ level ][ block ][ 1 ][ 0 ],  this.levels[ level ][ block ][ 1 ][ 1 ] ) );
        }
    },

    // run at the beginning to add all entities
    create : function() {
        // set whether the ball has been launched and its velocity
        this.ballLaunched = false;
        this.ballVelocity = 200;
        
        // set number of lives we're allowed, score, and level
        this.lives = 3;
        this.score = 0;
        this.level = 0;

        // create the player's paddle and the ball
        this.paddle = this.createPaddle( game.world.width / 2, game.world.height - 4 );
        this.ball   = this.createBall( game.world.width / 2, game.world.height - 12 );

        // make our blocks
        this.buildLevel( this.level );
    
        // add our initial help text
        var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = game.add.text( 20, 300, "psst. click to launch!", style );
      
        // add our lives tracker
        style = { font: "bold 12px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.livesText = game.add.text( 340, 8, "Lives: 3", style );
        
        // add our score tracker
        this.scoreText = game.add.text( 12, 8, "Score: 0", style );
        
        // add our level tracker
        this.levelText = game.add.text( 178, 8, "Level 1", style );


        // launch the ball when the user clicks the mouse
        game.input.onDown.addOnce( this.launchBall, this );
        
        // setup audio
        this.soundEffects.ballHitsPaddle = game.add.audio( 'ball_hits_paddle' );
        this.soundEffects.ballHitsBlock  = game.add.audio( 'ball_hits_block' );
    },

    // run every frame to update paddle possible and check for collisions
    update : function() {
        // make the paddle follow the mouse
        this.controlPaddle( this.paddle, game.input.x );

        // check for a collision between the paddle and the ball
        if( game.physics.arcade.collide( this.paddle, this.ball ) )
        {
            // play the sound effect
            this.soundEffects.ballHitsPaddle.play();
            
            // figure out where we hit on the paddle
            var random = Math.random() * 10;
            if( this.ball.x <= this.paddle.x - this.paddle.width / 2 + this.paddle.width / 3 ) {
                this.ball.body.velocity.x = -this.ballVelocity - 100 - random;
            }
            else if( this.ball.x >= this.paddle.x - this.paddle.width / 2 + 2 * this.paddle.width / 3 ) {
                this.ball.body.velocity.x = this.ballVelocity + 100 + random;
            }
        }

        // check for a collision between the ball and a block
        for( var [ key, block ] of this.blocks ) {
            // if there's a hit, remove the sprite from the game and the block from our map
            if( game.physics.arcade.collide( this.ball, block ) ) {
                // play the sound effect
                this.soundEffects.ballHitsBlock.play();

                // check if they hit a special block
                if( block.key == 'extra' ) {
                    game.physics.arcade.gravity.y = 200;
                    this.ball.body.allowGravity = false;
                    for( var [ key2, block2 ] of this.blocks ) {
                        block2.body.bounce.y = 0.95;
                        block2.body.allowGravity = true;
                    }
                }
                
                // update the score
                this.score += 10;
                this.scoreText.setText( "Score: " + this.score );
                
                // remove the block
                block.destroy();
                this.blocks.delete( key );
            }
        }

        // check if the player has won
        if( this.blocks.size === 0 ) {
            // move on to the next level
            this.level++;
            
            // if there are no more levels, you win!
            if( this.levels[ this.level ] === undefined ) {
                this.state.start( 'You Win' );
            }
            // otherwise, setup the next level
            else {
                // set the new level text
                this.levelText.setText( "Level " + ( this.level + 1 ) );
                
                // stop it from moving
                this.ball.body.velocity.setTo( 0, 0 );
                
                // build the new level
                this.buildLevel( this.level );
                
                // allow the player to launch it again
                this.ballLaunched = false;
                game.input.onDown.addOnce( this.launchBall, this );
            }
        }

        // check if the ball hit the bottom of the screen
        if( this.ball.body.blocked.down ) {
            // decrease lives
            this.lives--;
            
            // update the text for the lives
            this.livesText.setText( "Lives: " + this.lives );
            
            // end game if needed
            if( this.lives <= 0 ) {
                this.state.start( 'You Lose' );
            }
            // otherwise reset the ball
            else {
                // stop it from moving
                this.ball.body.velocity.setTo( 0, 0 );
                
                // allow the player to launch it again
                this.ballLaunched = false;
                game.input.onDown.addOnce( this.launchBall, this );
            }
        }

        // if ball hasn't been launched, but ball on top of paddle
        if( !this.ballLaunched ) {
            this.ball.x = this.paddle.x;
            this.ball.y = game.world.height - 12;
        }
    },

    // create the player's paddle
    createPaddle : function( x, y ) {
        // add the sprite to the world and set anchor point to middle of sprite
        var paddle = game.add.sprite( x, y, 'paddle' );
        paddle.scale.setTo( 2, 1 );
        paddle.anchor.setTo( 0.5, 0.5 );

        // handle physics
        game.physics.arcade.enable( paddle );
        paddle.body.collideWorldBounds = true;
        paddle.body.immovable = true;

        return paddle;
    },

    // handle moving the paddle
    controlPaddle : function( paddle, x ) {
        // move paddle
        paddle.x = x;

        // make sure it stays in bounds
        if( paddle.x < paddle.width / 2  ) {
            paddle.x = paddle.width / 2;
        }
        else if( paddle.x > game.world.width - paddle.width / 2 ) {
            paddle.x = game.world.width - paddle.width / 2
        }
    },

    // create the ball
    createBall : function( x, y ) {
        // add the sprite to the world and set anchor point to middle of sprite
        var ball = game.add.sprite( x, y, 'ball' );
        ball.anchor.setTo( 0.5, 0.5 );
        ball.scale.setTo( 0.25, 0.25 );

        // handle physics
        game.physics.arcade.enable( ball );
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo( 1, 1 );

        return ball;
    },

    // set the ball moving
    launchBall : function() {
        // remove the text
        this.text.destroy();
        
        // hide the cursor
        this.game.canvas.style.cursor = 'none';

        // launch
        this.ball.body.velocity.x = -this.ballVelocity;
        this.ball.body.velocity.y = -this.ballVelocity;

        this.ballLaunched = true;
    },

    // create a block to hit
    createBlock : function( type, x, y ) {
        // add the sprite to the world and set anchor point to middle of sprite
        var block = game.add.sprite( x, y, type );
        block.anchor.setTo( 0.5, 0.5 );

        // handle physics
        game.physics.arcade.enable( block );
        block.body.collideWorldBounds = true;
        block.body.immovable = true;

        return block;
    }
};        
   
// add the state to the game
game.state.add( 'Game', states.game );