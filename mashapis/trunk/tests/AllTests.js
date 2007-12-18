/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

if( !this.JsUtil )
{
    if( this.WScript )
    {
        var fso = new ActiveXObject( "Scripting.FileSystemObject" );
        var file = fso.OpenTextFile( "../lib/jsunit/JsUtil.js", 1 );
        var all = file.ReadAll();
        file.Close();
        eval( all );
    }
    else
        load( "../lib/jsunit/JsUtil.js" );
    
    eval( JsUtil.prototype.include( "../lib/jsunit/JsUnit.js" ));
    eval( JsUtil.prototype.include( "../src/mashapis.js" ));
    
    eval( JsUtil.prototype.include( "ManagerTest.js" ));
}

function AllTests()
{
    TestSuite.call( this, "AllTests" );
}
function AllTests_suite()
{
    var suite = new AllTests();
    suite.addTest( ManagerTestSuite.prototype.suite());
    return suite;
}
AllTests.prototype = new TestSuite();
AllTests.prototype.suite = AllTests_suite;

var args;
if( this.WScript )
{
    args = new Array();
    for( var i = 0; i < WScript.Arguments.Count(); ++i )
        args[i] = WScript.Arguments( i );
}
else if( this.arguments )
    args = arguments;
else
    args = new Array();
    
var result = TextTestRunner.prototype.main( args );
JsUtil.prototype.quit( result );