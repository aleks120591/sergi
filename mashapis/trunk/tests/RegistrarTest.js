function RegistrarTest(name)
{
    TestCase.call( this, name );
}

function RegistrarTest_testRegisterNamespace()
{
    var str = "name1.name2.name3";
    mashape.Registrar.registerNamespace(str);
    this.assertNotNull(name1);
    this.assertNotNull(name1.name2);
    this.assertNotNull(name1.name2.name3);
}

function RegistrarTest_testCreateInstance()
{
    var 
    	inst1 = new RegistrarTest.SampleClass1(),
    	inst2 = mashape.Registrar.createInstance("RegistrarTest.SampleClass1");
    	
    this.assertEquals("Method mashape.Registrar.createInstance doesn't work", inst1.response, inst2.response);
}

function RegistrarTest_testSerializeSimple()
{
    var 
    	inst1 = {prop1 : true, prop2 : "string value", prop3 : 56},
    	inst2 = mashape.Registrar.serialize(inst1);
    	
    this.assertNotUndefined(inst2.prop1);
    this.assertEquals("Simple serialization: failed to serialize true value", inst1.prop1, inst2.prop1);
    this.assertEquals("Simple serialization: failed to serialize string value", inst1.prop2, inst2.prop2);
    this.assertEquals("Simple serialization: failed to serialize bumber value", inst1.prop3, inst2.prop3);
}

function RegistrarTest_testSerializeClass()
{
    var 
    	inst1 = new RegistrarTest.SampleClass2(),
    	inst2 = mashape.Registrar.serialize(inst1, "RegistrarTest.SampleClass2");

    this.assertNotUndefined(inst2.prop1);
    this.assertUndefined(inst2.response);
    this.assertEquals("Class serialization: failed to serialize true value", inst1.prop1, inst2.prop1);
}

function RegistrarTest_testSerializeComplex()
{
    var 
    	inst1 = new RegistrarTest.SampleClass1(),
    	inst2 = mashape.Registrar.serialize(inst1, "RegistrarTest.SampleClass1");
    
    this.assertNotUndefined("inst2.propNum is undefined", inst2.propNum);
    this.assertNotUndefined("inst2.propSampleClass2 is undefined", inst2.propSampleClass2);
    this.assertNotUndefined("inst2.propClassArray is undefined", inst2.propClassArray);
    this.assertUndefined(inst2.response);
    this.assertEquals(inst1.propSimpleArray.length, inst2.propSimpleArray.length);
}

RegistrarTest.prototype = new TestCase();
RegistrarTest.glue();

function RegistrarTestSuite()
{
    TestSuite.call( this, "RegistrarTestSuite" );
    this.addTestSuite( RegistrarTest );
}
RegistrarTestSuite.prototype = new TestSuite();
RegistrarTestSuite.prototype.suite = function () { return new RegistrarTestSuite(); }


RegistrarTest.SampleClass1 = function(){
	this.response = "I am an instance of class RegistrarTest.SampleClass1";
	this.propNum = 3;
	this.propSampleClass2 = new RegistrarTest.SampleClass2("My super value");
	this.propString = "string value";
	this.propBool = true;
	this.propSimpleArray = [234523, "dgsgkj", false];
	this.propClassArray = [new RegistrarTest.SampleClass2(), new RegistrarTest.SampleClass2()];
}

RegistrarTest.SampleClass2 = function(prop1){
	this.prop1 = prop1 ? prop1 : "some string value";
	this.response = "I am RegistrarTest.SampleClass2";
}

mashape.Registrar.registerClassDesriptor("RegistrarTest.SampleClass1",
		["propNum", "propSampleClass2:RegistrarTest.SampleClass2", "propString", "propBool", "propSimpleArray", "propClassArray:[RegistrarTest.SampleClass2]"]);

mashape.Registrar.registerClassDesriptor("RegistrarTest.SampleClass2", ["prop1"]);