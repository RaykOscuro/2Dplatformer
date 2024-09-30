/**
 * This is only used for the web version.
 * This module provides the game settings and level data as JSON objects.
 * The settings and level data are loaded from JSON strings.
 * The settings and level data are exposed as variables.
 */

/**
 * The game settings object.
 * @type {object}
 */
export const settingsData: object = JSON.parse(
  // The settings JSON string
  '{"canvas": {"width": 800,"height": 600,"backgroundColor": "#87CEEB","offsetThreshold": 400},"character": {"gravity": 0.75,"maxFallSpeed": 15,"initialJumpStrength": -5,"maxJumpTime": 15,"moveSpeed": 5,"coyoteTime": 5,"frameSpeed": 3,"characterFrames": 9,"frameImageName": "fox_walk","frameImageType": "png","fps": 60,"slideFactor": 0.65,"bufferFrames": 8,"ledgeClimb": 5}}'
);

/**
 * The level data object.
 * @type {object}
 */
export const levelData: object = JSON.parse(
  // The level data JSON string
  '{"settings": {"width": 1200,"height": 600},"character": {"x": 100,"y": 500,"width": 50,"height": 50},"platforms": [{"x": 0,"y": 50,"width": 300,"height": 50,"isSolid": true,"isHazard": false},{"x": 300,"y": 25,"width": 600,"height": 25,"isSolid": false,"isHazard": true},{"x": 900,"y": 50,"width": 300,"height": 50,"isSolid": true,"isHazard": false},{"x": 400,"y": 150,"width": 200,"height": 50,"isSolid": true,"isHazard": false},{"x": 0,"y": 250,"width": 250,"height": 50,"isSolid": true,"isHazard": false},{"x": 250,"y": 225,"width": 50,"height": 25,"isSolid": false,"isHazard": true},{"x": 700,"y": 300,"width": 100,"height": 50,"isSolid": true,"isHazard": false},{"x": 800,"y": 275,"width": 50,"height": 25,"isSolid": false,"isHazard": true}]}'
);

