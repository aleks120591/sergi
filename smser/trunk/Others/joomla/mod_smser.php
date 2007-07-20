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

if ($_POST["change"]) 
{
	$keys=array_keys($_POST);
	switch ($keys[1])
	{
		case "gat":
			$user = new stdClass;
			$user->user_id = $my->id;
			$user->gate = intval($_POST[1]);
			$database->updateObject('#__smser_users', $user, 'user_id');
			break;
	}
	return;
}

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
<?php if($my->id) { ?>
			function SAdamchuk_Smser_CreateContact(channel,number,name,gate,rate){
				var r=new SAdamchuk_Smser_Contact(channel,number,rate);
				r.name=name;
				r.gate=gate;
				return r;
			}
			function SAdamchuk_Smser_Persister(){
				<?php 
					$database->setQuery( "SELECT `jos_smser_users`.`sender_name` , `jos_smser_users`.`gate` FROM `jos_smser_users` WHERE `jos_smser_users`.`user_id` = ".$my->id );
					$user = NULL;
  					$database->loadObject( $user );
  					echo "this.senderName='$user->sender_name';";
  					echo "this.gate=$user->gate;";
				?>
			}
			SAdamchuk_Smser_Persister.prototype.getContacts=function(){
			    return [
				<?php
			    	function creatorFunction($rec) 
					{
						return "SAdamchuk_Smser_CreateContact('$rec->channel','$rec->number','$rec->name',$rec->gate,$rec->rate)";
					}
			    	$database->setQuery( "SELECT `jos_smser_contacts`.`channel`, `jos_smser_contacts`.`number`, `jos_smser_contacts`.`name`, `jos_smser_contacts`.`gate`, `jos_smser_contacts`.`rate` FROM `jos_smser_contacts` WHERE `jos_smser_contacts`.`user_id` = ".$my->id." ORDER BY `jos_smser_contacts`.`rate` DESC" );
					 $rows = $database->loadObjectList();
				    echo join(",",array_map("creatorFunction",$rows));
			    ?>
			    ];
			}
			SAdamchuk_Smser_Persister.prototype.getSenderName=function(){
			    return this.senderName;
			}
			SAdamchuk_Smser_Persister.prototype.getGateType=function(){
			    return this.gate;
			}
			SAdamchuk_Smser_Persister.prototype.save=function(contacts,senderName){
			    this.module.setPreference("snd",senderName);
			    this.module.setPreference("cnt",SAdamchuk_Smser_SerializeContacts(contacts));
			}
			SAdamchuk_Smser_Persister.prototype.saveGateType=function(gateType){
				this.postData("gat",gateType.toString());
			}
			SAdamchuk_Smser_Persister.prototype.postData=function(paramName,value){
				var req=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Msxml2.XMLHTTP");
				req.open("POST", <?php echo "'".$mosConfig_live_site."/modules/mod_smser.php'"; ?>, true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.send("change=1&".paramName+"="+escape(value));
			}
<?php } ?>
	
		var env={resolveUrl:function(path){return "http://sendsms.com.ua/goodies/live/"+path;},Resize:function(){}};
        var el=document.getElementById("smserGadgetHolder");
        var view=SAdamchuk_Smser_View(
            el,env,
<?php if($my->id) { ?> "��� ������ ��������" <?php } else { ?>
            "��� ����, ��� ���� �������� ���������� ���, ��� ������� �������������� �� ����� ����. <a href='index.php?option=com_registration&task=register'>�������������</a>, ���� �� �� �� �����������, ���� � ��� ��� � �������� �����, ���� �����, �������������." <?php } ?> ,
            "���� � ��� ������� ��������� �� ��������, ���� ����� �������� �� ������� <a href=\"http://sendsms.com.ua/faq\" target=\"_blank\">������ ������</a>.");
        SAdamchuk_Smser_Controller.initialize(view,<?php if($my->id) { ?> new SAdamchuk_Smser_Persister(),true <?php } else { ?> null,false <?php } ?>);
		//-->
</script>