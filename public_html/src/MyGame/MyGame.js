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

    // The camera to view the scene
    this.mCamera = null;

    // the hero and the support objects
    this.mBound = null;
    this.mFontImage = null;
    this.mMinion = null;
    this.mSpriteSheet = null;

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
    this.mCamera = new Camera(
        vec2.fromValues(50, 33),   // position of the camera
        100,                       // width of camera
        [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

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

    // Step D: Create the hero object with texture from the lower-left corner
    this.mBound = new SpriteRenderable(this.kBound);
    this.mBound.setColor([1, 1, 1, 0]);
    this.mBound.getXform().setPosition(70, 30);
    this.mBound.getXform().setSize(10, 10);
    this.mBound.setElementPixelPositions(0, 512, 0, 512);

    // font
    this.mTextCon16 = new FontRenderable("Consolas 16: in black");
    this.mTextCon16.setFont(this.kFontCon16);
    this._initText(this.mTextCon16, 40, 2, [0, 0, 0, 1], 2);

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
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: Draw everything
    this.mSpriteSheet.draw(this.mCamera.getVPMatrix());
    this.mBound.draw(this.mCamera.getVPMatrix());
    this.mFontImage.draw(this.mCamera.getVPMatrix());
    this.mMinion.draw(this.mCamera.getVPMatrix());

    // drawing the text output
    // this.mTextSysFont.draw(this.mCamera.getVPMatrix());
    this.mTextCon16.draw(this.mCamera.getVPMatrix());
    // this.mTextCon24.draw(this.mCamera.getVPMatrix());
    // this.mTextCon32.draw(this.mCamera.getVPMatrix());
    // this.mTextCon72.draw(this.mCamera.getVPMatrix());
    // this.mTextSeg96.draw(this.mCamera.getVPMatrix());
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
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (xform.getYPos() > this.mSpriteSheet.getXform().getYPos() - this.mSpriteSheet.getXform().getHeight() / 2 + xform.getHeight() / 2) {
            xform.incYPosBy(-deltaX);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (xform.getXPos() < this.mSpriteSheet.getXform().getXPos() + this.mSpriteSheet.getXform().getWidth() / 2 - xform.getWidth() / 2) {
            xform.incXPosBy(deltaX);
        }
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (xform.getXPos() > this.mSpriteSheet.getXform().getXPos() - this.mSpriteSheet.getXform().getWidth() / 2 + xform.getWidth() / 2) {
            xform.incXPosBy(-deltaX);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (xform.getHeight() < 100) {
            xform.incHeightBy(deltaSize);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (xform.getHeight() > 1) {
            xform.incHeightBy(-deltaSize);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (xform.getWidth() < 100) {
            xform.incWidthBy(deltaSize);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if ( xform.getWidth() > 1) {
            xform.incWidthBy(-deltaSize);
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