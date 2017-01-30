// set it up to as soon as possible.
window.onload = function() {
    // creat our list of states
    var states = {
        // the start state just shows a menu that will start the game
        start : {
            // keep track of our entities
            button : null,
            
            // load our assets
            preload : function() {
                game.load.image( 'button', 'assets/paddle.png' );
            },
            
            // run at the very beginning to add all entities
            create : function() {
                // add our text
                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                game.add.text( 5, 4, "Let's play some Breakout", style );
                
                // add the start button
                this.button = game.add.button( game.world.centerX - 60, game.world.centerY, 'button', this.onClick, this, 1, 1, 1 );
                this.button.scale.setTo( 4, 4 );
                
                // add button text
                style.fontSize = '20px';
                style.fill = 'black';
                game.add.text( 175, 204, "leggo", style );
            },
            
            // do nothing each frame
            update : function() {},
            
            // start the game when the start button is clicked
            onClick : function() {
                this.state.start( 'Game' );
            }
        },
        
        // the game state
        game : {
            // keep track of our entities
            paddle : null,
            ball : null,
            blocks : null,
            text : null,

            // keep track of our vars
            ballLaunched : null,
            ballVelocity : null,
            
            // load up assets
            preload : function() {
                game.load.image( 'paddle', 'assets/paddle.png' );
                game.load.image( 'block', 'assets/paddle.png' );
                game.load.image( 'ball', 'assets/ball.png' );
            },
            
            // run at the beginning to add all entities
            create : function() {
                // set whether the ball has been launched and its velocity
                this.ballLaunched = false;
                this.ballVelocity = 300;

                // create the player's paddle and the ball
                this.paddle = this.createPaddle( game.world.width / 2, game.world.height - 4 );
                this.ball   = this.createBall( game.world.width / 2, game.world.height - 12 );

                // make our blocks
                this.blocks = new Map();
                var row, col;
                for( row = 0; row < 5; ++row ) {
                    for( col = 0; col < 11; ++col ) {
                        this.blocks.set( 'block' + row + col, this.createBlock( 32 + ( col * 2 ) + 32 * col, 32 + 16 * row ) );
                    }
                }
                
                // add our text
                var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.text = game.add.text( 20, 300, "psst. click to launch!", style );

                // launch the ball when the user clicks the mouse
                game.input.onDown.addOnce( this.launchBall, this );
            },
            
            // run every frame to update paddle possible and check for collisions
            update : function() {
                // make the paddle follow the mouse
                this.controlPaddle( this.paddle, game.input.x );

                // check for a collision between the paddle and the ball
                game.physics.arcade.collide( this.paddle, this.ball );

                // check for a collision between the ball and a block
                for( var [ key, block ] of this.blocks ) {
                    // if there's a hit, remove the sprite from the game and the block from our map
                    if( game.physics.arcade.collide( this.ball, block ) ) {
                        block.destroy();
                        this.blocks.delete( key );
                    }
                }

                // check if the player has won
                if( this.blocks.size === 0 ) {
                    this.state.start( 'You Win' );
                }

                // check if the ball hit the bottom of the screen
                if( this.ball.body.blocked.down ) {
                    this.state.start( 'You Lose' );
                }
                
                // if ball hasn't been launched, but ball on top of paddle
                if( !this.ballLaunched ) {
                    this.ball.x = this.paddle.x;
                    this.ball.y = this.paddle.y - this.paddle.height;
                }
            },
            
            // create the player's paddle
            createPaddle : function( x, y ) {
                // add the sprite to the world and set anchor point to middle of sprite
                var paddle = game.add.sprite( x, y, 'paddle' );
                paddle.anchor.setTo( 0.5, 0.5 );
                paddle.scale.setTo( 2, 1 );

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
                
                // launch or reset the ball
                if( this.ballLaunched ) {
                    this.ball.x = game.world.centerX;
                    this.ball.y = game.world.centerY;

                    this.ball.body.velocity.setTo( 0, 0 );

                    this.ballLaunched = false;
                }
                else {
                    this.ball.body.velocity.x = -this.ballVelocity;
                    this.ball.body.velocity.y = -this.ballVelocity;

                    this.ballLaunched = true;
                }
            },
            
            // create a block to hit
            createBlock : function( x, y ) {
                // add the sprite to the world and set anchor point to middle of sprite
                var block = game.add.sprite( x, y, 'block' );
                block.anchor.setTo( 0.5, 0.5 );

                // handle physics
                game.physics.arcade.enable( block );
                block.body.collideWorldBounds = true;
                block.body.immovable = true;

                return block;
            }
        },
        
        // the game state where the player loases
        loser : {
            // keep track of our entities
            button : null,
            
            // load up assets
            preload : function() {
                game.load.image( 'button', 'assets/paddle.png' );
            },
            
            // add our text and button to the screen
            create : function() {
                // add our text
                var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                game.add.text( 5, 4, "Looks like you lost. Play again?", style );
                
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
        },
        
        // the win state
        winner : {
            // keep track of our entities
            button : null,
            
            // load up our assets
            preload : function() {
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
        }
    };
    
    // create game
    var game = new Phaser.Game( 400, 400, Phaser.AUTO, '' );

    // add our states
    game.state.add( 'Start Menu', states.start );
    game.state.add( 'Game', states.game );
    game.state.add( 'You Lose', states.loser );
    game.state.add( 'You Win', states.winner );

    // start game from the start menu
    game.state.start( 'Start Menu' );
}