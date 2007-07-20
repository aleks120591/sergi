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
if (count($_POST)>0) 
{
	// Set flag that this is a parent file
	define( '_VALID_MOS', 1 );
	
	require( '../globals.php' );
	require_once( '../configuration.php' );
	// SSL check - $http_host returns <live site url>:<port number if it is 443>
	$http_host = explode(':', $_SERVER['HTTP_HOST'] );
	if( (!empty( $_SERVER['HTTPS'] ) && strtolower( $_SERVER['HTTPS'] ) != 'off' || isset( $http_host[1] ) && $http_host[1] == 443) && substr( $mosConfig_live_site, 0, 8 ) != 'https://' ) {
		$mosConfig_live_site = 'https://'.substr( $mosConfig_live_site, 7 );
	}

	require_once( '../includes/joomla.php' );
	
	$mainframe = new mosMainFrame( $database, null, '.' );
	$mainframe->initSession();
	$my = $mainframe->getUser();
	$keys=array_keys($_POST);
	$theVal=$_POST[$keys[0]];
	switch ($keys[0])
	{
		case "gat":
			$user = new stdClass;
			$user->user_id = $my->id;
			$user->gate = intval($theVal);
			$database->updateObject('#__smser_users', $user, 'user_id');
			break;
		case "snd":
			$user = new stdClass;
			$user->user_id = $my->id;
			$user->sender_name = $theVal;
			$database->updateObject('#__smser_users', $user, 'user_id');
			break;
	}
	exit();
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
			    this.postData("snd",senderName);
			    this.postData("cnt",this.serializeContacts(contacts));
			}
			SAdamchuk_Smser_Persister.prototype.saveGateType=function(gateType){
				this.postData("gat",gateType.toString());
			}
			SAdamchuk_Smser_Persister.prototype.postData=function(paramName,value){
				var req=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Msxml2.XMLHTTP");
				req.open("POST", <?php echo "'".$mosConfig_live_site."/modules/mod_smser.php'"; ?>, true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.send(paramName+"="+escape(value));
			}
			SAdamchuk_Smser_Persister.prototype.serializeContacts(contacts){
				var res="<contacts>";
				for(var i=0;i<contacts.length;i++){
					var c=contacts[i];
					res+="<contact channel=\""+
					c.channel+
					"\" name=\""+c.channel+
					"\" rate=\""+c.rate+
					"\" number=\""+c.number+
					"\" gate=\""+c.gate+
					"\"/>";
				}
				return res+"</contacts>";
			}
<?php } ?>
	
		var env={resolveUrl:function(path){return "http://sendsms.com.ua/goodies/live/"+path;},Resize:function(){}};
        var el=document.getElementById("smserGadgetHolder");
        var view=SAdamchuk_Smser_View(
            el,env,
<?php if($my->id) { ?> "Тут будуть контакти" <?php } else { ?>
            "Для того, щоб ваші контакти зберігались тут, вам потрібно авторизуватись на цьмоу сайті. <a href='index.php?option=com_registration&task=register'>Зареєструйтесь</a>, якщо ви ще не зареєстровані, якщо у вас вже є обліковий запис, будь ласка, авторизуйтесь." <?php } ?> ,
            "Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"http://sendsms.com.ua/faq\" target=\"_blank\">частих питань</a>.");
        SAdamchuk_Smser_Controller.initialize(view,<?php if($my->id) { ?> new SAdamchuk_Smser_Persister(),true <?php } else { ?> null,false <?php } ?>);
		//-->
</script>