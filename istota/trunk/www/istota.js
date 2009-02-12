function World(canv)
{
	this.canvas = canv;
}

World.prototype.plotPixel = function(x, y, c) {
    var pixel = document.createElement('div');
    pixel.className = 'Ink';
    pixel.style.borderTopColor = c;
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    this.canvas.appendChild(pixel);
}