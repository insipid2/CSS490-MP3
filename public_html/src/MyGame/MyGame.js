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
    // textures
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBound = "assets/Bound.png";
    
    // fonts
    this.kFontCon16 = "assets/fonts/Consolas-16";  // notice font names do not need extensions!
    this.kFontCon24 = "assets/fonts/Consolas-24";
    this.kFontCon32 = "assets/fonts/Consolas-32";  // this is also the default system font
    this.kFontCon72 = "assets/fonts/Consolas-72";
    this.kFontSeg96 = "assets/fonts/Segment7-96";

    // Cameras for the 3 scenes
    this.mCameraMain = null;
    this.mCameraAnimation = null;
    // 0 = right, 1 = bottom, 2 = left, 3 = top
    this.mCamerasZoomed = [];

    // sprite sheet and interactive bound
    this.mBound = null;
    // 0 = right, 1 = bottom, 2 = left, 3 = top
    this.mBoundMarks = [];
    // this.mFontImage = null;
    this.mMinion = null;
    this.mSpriteSheet = null;
    this.mSpriteSheetMarks = [];
    this.mNumAnimFrames = 0;
    this.mAnimFrames = [];
    this.mShowFrames = false;
    this.spriteImg = null;

    this.mTextCon16 = null;
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
    // ** Sprite Sheet ** //
    this.spriteImg = gEngine.ResourceMap.retrieveAsset(this.kMinionSprite);
    var spriteRatio = this.spriteImg.mWidth / this.spriteImg.mHeight;
    var spriteWidth = 0, spriteHeight = 0;
    var spriteX = 0, spriteY = 0;
    var borderThickness = 0.2;
    console.log("Image: " + this.kMinionSprite + ", width, height: " + this.spriteImg.mWidth + ", " + this.spriteImg.mHeight);
    console.log("Aspect Ratio: " + spriteRatio);
    
    this.mSpriteSheet = new SpriteSource(this.kMinionSprite);
    var spriteXform = this.mSpriteSheet.getXform();
    spriteXform.setPosition(spriteX,spriteY);
    
    // test for whether width or height is larger
    if (spriteRatio >= 1) {
        // Wider or 1:1
        spriteWidth = 100;
        spriteHeight = spriteWidth / spriteRatio;
    }
    else {
        spriteHeight = 100;
        spriteWidth = spriteHeight * spriteRatio;
    }
    spriteXform.setSize(spriteWidth, spriteHeight);
    for (var i = 0; i < 8; i++) {
        this.mSpriteSheetMarks.push(new Renderable());
    }
    
    // right border
    this.mSpriteSheetMarks[0].getXform().setPosition(spriteX + spriteWidth / 2, spriteY);
    this.mSpriteSheetMarks[0].getXform().setSize(borderThickness, spriteHeight);
    this.mSpriteSheetMarks[0].setColor([0, 0, 0, 1]);
    // bottom border
    this.mSpriteSheetMarks[1].getXform().setPosition(spriteX, spriteY - spriteHeight / 2);
    this.mSpriteSheetMarks[1].getXform().setSize(spriteWidth, borderThickness);
    this.mSpriteSheetMarks[1].setColor([0, 0, 0, 1]);
    // left border
    this.mSpriteSheetMarks[2].getXform().setPosition(spriteX - spriteWidth / 2, spriteY);
    this.mSpriteSheetMarks[2].getXform().setSize(borderThickness, spriteHeight);
    this.mSpriteSheetMarks[2].setColor([0, 0, 0, 1]);
    // top border
    this.mSpriteSheetMarks[3].getXform().setPosition(spriteX, spriteY + spriteHeight / 2);
    this.mSpriteSheetMarks[3].getXform().setSize(spriteWidth, borderThickness);
    this.mSpriteSheetMarks[3].setColor([0, 0, 0, 1]);
    // top right square
    this.mSpriteSheetMarks[4].getXform().setPosition(spriteX + spriteWidth / 2, spriteY + spriteHeight / 2);
    this.mSpriteSheetMarks[4].getXform().setSize(3, 3);
    this.mSpriteSheetMarks[4].setColor([1, 0, 0, 1]);
    // bottom right square
    this.mSpriteSheetMarks[5].getXform().setPosition(spriteX + spriteWidth / 2, spriteY - spriteHeight / 2);
    this.mSpriteSheetMarks[5].getXform().setSize(3, 3);
    this.mSpriteSheetMarks[5].setColor([0, 1, 0, 1]);
    // bottom left square
    this.mSpriteSheetMarks[6].getXform().setPosition(spriteX - spriteWidth / 2, spriteY - spriteHeight / 2);
    this.mSpriteSheetMarks[6].getXform().setSize(3, 3);
    this.mSpriteSheetMarks[6].setColor([0, 0, 1, 1]);
    // top left square
    this.mSpriteSheetMarks[7].getXform().setPosition(spriteX - spriteWidth / 2, spriteY + spriteHeight / 2);
    this.mSpriteSheetMarks[7].getXform().setSize(3, 3);
    this.mSpriteSheetMarks[7].setColor([1, 0, 1, 1]);
    
    // ** Interactive Bound ** //
    this.mBound = new SpriteRenderable(this.kBound);
    this.mBound.setColor([1, 1, 1, 0]);
    this.mBound.getXform().setPosition(spriteXform.getXPos(), spriteXform.getYPos());
    this.mBound.getXform().setSize(10, 10);
    this.mBound.setElementPixelPositions(0, 512, 0, 512);
    for (var i = 0; i < 4; i++) {
        this.mBoundMarks.push(new Renderable());
    }

    // right square
    this.mBoundMarks[0].getXform().setPosition(this.mBound.getXform().getXPos() + this.mBound.getXform().getWidth() / 2,
                                                this.mBound.getXform().getYPos());
    this.mBoundMarks[0].getXform().setSize(0.75, 0.75);
    this.mBoundMarks[0].setColor([1, 0, 0, 1]);
    // bottom square
    this.mBoundMarks[1].getXform().setPosition(this.mBound.getXform().getXPos(),
                                                this.mBound.getXform().getYPos() - this.mBound.getXform().getHeight() / 2);
    this.mBoundMarks[1].getXform().setSize(0.75, 0.75);
    this.mBoundMarks[1].setColor([0, 1, 0, 1]);
    // left square
    this.mBoundMarks[2].getXform().setPosition(this.mBound.getXform().getXPos() - this.mBound.getXform().getWidth() / 2,
                                                this.mBound.getXform().getYPos());
    this.mBoundMarks[2].getXform().setSize(0.75, 0.75);
    this.mBoundMarks[2].setColor([0, 0, 1, 1]);
    // top square
    this.mBoundMarks[3].getXform().setPosition(this.mBound.getXform().getXPos(),
                                                this.mBound.getXform().getYPos() + this.mBound.getXform().getHeight() / 2);
    this.mBoundMarks[3].getXform().setSize(0.75, 0.75);
    this.mBoundMarks[3].setColor([1, 0, 1, 1]);
    
    // ** Animation Object ** //
    this.mMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(0, 0);
    this.mMinion.getXform().setSize(192, 192);
    this.mMinion.setSpriteSequence(this.mBound.getXform().getYPos() + this.mBound.getXform().getHeight() / 2,
                                    this.mBound.getXform().getXPos() - this.mBound.getXform().getWidth() / 2,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    this.mBound.getXform().getWidth(), this.mBound.getXform().getHeight(),    // widthxheight in pixels
                                    this.mNumAnimFrames + 1,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(500); // show each element for mAnimSpeed updates
    
    // ** Cameras ** //
    // Main
    this.mCameraMain = new Camera(
        vec2.fromValues(spriteXform.getXPos(), spriteXform.getYPos()),   // position of the camera
        110,                       // width of camera
        [192, 0, 448, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCameraMain.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Animation
    this.mCameraAnimation = new Camera(
        vec2.fromValues(this.mMinion.getXform().getXPos(), this.mMinion.getXform().getYPos()),
        192,
        [0, 290, 190, 190]
    );
    this.mCameraAnimation.setBackgroundColor([0.7, 0.9, 0.7, 1]);
    
    // Zoomed cameras (4)
    for (var i = 0; i < 4; i++) {
        this.mCamerasZoomed[i] = new Camera(
            vec2.fromValues(this.mBoundMarks[i].getXform().getXPos(), this.mBoundMarks[i].getXform().getYPos()),
            this.mBound.getXform().getWidth() / 2,
            [0, 0, 0, 0]
        );
        this.mCamerasZoomed[i].setBackgroundColor([1, 1, 1, 1]);
    }
    // right zoomed
    this.mCamerasZoomed[0].setViewport([96, 96, 96, 96]);
    // bottom zoomed
    this.mCamerasZoomed[1].setViewport([48, 0, 96, 96]);
    // left zoomed
    this.mCamerasZoomed[2].setViewport([0, 96, 96, 96]);
    // top zoomed
    this.mCamerasZoomed[3].setViewport([48, 192, 96, 96]);

    // ** Status text ** //
    this.mTextCon16 = new FontRenderable("Consolas 16: in black");
    this.mTextCon16.setFont(this.kFontCon16);
    this._initText(this.mTextCon16, 40, 2, [0, 0, 0, 1], 2);

    
//    // Font image zoom
//    this.mFontImage = new SpriteRenderable(this.kFontImage);
//    this.mFontImage.setColor([1, 1, 1, 0]);
//    this.mFontImage.getXform().setPosition(15, 50);
//    this.mFontImage.getXform().setSize(20, 20);
//
    

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
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);

    // Step  B: Activate the main Camera
    this.mCameraMain.setupViewProjection();

    // Step  C: Draw everything
    // background, sprite sheet
    this.mSpriteSheet.draw(this.mCameraMain.getVPMatrix());
    // Interactive Bound square markers
    for (var k = 0; k < 4; k++) {
        this.mBoundMarks[k].draw(this.mCameraMain.getVPMatrix());
    }
    // Interactive Bound outline
    this.mBound.draw(this.mCameraMain.getVPMatrix());
    // Animation Frames
    if (this.mShowFrames) {
        for (var i = 0; i < this.mNumAnimFrames; i++) {
            this.mAnimFrames[i].draw(this.mCameraMain.getVPMatrix());
        }
    }
    
    // Sprite sheet corner square markers
    for (var i = 0; i < 8; i++) {
        this.mSpriteSheetMarks[i].draw(this.mCameraMain.getVPMatrix());
    }
    
    
    this.mTextCon16.draw(this.mCameraMain.getVPMatrix());
    
    this.mCameraAnimation.setupViewProjection();
    this.mMinion.draw(this.mCameraAnimation.getVPMatrix());
    
    // draw again for each zoomed camera
    for (var i = 0; i < 4; i++) {
        this.mCamerasZoomed[i].setupViewProjection();
        this.mSpriteSheet.draw(this.mCamerasZoomed[i].getVPMatrix());
        for (var j = 0; j < 4; j++) {
            this.mBoundMarks[j].draw(this.mCamerasZoomed[i].getVPMatrix());
        }
        this.mBound.draw(this.mCamerasZoomed[i].getVPMatrix());
        for (var k = 0; k < 8; k++) {
            this.mSpriteSheetMarks[k].draw(this.mCamerasZoomed[i].getVPMatrix());
        }
    }
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

    // Space - finer adjustments
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        deltaX *= .01;
        deltaSize *= .01;
    }
    
    // Q - toggle showing of animation frames
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mShowFrames = !this.mShowFrames;
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
    
    // update zoomed camera positions
    for (var i = 0; i < 4; i++) {
        this.mCamerasZoomed[i].setWCCenter(this.mBoundMarks[i].getXform().getXPos(), this.mBoundMarks[i].getXform().getYPos());
        this.mCamerasZoomed[i].setWCWidth(this.mBound.getXform().getWidth() / 2);
    }
    
    // figure out how many animation frames there should be based on
    // position of Interactive Bound
    // TODO: optimize by only updating frames if the size of bound or
    // number of frames changes
    var gap = this.mSpriteSheet.getXform().getXPos() + this.mSpriteSheet.getXform().getWidth() / 2 - 
            xform.getXPos() - xform.getWidth() / 2;
    console.log("Gap size: " + gap);    
    this.mNumAnimFrames = Math.floor(gap / xform.getWidth());
    console.log("# of frames: " + this.mNumAnimFrames);
    for (var i = 0; i < this.mNumAnimFrames; i++) {
        this.mAnimFrames[i] = new SpriteRenderable(this.kBound);
        this.mAnimFrames[i].setColor([1, 1, 1, 0]);
        this.mAnimFrames[i].getXform().setPosition(xform.getXPos() + xform.getWidth() * (i + 1), xform.getYPos());
        this.mAnimFrames[i].getXform().setSize(xform.getWidth(), xform.getHeight());
        this.mAnimFrames[i].setElementPixelPositions(0, 512, 0, 512);
    }
    
    // update Minion (animation object) based on Interactive Bound and # of Animation Frame
    var vertDiff = (this.mSpriteSheet.getXform().getYPos() + this.mSpriteSheet.getXform().getHeight() / 2) - (xform.getYPos() + xform.getHeight() / 2);
    var vertScale = vertDiff / this.mSpriteSheet.getXform().getHeight();
    
    var horizDiff = (this.mSpriteSheet.getXform().getXPos() - this.mSpriteSheet.getXform().getWidth() / 2) - (xform.getXPos() - xform.getWidth() / 2);
    var horizScale = horizDiff / this.mSpriteSheet.getXform().getWidth();
    this.mMinion.setSpriteSequence(this.spriteImg.mHeight * vertScale, // top edge
                                    this.spriteImg.mWidth * horizScale, // left edge
                                    xform.getWidth(), xform.getHeight(),    // widthxheight in pixels
                                    this.mNumAnimFrames + 1,          // number of elements in this sequence
                                    0);         // horizontal padding in between

    // New update code for changing the sub-texture regions being shown"
    var deltaT = 0.001;

//    // <editor-fold desc="The font image:">
//    // zoom into the texture by updating texture coordinate
//    // For font: zoom to the upper left corner by changing bottom right
//    var texCoord = this.mFontImage.getElementUVCoordinateArray();
//            // The 8 elements:
//            //      mTexRight,  mTexTop,          // x,y of top-right
//            //      mTexLeft,   mTexTop,
//            //      mTexRight,  mTexBottom,
//            //      mTexLeft,   mTexBottom
//    var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
//    var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;
//    if (b > 1.0) {
//        b = 0;
//    }
//    if (r < 0) {
//        r = 1.0;
//    }
//    this.mFontImage.setElementUVCoordinate(
//        texCoord[SpriteRenderable.eTexCoordArray.eLeft],
//        r,
//        b,
//        texCoord[SpriteRenderable.eTexCoordArray.eTop]
//    );
//    // </editor-fold>
//
//    // remember to update this.mMinion's animation
//    this.mMinion.updateAnimation();

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