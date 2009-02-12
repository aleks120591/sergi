function GeneTest(name)
{
    TestCase.call( this, name );
}

function GeneTest_testSimpleCration()
{
	var gene = new Gene(34, 12, 87, 143, 20);
	
	this.assertEquals(34, gene.getRotation());
	this.assertEquals(12, gene.getRColor());
	this.assertEquals(87, gene.getGColor());
	this.assertEquals(143, gene.getBColor());
	this.assertEquals(20, gene.getLenght());
}

GeneTest.prototype = new TestCase();
GeneTest.glue();