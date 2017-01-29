/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBound = "assets/Bound.png";
    

    // the fonts
    this.kFontCon16 = "assets/fonts/Consolas-16";  // notice font names do not need extensions!
    this.kFontCon24 = "assets/fonts/Consolas-24";
    this.kFontCon32 = "assets/fonts/Consolas-32";  // this is also the default system font
    this.kFontCon72 = "assets/fonts/Consolas-72";
    this.kFontSeg96 = "assets/fonts/Segment7-96";

    // Cameras for the 3 scenes
    this.mCameraMain = null;
    this.mCameraAnimation = null;
    this.mCameraZoomed = null;

    // the hero and the support objects
    this.mBound = null;
    this.mBoundMarks = [];
    this.mFontImage = null;
    this.mMinion = null;
    this.mSpriteSheet = null;
    this.mSpriteSheetMarks = [];

    this.mTextSysFont = null;
    this.mTextCon16 = null;
    this.mTextCon24 = null;
    this.mTextCon32 = null;
    this.mTextCon72 = null;
    this.mTextSeg96 = null;

    this.mTextToWork = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // Step A: loads the textures    
    gEngine.Textures.loadTexture(this.kFontImage);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBound);

    // Step B: loads all the fonts
    gEngine.Fonts.loadFont(this.kFontCon16);
    gEngine.Fonts.loadFont(this.kFontCon24);
    gEngine.Fonts.loadFont(this.kFontCon32);
    gEngine.Fonts.loadFont(this.kFontCon72);
    gEngine.Fonts.loadFont(this.kFontSeg96);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kFontImage);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBound);

    // unload the fonts
    gEngine.Fonts.unloadFont(this.kFontCon16);
    gEngine.Fonts.unloadFont(this.kFontCon24);
    gEngine.Fonts.unloadFont(this.kFontCon32);
    gEngine.Fonts.unloadFont(this.kFontCon72);
    gEngine.Fonts.unloadFont(this.kFontSeg96);

    // Step B: starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCameraMain = new Camera(
        vec2.fromValues(50, 33),   // position of the camera
        100,                       // width of camera
        [192, 0, 448, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCameraMain.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mCameraAnimation = new Camera(
        vec2.fromValues(0, 0),
        100,
        [0, 290, 190, 190]
    );
    this.mCameraAnimation.setBackgroundColor([0.7, 0.9, 0.7, 1]);
    
    this.mCameraZoomed = new Camera(
        vec2.fromValues(0, 0),
        100,
        [0, 0, 192, 288]
    );
    this.mCameraZoomed.setBackgroundColor([0.7, 0.7, 0.7, 1]);

    // Step B: Create the font and minion images using sprite
    this.mFontImage = new SpriteRenderable(this.kFontImage);
    this.mFontImage.setColor([1, 1, 1, 0]);
    this.mFontImage.getXform().setPosition(15, 50);
    this.mFontImage.getXform().setSize(20, 20);

    // The right minion
    this.mMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(15, 25);
    this.mMinion.getXform().setSize(24, 19.2);
    this.mMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(5);
                                // show each element for mAnimSpeed updates

    // Sprite Sheet
    this.mSpriteSheet = new SpriteSource(this.kMinionSprite);
    this.mSpriteSheet.getXform().setPosition(70,30);
    this.mSpriteSheet.getXform().setSize(60, 40);

    // Step D: Create the Interactive Bound
    this.mBound = new SpriteRenderable(this.kBound);
    this.mBound.setColor([1, 1, 1, 0]);
    this.mBound.getXform().setPosition(70, 30);
    this.mBound.getXform().setSize(10, 10);
    this.mBound.setElementPixelPositions(0, 512, 0, 512);
    this.mBoundMarks.push(new Renderable());
    this.mBoundMarks.push(new Renderable());
    this.mBoundMarks.push(new Renderable());
    this.mBoundMarks.push(new Renderable());
    // right square
    this.mBoundMarks[0].getXform().setPosition(75, 30);
    this.mBoundMarks[0].getXform().setSize(1, 1);
    this.mBoundMarks[0].setColor([1, 0, 0, 1]);
    // bottom square
    this.mBoundMarks[1].getXform().setPosition(70, 25);
    this.mBoundMarks[1].getXform().setSize(1, 1);
    this.mBoundMarks[1].setColor([0, 1, 0, 1]);
    // left square
    this.mBoundMarks[2].getXform().setPosition(65, 30);
    this.mBoundMarks[2].getXform().setSize(1, 1);
    this.mBoundMarks[2].setColor([0, 0, 1, 1]);
    // top square
    this.mBoundMarks[3].getXform().setPosition(70, 35);
    this.mBoundMarks[3].getXform().setSize(1, 1);
    this.mBoundMarks[3].setColor([1, 0, 1, 1]);
    //<editor-fold desc="Create the fonts!">
//    this.mTextSysFont = new FontRenderable("System Font: in Red");
//    this._initText(this.mTextSysFont, 50, 60, [1, 0, 0, 1], 3);

    this.mTextCon16 = new FontRenderable("Consolas 16: in black");
    this.mTextCon16.setFont(this.kFontCon16);
    this._initText(this.mTextCon16, 40, 2, [0, 0, 0, 1], 2);

//    this.mTextCon24 = new FontRenderable("Consolas 24: in black");
//    this.mTextCon24.setFont(this.kFontCon24);
//    this._initText(this.mTextCon24, 50, 50, [0, 0, 0, 1], 3);
//
//    this.mTextCon32 = new FontRenderable("Consolas 32: in white");
//    this.mTextCon32.setFont(this.kFontCon32);
//    this._initText(this.mTextCon32, 40, 40, [1, 1, 1, 1], 4);
//
//    this.mTextCon72 = new FontRenderable("Consolas 72: in blue");
//    this.mTextCon72.setFont(this.kFontCon72);
//    this._initText(this.mTextCon72, 30, 30, [0, 0, 1, 1], 6);
//
//    this.mTextSeg96  = new FontRenderable("Segment7-92");
//    this.mTextSeg96.setFont(this.kFontSeg96);
//    this._initText(this.mTextSeg96, 30, 15, [1, 1, 0, 1], 7);
    //</editor-fold>

    this.mTextToWork = this.mTextCon16;
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([1, 1, 1, 1]);

    // Step  B: Activate the main Camera
    this.mCameraMain.setupViewProjection();

    // Step  C: Draw everything
    this.mSpriteSheet.draw(this.mCameraMain.getVPMatrix());
    this.mBound.draw(this.mCameraMain.getVPMatrix());
    this.mBoundMarks[0].draw(this.mCameraMain.getVPMatrix());
    this.mBoundMarks[1].draw(this.mCameraMain.getVPMatrix());
    this.mBoundMarks[2].draw(this.mCameraMain.getVPMatrix());
    this.mBoundMarks[3].draw(this.mCameraMain.getVPMatrix());
    this.mFontImage.draw(this.mCameraMain.getVPMatrix());
    this.mMinion.draw(this.mCameraMain.getVPMatrix());

    // drawing the text output
    // this.mTextSysFont.draw(this.mCameraMain.getVPMatrix());
    this.mTextCon16.draw(this.mCameraMain.getVPMatrix());
    // this.mTextCon24.draw(this.mCameraMain.getVPMatrix());
    // this.mTextCon32.draw(this.mCameraMain.getVPMatrix());
    // this.mTextCon72.draw(this.mCameraMain.getVPMatrix());
    // this.mTextSeg96.draw(this.mCameraMain.getVPMatrix());
    
    this.mCameraAnimation.setupViewProjection();
    this.mCameraZoomed.setupViewProjection();
};

// The 
//  function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.5;
    var deltaSize = 1;
    var xform = this.mBound.getXform();

    // Space
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        deltaX *= .01;
        deltaSize *= .01;
    }
    
    // Support Bound movements TODO: rest of bounds
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (xform.getYPos() < this.mSpriteSheet.getXform().getYPos() + this.mSpriteSheet.getXform().getHeight() / 2 - xform.getHeight() / 2) {
            xform.incYPosBy(deltaX);
            for (var i = 0; i < 4; i++) {
                this.mBoundMarks[i].getXform().incYPosBy(deltaX);
            }
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (xform.getYPos() > this.mSpriteSheet.getXform().getYPos() - this.mSpriteSheet.getXform().getHeight() / 2 + xform.getHeight() / 2) {
            xform.incYPosBy(-deltaX);
            for (var i = 0; i < 4; i++) {
                this.mBoundMarks[i].getXform().incYPosBy(-deltaX);
            }
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (xform.getXPos() < this.mSpriteSheet.getXform().getXPos() + this.mSpriteSheet.getXform().getWidth() / 2 - xform.getWidth() / 2) {
            xform.incXPosBy(deltaX);
            for (var i = 0; i < 4; i++) {
                this.mBoundMarks[i].getXform().incXPosBy(deltaX);
            }
        }
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (xform.getXPos() > this.mSpriteSheet.getXform().getXPos() - this.mSpriteSheet.getXform().getWidth() / 2 + xform.getWidth() / 2) {
            xform.incXPosBy(-deltaX);
            for (var i = 0; i < 4; i++) {
                this.mBoundMarks[i].getXform().incXPosBy(-deltaX);
            }
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (xform.getHeight() < 100) {
            xform.incHeightBy(deltaSize);
            this.mBoundMarks[1].getXform().incYPosBy(-deltaX);
            this.mBoundMarks[3].getXform().incYPosBy(deltaX);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (xform.getHeight() > 1) {
            xform.incHeightBy(-deltaSize);
            this.mBoundMarks[1].getXform().incYPosBy(deltaX);
            this.mBoundMarks[3].getXform().incYPosBy(-deltaX);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (xform.getWidth() < 100) {
            xform.incWidthBy(deltaSize);
            this.mBoundMarks[0].getXform().incXPosBy(deltaX);
            this.mBoundMarks[2].getXform().incXPosBy(-deltaX);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if ( xform.getWidth() > 1) {
            xform.incWidthBy(-deltaSize);
            this.mBoundMarks[0].getXform().incXPosBy(-deltaX);
            this.mBoundMarks[2].getXform().incXPosBy(deltaX);
        }
    }
    
    

    // New update code for changing the sub-texture regions being shown"
    var deltaT = 0.001;

    // <editor-fold desc="The font image:">
    // zoom into the texture by updating texture coordinate
    // For font: zoom to the upper left corner by changing bottom right
    var texCoord = this.mFontImage.getElementUVCoordinateArray();
            // The 8 elements:
            //      mTexRight,  mTexTop,          // x,y of top-right
            //      mTexLeft,   mTexTop,
            //      mTexRight,  mTexBottom,
            //      mTexLeft,   mTexBottom
    var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
    var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;
    if (b > 1.0) {
        b = 0;
    }
    if (r < 0) {
        r = 1.0;
    }
    this.mFontImage.setElementUVCoordinate(
        texCoord[SpriteRenderable.eTexCoordArray.eLeft],
        r,
        b,
        texCoord[SpriteRenderable.eTexCoordArray.eTop]
    );
    // </editor-fold>

    // remember to update this.mMinion's animation
    this.mMinion.updateAnimation();

    // interactive control of the display size

    // choose which text to work on
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero)) {
//        this.mTextToWork = this.mTextCon16;
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
//        this.mTextToWork = this.mTextCon24;
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
//        this.mTextToWork = this.mTextCon32;
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Four)) {
//        this.mTextToWork = this.mTextCon72;
//    }

//    var deltaF = 0.005;
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
//        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
//            this.mTextToWork.getXform().incWidthBy(deltaF);
//        }
//        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Y)) {
//            this.mTextToWork.getXform().incHeightBy(deltaF);
//        }
//        this.mTextSysFont.setText(this.mTextToWork.getXform().getWidth().toFixed(2) + "x" + this.mTextToWork.getXform().getHeight().toFixed(2));
//    }
//
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
//        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
//            this.mTextToWork.getXform().incWidthBy(-deltaF);
//        }
//        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Y)) {
//            this.mTextToWork.getXform().incHeightBy(-deltaF);
//        }
//        this.mTextSysFont.setText(this.mTextToWork.getXform().getWidth().toFixed(2) + "x" + this.mTextToWork.getXform().getHeight().toFixed(2));
//    }
};