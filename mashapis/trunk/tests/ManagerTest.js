function ManagerTest(name)
{
    TestCase.call( this, name );
}

function ManagerTest_testRegisterNamespace()
{
    var str = "name1.name2.name3";
    mashapis.Manager.registerNamespace(str);
    this.assertTrue(name1);
    this.assertTrue(name1.name2);
    this.assertTrue(name1.name2.name3);
}

ManagerTest.prototype = new TestCase();
ManagerTest.glue();

function ManagerTestSuite()
{
    TestSuite.call( this, "ManagerTestSuite" );
    this.addTestSuite( ManagerTest );
}
ManagerTestSuite.prototype = new TestSuite();
ManagerTestSuite.prototype.suite = function () { return new ManagerTestSuite(); }
