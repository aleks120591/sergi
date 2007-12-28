function EngineTest(name)
{
    TestCase.call( this, name );
}

function EngineTest_setUp()
{
	this.engine = new mashape.Engine();
	this.engine.registerClassDesriptor("EngineTest.SampleClass1",
		["propNum", "propSampleClass2:EngineTest.SampleClass2", "propString", "propBool", "propSimpleArray", "propClassArray:[EngineTest.SampleClass2]"]);
	this.engine.registerClassDesriptor("EngineTest.SampleClass2", ["prop1"]);
}

function EngineTest_testSerializeSimple()
{
    var 
    	inst1 = {prop1 : true, prop2 : "string value", prop3 : 56},
    	inst2 = this.engine.serialize(inst1);
    	
    this.assertNotUndefined(inst2.prop1);
    this.assertEquals("Simple serialization: failed to serialize true value", inst1.prop1, inst2.prop1);
    this.assertEquals("Simple serialization: failed to serialize string value", inst1.prop2, inst2.prop2);
    this.assertEquals("Simple serialization: failed to serialize bumber value", inst1.prop3, inst2.prop3);
}

function EngineTest_testSerializeClass()
{
    var 
    	inst1 = new EngineTest.SampleClass2(),
    	inst2 = this.engine.serialize(inst1, "EngineTest.SampleClass2");

    this.assertNotUndefined(inst2.prop1);
    this.assertUndefined(inst2.response);
    this.assertEquals("Class serialization: failed to serialize true value", inst1.prop1, inst2.prop1);
}

function EngineTest_testSerializeComplex()
{
    var 
    	inst1 = new EngineTest.SampleClass1(),
    	inst2 = this.engine.serialize(inst1, "EngineTest.SampleClass1");
    
    this.assertNotNull(inst2);
    this.assertNotUndefined("inst2.propNum is undefined", inst2.propNum);
    this.assertNotUndefined("inst2.propSampleClass2 is undefined", inst2.propSampleClass2);
    this.assertNotUndefined("inst2.propClassArray is undefined", inst2.propClassArray);
    this.assertUndefined(inst2.response);
    this.assertEquals(inst1.propSimpleArray.length, inst2.propSimpleArray.length);
}

EngineTest.prototype = new TestCase();
EngineTest.glue();

function EngineTestSuite()
{
    TestSuite.call( this, "EngineTestSuite" );
    this.addTestSuite( EngineTest );
}
EngineTestSuite.prototype = new TestSuite();
EngineTestSuite.prototype.suite = function () { return new EngineTestSuite(); }


EngineTest.SampleClass1 = function(){
	this.response = "I am an instance of class EngineTest.SampleClass1";
	this.propNum = 3;
	this.propSampleClass2 = new EngineTest.SampleClass2("My super value");
	this.propString = "string value";
	this.propBool = true;
	this.propSimpleArray = [234523, "dgsgkj", false];
	this.propClassArray = [new EngineTest.SampleClass2(), new EngineTest.SampleClass2()];
}

EngineTest.SampleClass2 = function(prop1){
	this.prop1 = prop1 ? prop1 : "some string value";
	this.response = "I am EngineTest.SampleClass2";
}