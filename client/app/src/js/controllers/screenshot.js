/**
 * ScreenshotController
 * ====================
 * Handles display of a single screenshot.
 */

function ScreenshotController(Screenshot, User, screenshot, $window, $document, $stateParams) {
  // this.screenshot = screenshot;
  console.log($stateParams);
  this.saveScreenShot = function(canvasImage){
    Screenshot.addDrawing(canvasImage, $stateParams.screenshotId);
    // console.log("SCREENSHOT", screenshot)
    // console.log("ANNOTATED", screenshot.annotatedImage)
  };

}
ScreenshotController.$inject = ['Screenshot', 'User', 'screenshot','$window','$document', '$stateParams'];

angular.module('Archivr.screenshot', [
  'Archivr.services.Screenshot',
  'Archivr.services.User'
]).controller('ScreenshotController', ScreenshotController);

