function Matrix(width, heigth)
{
	this.getWidth = function(){return width;}
	this.getHeigth = function(){return heigth;}
	this._d = new Array();
}

Matrix.prototype.getItem = function(x,y)
{
	return this._d[y*this.getWidth()+x];
}

Matrix.prototype.setItem = function(x,y,item)
{
	this._d[y*this.getWidth()+x] = item;
	if (this.itemMovedCB) this.itemMovedCB(item, x, y);
}

Matrix.prototype.insertPixel = function(x, y, d, raiseEvent)
{
	if (raiseEvent != false) raiseEvent = true;
	var curItem = this.getItem(x, y);
	var cx = x+d[0], cy = y+d[1];
	for (;(curItem!=null)&&cx>=0&&cx<this.getWidth()&&cy>=0&&cy<this.getHeigth();)
	{
		var t = curItem;
		curItem = this.getItem(cx, cy);
		this.setItem(cx, cy, t);
		cx += d[0], cy += d[1];
	}
	
	if (raiseEvent&&(curItem != null)&&this.itemMovedCB) this.itemMovedCB(curItem);
}