/*global $: false, Overlay: false, HTMLElement: false, Rectangle: false, Point: false, HTMLTableCellElement: false, HTMLTableElement: false */
/*jslint browser: true, plusplus: true, white: true */

function EditViewer(viewer, overlay) {
    "use strict";
    
    // table elment
	this.viewer = viewer;
    // overlay object
	this.overlay = new Overlay(overlay, this);
    // Listen to click event and draw overlay.
    this.init();
}

(function () {
	"use strict";

	var // First click starts the overlay drawing, until the second click ends the overlay drawing.
        started = false,
        // Get the rectangle area of the element.
        getElemRect = function(elem) {
            var left, top, right, bottom;
    
            if (elem instanceof HTMLElement) {
                left = elem.offsetLeft;
                top = elem.offsetTop;
                right = left + elem.offsetWidth;
                bottom = top + elem.offsetHeight;
    
                return new Rectangle(left, top, right, bottom);
            }
    
            return null;
        },
        // Determin whether a point locates within the rectangle area of the element.
	    locateWithin = function(elem, point) {
            var rect = getElemRect(elem);
            if (!rect) {
                return false;
            }
    
            return rect.contain(point);
        },
        // Start drawing overlay.
        startDrawing = function(self, event) {
            var rect = self.cellUnderMouse(event),
                viewer = self.viewer,
                overlay = self.overlay;
    
            if (!!rect) {
                started = true;
    
                overlay.clear();
                overlay.draw(rect);
                
                viewer.on('mouseover', function (event) {
                    rect = self.cellUnderMouse(event);
                    overlay.layout(rect);
                });
            }
        },
        // End drawing overlay.
        endDrawing = function(self, event) {
            var viewer = self.viewer;
    
            viewer.off('mouseover');
            
            started = false;
        };
    
    // Register the click event handler.
    EditViewer.prototype.init = function() {
		var viewer = this.viewer,
			self = this;

		viewer.on('click', function(event) {
			if (!started) {
				startDrawing(self, event);
			} else {
				endDrawing(self, event);
			}
		});
	};

    // Dispatch mouse event on the viewer.
	EditViewer.prototype.forwardEvent = function(event) {
		var viewer = this.viewer.get()[0],
			mouseevent,
            type = (event.type === "click") ? "click" : "mouseover";

		if (document.createEvent) {
			mouseevent = document.createEvent('MouseEvent');
			mouseevent.initMouseEvent(type, event.bubbles, event.cancelable, window,
				0, event.screenX, event.screenY, event.clientX, event.clientY,
				event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
				event.button, null);
			viewer.dispatchEvent(mouseevent);
		}
	};

    // Get the HD cell under mouse.
	EditViewer.prototype.cellUnderMouse = function(event) {
		var elem = event.target || event.srcElement,
			rect = null,
			point = new Point(),
			tagName = "",
			children,
            child,
			i;

		if (elem instanceof HTMLTableCellElement) {
			// A TH/TD is clicked
			tagName = elem.tagName;
			if (tagName.toLowerCase() === "td") {
				// A TD is clicked
				rect = getElemRect(elem);
			}
		} else if (elem instanceof HTMLTableElement) {
			// Border is clicked
			elem = event.target;
			
			point.x = event.offsetX;
			point.y = event.offsetY;

			children = $(elem).find('td');
			for (i = 0; i < children.length; i++) {
				child = children[i];
				if ((child instanceof HTMLTableCellElement) && locateWithin(child, point)) {
					rect = getElemRect(child);
					break;
				}
			}
		}

		return rect;
	};

}());