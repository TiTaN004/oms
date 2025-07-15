-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2025 at 11:56 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `client_master`
--

CREATE TABLE `client_master` (
  `id` int(11) NOT NULL,
  `clientName` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'admin', 'admin', 'mananrathod214@gmail.com', '111111111', '1111', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImp0aSI6MSwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwiVXNlcklkIjoiMSIsImV4cCI6MTc1MjQ4OTAzOSwiaXNzIjoib3Rwc3lzdGVtIiwiYXVkIjoib3Rwc3lzdGVtIiwiaWF0IjoxNzUyNDg1NDM5fQ.9OW690xJc-RONi6GbFRbW2afYjQEF00wKkXY1MKhS-0', 1, 1, 1);

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
(2, 1, 'dFhNoAVjRlK-mH51tIFkgU:APA91bFtIabTQWNnKpy9cZP2Tp2xAh6R11VSLNoBEh0Ys8ImLzpBxLiyF-sfBehmuPJNau4FGdGee3IKvygN650zvHxDtQGVXgH3zYCPB8nAjz542D2iv8g', 'android', 1, '2025-07-07 20:39:50');

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

CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW`current_orders`  AS SELECT `o`.`orderID` AS `orderID`, `o`.`parentOrderID` AS `parentOrderID`, coalesce(`o`.`parentOrderID`,`o`.`orderID`) AS `originalOrderID`, `o`.`orderNo` AS `orderNo`, `o`.`orderOn` AS `orderOn`, `o`.`fClientID` AS `fClientID`, `cm`.`clientName` AS `clientName`, `o`.`fProductID` AS `fProductID`, `p`.`product_name` AS `productName`, `o`.`fAssignUserID` AS `fAssignUserID`, `u`.`fullName` AS `assignUser`, `o`.`weight` AS `weight`, `o`.`productWeight` AS `productWeight`, `o`.`productQty` AS `productQty`, `o`.`totalPrice` AS `totalPrice`, `o`.`status` AS `status`, `o`.`createdAt` AS `createdAt`, `o`.`updatedAt` AS `updatedAt`, (select count(0) from `order` `o2` where coalesce(`o2`.`parentOrderID`,`o2`.`orderID`) = coalesce(`o`.`parentOrderID`,`o`.`orderID`)) AS `totalAssignments` FROM (((`order` `o` left join `client_master` `cm` on(`o`.`fClientID` = `cm`.`id`)) left join `product` `p` on(`o`.`fProductID` = `p`.`id`)) left join `user` `u` on(`o`.`fAssignUserID` = `u`.`userID`)) WHERE `o`.`isActive` = 1 ;

-- --------------------------------------------------------

--
-- Structure for view `order_assignment_history`
--
DROP TABLE IF EXISTS `order_assignment_history`;

CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW`order_assignment_history`  AS SELECT `o`.`orderID` AS `orderID`, coalesce(`o`.`parentOrderID`,`o`.`orderID`) AS `originalOrderID`, `o`.`orderNo` AS `orderNo`, `o`.`fAssignUserID` AS `fAssignUserID`, `u`.`fullName` AS `assignUser`, `o`.`status` AS `status`, `o`.`isActive` AS `isActive`, `o`.`createdAt` AS `assignedAt`, `o`.`updatedAt` AS `lastModified`, CASE WHEN `o`.`isActive` = 1 THEN 'Current' ELSE 'Previous' END AS `assignmentStatus`, row_number() over ( partition by coalesce(`o`.`parentOrderID`,`o`.`orderID`) order by `o`.`createdAt`) AS `assignmentSequence` FROM (`order` `o` left join `user` `u` on(`o`.`fAssignUserID` = `u`.`userID`)) ORDER BY coalesce(`o`.`parentOrderID`,`o`.`orderID`) ASC, `o`.`createdAt` ASC ;

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
  MODIFY `CastingOrderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

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
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
