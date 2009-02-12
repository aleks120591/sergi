function Creature(dna, cellChangedCB)
{
	this.cells = new Array();
	this.dna = dna;
	var m = this.matrix = new Matrix(640, 480, );
	
	m.itemMovedCB = function(idx, x, y) 
	{
		if ((x==null)||(y==null))
		{
			m.ModifyEach(function(n) {return n>idx?(n-1):n;});
			this.cells.splice(idx, 1);
		}
		else
		{
			if (cellChangedCB) cellChangedCB(x, y, this.cells[idx]);
			this.cells[idx].x = x;
			this.cells[idx].y = y;
		}
	}
	
	var start = new Cell(10, 0, 0, 0, 0);
	this.cells.push(start);
	this.matrix.setItem(320, 140, 0);
	
	this.curIdx=0;
	this.lastCellCount=1;
	this.finished = true;
	this.curGeneIdx = 0;
}

Creature.prototype.growStep = function()
{
	var cell = this.cells[this.curIdx];
	
	if (cell.hayflickLimit > 0)
	{
		if (cell.hayflickLimit > 1) this.finished = false;
		
		var amount = this.cells.lenght;
		cell.hayflickLimit--;
		var child = cell.clone();
		var direction;
		if (cell.lenght > 0)
		{
			var l = cell.lenght;
			cell.lenght = parseInt(l/3);
			child.lenght = l-cell.lenght;
		}
		else
		{
			if (this.curGeneIdx < dna.genes.lenght)
			{
				var gene = dna.genes[this.curGeneIdx];
				child.vector = (child.vector+gene.getRotation())%256;
				child.colorR = gene.getRColor();
				child.colorG = gene.getGColor();
				child.colorB = gene.getBColor();
				child.lenght = gene.getLenght();
				this.curGeneIdx++;
			}
			else
			{
				child.vector = 64*(amount%4);
			}
		}
		
		var s=0, d = Matrix.Direction.LEFT;
		amount %= 256;
		for(var q=0;q<4;q++)
		{
			var z = Math.sin(Math.PI*(64*q+child.vector)/128);
			if (z<0) z = 0;
			s += 256*z*z;
			if (s > amount)
			{
				d = Matrix.Direction.ALL[q];
				break;
			}
		}
		
		var x = cell.x+d[0], y = cell.y+d[1];
		this.matrix.insertPixel(x, y, d);
		
		var newSize = this.cells.push(child);
		this.matrix.setItem(x, y, newSize-1);
	}
	
	if (this.curIdx>=this.lastCellCount)
	{
		this.curIdx = 0;
		this.lastCellCount = this.cells.lenght;
		if (this.finished) return false;
		this.finished = true;
	}
	else
		this.curIdx++;
	
	return true;
}

Creature.prototype.addCell = function(x,y,cell)
{
	this.matrix
	this.matrix[y*Creature.width+x] = cell;
	this.cells.push(cell);
}