-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Jul 19, 2007 at 06:35 PM
-- Server version: 5.0.41
-- PHP Version: 5.2.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `sendsms`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `jos_smser_contacts`
-- 

CREATE TABLE `jos_smser_contacts` (
  `user_id` int(11) NOT NULL,
  `channel` char(1) collate latin1_general_ci NOT NULL,
  `number` char(7) collate latin1_general_ci NOT NULL,
  `name` varchar(10) collate latin1_general_ci NOT NULL default '''''',
  `gate` int(11) NOT NULL,
  `rate` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

-- 
-- Table structure for table `jos_smser_users`
-- 

CREATE TABLE `jos_smser_users` (
  `user_id` int(11) NOT NULL,
  `sender_name` varchar(20) collate latin1_general_ci default NULL,
  `gate` int(11) NOT NULL default '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;