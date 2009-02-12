function MatrixTest(name)
{
    TestCase.call( this, name );
}

function MatrixTest_testInsertPixelMoveLeft()
{
	var m = new Matrix(4, 2);
	m.setItem(1,1,3);
	m.setItem(2,1,0);
	m.insertPixel(2,1,Matrix.Direction.LEFT);
	this.assertEquals(3, m.getItem(0,1));
	this.assertEquals(0, m.getItem(1,1));
}

function MatrixTest_testInsertPixelMoveNotAll()
{
	var m = new Matrix(5, 5);
	m.setItem(1,1,3);
	m.setItem(1,2,0);
	
	m.setItem(1,4,8);
	
	m.insertPixel(1,1,Matrix.Direction.DOWN);
	this.assertEquals(8, m.getItem(1,4));
	this.assertEquals(3, m.getItem(1,2));
}

MatrixTest.prototype = new TestCase();
MatrixTest.glue();