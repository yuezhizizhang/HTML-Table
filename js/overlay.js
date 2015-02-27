/*jslint white: true */

function Overlay(elem, viewer) {
    "use strict";
    
    // overlay div
	this.overlay = elem;
    // table element
	this.viewer = viewer;

	this.init();
}

(function() {
	"use strict";

    // The starting rectangle area.
	var start = null;

	Overlay.prototype.init = function() {
		var viewer = this.viewer;

        // Forward click event to the viewer.
		this.overlay.on('click', function(event) {
			viewer.forwardEvent(event);
		});

        // Forward mousemove event to the viewer.
		this.overlay.on('mousemove', function(event) {
			viewer.forwardEvent(event);
		});
	};

    // Draw overlay at the specified rectangle area.
	Overlay.prototype.draw = function(rect) {
		if (!!rect) {
			this.overlay.removeClass('hidden');
			this.layout(rect);
			start = rect;
		}
	};

    // Move and resize overlay.
	Overlay.prototype.layout = function(rect) {
		if (!!rect) {
			if (!!start) {
				rect = start.merge(rect);
			}

			this.overlay.css('left', rect.left);
			this.overlay.css('top', rect.top);
			this.overlay.css('width', rect.width());
			this.overlay.css('height', rect.height());
		}
	};

    // Hide overlay.
	Overlay.prototype.clear = function() {
		start = null;
		this.overlay.addClass('hidden');
	};

}());