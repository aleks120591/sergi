<?php
$channels=array(
	"0" => "+38050{0}@sms.umc.com.ua",
	"1" => "+38095{0}@sms.umc.com.ua",
	"2" => "+38099{0}@sms.umc.com.ua",
	"3" => "+38066{0}@sms.umc.com.ua",
	"4" => "38067{0}@sms.kyivstar.net",
	"5" => "38096{0}@sms.kyivstar.net",
	"6" => "38097{0}@sms.kyivstar.net",
	"7" => "38098{0}@sms.kyivstar.net",
	"8" => "38063{0}@life.com.ua",
	"9" => "38093{0}@life.com.ua",
	"a" => "38068{0}@sms.beeline.ua",
	"b" => "38039{0}@sms.gt.kiev.ua",
	"c" => "38039{0}@sms.gt.kiev.ua",
	"d" => "38068{0}@sms.beeline.ua"
);

$to = str_replace("{0}",$_POST["number"],$channels[$_POST["channelCode"]]);
$subject = "";
$txt = $_POST["message"].$_POST["senderName"];
$headers = "From: ".$_POST["senderEmail"];

if (mail($to,$subject,$txt,$headers))
  echo "<p align='center'>���� ����������� ������ �������</p>";
else
  echo "<p align='center'>������� ������� ��� �������� ����������� �� email ����. �������������, �� �� ���� ����� ����� ����������, ��� email �� ��������� ��������� ���� ����</p>";

echo "<p align='center'><a href='javascript:window.close()'>�������</a></p>";
?>