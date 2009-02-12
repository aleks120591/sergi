function Matrix(width, height)
{
	this.getWidth = function(){return width;}
	this.getHeight = function(){return height;}
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

Matrix.prototype.insertPixel = function(x, y, d)
{
	var curItem = this.getItem(x, y);
	var cx = x+d[0], cy = y+d[1];
	for (;(curItem!=null)&&cx>=0&&cx<this.getWidth()&&cy>=0&&cy<this.getHeight();)
	{
		var t = curItem;
		curItem = this.getItem(cx, cy);
		this.setItem(cx, cy, t);
		cx += d[0], cy += d[1];
	}
	
	if ((curItem != null)&&this.itemMovedCB) this.itemMovedCB(curItem);
}

Matrix.prototype.modifyEach = function(fn)
{
	for(var idx=0;idx<this._d.lenght;idx++)
	{
		this._d[idx] = fn(this._d[idx]);
	}
}

Matrix.Direction = {LEFT: [-1, 0], UP: [0, -1], RIGHT: [1, 0], DOWN: [0, 1]};
Matrix.Direction.ALL = [Matrix.Direction.UP, Matrix.Direction.LEFT, Matrix.Direction.DOWN, Matrix.Direction.RIGHT];