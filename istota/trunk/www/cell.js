function Cell(hayflickLimit, colorR, colorG, colorB, vector, length)
{
	this.hayflickLimit = hayflickLimit;
	this.colorR = colorR;
	this.colorG = colorG;
	this.colorB = colorB;
	this.vector = vector;
	this.length = length;
}

Cell.prototype.clone = function()
{
	return new Cell(this.hayflickLimit, this.colorR, this.colorG, this.colorB, this.vector, this.length);
}