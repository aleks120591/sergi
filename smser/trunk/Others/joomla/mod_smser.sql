-- 
-- Table structure for table `jos_smser_contacts`
-- 

DROP TABLE IF EXISTS `jos_smser_contacts`;
CREATE TABLE IF NOT EXISTS `jos_smser_contacts` (
  `user_id` int(11) NOT NULL default '0',
  `channel` char(1) NOT NULL default '',
  `number` varchar(7) NOT NULL default '',
  `name` varchar(10) NOT NULL default '',
  `gate` int(11) NOT NULL default '0',
  `rate` int(11) NOT NULL default '0',
  KEY `idx_user_id_rate` (`user_id`,`rate`)
) TYPE=MyISAM;

-- --------------------------------------------------------

-- 
-- Table structure for table `jos_smser_users`
-- 

DROP TABLE IF EXISTS `jos_smser_users`;
CREATE TABLE IF NOT EXISTS `jos_smser_users` (
  `user_id` int(11) NOT NULL default '0',
  `sender_name` varchar(20) NOT NULL default '',
  `gate` int(11) NOT NULL default '4',
  PRIMARY KEY  (`user_id`)
) TYPE=MyISAM;