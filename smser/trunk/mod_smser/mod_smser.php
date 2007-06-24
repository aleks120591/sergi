<?php
/**
 * Smser Module Entry Point
 * 
 * @package		SAdamchuk.Smser
 * @subpackage	JoomlaModule
 * @link		http://sendsms.com.ua
 * @license		GNU/GPL, see LICENSE.php
 * mod_smser is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 */

// no direct access
defined( '_VALID_MOS' ) or die( 'Restricted access' );
?>

<style type="text/css">
	<!--
	@import "http://sendsms.com.ua/goodies/live/SmserGadget.css";
	// -->
</style>
<table widht="100%" align="center"><tr><td>
	<div id="smserGadgetHolder" class="SAdamchuk_MSGadgets_SmserGadget"/>
</table></td></tr>
<script type="text/javascript" src="http://sendsms.com.ua/goodies/live/smser.js" charset="UTF-8" language="javascript"></script>
<script type="text/javascript" language="javascript">
		<!--
		var env={resolveUrl:function(path){return "http://sendsms.com.ua/goodies/live/"+path;},Resize:function(){}};
        var el=document.getElementById("smserGadgetHolder");
        var view=SAdamchuk_Smser_View(
            el,env,
            "Дана версія ґаджету не дозволяє зберігати контакти, якщо хочете щоб останні/найчастіше використовувані телефони запам'ятовувались, будь ласка <a href=\"http://www.live.com/?add=http%3A//sendsms.com.ua/goodies/live/gadget.xml\" target=\"_blank\">проінсталюйте</a> ґаджет на <a href=\"http://live.com\" target=\"_blank\">персоналізовану сторінку Live.com</a>",//null,
            "Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"http://sendsms.com.ua/faq.htm\" target=\"_blank\">частих питань</a>.");
        SAdamchuk_Smser_Controller.initialize(view,null,false);
		//-->
</script>