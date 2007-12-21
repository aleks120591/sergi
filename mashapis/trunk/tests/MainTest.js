function MainTest(name)
{
    TestCase.call( this, name );
}

function MainTest_testRegisterNamespace()
{
    var str = "name1.name2.name3";
    mashape.registerNamespace(str);
    this.assertTrue(name1);
    this.assertTrue(name1.name2);
    this.assertTrue(name1.name2.name3);
}

MainTest.prototype = new TestCase();
MainTest.glue();

function MainTestSuite()
{
    TestSuite.call( this, "MainTestSuite" );
    this.addTestSuite( MainTest );
}
MainTestSuite.prototype = new TestSuite();
MainTestSuite.prototype.suite = function () { return new MainTestSuite(); }
