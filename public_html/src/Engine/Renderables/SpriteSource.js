/*
 * File: SpriteSource.js
 *  
 * - Defines a TextureRenderable which will make up the background
 * - Defines a set of 8 Renderables which will make up the border lines
 * and corner markers
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Renderable: false, TextureRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteSource(myTexture, shader) {
    // trying to implement with this not as a subclass of TextureRenderable
    // TextureRenderable.call(this, myTexture);
    
    // probably want to get texture from the resource matrix instead of having it passed in?
    this.mBackground = new TextureRenderable(myTexture);
    
    // shader
    this.mShader = shader;
    
    // elements 0-3 are black border: left, right, top, bottom
    // elements 4-7 are corner squares: tl, tr, br, bl
    this.mBorder = [];
    
    // edge position storage
    this.leftX = 0;
    this.rightX = 0;
    this.topY = 0;
    this.botY = 0;
    
    this.initBorder();
}
// not a subclass of TextureRenderable
// gEngine.Core.inheritPrototype(SpriteSource, TextureRenderable);


SpriteSource.prototype.draw = function (vpMatrix) {
    TextureRenderable.prototype.draw.call(this, vpMatrix);
    console.log("draw 1");
    this.mLeftBorder.draw(vpMatrix);
    console.log("draw 2");
};

SpriteSource.prototype.initBorder = function() {
    this.mBorder[0] = new Renderable(this.mShader);
    
    console.log("1");
    this.leftX = this.getXform().getXPos() - this.getXform().getWidth() / 2;
    console.log("2");
    this.mBorder[0].setColor(0, 0, 0, 1);
    console.log("3");
    this.mBorder[0].getXform().setPosition(this.leftX, this.getXform().getYPos());
    console.log("4");
    this.mBorder[0].getXform().setHeight(this.getXform().getHeight());
    console.log("5");
    this.mBorder[0].getXform().setWidth(1);
    console.log("6");
};