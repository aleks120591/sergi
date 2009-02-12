function DnaTest(name)
{
    TestCase.call( this, name );
}

function DnaTest_testSimpleCration1()
{
	var dna = new Dna([34, 12, 87, 143, 20, 5]);
	
	this.assertEquals(2, dna.genes.length);
	
	this.assertEquals(5, dna.genes[1].getRotation());
	this.assertEquals(0, dna.genes[1].getRColor());
}

DnaTest.prototype = new TestCase();
DnaTest.glue();