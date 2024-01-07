-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2024 at 03:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pokebattle`
--

-- --------------------------------------------------------

--
-- Table structure for table `battle`
--

CREATE TABLE `battle` (
  `id` int(11) NOT NULL,
  `user1Id` int(11) NOT NULL,
  `user2Id` int(11) NOT NULL,
  `winnerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_user`
--

CREATE TABLE `leaderboard_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leaderboard_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monster`
--

CREATE TABLE `monster` (
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `health` int(11) NOT NULL,
  `attack` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `speed` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monster`
--

INSERT INTO `monster` (`name`, `type`, `health`, `attack`, `defense`, `speed`, `id`) VALUES
('Glob', 'Normal', 100, 20, 25, 25, 1);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `name` varchar(255) NOT NULL,
  `authNumber` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`name`, `authNumber`, `id`) VALUES
('user', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `wins` int(11) NOT NULL,
  `losses` int(11) NOT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `wins`, `losses`, `roleId`) VALUES
(1, 'te', 'te', 'te', 0, 0, NULL),
(2, 'Kayle', 'Kayle1', 'Kayle@mail.com', 0, 0, NULL),
(3, 'a', 'a', 'a@a.a', 0, 0, NULL),
(4, 'a', 'a', 'a@a.a', 0, 0, NULL),
(5, 'a', 'a', 'a@a.a', 0, 0, NULL),
(6, 'a', 'a', 'a@a.a', 0, 0, NULL),
(7, 'a', 'a', 'a@a.a', 0, 0, NULL),
(8, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(9, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(10, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(11, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(12, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(13, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(14, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(15, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(16, 'kayle2', 'Kayle2', 'kayle2@hotmail.com', 0, 0, NULL),
(17, 'test', 'test', 'test', 0, 0, NULL),
(18, 't', 't', 't', 0, 0, NULL),
(19, 'q', 'q', 'q', 0, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `battle`
--
ALTER TABLE `battle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_31697a2087e382465fd02493270` (`user1Id`),
  ADD KEY `FK_66399fceab7b9807095c6bf6e37` (`user2Id`),
  ADD KEY `FK_0f28157daad5bdcf01ba0c6430d` (`winnerId`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leaderboard_user`
--
ALTER TABLE `leaderboard_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monster`
--
ALTER TABLE `monster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `battle`
--
ALTER TABLE `battle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaderboard_user`
--
ALTER TABLE `leaderboard_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monster`
--
ALTER TABLE `monster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `battle`
--
ALTER TABLE `battle`
  ADD CONSTRAINT `FK_0f28157daad5bdcf01ba0c6430d` FOREIGN KEY (`winnerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_31697a2087e382465fd02493270` FOREIGN KEY (`user1Id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_66399fceab7b9807095c6bf6e37` FOREIGN KEY (`user2Id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
