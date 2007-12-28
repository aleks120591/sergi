function MashapeTest(name)
{
    TestCase.call( this, name );
}

function MashapeTest_testRegisterNamespace()
{
    var str = "name1.name2.name3";
    mashape.registerNamespace(str);
    this.assertNotNull(name1);
    this.assertNotNull(name1.name2);
    this.assertNotNull(name1.name2.name3);
}

function MashapeTest_testCreateInstance()
{
    var 
    	inst1 = new MashapeTest.SampleClass1(),
    	inst2 = mashape.createInstance("MashapeTest.SampleClass1");
    	
    this.assertEquals("Method mashape.createInstance doesn't work", inst1.response, inst2.response);
}

function MashapeTest_testTrim()
{
    this.assertEquals("ggsg", mashape.trim(" ggsg   "));
}

MashapeTest.prototype = new TestCase();
MashapeTest.glue();

function MashapeTestSuite()
{
    TestSuite.call( this, "MashapeTestSuite" );
    this.addTestSuite( MashapeTest );
}
MashapeTestSuite.prototype = new TestSuite();
MashapeTestSuite.prototype.suite = function () { return new MashapeTestSuite(); }


MashapeTest.SampleClass1 = function(){
	this.response = "I am an instance of class RegistrarTest.MashapeClass1";
}