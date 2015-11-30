// Initialize Phaser, and create a 400x490px game
// Insert it in the div element of the html
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

// Create our 'main' state that will contain the game
var mainState = {

    // This function will be executed at the beginning     
    // That's where we load the game's assets 
    preload: function() { 
         
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the ball sprite
        game.load.image('ball', 'assets/img/ball.png');
        // Load the pipe sprites
        game.load.image('pipe', 'assets/img/pipe.png');
    },

    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc.  
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the ball on the screen
        this.ball = this.game.add.sprite(100, 245, 'ball');

        // Add gravity to the ball to make it fall
        game.physics.arcade.enable(this.ball);
        this.ball.body.gravity.y = 1000;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.downHandler = this.game.input.onDown.add(this.jump, this);


        // Create a group 
        this.pipes = game.add.group();  
        // Add physics to the group 
        this.pipes.enableBody = true;   
        // Create 20 pipes  
        this.pipes.createMultiple(20, 'pipe'); 
        // adds a row of pipes every 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "40px Arial", fill: "#ffffff" }); 
    },

    // This function is called 60 times per second    
    // It contains the game's logic
    update: function() {
        // If the ball is out of the world (too high or too low), call the 'restartGame' function
        if (this.ball.inWorld == false) {
            this.restartGame();
        }
        game.physics.arcade.overlap(this.ball, this.pipes, this.restartGame, null, this); 
    },

    // Make the ball jump 
    jump: function() {  
        // Add a vertical velocity to the ball
        this.ball.body.velocity.y = -350;
    },

    // this funciton creates a new pipe 
    // by default, all the pipes in the group are not displayed (dead)
    // automatically kills each pipe when its no longer visible so never run out of pipes
    addOnePipe: function(x, y) {  
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // this displays six pipes in a row with a hole somewhere in the middle
    addRowOfPipes: function() {  
        // Pick where the hole will be
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);   
            }
        }
        // each time a new row of pipes is created, or the ball goes through hole
        // add score to the label text
        this.score += 1;  
        this.labelScore.text = this.score;
    },  

    // Restart the game
    restartGame: function() {  
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');