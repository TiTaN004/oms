-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2025 at 09:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oms_site`
--

-- --------------------------------------------------------

--
-- Table structure for table `casting_order`
--

CREATE TABLE `casting_order` (
  `CastingOrderId` int(11) NOT NULL,
  `fClientID` int(11) DEFAULT NULL,
  `fProductID` int(11) DEFAULT NULL,
  `fAssignUserID` int(11) DEFAULT NULL,
  `fOperationID` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `size` float NOT NULL,
  `order_date` datetime NOT NULL,
  `status` varchar(20) DEFAULT NULL CHECK (`status` in ('Processing','Completed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `casting_order`
--

INSERT INTO `casting_order` (`CastingOrderId`, `fClientID`, `fProductID`, `fAssignUserID`, `fOperationID`, `quantity`, `size`, `order_date`, `status`) VALUES
(2, 3, 7, 3, 1, 10, 10, '2025-06-23 00:00:00', 'Processing');

-- --------------------------------------------------------

--
-- Table structure for table `client_master`
--

CREATE TABLE `client_master` (
  `id` int(11) NOT NULL,
  `clientName` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_master`
--

INSERT INTO `client_master` (`id`, `clientName`, `isActive`) VALUES
(3, 'testbhai', 1),
(37, 'Final test', 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `current_orders`
-- (See below for the actual view)
--
CREATE TABLE `current_orders` (
`orderID` int(11)
,`parentOrderID` int(11)
,`originalOrderID` int(11)
,`orderNo` varchar(50)
,`orderOn` datetime
,`fClientID` int(11)
,`clientName` varchar(50)
,`fProductID` int(11)
,`productName` varchar(50)
,`fAssignUserID` int(11)
,`assignUser` varchar(255)
,`weight` decimal(10,2)
,`productWeight` decimal(10,2)
,`productQty` int(11)
,`totalPrice` decimal(10,2)
,`status` enum('Processing','Completed','Cancelled')
,`createdAt` timestamp
,`updatedAt` timestamp
,`totalAssignments` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `operation_type`
--

CREATE TABLE `operation_type` (
  `id` int(11) NOT NULL,
  `operationName` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operation_type`
--

INSERT INTO `operation_type` (`id`, `operationName`, `isActive`) VALUES
(1, 'admin', 1),
(2, 'fortune casting', 1),
(3, 'Black Matt', 1),
(4, 'GE', 1),
(5, 'Buff', 1),
(6, 'Tunning', 1),
(7, 'VMC', 1),
(8, 'Crome', 1),
(9, 'Colour', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `orderID` int(11) NOT NULL,
  `parentOrderID` int(11) DEFAULT NULL,
  `fAssignUserID` int(11) DEFAULT NULL,
  `fClientID` int(11) DEFAULT NULL,
  `fProductID` int(11) DEFAULT NULL,
  `fOperationID` int(11) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `orderNo` varchar(50) DEFAULT NULL,
  `orderOn` datetime DEFAULT NULL,
  `pricePerQty` decimal(10,2) DEFAULT NULL,
  `productQty` int(11) DEFAULT NULL,
  `productWeight` decimal(10,2) DEFAULT NULL,
  `productWeightTypeID` int(11) DEFAULT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL,
  `totalWeight` decimal(10,2) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `WeightTypeID` int(11) DEFAULT NULL,
  `status` enum('Processing','Completed','Cancelled') DEFAULT 'Processing',
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`orderID`, `parentOrderID`, `fAssignUserID`, `fClientID`, `fProductID`, `fOperationID`, `remark`, `description`, `orderNo`, `orderOn`, `pricePerQty`, `productQty`, `productWeight`, `productWeightTypeID`, `totalPrice`, `totalWeight`, `weight`, `WeightTypeID`, `status`, `isActive`, `createdAt`, `updatedAt`) VALUES
(30, NULL, 6, 3, 7, 2, ' [Reassigned on 2025-06-25 19:35:35]', 'heloookkljjk', 'ORD001', '2025-06-25 19:33:02', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 14:03:02', '2025-06-25 14:21:19'),
(31, 30, 7, 3, 7, 7, ' [Reassigned from previous by admin] [Reassigned on 2025-06-25 19:56:36]', 'heloo', 'ORD001', '2025-06-25 19:33:02', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 14:05:35', '2025-06-25 14:26:36'),
(32, 30, 3, 3, 7, 2, ' [Reassigned from previous by admin] [Reassigned on 2025-06-25 20:38:13]', 'heloo', 'ORD001', '2025-06-25 19:33:02', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 14:26:36', '2025-06-25 15:08:13'),
(33, NULL, 6, 3, 7, 2, ' [Reassigned on 2025-06-25 20:38:37]', 'test', 'ORD002', '2025-06-25 20:37:36', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 15:07:36', '2025-06-25 15:08:37'),
(34, 30, 6, 3, 7, 2, ' [Reassigned from previous by admin]', 'order is complete 100pice returned', 'ORD001', '2025-06-25 19:33:02', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 15:08:13', '2025-06-26 04:43:05'),
(35, 33, 7, 3, 7, 7, ' [Reassigned from previous by admin] [Reassigned on 2025-06-26 20:17:52]', 'test', 'ORD002', '2025-06-25 20:37:36', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-25 15:08:37', '2025-06-26 14:47:52'),
(43, NULL, 7, 3, 5, 7, ' [Reassigned on 2025-06-26 20:14:54]', 'reassign notification test', 'ORD010', '2025-06-26 20:14:32', 1.00, 1000, 1.00, 1, 1000.00, 2.00, 1.00, 2, 'Completed', 1, '2025-06-26 14:44:32', '2025-06-26 14:45:52'),
(44, 43, 3, 3, 5, 2, ' [Reassigned from previous by admin]', 'live test', 'ORD010', '2025-06-26 20:14:32', 1.00, 1000, 1.00, 1, 1000.00, 2.00, 1.00, 2, 'Completed', 1, '2025-06-26 14:44:54', '2025-07-04 05:12:44'),
(45, 33, 3, 3, 7, 2, ' [Reassigned from previous by admin] [Reassigned on 2025-06-30 20:36:13]', 'test', 'ORD002', '2025-06-25 20:37:36', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Processing', 1, '2025-06-26 14:47:52', '2025-06-30 15:06:13'),
(81, 33, 7, 3, 7, 7, ' [Reassigned from previous by admin] [Reassigned on 2025-07-01 09:05:24]', 'assigning to the tester', 'ORD002', '2025-06-25 20:37:36', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-06-30 15:06:14', '2025-07-01 03:35:24'),
(82, 33, 6, 3, 7, 7, ' [Reassigned from previous by admin]', 'assigning to the tester', 'ORD002', '2025-06-25 20:37:36', 2.00, 1111, 1.00, 2, 2222.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-07-01 03:35:24', '2025-07-01 03:35:24'),
(89, NULL, 3, 37, 17, 2, ' [Reassigned on 2025-07-01 09:34:29]', 'sending to another ', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:01:07', '2025-07-01 04:04:29'),
(90, 89, 7, 37, 17, 7, 'Reassigned from order 89 [Reassigned on 2025-07-01 09:41:04]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:04:29', '2025-07-01 04:11:04'),
(91, 89, 6, 37, 17, 2, 'Reassigned from order 90 [Reassigned on 2025-07-01 09:42:05]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:11:04', '2025-07-01 04:12:05'),
(92, 89, 3, 37, 17, 2, 'Reassigned from order 91 [Reassigned on 2025-07-01 10:28:09]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:12:05', '2025-07-01 04:58:09'),
(93, 89, 6, 37, 17, 2, 'Reassigned from order 92 [Reassigned on 2025-07-01 10:28:27]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:58:09', '2025-07-01 04:58:27'),
(94, 89, 3, 37, 17, 2, 'Reassigned from order 93 [Reassigned on 2025-07-01 10:28:47]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:58:27', '2025-07-01 04:58:47'),
(95, 89, 6, 37, 17, 2, 'Reassigned from order 94 [Reassigned on 2025-07-01 10:28:52]', 'sending to another', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:58:47', '2025-07-01 04:58:52'),
(96, 89, 3, 37, 17, 2, 'Reassigned from order 95 [Reassigned on 2025-07-02 15:11:19]', 'Inside', 'ORD011', '2025-07-01 09:31:07', 2.00, 10, 1.00, 2, 20.00, 11.00, 10.00, 2, 'Completed', 1, '2025-07-01 04:58:52', '2025-07-02 09:41:19'),
(97, NULL, 3, 37, 7, 2, '', '4', 'ORD012', '2025-07-02 11:50:56', 1.00, 1, 1.00, 1, 1.00, 2.00, 1.00, 1, 'Processing', 1, '2025-07-02 06:20:56', '2025-07-02 09:43:42'),
(104, NULL, 3, 3, 7, 2, '', 'Testing search', 'ORD013', '2025-07-02 16:49:39', 1.00, 1, 1.00, 1, 1.00, 2.00, 1.00, 1, 'Processing', 1, '2025-07-02 11:19:39', '2025-07-02 11:19:39'),
(105, NULL, 3, 37, 7, 2, '', 'tttttt', 'ORD014', '2025-07-04 14:13:52', 1.00, 11000, 1.00, 1, 11000.00, 12.00, 11.00, 2, 'Completed', 1, '2025-07-04 08:43:52', '2025-07-05 07:01:20'),
(106, NULL, 3, 3, 7, 2, ' [Reassigned on 2025-07-05 12:39:58]', 'final test ', 'ORD015', '2025-07-05 12:38:10', 1.00, 1111000, 1.00, 1, 1111000.00, 1112.00, 1111.00, 2, 'Completed', 1, '2025-07-05 07:08:10', '2025-07-05 07:09:58'),
(107, 106, 7, 3, 7, 7, 'Reassigned from order 106', 'final test ', 'ORD015', '2025-07-05 12:38:10', 1.00, 1111000, 1.00, 1, 1111000.00, 1112.00, 1111.00, 2, 'Processing', 1, '2025-07-05 07:09:58', '2025-07-05 07:09:58');

-- --------------------------------------------------------

--
-- Stand-in structure for view `order_assignment_history`
-- (See below for the actual view)
--
CREATE TABLE `order_assignment_history` (
`orderID` int(11)
,`originalOrderID` int(11)
,`orderNo` varchar(50)
,`fAssignUserID` int(11)
,`assignUser` varchar(255)
,`status` enum('Processing','Completed','Cancelled')
,`isActive` tinyint(1)
,`assignedAt` timestamp
,`lastModified` timestamp
,`assignmentStatus` varchar(8)
,`assignmentSequence` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `userID`, `token`, `expires_at`, `created_at`) VALUES
(8, 7, '969404', '2025-06-27 15:00:56', '2025-06-27 14:45:56');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `product_name`, `product_image`, `is_active`) VALUES
(5, 't', 'product_6856ead0b055f.png', 1),
(7, '00000', 'product_6856eac51eeeb.png', 1),
(17, 'test', 'product_686158e7bfd24.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `emailID` varchar(100) NOT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(455) DEFAULT NULL,
  `operationTypeID` int(11) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `fullName`, `userName`, `emailID`, `mobileNo`, `password`, `token`, `operationTypeID`, `isAdmin`, `isActive`) VALUES
(1, 'admin', 'admin', 'mananrathod214@gmail.com', '111111111', '1111', '', 1, 1, 1),
(3, 'Test', 'test', 'test123@gmail.com', '111111112', '2222', '', 2, 0, 1),
(6, 'testerrrrrr', 'tester', 'mananrathod45@gmail.com', '7043860209', '1', '', 2, 0, 1),
(7, 'another user', 'another', 'test@gmail.com', '23423434', '3333', '', 7, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `device_token` varchar(255) NOT NULL,
  `platform` enum('android','ios') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_devices`
--

INSERT INTO `user_devices` (`id`, `userID`, `device_token`, `platform`, `is_active`, `updated_at`) VALUES
(1, 3, '', 'android', 1, '2025-07-05 12:34:08'),
(2, 1, '', 'android', 1, '2025-07-04 20:07:38'),
(5, 7, '', 'android', 1, '2025-06-30 11:32:35');

-- --------------------------------------------------------

--
-- Table structure for table `weight_type`
--

CREATE TABLE `weight_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `weight_type`
--

INSERT INTO `weight_type` (`id`, `name`) VALUES
(1, 'Gram'),
(2, 'KG');

-- --------------------------------------------------------

--
-- Structure for view `current_orders`
--
DROP TABLE IF EXISTS `current_orders`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `current_orders`  AS SELECT `o`.`orderID` AS `orderID`, `o`.`parentOrderID` AS `parentOrderID`, coalesce(`o`.`parentOrderID`,`o`.`orderID`) AS `originalOrderID`, `o`.`orderNo` AS `orderNo`, `o`.`orderOn` AS `orderOn`, `o`.`fClientID` AS `fClientID`, `cm`.`clientName` AS `clientName`, `o`.`fProductID` AS `fProductID`, `p`.`product_name` AS `productName`, `o`.`fAssignUserID` AS `fAssignUserID`, `u`.`fullName` AS `assignUser`, `o`.`weight` AS `weight`, `o`.`productWeight` AS `productWeight`, `o`.`productQty` AS `productQty`, `o`.`totalPrice` AS `totalPrice`, `o`.`status` AS `status`, `o`.`createdAt` AS `createdAt`, `o`.`updatedAt` AS `updatedAt`, (select count(0) from `order` `o2` where coalesce(`o2`.`parentOrderID`,`o2`.`orderID`) = coalesce(`o`.`parentOrderID`,`o`.`orderID`)) AS `totalAssignments` FROM (((`order` `o` left join `client_master` `cm` on(`o`.`fClientID` = `cm`.`id`)) left join `product` `p` on(`o`.`fProductID` = `p`.`id`)) left join `user` `u` on(`o`.`fAssignUserID` = `u`.`userID`)) WHERE `o`.`isActive` = 1 ;

-- --------------------------------------------------------

--
-- Structure for view `order_assignment_history`
--
DROP TABLE IF EXISTS `order_assignment_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `order_assignment_history`  AS SELECT `o`.`orderID` AS `orderID`, coalesce(`o`.`parentOrderID`,`o`.`orderID`) AS `originalOrderID`, `o`.`orderNo` AS `orderNo`, `o`.`fAssignUserID` AS `fAssignUserID`, `u`.`fullName` AS `assignUser`, `o`.`status` AS `status`, `o`.`isActive` AS `isActive`, `o`.`createdAt` AS `assignedAt`, `o`.`updatedAt` AS `lastModified`, CASE WHEN `o`.`isActive` = 1 THEN 'Current' ELSE 'Previous' END AS `assignmentStatus`, row_number() over ( partition by coalesce(`o`.`parentOrderID`,`o`.`orderID`) order by `o`.`createdAt`) AS `assignmentSequence` FROM (`order` `o` left join `user` `u` on(`o`.`fAssignUserID` = `u`.`userID`)) ORDER BY coalesce(`o`.`parentOrderID`,`o`.`orderID`) ASC, `o`.`createdAt` ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `casting_order`
--
ALTER TABLE `casting_order`
  ADD PRIMARY KEY (`CastingOrderId`),
  ADD KEY `fClientID` (`fClientID`),
  ADD KEY `fProductID` (`fProductID`),
  ADD KEY `fAssignUserID` (`fAssignUserID`),
  ADD KEY `fOperationID` (`fOperationID`);

--
-- Indexes for table `client_master`
--
ALTER TABLE `client_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `operation_type`
--
ALTER TABLE `operation_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `fAssignUserID` (`fAssignUserID`),
  ADD KEY `fClientID` (`fClientID`),
  ADD KEY `fProductID` (`fProductID`),
  ADD KEY `fOperationID` (`fOperationID`),
  ADD KEY `productWeightTypeID` (`productWeightTypeID`),
  ADD KEY `WeightTypeID` (`WeightTypeID`),
  ADD KEY `idx_parent_order` (`parentOrderID`),
  ADD KEY `idx_active_orders` (`isActive`),
  ADD KEY `idx_order_status` (`status`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `emailID` (`emailID`),
  ADD UNIQUE KEY `mobileNo` (`mobileNo`),
  ADD KEY `operationTypeID` (`operationTypeID`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `weight_type`
--
ALTER TABLE `weight_type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `casting_order`
--
ALTER TABLE `casting_order`
  MODIFY `CastingOrderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `client_master`
--
ALTER TABLE `client_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `operation_type`
--
ALTER TABLE `operation_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `weight_type`
--
ALTER TABLE `weight_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `casting_order`
--
ALTER TABLE `casting_order`
  ADD CONSTRAINT `casting_order_ibfk_1` FOREIGN KEY (`fClientID`) REFERENCES `client_master` (`id`),
  ADD CONSTRAINT `casting_order_ibfk_2` FOREIGN KEY (`fProductID`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `casting_order_ibfk_3` FOREIGN KEY (`fAssignUserID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `casting_order_ibfk_4` FOREIGN KEY (`fOperationID`) REFERENCES `operation_type` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`fAssignUserID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`fClientID`) REFERENCES `client_master` (`id`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`fProductID`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`fOperationID`) REFERENCES `operation_type` (`id`),
  ADD CONSTRAINT `order_ibfk_5` FOREIGN KEY (`productWeightTypeID`) REFERENCES `weight_type` (`id`),
  ADD CONSTRAINT `order_ibfk_6` FOREIGN KEY (`WeightTypeID`) REFERENCES `weight_type` (`id`),
  ADD CONSTRAINT `order_parent_fk` FOREIGN KEY (`parentOrderID`) REFERENCES `order` (`orderID`);

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`operationTypeID`) REFERENCES `operation_type` (`id`);

--
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
