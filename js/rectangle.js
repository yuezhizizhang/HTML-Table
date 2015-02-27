/*jslint white: true */

function Rectangle(left, top, right, bottom) {
    "use strict";
    
	this.left = left || 0;
	this.top = top || 0;
	this.right = right || 0;
	this.bottom = bottom || 0;
}

(function() {
	"use strict";

    // Determine whether point locates within the rectangle.
	Rectangle.prototype.contain = function(point) {
		return (point.x >= this.left &&
				point.x < this.right &&
				point.y >= this.top &&
				point.y < this.bottom);
	};

    // Get the width of the rectangle.
	Rectangle.prototype.width = function() {
		return this.right - this.left;
	};

    // Get the height of the rectangle.
	Rectangle.prototype.height = function() {
		return this.bottom - this.top;
	};

	Rectangle.prototype.leftOf = function(rect) {
		return this.left <= rect.left;
	};

	Rectangle.prototype.rightOf = function(rect) {
		return this.right >= rect.right;
	};

	Rectangle.prototype.topOf = function(rect) {
		return this.top <= rect.top;
	};

	Rectangle.prototype.bottomOf = function(rect) {
		return this.bottom >= rect.bottom;
	};

    // Merge two rectangle areas into a large area, which contains both rectangles. 
	Rectangle.prototype.merge = function(rect) {
		var left = this.left,
			top = this.top,
			right = this.right,
			bottom = this.bottom;

		if (!rect) {
			return new Rectangle(left, top, right, bottom);
		}

		if (rect.leftOf(this)) {
			left = rect.left;
		}

		if (rect.rightOf(this)) {
			right = rect.right;
		}

		if (rect.topOf(this)) {
			top = rect.top;
		}

		if (rect.bottomOf(this)) {
			bottom = rect.bottom;
		}

		return new Rectangle(left, top, right, bottom);
	};

}());