const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

var prevX, prevY, prevZ = null;

var shakeThreshold = 4;
var lastShakeEvent = 0;
var shakeEnabled = false;

var menuId;
var audio;

function onDeviceMotion(event) {
  if (!shakeEnabled)
    return;
 
  var shakeTheHouse = false;
 
  var motion = event.accelerationIncludingGravity;
 
  if (prevX == null && prevY == null && prevZ == null) {
    // Initialize motion
    prevX = motion.x;
    prevY = motion.y;
    prevZ = motion.z;
    return;
  }
  if (Math.abs(prevX - motion.x > shakeThreshold) ||
      Math.abs(prevY - motion.y > shakeThreshold) ||
      Math.abs(prevZ - motion.z > shakeThreshold)) {
    // If we've already done a shake in the past second, don't do another one
    var now = Math.round(new Date().getTime());
    if (now - lastShakeEvent > 1*1000)
      shakeTheHouse = true;
    lastShakeEvent = now;
  }
  prevX = motion.x;
  prevY = motion.y;
  prevZ = motion.z;

  if (shakeTheHouse) {
    var win = Services.wm.getMostRecentWindow("navigator:browser");
    var doc = win.content.document;
    var links = doc.querySelectorAll("a[href]");
    var randomnumber = Math.floor(Math.random()*links.length);
    doc.location.href = links[randomnumber].href;
//    audio.play();
  }
}

var icon = "data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hA\AAEJGlDQ1BJQ0MgUHJvZmlsZQAAOBGFVd\
9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZA\
w9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquu\
nc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+Ax\
RzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4V\
VuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j\
/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj\
6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdq\
umllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+\
YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9L\
aJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxA\
fSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc\
2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSue\
HQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdi\
l1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfG\
VMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0\
sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoy\
S+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7H\
elL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4bBsrEwAAAAlwSFlzAAALEwAACxMBAJqc\
GAAAAjdpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM\
6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuMS4yIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodH\
RwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjc\
mlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2Jl\
LmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x\
1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgIC\
AgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmO\
k9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmlj\
SW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3J\
kZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KM1z6lgAAAUtJREFUOBGFUk\
tOw0AMfflKyaZkRVWWuUEuQS9AT1AWwH1QT1OOkE0j5QhFWZGP1CRkhnjoVNM4BW/G9jy/efbYklLCt\
DRN5dvLK8IwhOM4oFsxDKjrCu+7HZIksUy8awbkN02Dxd0CURSpK+K3xhLP99CeTlM4GEFRFHjabBDH\
Mdq2BUaGIAhwyDKUVfU/Qd/1WK8fsVo9XIHvl0vkeX6Vo8CeZlzXhW39pmk+QggF8X0fts3gnEBKAes\
MJAI9ZCru+376Hp+BGIs8z1NAi6Z3NlJmxjrPNJHkOalEqtXoYjoZARXPEdBODN+DWav8WQKSOzU1XI\
fBuYJh3DpTge57jpQeYZS3WqC8/lJT3Z8E02+cU8Ga7cb11UCzFVqkruvMx5XPFFR1zUA6UX6V2r2cT\
MHHfo/P41ENkpaKzB4XivzskGH7vL0Uk/MD64hztrled34AAAAASUVORK5CYII="

function loadIntoWindow(window) {
  if (!window)
    return;
  menuId = window.NativeWindow.menu.add({name:"Site Shaker", icon: icon, checkable: true, callback: function() {
    shakeEnabled = !shakeEnabled;
    window.NativeWindow.menu.update(menuId, {checked: shakeEnabled});
  }});
//  var doc = window.document;
//  audio = doc.createElementNS("http://www.w3.org/1999/xhtml", "audio");
//  audio.setAttribute("src", "chrome://siteshaker/content/Example.ogg");
  window.addEventListener("devicemotion", onDeviceMotion, false);
}
 
function unloadFromWindow(window) {
  if (!window) {
    return;
  }
  window.NativeWindow.menu.remove(menuId);
  window.removeEventListener("devicemotion", onDeviceMotion, false);
//  var doc = window.document;
//  doc.removeChild(audio);
}
 
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  
  onCloseWindow: function(aWindow) {},
  onWindowTitleChange: function(aWindow, aTitle) {}
};
 
function startup(aData, aReason) {
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
 
  // Load into any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }
 
  // Load into any new windows
  wm.addListener(windowListener);
  
}

function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
    return;
 
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
 
  // Stop listening for new windows
  wm.removeListener(windowListener);
 
  // Unload from any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}
 
function install(aData, aReason) {
  var win = Services.wm.getMostRecentWindow("navigator:browser");
  win.NativeWindow.toast.show("Site Shaker is off by default. You can turn it on in the settings menu.", "long");
}
function uninstall(aData, aReason) {
}
