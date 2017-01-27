/*
 * File: SpriteSource.js
 *  
 * Texture object with a bounding box around it, and containing a set of 
 * smaller bound boxes
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Renderable: false, TextureRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteSource(myTexture) {
    TextureRenderable.call(this, myTexture);
}
gEngine.Core.inheritPrototype(SpriteSource, TextureRenderable);


SpriteSource.prototype.draw = function (vpMatrix) {
    TextureRenderable.prototype.draw.call(this, vpMatrix);
};
