function Creature(dna, cellChangedCB)
{
	this.cells = new Array();
	this.dna = dna;
	this.matrix = new Matrix(640, 480);
	me = this;
	
	this.matrix.itemMovedCB = function(idx, x, y) 
	{
		if ((x==null)||(y==null))
		{
			var last = me.cells.pop();
			me.matrix.setItem(last.x, last.y, idx, false);
			me.cells[idx] = last;
		}
		else
		{
			if (cellChangedCB) cellChangedCB(x, y, me.cells[idx]);
			me.cells[idx].x = x;
			me.cells[idx].y = y;
		}
	}
	
	var start = new Cell(10, 0, 0, 0, 0, 0);
	this.cells.push(start);
	this.matrix.setItem(parseInt(this.matrix.getWidth()/2), parseInt(this.matrix.getHeigth()/2), 0);
	
	this.curIdx=0;
	this.lastCellCount=1;
	this.finished = true;
	this.curGeneIdx = 0;
}

// TODO: This method requires refactorisation
Creature.prototype.growStep = function()
{
	var cell = this.cells[this.curIdx];
	
	if (cell.hayflickLimit > 0)
	{
		if (cell.hayflickLimit > 1) this.finished = false;
		
		var amount = this.cells.length;
		var child = cell.clone();
		var direction;
		if (cell.length > 0)
		{
			child.length--;
			cell.length = 0;
		}
		else
		{
			child.hayflickLimit--;
			if (this.curGeneIdx < this.dna.genes.length)
			{
				var gene = this.dna.genes[this.curGeneIdx];
				child.vector = (child.vector+gene.getRotation())%256;
				child.colorR = gene.getRColor();
				child.colorG = gene.getGColor();
				child.colorB = gene.getBColor();
				child.length = gene.getLength();
				this.curGeneIdx++;
			}
			else
			{
				child.vector = 64*(amount%4);
			}
		}
		cell.hayflickLimit--;
		
		var d = Direction.getRandomDirection(child.vector, amount);
		
		var x = cell.x+d[0], y = cell.y+d[1];
		this.matrix.insertPixel(x, y, d);
		
		var newSize = this.cells.push(child);
		this.matrix.setItem(x, y, newSize-1);
	}
	
	this.curIdx++;
	
	if (this.curIdx>=this.lastCellCount)
	{
		this.curIdx = 0;
		this.lastCellCount = this.cells.length;
		if (this.finished) return false;
		this.finished = true;
	}
	
	return true;
}