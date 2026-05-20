-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2026 at 06:54 PM
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
-- Database: `capstter`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_codes_table`
--

CREATE TABLE `access_codes_table` (
  `access_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `code` varchar(999) NOT NULL,
  `year_created` int(4) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `access_codes_table`
--

INSERT INTO `access_codes_table` (`access_id`, `business_id`, `code`, `year_created`, `is_active`) VALUES
(1, 1, '2526-4BGR1', 2025, 1),
(2, 2, '2526-4BGR2', 2025, 1),
(3, 3, '2526-4AGR3', 2025, 1),
(4, 4, '2526-4AGR4', 2025, 1),
(5, 5, '2526-4AGR5', 2025, 1),
(7, 7, '2526-4AGR10', 2025, 1),
(8, 8, '2526-4AGR6', 2025, 1),
(9, 20, '2526-4BGR3', 2026, 1);

-- --------------------------------------------------------

--
-- Table structure for table `action_table`
--

CREATE TABLE `action_table` (
  `action_id` bigint(12) UNSIGNED NOT NULL,
  `action_name` varchar(999) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `action_table`
--

INSERT INTO `action_table` (`action_id`, `action_name`, `description`) VALUES
(1, 'create', 'Add new record'),
(2, 'read', 'View record'),
(3, 'update', 'Modify record'),
(4, 'delete', 'Soft delete (archived)'),
(5, 'cancel', 'Cancel pending transaction'),
(6, 'archive', 'Archive old records'),
(7, 'export', 'Export reports/data');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED DEFAULT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `module_id` bigint(12) UNSIGNED NOT NULL,
  `action_id` bigint(12) UNSIGNED NOT NULL,
  `table_name` varchar(99) NOT NULL,
  `record_id` bigint(12) UNSIGNED NOT NULL,
  `old_data` longtext NOT NULL,
  `new_data` longtext NOT NULL,
  `ip_address` varchar(99) NOT NULL,
  `user_agent` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:09:44'),
(2, 2, 5, 3, 1, 'products', 20, '{}', '{\"name\":\"Red bell Pepper\",\"unit_id\":\"1\",\"price\":\"30\",\"product_type\":\"simple\",\"category_id\":\"7\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764540753/products/kydtr1bubziy4mipp4tj.jpg\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:12:33'),
(3, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:30:26'),
(4, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:31:00'),
(6, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:43:06'),
(7, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:43:06'),
(9, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:45:59'),
(10, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:45:59'),
(11, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:46:01'),
(12, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:46:01'),
(13, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:46:01'),
(14, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:46:01'),
(16, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:52'),
(17, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:52'),
(18, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:57'),
(19, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:57'),
(20, 1, 1, 1, 2, 'employees', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:57'),
(21, 1, 1, 1, 2, 'employees', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:57'),
(22, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:59'),
(23, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:47:59'),
(24, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:45'),
(25, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:45'),
(26, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:47'),
(27, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:47'),
(28, 1, 1, 1, 2, 'employees', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:49'),
(29, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:49'),
(30, 1, 1, 1, 2, 'employees', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:49'),
(31, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:49'),
(32, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(33, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(34, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(35, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(36, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(37, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:50'),
(38, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:51'),
(39, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:51'),
(40, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:55'),
(41, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:55'),
(42, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:55'),
(43, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:57'),
(44, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:57'),
(45, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:57'),
(46, 1, 1, 1, 2, '1', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:57'),
(48, NULL, 11, 4, 2, 'total_amount', 0, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:54:10'),
(51, 7, 13, 1, 2, 'settings', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:49:38'),
(52, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:49:38'),
(53, 7, 13, 1, 2, 'settings', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:49:38'),
(54, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:49:38'),
(55, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:08'),
(56, 7, 13, 1, 2, 'settings', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:29'),
(57, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:29'),
(58, 7, 13, 1, 2, 'settings', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:29'),
(59, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:29'),
(60, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:50:59'),
(61, 7, 13, 4, 2, 'total_amount', 0, '{}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 07:51:29'),
(90, 7, 15, 1, 1, 'business_user_position_table', 10, '{}', '{\"user_id\":15,\"business_id\":7}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 11:56:42'),
(91, NULL, 2, 1, 4, 'business_table', 6, '{\"business_id\":6}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-02 15:08:26'),
(92, 7, 13, 1, 3, 'business_employee_table', 15, '{\"user_id\":15,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"andrey\",\"first_name\":\"andrey\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":15,\"bus_pos_id\":\"5\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 16:07:20'),
(93, 7, 13, 2, 1, 'product_category_table', 8, '{}', '{\"name\":\"Processed\",\"description\":\"Can sold as raw\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:32:50'),
(94, 7, 13, 2, 1, 'product_category_table', 9, '{}', '{\"name\":\"Food\",\"description\":\"Cooked\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:14'),
(95, 7, 13, 2, 1, 'product_category_table', 10, '{}', '{\"name\":\"Ingredients\",\"description\":\"Raw cooking items\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:23'),
(96, 7, 13, 3, 1, 'products', 21, '{}', '{\"name\":\"Longganisa\",\"unit_id\":\"17\",\"price\":\"120\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696825/products/u98u5xpeugfxruoswvd1.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:46'),
(97, 7, 13, 3, 1, 'products', 22, '{}', '{\"name\":\"Hotdog\",\"unit_id\":\"17\",\"price\":\"20\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696867/products/ktjutyxtdjqkebzzrcds.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:34:27'),
(98, 7, 13, 3, 1, 'products', 23, '{}', '{\"name\":\"Onion\",\"unit_id\":\"13\",\"price\":\"7\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696915/products/sc2lbny5odimv2dlrrue.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:35:16'),
(99, 7, 13, 3, 1, 'products', 24, '{}', '{\"name\":\"Lemon\",\"unit_id\":\"13\",\"price\":\"12\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696947/products/p6palpor3lybdoaquefl.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:35:48'),
(100, 7, 13, 3, 1, 'products', 25, '{}', '{\"name\":\"Thyme Leaves\",\"unit_id\":\"1\",\"price\":\"30\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697130/products/lzvv12itfruxo9gfgm1d.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:38:51'),
(101, 7, 13, 3, 1, 'products', 26, '{}', '{\"name\":\"Black Pepper\",\"unit_id\":\"1\",\"price\":\"15\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697179/products/ifkcp7eqwrlbbbsgrcir.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:39:40'),
(102, 7, 13, 3, 1, 'products', 27, '{}', '{\"name\":\"Salt\",\"unit_id\":\"2\",\"price\":\"60\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697198/products/y7mao7khkxk9peid0ajr.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:39:58'),
(103, 7, 13, 3, 1, 'products', 28, '{}', '{\"name\":\"buttah\",\"unit_id\":\"1\",\"price\":\"70\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697242/products/ubkdpykwf1tyebgaxd3g.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:40:43'),
(104, 7, 13, 3, 1, 'products', 29, '{}', '{\"name\":\"Chicken.\",\"unit_id\":\"13\",\"price\":\"120\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697280/products/jur2kqx4lasmecs0d3oq.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:41:21'),
(105, 7, 13, 2, 1, 'product_category_table', 11, '{}', '{\"name\":\"Poultry\",\"description\":\"Egg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:42:08'),
(106, 7, 13, 3, 1, 'products', 30, '{}', '{\"name\":\"Roasted Chicken ...\",\"unit_id\":\"25\",\"price\":\"250\",\"product_type\":\"recipe\",\"category_id\":\"9\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697419/products/txjxthhckczv743oypto.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:43:40'),
(107, 7, 13, 3, 1, 'products', 31, '{}', '{\"name\":\"Roasted Chiken B1T1\",\"unit_id\":\"25\",\"price\":\"450\",\"product_type\":\"composite\",\"category_id\":\"9\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697470/products/aufmkryjkww5mp8kimnf.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:31'),
(108, 7, 13, 3, 3, 'products', 30, '{\"product_id\":30,\"business_id\":7,\"name\":\"Roasted Chicken ...\",\"product_type\":\"recipe\",\"category_id\":9,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697419/products/txjxthhckczv743oypto.jpg\",\"localpath\":\"uploads\\\\1764697417888-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:43:40.000Z\",\"quantity\":0,\"unit_id\":25,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:40'),
(109, 7, 13, 3, 3, 'products', 31, '{\"product_id\":31,\"business_id\":7,\"name\":\"Roasted Chiken B1T1\",\"product_type\":\"composite\",\"category_id\":9,\"price\":\"450.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697470/products/aufmkryjkww5mp8kimnf.jpg\",\"localpath\":\"uploads\\\\1764697469440-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:44:31.000Z\",\"quantity\":0,\"unit_id\":25,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:42'),
(110, 7, 13, 3, 3, 'products', 21, '{\"product_id\":21,\"business_id\":7,\"name\":\"Longganisa\",\"product_type\":\"simple\",\"category_id\":8,\"price\":\"120.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696825/products/u98u5xpeugfxruoswvd1.webp\",\"localpath\":\"uploads\\\\1764696823539-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:33:46.000Z\",\"quantity\":0,\"unit_id\":17,\"unit_multiplier\":5}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:45'),
(111, 7, 13, 3, 3, 'products', 22, '{\"product_id\":22,\"business_id\":7,\"name\":\"Hotdog\",\"product_type\":\"simple\",\"category_id\":8,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696867/products/ktjutyxtdjqkebzzrcds.webp\",\"localpath\":\"uploads\\\\1764696865532-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:34:27.000Z\",\"quantity\":0,\"unit_id\":17,\"unit_multiplier\":12}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:45'),
(112, 7, 13, 2, 1, 'inventory_table', 51, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":28,\"transaction_id\":51}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:45:04'),
(113, 7, 13, 2, 1, 'inventory_table', 52, '{}', '{\"items_count\":5,\"type\":\"stock_in\",\"stockin_id\":29,\"transaction_id\":52}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:05:27'),
(114, 7, 13, 2, 1, 'inventory_table', 53, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":30,\"transaction_id\":53}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:11:49'),
(115, 7, 13, 2, 1, 'inventory_table', 54, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":31,\"transaction_id\":54}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:12:37'),
(116, 7, 13, 2, 1, 'inventory_table', 55, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":32,\"transaction_id\":55}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:13:01'),
(117, 7, 13, 2, 1, 'inventory_table', 56, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[56]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:13:18'),
(118, 7, 13, 2, 1, 'inventory_table', 57, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[57]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:22:21'),
(119, 7, 13, 2, 1, 'inventory_table', 58, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[58]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:22:27'),
(120, 7, 13, 4, 1, 'purchases_table', 34, '{}', '{\"sale_id\":34,\"total_amount\":720,\"items_count\":1,\"receipt_no\":\"LOL -12031\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(121, 7, 13, 4, 1, 'purchase_items_table', 36, '{}', '{\"purchase_id\":34,\"product_id\":22,\"quantity\":\"36.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(122, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-36}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(123, 7, 13, 4, 3, 'transaction_table', 34, '{}', '{\"purchase_id\":34,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:45'),
(124, 7, 13, 4, 1, 'purchases_table', 35, '{}', '{\"sale_id\":35,\"total_amount\":700,\"items_count\":2,\"receipt_no\":\"LOL -12032\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(125, 7, 13, 4, 1, 'purchase_items_table', 37, '{}', '{\"purchase_id\":35,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(126, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(127, 7, 13, 4, 1, 'purchase_items_table', 38, '{}', '{\"purchase_id\":35,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(128, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(129, 7, 13, 4, 1, 'purchases_table', 36, '{}', '{\"sale_id\":36,\"total_amount\":450,\"items_count\":1,\"receipt_no\":\"LOL -12033\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55'),
(130, 7, 13, 4, 1, 'purchase_items_table', 39, '{}', '{\"purchase_id\":36,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55'),
(131, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55'),
(132, 7, 13, 4, 3, 'transaction_table', 35, '{}', '{\"purchase_id\":35,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:59:06'),
(133, 7, 13, 4, 3, 'transaction_table', 36, '{}', '{\"purchase_id\":36,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:59:08'),
(134, 7, 13, 4, 1, 'purchases_table', 37, '{}', '{\"sale_id\":37,\"total_amount\":500,\"items_count\":1,\"receipt_no\":\"LOL -12034\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(135, 7, 13, 4, 1, 'purchase_items_table', 40, '{}', '{\"purchase_id\":37,\"product_id\":30,\"quantity\":\"2.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(136, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(137, 7, 13, 4, 3, 'transaction_table', 37, '{}', '{\"purchase_id\":37,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:28'),
(138, 7, 13, 4, 1, 'purchases_table', 38, '{}', '{\"sale_id\":38,\"total_amount\":120,\"items_count\":1,\"receipt_no\":\"LOL -12035\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(139, 7, 13, 4, 1, 'purchase_items_table', 41, '{}', '{\"purchase_id\":38,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(140, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(141, 7, 13, 4, 3, 'transaction_table', 38, '{}', '{\"purchase_id\":38,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:10'),
(142, 7, 13, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgeds\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgends\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:03:08'),
(143, 7, 14, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgends\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:16:04'),
(144, 7, 13, 4, 1, 'purchases_table', 39, '{}', '{\"sale_id\":39,\"total_amount\":360,\"items_count\":1,\"receipt_no\":\"LOL -12036\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(145, 7, 13, 4, 1, 'purchase_items_table', 42, '{}', '{\"purchase_id\":39,\"product_id\":21,\"quantity\":\"3.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(146, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-3}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(147, 7, 13, 4, 5, 'transaction_table', 39, '{\"purchase_id\":39}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:32'),
(148, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":3}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:32'),
(149, 7, 13, 2, 1, 'inventory_table', 59, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":33,\"transaction_id\":59}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:49:00'),
(150, 7, 13, 4, 1, 'purchases_table', 40, '{}', '{\"sale_id\":40,\"total_amount\":2880,\"items_count\":1,\"receipt_no\":\"LOL -12037\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(151, 7, 13, 4, 1, 'purchase_items_table', 43, '{}', '{\"purchase_id\":40,\"product_id\":21,\"quantity\":\"24.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(152, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-24}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(153, 7, 13, 4, 3, 'transaction_table', 40, '{}', '{\"purchase_id\":40,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:53:01'),
(154, 7, 13, 2, 1, 'inventory_table', 60, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":34,\"transaction_id\":60}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:28:22'),
(155, 7, 13, 2, 1, 'inventory_table', 61, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":35,\"transaction_id\":61}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:28:25'),
(156, 7, 13, 2, 1, 'inventory_table', 62, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[62]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:31:23'),
(157, 7, 13, 2, 1, 'inventory_table', 68, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":36,\"transaction_id\":68}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:31:50'),
(158, 7, 13, 2, 1, 'inventory_table', 76, '{}', '{\"items_count\":6,\"type\":\"stock_in\",\"stockin_id\":37,\"transaction_id\":76}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:33:45'),
(159, 7, 13, 2, 1, 'inventory_table', 77, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[77]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:33:57'),
(160, 7, 13, 4, 1, 'purchases_table', 41, '{}', '{\"sale_id\":41,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -12038\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(161, 7, 13, 4, 1, 'purchase_items_table', 44, '{}', '{\"purchase_id\":41,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(162, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(163, 7, 13, 4, 1, 'purchase_items_table', 45, '{}', '{\"purchase_id\":41,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(164, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(165, 7, 13, 4, 1, 'purchase_items_table', 46, '{}', '{\"purchase_id\":41,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(166, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(167, 7, 13, 4, 1, 'purchase_items_table', 47, '{}', '{\"purchase_id\":41,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(168, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(169, 7, 13, 4, 5, 'transaction_table', 41, '{\"purchase_id\":41}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(170, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(171, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(172, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(173, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(174, 7, 13, 4, 1, 'purchases_table', 42, '{}', '{\"sale_id\":42,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -12039\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(175, 7, 13, 4, 1, 'purchase_items_table', 48, '{}', '{\"purchase_id\":42,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(176, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(177, 7, 13, 4, 1, 'purchase_items_table', 49, '{}', '{\"purchase_id\":42,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(178, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(179, 7, 13, 4, 1, 'purchase_items_table', 50, '{}', '{\"purchase_id\":42,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(180, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(181, 7, 13, 4, 1, 'purchase_items_table', 51, '{}', '{\"purchase_id\":42,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(182, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(183, 7, 13, 4, 5, 'transaction_table', 42, '{\"purchase_id\":42}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(184, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(185, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(186, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(187, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(188, 7, 13, 4, 1, 'purchases_table', 43, '{}', '{\"sale_id\":43,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120310\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(189, 7, 13, 4, 1, 'purchase_items_table', 52, '{}', '{\"purchase_id\":43,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(190, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(191, 7, 13, 4, 1, 'purchase_items_table', 53, '{}', '{\"purchase_id\":43,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(192, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(193, 7, 13, 4, 1, 'purchase_items_table', 54, '{}', '{\"purchase_id\":43,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(194, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(195, 7, 13, 4, 1, 'purchase_items_table', 55, '{}', '{\"purchase_id\":43,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(196, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(197, 7, 13, 4, 5, 'transaction_table', 43, '{\"purchase_id\":43}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(198, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(199, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(200, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(201, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(202, 7, 13, 4, 1, 'purchases_table', 44, '{}', '{\"sale_id\":44,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120311\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(203, 7, 13, 4, 1, 'purchase_items_table', 56, '{}', '{\"purchase_id\":44,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(204, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(205, 7, 13, 4, 1, 'purchase_items_table', 57, '{}', '{\"purchase_id\":44,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(206, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(207, 7, 13, 4, 1, 'purchase_items_table', 58, '{}', '{\"purchase_id\":44,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(208, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(209, 7, 13, 4, 1, 'purchase_items_table', 59, '{}', '{\"purchase_id\":44,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(210, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(211, 7, 13, 4, 5, 'transaction_table', 44, '{\"purchase_id\":44}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(212, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(213, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(214, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(215, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(216, 7, 13, 4, 1, 'purchases_table', 45, '{}', '{\"sale_id\":45,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120312\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(217, 7, 13, 4, 1, 'purchase_items_table', 60, '{}', '{\"purchase_id\":45,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(218, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(219, 7, 13, 4, 1, 'purchase_items_table', 61, '{}', '{\"purchase_id\":45,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(220, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(221, 7, 13, 4, 1, 'purchase_items_table', 62, '{}', '{\"purchase_id\":45,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(222, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(223, 7, 13, 4, 1, 'purchase_items_table', 63, '{}', '{\"purchase_id\":45,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(224, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(225, 7, 13, 4, 3, 'transaction_table', 45, '{}', '{\"purchase_id\":45,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:40'),
(226, 7, 13, 4, 1, 'purchases_table', 46, '{}', '{\"sale_id\":46,\"total_amount\":390,\"items_count\":3,\"receipt_no\":\"LOL -120313\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(227, 7, 13, 4, 1, 'purchase_items_table', 64, '{}', '{\"purchase_id\":46,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(228, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(229, 7, 13, 4, 1, 'purchase_items_table', 65, '{}', '{\"purchase_id\":46,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(230, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(231, 7, 13, 4, 1, 'purchase_items_table', 66, '{}', '{\"purchase_id\":46,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(232, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(233, 7, 13, 4, 1, 'purchases_table', 47, '{}', '{\"sale_id\":47,\"total_amount\":250,\"items_count\":1,\"receipt_no\":\"LOL -120314\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(234, 7, 13, 4, 1, 'purchase_items_table', 67, '{}', '{\"purchase_id\":47,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(235, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(236, 7, 13, 4, 1, 'purchases_table', 48, '{}', '{\"sale_id\":48,\"total_amount\":290,\"items_count\":2,\"receipt_no\":\"LOL -120315\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11');
INSERT INTO `audit_logs` (`log_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(237, 7, 13, 4, 1, 'purchase_items_table', 68, '{}', '{\"purchase_id\":48,\"product_id\":22,\"quantity\":\"2.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(238, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(239, 7, 13, 4, 1, 'purchase_items_table', 69, '{}', '{\"purchase_id\":48,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(240, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(241, 7, 13, 4, 1, 'purchases_table', 49, '{}', '{\"sale_id\":49,\"total_amount\":260,\"items_count\":2,\"receipt_no\":\"LOL -120316\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(242, 7, 13, 4, 1, 'purchase_items_table', 70, '{}', '{\"purchase_id\":49,\"product_id\":21,\"quantity\":\"2.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(243, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(244, 7, 13, 4, 1, 'purchase_items_table', 71, '{}', '{\"purchase_id\":49,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(245, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(246, 7, 13, 4, 1, 'purchases_table', 50, '{}', '{\"sale_id\":50,\"total_amount\":120,\"items_count\":1,\"receipt_no\":\"LOL -120317\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(247, 7, 13, 4, 1, 'purchase_items_table', 72, '{}', '{\"purchase_id\":50,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(248, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(249, 7, 13, 4, 1, 'purchases_table', 51, '{}', '{\"sale_id\":51,\"total_amount\":20,\"items_count\":1,\"receipt_no\":\"LOL -120318\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(250, 7, 13, 4, 1, 'purchase_items_table', 73, '{}', '{\"purchase_id\":51,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(251, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(252, 8, 16, 1, 1, 'business_table', 8, '{}', '{\"business_name\":\"MaybeIs\",\"business_cat_id\":\"4\",\"owner_id\":16}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 09:40:16'),
(253, 1, 1, 4, 1, 'purchases_table', 52, '{}', '{\"sale_id\":52,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-12031\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(254, 1, 1, 4, 1, 'purchase_items_table', 74, '{}', '{\"purchase_id\":52,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(255, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(256, 1, 18, 1, 1, 'business_user_position_table', 12, '{}', '{\"user_id\":18,\"business_id\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:50:31'),
(257, 1, 1, 1, 3, 'business_employee_table', 18, '{\"user_id\":18,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"testing2\",\"first_name\":\"test\",\"last_name\":\"tester\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":18,\"bus_pos_id\":\"3\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:51:57'),
(258, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:32:00'),
(259, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":60,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:56:43'),
(260, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":60,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:56:44'),
(261, 1, 19, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Cafe\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 15:33:58'),
(262, 3, 19, 1, 3, 'business_table', 3, '{\"business_id\":3,\"business_name\":\"Hanni Palm Oil\",\"business_cat_id\":12,\"name\":\"Butcher Shop\"}', '{\"business_id\":3,\"business_name\":\"Hanni Palm 5 Tiger strikes\",\"business_cat_id\":12,\"name\":\"Butcher Shop\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 15:34:16'),
(263, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Employee\"}', '{\"user_id\":4,\"bus_pos_id\":\"5\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:10:25'),
(264, 1, 4, 4, 1, 'purchases_table', 53, '{}', '{\"sale_id\":53,\"total_amount\":225,\"items_count\":3,\"receipt_no\":\"MINJ-12041\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(265, 1, 4, 4, 1, 'purchase_items_table', 75, '{}', '{\"purchase_id\":53,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(266, 1, 4, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(267, 1, 4, 4, 1, 'purchase_items_table', 76, '{}', '{\"purchase_id\":53,\"product_id\":7,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(268, 1, 4, 2, 3, 'inventory_table', 7, '{}', '{\"product_id\":7,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(269, 1, 4, 4, 1, 'purchase_items_table', 77, '{}', '{\"purchase_id\":53,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(270, 1, 4, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(271, 1, 4, 4, 3, 'transaction_table', 53, '{}', '{\"purchase_id\":53,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:23'),
(272, 1, 4, 4, 3, 'transaction_table', 52, '{}', '{\"purchase_id\":52,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:25'),
(273, 1, 4, 4, 1, 'purchases_table', 54, '{}', '{\"sale_id\":54,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-12043\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(274, 1, 4, 4, 1, 'purchase_items_table', 78, '{}', '{\"purchase_id\":54,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(275, 1, 4, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(276, 1, 4, 4, 3, 'transaction_table', 54, '{}', '{\"purchase_id\":54,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:57'),
(277, 1, 4, 4, 1, 'purchases_table', 55, '{}', '{\"sale_id\":55,\"total_amount\":210,\"items_count\":1,\"receipt_no\":\"MINJ-12044\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(278, 1, 4, 4, 1, 'purchase_items_table', 79, '{}', '{\"purchase_id\":55,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(279, 1, 4, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(280, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":5,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Cashier\"}', '{\"user_id\":4,\"bus_pos_id\":\"7\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:35:10'),
(281, 1, 4, 4, 5, 'transaction_table', 55, '{\"purchase_id\":55}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:38:52'),
(282, 1, 4, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:38:52'),
(283, 1, 4, 2, 1, 'inventory_table', 78, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":38,\"transaction_id\":78}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:48'),
(284, 1, 4, 2, 3, 'inventory_table', 79, '{}', '{\"items_count\":1,\"type\":\"stock_out\",\"reason\":\"waste\",\"transaction_ids\":[79]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:54'),
(285, 1, 4, 2, 3, 'inventory_table', 80, '{}', '{\"items_count\":1,\"type\":\"stock_out\",\"reason\":\"waste\",\"transaction_ids\":[80]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:57'),
(286, 1, 4, 2, 3, 'inventory_table', 81, '{}', '{\"items_count\":1,\"type\":\"correction\",\"transaction_ids\":[81]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:12'),
(287, 1, 4, 2, 3, 'inventory_table', 82, '{}', '{\"items_count\":1,\"type\":\"correction\",\"transaction_ids\":[82]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:14'),
(288, 1, 4, 2, 1, 'inventory_table', 85, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[85]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:28'),
(289, 1, 4, 2, 1, 'inventory_table', 86, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[86]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:35'),
(290, 7, 20, 1, 1, 'business_user_position_table', 13, '{}', '{\"user_id\":20,\"business_id\":7}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 04:44:31'),
(291, NULL, 20, 1, 1, 'business_table', 9, '{}', '{\"business_name\":\"Business\",\"business_cat_id\":\"10\",\"owner_id\":20}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 05:14:27'),
(292, 1, 21, 1, 1, 'business_user_position_table', 15, '{}', '{\"user_id\":21,\"business_id\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:06:12'),
(293, 7, 13, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":15,\"name\":\"Beverage Manufacturer\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:19:31'),
(294, 1, 1, 4, 1, 'purchases_table', 56, '{}', '{\"sale_id\":56,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-12045\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(295, 1, 1, 4, 1, 'purchase_items_table', 80, '{}', '{\"purchase_id\":56,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(296, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(297, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":7,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Operational_Support\"}', '{\"user_id\":4,\"bus_pos_id\":6}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:23'),
(298, 1, 1, 1, 3, 'business_employee_table', 21, '{\"user_id\":21,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"toffee\",\"first_name\":\"toffee\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":21,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:54'),
(299, 1, 1, 1, 3, 'business_employee_table', 1, '{\"user_id\":1,\"business_id\":1,\"bus_pos_id\":1,\"username\":\"testcase1\",\"first_name\":\"chrowmell\",\"last_name\":\"tipura\",\"contact_no\":\"09665263746\",\"position_name\":\"Owner\"}', '{\"user_id\":1,\"bus_pos_id\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:36:45'),
(300, 1, 21, 4, 1, 'purchases_table', 57, '{}', '{\"sale_id\":57,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-12046\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(301, 1, 21, 4, 1, 'purchase_items_table', 81, '{}', '{\"purchase_id\":57,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(302, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(303, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:05'),
(304, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:40'),
(305, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:41'),
(306, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:04:28'),
(307, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:04:42'),
(308, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:08'),
(309, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:09'),
(310, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:09'),
(311, 1, 1, 3, 3, 'products', 4, '{\"product_id\":4,\"business_id\":1,\"name\":\"Onion\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"5.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487480/products/zsegd5wiurryam7zjg2g.jpg\",\"localpath\":\"uploads\\\\1764487476164-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:24:38.000Z\",\"quantity\":40,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:11'),
(312, 1, 1, 3, 3, 'products', 5, '{\"product_id\":5,\"business_id\":1,\"name\":\"toyo\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487632/products/xditlegru20b6f8ea8pm.webp\",\"localpath\":\"uploads\\\\1764487628595-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:27:10.000Z\",\"quantity\":-60,\"unit_id\":5,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:12'),
(313, 1, 1, 3, 3, 'products', 6, '{\"product_id\":6,\"business_id\":1,\"name\":\"beef stik\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"210.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487721/products/ihnqzwibiqh0b31puokx.jpg\",\"localpath\":\"uploads\\\\1764487717524-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:28:39.000Z\",\"quantity\":10,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:12'),
(314, 1, 1, 3, 3, 'products', 7, '{\"product_id\":7,\"business_id\":1,\"name\":\"vinegar\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488554/products/hlaaagppphwgnp4bynea.webp\",\"localpath\":\"uploads\\\\1764488550113-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:42:32.000Z\",\"quantity\":49,\"unit_id\":5,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:14'),
(315, 1, 1, 3, 3, 'products', 8, '{\"product_id\":8,\"business_id\":1,\"name\":\"Adobo\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488708/products/afqr8hyp2yosg7vm5t25.jpg\",\"localpath\":\"uploads\\\\1764488703724-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:45:06.000Z\",\"quantity\":10,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:14'),
(316, 1, 1, 3, 3, 'products', 9, '{\"product_id\":9,\"business_id\":1,\"name\":\"Pork Meat\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"220.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489852/products/lz86xq1uybhv6ypahlsf.webp\",\"localpath\":\"uploads\\\\1764489847625-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:04:10.000Z\",\"quantity\":4,\"unit_id\":2,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:15'),
(317, 1, 1, 3, 3, 'products', 10, '{\"product_id\":10,\"business_id\":1,\"name\":\"Sinigang\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489975/products/kyekfez4lxguyfawy7it.webp\",\"localpath\":\"uploads\\\\1764489971658-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:06:14.000Z\",\"quantity\":11,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:16'),
(318, 1, 1, 3, 3, 'products', 11, '{\"product_id\":11,\"business_id\":1,\"name\":\"egg\",\"product_type\":\"simple\",\"category_id\":2,\"price\":\"5.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490405/products/dtfpulhom95segosmdp6.jpg\",\"localpath\":\"uploads\\\\1764490400693-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:13:23.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:17'),
(319, 1, 1, 3, 3, 'products', 12, '{\"product_id\":12,\"business_id\":1,\"name\":\"pancit malabon\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490472/products/wjekoi2xtdbabfhszwny.jpg\",\"localpath\":\"uploads\\\\1764490468597-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:14:30.000Z\",\"quantity\":1,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:17'),
(320, 1, 1, 3, 3, 'products', 13, '{\"product_id\":13,\"business_id\":1,\"name\":\"pepper\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"30.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492492/products/yfkenfprgnbp0keejkxa.jpg\",\"localpath\":\"uploads\\\\1764492487429-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:48:10.000Z\",\"quantity\":92,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:18'),
(321, 1, 1, 3, 3, 'products', 14, '{\"product_id\":14,\"business_id\":1,\"name\":\"Kaldereta\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492533/products/xtufwxeotw4p17ropdum.jpg\",\"localpath\":\"uploads\\\\1764492529270-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:48:51.000Z\",\"quantity\":4,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:18'),
(322, 1, 1, 3, 3, 'products', 15, '{\"product_id\":15,\"business_id\":1,\"name\":\"beef\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764495504/products/uaib3ojtptcmvx7bamti.jpg\",\"localpath\":\"uploads\\\\1764495502713-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T09:38:25.000Z\",\"quantity\":100,\"unit_id\":2,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:19'),
(323, 1, 1, 3, 3, 'products', 18, '{\"product_id\":18,\"business_id\":1,\"name\":\"black pepper\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"30.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764516625/products/zrebrw6zqr84lk7qjrb0.jpg\",\"localpath\":\"uploads\\\\1764516622386-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T15:30:25.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:20'),
(324, 1, 1, 3, 3, 'products', 19, '{\"product_id\":19,\"business_id\":1,\"name\":\"hysi\",\"product_type\":\"simple\",\"category_id\":3,\"price\":\"89.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764525168/products/s7y9mex8kvl4xjxtyxin.jpg\",\"localpath\":\"uploads\\\\1764525165232-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T17:52:48.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:21'),
(325, 1, 1, 4, 1, 'purchases_table', 58, '{}', '{\"sale_id\":58,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-12047\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(326, 1, 1, 4, 1, 'purchase_items_table', 82, '{}', '{\"purchase_id\":58,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(327, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(328, 1, 21, 4, 3, 'transaction_table', 58, '{}', '{\"purchase_id\":58,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:03'),
(329, 1, 21, 4, 5, 'transaction_table', 57, '{\"purchase_id\":57}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:06'),
(330, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:06'),
(331, 1, 21, 4, 1, 'purchases_table', 59, '{}', '{\"sale_id\":59,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-12048\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(332, 1, 21, 4, 1, 'purchase_items_table', 83, '{}', '{\"purchase_id\":59,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(333, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(334, 1, 21, 4, 1, 'purchase_items_table', 84, '{}', '{\"purchase_id\":59,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(335, 1, 21, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(336, 1, 1, 4, 1, 'purchases_table', 60, '{}', '{\"sale_id\":60,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-12049\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(337, 1, 1, 4, 1, 'purchase_items_table', 85, '{}', '{\"purchase_id\":60,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(338, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(339, 1, 1, 4, 3, 'transaction_table', 60, '{}', '{\"purchase_id\":60,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:21:00'),
(340, 1, 1, 4, 3, 'transaction_table', 56, '{}', '{\"purchase_id\":56,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:32:15'),
(341, 1, 21, 4, 1, 'purchases_table', 61, '{}', '{\"sale_id\":61,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-120410\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(342, 1, 21, 4, 1, 'purchase_items_table', 86, '{}', '{\"purchase_id\":61,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(343, 1, 21, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(344, 1, 21, 4, 1, 'purchases_table', 62, '{}', '{\"sale_id\":62,\"total_amount\":210,\"items_count\":1,\"receipt_no\":\"MINJ-120411\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(345, 1, 21, 4, 1, 'purchase_items_table', 87, '{}', '{\"purchase_id\":62,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(346, 1, 21, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(347, 1, 21, 4, 3, 'transaction_table', 62, '{}', '{\"purchase_id\":62,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:59'),
(348, 1, 1, 2, 1, 'inventory_table', 87, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":39,\"transaction_id\":87}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:01:22'),
(349, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:16:08'),
(350, 7, 13, 1, 3, 'business_employee_table', 15, '{\"user_id\":15,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"andrey\",\"first_name\":\"andrey\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":15,\"bus_pos_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:17:18'),
(351, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:01'),
(352, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:33'),
(353, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:46'),
(354, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:59'),
(355, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:22:29'),
(356, 10, 22, 1, 1, 'business_table', 10, '{}', '{\"business_name\":\"Kahitano\",\"business_cat_id\":\"6\",\"owner_id\":22}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:26:26'),
(357, 11, 23, 1, 1, 'business_table', 11, '{}', '{\"business_name\":\"lastna\",\"business_cat_id\":\"16\",\"owner_id\":23}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:33:13'),
(358, 12, 24, 1, 1, 'business_table', 12, '{}', '{\"business_name\":\"testete\",\"business_cat_id\":\"3\",\"owner_id\":24}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:36:53'),
(359, 13, 25, 1, 1, 'business_table', 13, '{}', '{\"business_name\":\"gjgjjgg\",\"business_cat_id\":\"2\",\"owner_id\":25}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:39:41'),
(360, 14, 26, 1, 1, 'business_table', 14, '{}', '{\"business_name\":\"testing\",\"business_cat_id\":\"11\",\"owner_id\":26}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:46:53'),
(361, 15, 27, 1, 1, 'business_table', 15, '{}', '{\"business_name\":\"try\",\"business_cat_id\":\"13\",\"owner_id\":27}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:49:38'),
(362, 16, 28, 1, 1, 'business_table', 16, '{}', '{\"business_name\":\"gkdjkgfd\",\"business_cat_id\":\"10\",\"owner_id\":28}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:52:19'),
(363, 1, 1, 2, 1, 'product_category_table', 12, '{}', '{\"name\":\"Ready meal\",\"description\":\"dwdw\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:56:52'),
(367, 20, 29, 1, 1, 'business_table', 20, '{}', '{\"business_name\":\"Restu Bowl\",\"business_cat_id\":\"2\",\"owner_id\":29}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-19 21:46:34'),
(368, 20, 29, 5, 1, 'access_codes_table', 9, '{}', '{\"code\":\"2526-4BGR3\",\"year_created\":2026,\"year\":\"2025-2026\",\"section\":\"4B\",\"group\":\"GR3\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-19 21:46:34'),
(369, 7, 13, 4, 1, 'purchases_table', 63, '{}', '{\"sale_id\":63,\"total_amount\":12,\"items_count\":1,\"receipt_no\":\"LOL -01201\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(370, 7, 13, 4, 1, 'purchase_items_table', 88, '{}', '{\"purchase_id\":63,\"product_id\":24,\"quantity\":\"1.00\",\"price\":\"12.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(371, 7, 13, 2, 3, 'inventory_table', 24, '{}', '{\"product_id\":24,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(372, 7, 13, 4, 3, 'transaction_table', 63, '{}', '{\"purchase_id\":63,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:54'),
(373, 1, 1, 4, 1, 'purchases_table', 1061, '{}', '{\"sale_id\":1061,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01201\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(374, 1, 1, 4, 1, 'purchase_items_table', 89, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(375, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(376, 1, 1, 4, 1, 'purchase_items_table', 90, '{}', '{\"purchase_id\":1061,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(377, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(378, 1, 1, 4, 1, 'purchases_table', 1062, '{}', '{\"sale_id\":1062,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01202\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(379, 1, 1, 4, 1, 'purchase_items_table', 91, '{}', '{\"purchase_id\":1062,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(380, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(381, 1, 1, 4, 1, 'purchase_items_table', 92, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(382, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(383, 1, 1, 4, 1, 'purchases_table', 1063, '{}', '{\"sale_id\":1063,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01203\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(384, 1, 1, 4, 1, 'purchase_items_table', 93, '{}', '{\"purchase_id\":1063,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(385, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(386, 1, 1, 4, 1, 'purchase_items_table', 94, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(387, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(388, 1, 1, 4, 1, 'purchases_table', 1064, '{}', '{\"sale_id\":1064,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01204\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(389, 1, 1, 4, 1, 'purchase_items_table', 95, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(390, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(391, 1, 1, 4, 1, 'purchase_items_table', 96, '{}', '{\"purchase_id\":1064,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39');
INSERT INTO `audit_logs` (`log_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(392, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(393, 1, 1, 4, 1, 'purchases_table', 1065, '{}', '{\"sale_id\":1065,\"total_amount\":230,\"items_count\":2,\"receipt_no\":\"MINJ-01205\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(394, 1, 1, 4, 1, 'purchase_items_table', 97, '{}', '{\"purchase_id\":1065,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(395, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(396, 1, 1, 4, 1, 'purchase_items_table', 98, '{}', '{\"purchase_id\":1065,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(397, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(398, 1, 1, 4, 1, 'purchases_table', 1066, '{}', '{\"sale_id\":1066,\"total_amount\":470,\"items_count\":2,\"receipt_no\":\"MINJ-01206\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(399, 1, 1, 4, 1, 'purchase_items_table', 99, '{}', '{\"purchase_id\":1066,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(400, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(401, 1, 1, 4, 1, 'purchase_items_table', 100, '{}', '{\"purchase_id\":1066,\"product_id\":10,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(402, 1, 1, 2, 3, 'inventory_table', 10, '{}', '{\"product_id\":10,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(403, 1, 1, 4, 3, 'transaction_table', 59, '{}', '{\"purchase_id\":59,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:06'),
(404, 1, 1, 4, 3, 'transaction_table', 1061, '{}', '{\"purchase_id\":1061,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:10'),
(405, 1, 1, 4, 3, 'transaction_table', 1062, '{}', '{\"purchase_id\":1062,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:12'),
(406, 1, 1, 4, 3, 'transaction_table', 1063, '{}', '{\"purchase_id\":1063,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:15'),
(407, 1, 1, 4, 3, 'transaction_table', 1064, '{}', '{\"purchase_id\":1064,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:17'),
(408, 1, 1, 4, 3, 'transaction_table', 1065, '{}', '{\"purchase_id\":1065,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:19'),
(409, 1, 1, 4, 3, 'transaction_table', 1066, '{}', '{\"purchase_id\":1066,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:21'),
(410, 1, 1, 4, 1, 'purchases_table', 1061, '{}', '{\"sale_id\":1061,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01208\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(411, 1, 1, 4, 1, 'purchase_items_table', 89, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(412, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(413, 1, 1, 4, 1, 'purchase_items_table', 90, '{}', '{\"purchase_id\":1061,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(414, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(415, 1, 1, 4, 1, 'purchase_items_table', 101, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(416, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(417, 1, 1, 4, 3, 'transaction_table', 59, '{}', '{\"purchase_id\":59,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:51'),
(418, 1, 1, 4, 3, 'transaction_table', 1061, '{}', '{\"purchase_id\":1061,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:55'),
(419, 1, 1, 4, 1, 'purchases_table', 1062, '{}', '{\"sale_id\":1062,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01209\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(420, 1, 1, 4, 1, 'purchase_items_table', 91, '{}', '{\"purchase_id\":1062,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(421, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(422, 1, 1, 4, 1, 'purchase_items_table', 92, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(423, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(424, 1, 1, 4, 1, 'purchase_items_table', 102, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(425, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(426, 1, 1, 4, 3, 'transaction_table', 1062, '{}', '{\"purchase_id\":1062,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:31'),
(427, 1, 1, 4, 1, 'purchases_table', 1063, '{}', '{\"sale_id\":1063,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-012010\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(428, 1, 1, 4, 1, 'purchase_items_table', 93, '{}', '{\"purchase_id\":1063,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(429, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(430, 1, 1, 4, 1, 'purchase_items_table', 94, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(431, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(432, 1, 1, 4, 1, 'purchase_items_table', 103, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(433, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(434, 1, 1, 4, 3, 'transaction_table', 1063, '{}', '{\"purchase_id\":1063,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:54'),
(435, 1, 1, 4, 1, 'purchases_table', 1064, '{}', '{\"sale_id\":1064,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-012011\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(436, 1, 1, 4, 1, 'purchase_items_table', 95, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(437, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(438, 1, 1, 4, 1, 'purchase_items_table', 96, '{}', '{\"purchase_id\":1064,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(439, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(440, 1, 1, 4, 1, 'purchase_items_table', 104, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(441, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(442, 1, 1, 4, 3, 'transaction_table', 1064, '{}', '{\"purchase_id\":1064,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:11'),
(443, 1, 1, 4, 1, 'purchases_table', 1065, '{}', '{\"sale_id\":1065,\"total_amount\":220,\"items_count\":1,\"receipt_no\":\"MINJ-012012\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(444, 1, 1, 4, 1, 'purchase_items_table', 97, '{}', '{\"purchase_id\":1065,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(445, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(446, 1, 1, 4, 1, 'purchase_items_table', 98, '{}', '{\"purchase_id\":1065,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(447, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(448, 1, 1, 4, 1, 'purchase_items_table', 105, '{}', '{\"purchase_id\":1065,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(449, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(450, 1, 1, 4, 1, 'purchases_table', 1066, '{}', '{\"sale_id\":1066,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-012013\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(451, 1, 1, 4, 1, 'purchase_items_table', 99, '{}', '{\"purchase_id\":1066,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(452, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(453, 1, 1, 4, 1, 'purchase_items_table', 100, '{}', '{\"purchase_id\":1066,\"product_id\":10,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(454, 1, 1, 2, 3, 'inventory_table', 10, '{}', '{\"product_id\":10,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(455, 1, 1, 4, 1, 'purchase_items_table', 106, '{}', '{\"purchase_id\":1066,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(456, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(457, 1, 1, 4, 3, 'transaction_table', 1066, '{}', '{\"purchase_id\":1066,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:31:11'),
(458, 1, 1, 4, 3, 'transaction_table', 1065, '{}', '{\"purchase_id\":1065,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:31:15'),
(459, 1, 1, 4, 1, 'purchases_table', 1081, '{}', '{\"sale_id\":1081,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-01111\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(460, 1, 1, 4, 1, 'purchase_items_table', 107, '{}', '{\"purchase_id\":1081,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(461, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(462, 1, 1, 4, 3, 'transaction_table', 1081, '{}', '{\"purchase_id\":1081,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:52'),
(463, 1, 1, 4, 1, 'purchases_table', 1082, '{}', '{\"sale_id\":1082,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01112\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(464, 1, 1, 4, 1, 'purchase_items_table', 108, '{}', '{\"purchase_id\":1082,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(465, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(466, 1, 1, 4, 3, 'transaction_table', 1082, '{}', '{\"purchase_id\":1082,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:50'),
(467, 1, 1, 4, 1, 'purchases_table', 1083, '{}', '{\"sale_id\":1083,\"total_amount\":20,\"items_count\":1,\"receipt_no\":\"MINJ-01113\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(468, 1, 1, 4, 1, 'purchase_items_table', 109, '{}', '{\"purchase_id\":1083,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(469, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(470, 1, 1, 4, 3, 'transaction_table', 1083, '{}', '{\"purchase_id\":1083,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:03'),
(471, 1, 1, 4, 1, 'purchases_table', 1084, '{}', '{\"sale_id\":1084,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01114\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(472, 1, 1, 4, 1, 'purchase_items_table', 110, '{}', '{\"purchase_id\":1084,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(473, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(474, 1, 1, 4, 3, 'transaction_table', 1084, '{}', '{\"purchase_id\":1084,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:31'),
(475, 1, 1, 4, 1, 'purchases_table', 1085, '{}', '{\"sale_id\":1085,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01111\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(476, 1, 1, 4, 1, 'purchase_items_table', 111, '{}', '{\"purchase_id\":1085,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(477, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(478, 1, 1, 4, 1, 'purchases_table', 1086, '{}', '{\"sale_id\":1086,\"total_amount\":220,\"items_count\":2,\"receipt_no\":\"MINJ-01112\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(479, 1, 1, 4, 1, 'purchase_items_table', 112, '{}', '{\"purchase_id\":1086,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(480, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(481, 1, 1, 4, 1, 'purchase_items_table', 113, '{}', '{\"purchase_id\":1086,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(482, 1, 1, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(483, 1, 1, 4, 3, 'transaction_table', 1085, '{}', '{\"purchase_id\":1085,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:46'),
(484, 1, 1, 4, 3, 'transaction_table', 1086, '{}', '{\"purchase_id\":1086,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:49'),
(485, 1, 1, 4, 1, 'purchases_table', 1087, '{}', '{\"sale_id\":1087,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01131\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(486, 1, 1, 4, 1, 'purchase_items_table', 114, '{}', '{\"purchase_id\":1087,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(487, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(488, 1, 1, 4, 1, 'purchase_items_table', 115, '{}', '{\"purchase_id\":1087,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(489, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(490, 1, 1, 4, 1, 'purchases_table', 1088, '{}', '{\"sale_id\":1088,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01132\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(491, 1, 1, 4, 1, 'purchase_items_table', 116, '{}', '{\"purchase_id\":1088,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(492, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(493, 1, 1, 4, 1, 'purchases_table', 1089, '{}', '{\"sale_id\":1089,\"total_amount\":140,\"items_count\":1,\"receipt_no\":\"MINJ-01133\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(494, 1, 1, 4, 1, 'purchase_items_table', 117, '{}', '{\"purchase_id\":1089,\"product_id\":1,\"quantity\":\"4.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(495, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-4}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(496, 1, 1, 4, 3, 'transaction_table', 1087, '{}', '{\"purchase_id\":1087,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:30'),
(497, 1, 1, 4, 3, 'transaction_table', 1089, '{}', '{\"purchase_id\":1089,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:32'),
(498, 1, 1, 4, 3, 'transaction_table', 1088, '{}', '{\"purchase_id\":1088,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:34'),
(499, 1, 1, 4, 1, 'purchases_table', 1090, '{}', '{\"sale_id\":1090,\"total_amount\":235,\"items_count\":3,\"receipt_no\":\"MINJ-01131\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(500, 1, 1, 4, 1, 'purchase_items_table', 118, '{}', '{\"purchase_id\":1090,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(501, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(502, 1, 1, 4, 1, 'purchase_items_table', 119, '{}', '{\"purchase_id\":1090,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(503, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(504, 1, 1, 4, 1, 'purchase_items_table', 120, '{}', '{\"purchase_id\":1090,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(505, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(506, 1, 1, 4, 1, 'purchases_table', 1091, '{}', '{\"sale_id\":1091,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01132\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(507, 1, 1, 4, 1, 'purchase_items_table', 121, '{}', '{\"purchase_id\":1091,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(508, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(509, 1, 1, 4, 3, 'transaction_table', 1090, '{}', '{\"purchase_id\":1090,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:08:03'),
(510, 1, 1, 4, 3, 'transaction_table', 1091, '{}', '{\"purchase_id\":1091,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:08:27'),
(511, 1, 1, 4, 1, 'purchases_table', 1092, '{}', '{\"sale_id\":1092,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01151\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(512, 1, 1, 4, 1, 'purchase_items_table', 122, '{}', '{\"purchase_id\":1092,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(513, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(514, 1, 1, 4, 1, 'purchase_items_table', 123, '{}', '{\"purchase_id\":1092,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(515, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(516, 1, 1, 4, 1, 'purchases_table', 1093, '{}', '{\"sale_id\":1093,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01152\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(517, 1, 1, 4, 1, 'purchase_items_table', 124, '{}', '{\"purchase_id\":1093,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(518, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(519, 1, 1, 4, 1, 'purchase_items_table', 125, '{}', '{\"purchase_id\":1093,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(520, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(521, 1, 1, 4, 3, 'transaction_table', 1092, '{}', '{\"purchase_id\":1092,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:10:04'),
(522, 1, 1, 4, 3, 'transaction_table', 1093, '{}', '{\"purchase_id\":1093,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:10:06'),
(523, 1, 1, 4, 1, 'purchases_table', 1094, '{}', '{\"sale_id\":1094,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01161\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(524, 1, 1, 4, 1, 'purchase_items_table', 126, '{}', '{\"purchase_id\":1094,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(525, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(526, 1, 1, 4, 1, 'purchases_table', 1095, '{}', '{\"sale_id\":1095,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01162\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(527, 1, 1, 4, 1, 'purchase_items_table', 127, '{}', '{\"purchase_id\":1095,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(528, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(529, 1, 1, 4, 3, 'transaction_table', 1094, '{}', '{\"purchase_id\":1094,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:37'),
(530, 1, 1, 4, 3, 'transaction_table', 1095, '{}', '{\"purchase_id\":1095,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:39'),
(531, 1, 1, 4, 1, 'purchases_table', 1096, '{}', '{\"sale_id\":1096,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01163\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(532, 1, 1, 4, 1, 'purchase_items_table', 128, '{}', '{\"purchase_id\":1096,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(533, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(534, 1, 1, 4, 1, 'purchases_table', 1097, '{}', '{\"sale_id\":1097,\"total_amount\":350,\"items_count\":1,\"receipt_no\":\"MINJ-01164\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(535, 1, 1, 4, 1, 'purchase_items_table', 129, '{}', '{\"purchase_id\":1097,\"product_id\":1,\"quantity\":\"10.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(536, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-10}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(537, 1, 1, 4, 3, 'transaction_table', 1096, '{}', '{\"purchase_id\":1096,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:11'),
(538, 1, 1, 4, 3, 'transaction_table', 1097, '{}', '{\"purchase_id\":1097,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:13'),
(539, 1, 1, 4, 1, 'purchases_table', 1098, '{}', '{\"sale_id\":1098,\"total_amount\":105,\"items_count\":1,\"receipt_no\":\"MINJ-01171\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(540, 1, 1, 4, 1, 'purchase_items_table', 130, '{}', '{\"purchase_id\":1098,\"product_id\":1,\"quantity\":\"3.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(541, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(542, 1, 1, 4, 1, 'purchases_table', 1099, '{}', '{\"sale_id\":1099,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01172\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(543, 1, 1, 4, 1, 'purchase_items_table', 131, '{}', '{\"purchase_id\":1099,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(544, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(545, 1, 1, 4, 1, 'purchases_table', 1100, '{}', '{\"sale_id\":1100,\"total_amount\":30,\"items_count\":1,\"receipt_no\":\"MINJ-01173\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(546, 1, 1, 4, 1, 'purchase_items_table', 132, '{}', '{\"purchase_id\":1100,\"product_id\":4,\"quantity\":\"6.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(547, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-6}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(548, 1, 1, 4, 3, 'transaction_table', 1098, '{}', '{\"purchase_id\":1098,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:45'),
(549, 1, 1, 4, 3, 'transaction_table', 1100, '{}', '{\"purchase_id\":1100,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:47'),
(550, 1, 1, 4, 3, 'transaction_table', 1099, '{}', '{\"purchase_id\":1099,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:49'),
(551, 1, 1, 4, 1, 'purchases_table', 1101, '{}', '{\"sale_id\":1101,\"total_amount\":105,\"items_count\":1,\"receipt_no\":\"MINJ-01171\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(552, 1, 1, 4, 1, 'purchase_items_table', 133, '{}', '{\"purchase_id\":1101,\"product_id\":1,\"quantity\":\"3.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(553, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(554, 1, 1, 4, 1, 'purchases_table', 1102, '{}', '{\"sale_id\":1102,\"total_amount\":15,\"items_count\":1,\"receipt_no\":\"MINJ-01172\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(555, 1, 1, 4, 1, 'purchase_items_table', 134, '{}', '{\"purchase_id\":1102,\"product_id\":4,\"quantity\":\"3.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(556, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(557, 1, 1, 4, 1, 'purchases_table', 1103, '{}', '{\"sale_id\":1103,\"total_amount\":60,\"items_count\":1,\"receipt_no\":\"MINJ-01173\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(558, 1, 1, 4, 1, 'purchase_items_table', 135, '{}', '{\"purchase_id\":1103,\"product_id\":5,\"quantity\":\"3.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(559, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(560, 1, 1, 4, 3, 'transaction_table', 1101, '{}', '{\"purchase_id\":1101,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:22'),
(561, 1, 1, 4, 3, 'transaction_table', 1102, '{}', '{\"purchase_id\":1102,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:47'),
(562, 1, 1, 4, 3, 'transaction_table', 1103, '{}', '{\"purchase_id\":1103,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:49'),
(563, 1, 1, 4, 1, 'purchases_table', 1104, '{}', '{\"sale_id\":1104,\"total_amount\":155,\"items_count\":2,\"receipt_no\":\"MINJ-01191\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(564, 1, 1, 4, 1, 'purchase_items_table', 136, '{}', '{\"purchase_id\":1104,\"product_id\":1,\"quantity\":\"4.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(565, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-4}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(566, 1, 1, 4, 1, 'purchase_items_table', 137, '{}', '{\"purchase_id\":1104,\"product_id\":4,\"quantity\":\"3.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(567, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(568, 1, 1, 4, 3, 'transaction_table', 1104, '{}', '{\"purchase_id\":1104,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:53'),
(569, 1, 1, 4, 1, 'purchases_table', 1105, '{}', '{\"sale_id\":1105,\"total_amount\":240,\"items_count\":3,\"receipt_no\":\"MINJ-02151\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(570, 1, 1, 4, 1, 'purchase_items_table', 198, '{}', '{\"purchase_id\":1105,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(571, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(572, 1, 1, 4, 1, 'purchase_items_table', 199, '{}', '{\"purchase_id\":1105,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(573, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(574, 1, 1, 4, 1, 'purchase_items_table', 200, '{}', '{\"purchase_id\":1105,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(575, 1, 1, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39');
INSERT INTO `audit_logs` (`log_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(576, 1, 1, 4, 3, 'transaction_table', 1105, '{}', '{\"purchase_id\":1105,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:53'),
(577, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:39'),
(578, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:41'),
(579, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:59'),
(580, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:02'),
(581, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:11'),
(582, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:20'),
(583, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:21'),
(584, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:21'),
(585, 1, 1, 4, 1, 'purchases_table', 1106, '{}', '{\"sale_id\":1106,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-03051\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(586, 1, 1, 4, 1, 'purchase_items_table', 201, '{}', '{\"purchase_id\":1106,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(587, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(588, 1, 1, 4, 3, 'transaction_table', 1106, '{}', '{\"purchase_id\":1106,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `business_category_table`
--

CREATE TABLE `business_category_table` (
  `business_cat_id` bigint(12) NOT NULL,
  `name` varchar(999) NOT NULL,
  `description` varchar(999) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_category_table`
--

INSERT INTO `business_category_table` (`business_cat_id`, `name`, `description`, `created_at`, `created_by`) VALUES
(2, 'Restaurant', 'Full-service dining establishments offering local or international cuisine', '2025-10-30 18:11:15', NULL),
(3, 'Café & Coffee Shop', 'Casual spots serving coffee, tea, pastries, and light meals', '2025-10-30 18:11:15', NULL),
(4, 'Bakery', 'Businesses specializing in bread, cakes, pastries, and baked goods', '2025-10-30 18:11:15', NULL),
(5, 'Street Food Vendor', 'Mobile or roadside vendors offering quick, affordable meals', '2025-10-30 18:11:15', NULL),
(6, 'Food Truck', 'Mobile kitchens serving gourmet or fast food in urban areas', '2025-10-30 18:11:15', NULL),
(7, 'Catering Services', 'Event-based food preparation and delivery for parties, weddings, etc.', '2025-10-30 18:11:15', NULL),
(8, 'Fast Food Chain', 'Quick-service restaurants with standardized menus and global reach', '2025-10-30 18:11:15', NULL),
(9, 'Ethnic Cuisine Specialist', 'Restaurants focused on specific regional cuisines (e.g., Thai, Mexican)', '2025-10-30 18:11:15', NULL),
(10, 'Organic & Health Food Store', 'Retailers selling organic, vegan, or health-conscious food products', '2025-10-30 18:11:15', NULL),
(11, 'Seafood Market', 'Vendors specializing in fresh or cooked seafood', '2025-10-30 18:11:15', NULL),
(12, 'Butcher Shop', 'Sellers of fresh meat, poultry, and specialty cuts', '2025-10-30 18:11:15', NULL),
(13, 'Grocery & Supermarket', 'Large-scale food retailers offering packaged and fresh goods', '2025-10-30 18:11:15', NULL),
(14, 'Dessert & Ice Cream Shop', 'Businesses focused on sweets, frozen treats, and specialty desserts', '2025-10-30 18:11:15', NULL),
(15, 'Beverage Manufacturer', 'Producers of juices, sodas, alcoholic drinks, or bottled water', '2025-10-30 18:11:15', NULL),
(16, 'Food Import/Export Company', 'Businesses trading food products across borders', '2025-10-30 18:11:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business_logs`
--

CREATE TABLE `business_logs` (
  `business_logs_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `module_id` bigint(12) UNSIGNED NOT NULL,
  `action_id` bigint(12) UNSIGNED NOT NULL,
  `table_name` varchar(99) NOT NULL,
  `record_id` bigint(12) UNSIGNED NOT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`new_data`)),
  `ip_address` varchar(99) NOT NULL,
  `user_agent` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_logs`
--

INSERT INTO `business_logs` (`business_logs_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(2, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(3, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(4, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(5, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(6, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(7, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(8, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:51'),
(9, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:54'),
(10, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:54'),
(11, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:54'),
(12, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:23:54'),
(13, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:24:22'),
(14, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:24:22'),
(15, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:24:22'),
(16, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:24:22'),
(17, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:40'),
(18, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:40'),
(19, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:40'),
(20, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:40'),
(21, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:45'),
(22, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:45'),
(23, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:45'),
(24, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:26:45'),
(25, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:12'),
(26, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:12'),
(27, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:12'),
(28, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:12'),
(29, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:15'),
(30, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:15'),
(31, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:15'),
(32, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:15'),
(33, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:17'),
(34, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:17'),
(35, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:17'),
(36, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:17'),
(37, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:18'),
(38, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:18'),
(39, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:18'),
(40, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:18'),
(41, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:20'),
(42, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:20'),
(43, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:20'),
(44, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:20'),
(45, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:22'),
(46, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:22'),
(47, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:22'),
(48, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:22'),
(49, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:25'),
(50, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:25'),
(51, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:25'),
(52, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:25'),
(53, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:28'),
(54, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:28'),
(55, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:28'),
(56, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:28'),
(57, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:31'),
(58, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:31'),
(59, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:31'),
(60, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:31'),
(61, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:34'),
(62, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:34'),
(63, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:34'),
(64, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:34'),
(65, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:36'),
(66, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:36'),
(67, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:36'),
(68, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:29:36'),
(69, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:23'),
(70, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:23'),
(71, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:23'),
(72, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:23'),
(73, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:29'),
(74, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:29'),
(75, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:29'),
(76, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:29'),
(77, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:40'),
(78, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:40'),
(79, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:40'),
(80, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:40'),
(81, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:53'),
(82, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:53'),
(83, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:53'),
(84, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:30:53'),
(85, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:11'),
(86, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:11'),
(87, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:11'),
(88, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:11'),
(89, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:13'),
(90, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:13'),
(91, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:13'),
(92, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:13'),
(93, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:14'),
(94, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(95, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(96, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(97, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(98, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(99, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(100, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(101, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(102, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(103, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(104, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:15'),
(105, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(106, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(107, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(108, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(109, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(110, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:19'),
(111, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:32'),
(112, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:33'),
(113, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:33'),
(114, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:33'),
(115, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:33'),
(116, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:39'),
(117, 1, 1, 1, 2, 'business_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:39'),
(118, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:39'),
(119, 1, 1, 1, 2, 'business_setting_table', 1, '{}', '{}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:32:39'),
(120, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:34:14'),
(121, 1, 1, 3, 1, 'products', 19, '{}', '{\"name\":\"hysi\",\"unit_id\":\"1\",\"price\":\"89\",\"product_type\":\"simple\",\"category_id\":\"3\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764525168/products/s7y9mex8kvl4xjxtyxin.jpg\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:52:48'),
(122, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 17:57:23'),
(123, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:23:53'),
(124, 1, 1, 4, 1, 'purchases_table', 30, '{}', '{\"sale_id\":30,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-120116\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:46:38'),
(125, 1, 1, 4, 1, 'purchase_items_table', 32, '{}', '{\"purchase_id\":30,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:46:38'),
(126, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:46:38'),
(127, 1, 1, 4, 3, 'transaction_table', 30, '{}', '{\"purchase_id\":30,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:46:41'),
(128, 1, 1, 4, 1, 'purchases_table', 31, '{}', '{\"sale_id\":31,\"total_amount\":500,\"items_count\":1,\"receipt_no\":\"MINJ-120117\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:13'),
(129, 1, 1, 4, 1, 'purchase_items_table', 33, '{}', '{\"purchase_id\":31,\"product_id\":15,\"quantity\":\"2.00\",\"price\":\"250.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:13'),
(130, 1, 1, 2, 3, 'inventory_table', 15, '{}', '{\"product_id\":15,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:13'),
(131, 1, 1, 4, 3, 'transaction_table', 31, '{}', '{\"purchase_id\":31,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:17'),
(132, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:38'),
(133, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:47'),
(134, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:47:52'),
(135, 1, 1, 4, 1, 'purchases_table', 32, '{}', '{\"sale_id\":32,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-120118\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:49:37'),
(136, 1, 1, 4, 1, 'purchase_items_table', 34, '{}', '{\"purchase_id\":32,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:49:37'),
(137, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:49:37'),
(138, 1, 1, 4, 3, 'transaction_table', 32, '{}', '{\"purchase_id\":32,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 18:49:40'),
(139, 1, 1, 4, 1, 'purchases_table', 33, '{}', '{\"sale_id\":33,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-120119\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 19:28:55'),
(140, 1, 1, 4, 1, 'purchase_items_table', 35, '{}', '{\"purchase_id\":33,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 19:28:56'),
(141, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 19:28:56'),
(142, 1, 1, 4, 3, 'transaction_table', 33, '{}', '{\"purchase_id\":33,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 19:28:59'),
(143, 1, 1, 2, 3, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"correction\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 20:37:41'),
(144, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 20:46:14'),
(145, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutess\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 20:55:14'),
(146, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 21:30:31'),
(147, 1, 1, 1, 3, 'business_employee_table', 3, '{\"user_id\":3,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"testcase3\",\"first_name\":\"my\",\"last_name\":\"eee\",\"contact_no\":\"09887283847\",\"role_name\":\"Employee\"}', '{\"user_id\":3,\"bus_pos_id\":\"7\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 21:41:41'),
(148, 1, 4, 5, 2, 'access_codes_table', 0, '{}', '{\"code\":\"2526-4BGR1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 21:46:25'),
(149, 1, 4, 1, 1, 'business_user_position_table', 3, '{}', '{\"user_id\":4,\"business_id\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 21:46:25'),
(150, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:09:43'),
(151, 2, 5, 3, 1, 'products', 20, '{}', '{\"name\":\"Red bell Pepper\",\"unit_id\":\"1\",\"price\":\"30\",\"product_type\":\"simple\",\"category_id\":\"7\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764540753/products/kydtr1bubziy4mipp4tj.jpg\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:12:32'),
(152, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:30:26'),
(153, 1, 1, 2, 1, 'inventory_table', 0, '{}', '{\"items_count\":1,\"type\":\"stock_in\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-30 22:31:00'),
(154, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donut\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:48:54'),
(155, 7, 15, 5, 2, 'access_codes_table', 0, '{}', '{\"code\":\"2526-4AGR10\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 11:56:42'),
(156, 7, 15, 1, 1, 'business_user_position_table', 10, '{}', '{\"user_id\":15,\"business_id\":7}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 11:56:42'),
(157, 7, 13, 1, 3, 'business_employee_table', 15, '{\"user_id\":15,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"andrey\",\"first_name\":\"andrey\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":15,\"bus_pos_id\":\"5\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 16:07:20'),
(158, 7, 13, 2, 1, 'product_category_table', 8, '{}', '{\"name\":\"Processed\",\"description\":\"Can sold as raw\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:32:50'),
(159, 7, 13, 2, 1, 'product_category_table', 9, '{}', '{\"name\":\"Food\",\"description\":\"Cooked\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:14'),
(160, 7, 13, 2, 1, 'product_category_table', 10, '{}', '{\"name\":\"Ingredients\",\"description\":\"Raw cooking items\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:23'),
(161, 7, 13, 3, 1, 'products', 21, '{}', '{\"name\":\"Longganisa\",\"unit_id\":\"17\",\"price\":\"120\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696825/products/u98u5xpeugfxruoswvd1.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:33:46'),
(162, 7, 13, 3, 1, 'products', 22, '{}', '{\"name\":\"Hotdog\",\"unit_id\":\"17\",\"price\":\"20\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696867/products/ktjutyxtdjqkebzzrcds.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:34:27'),
(163, 7, 13, 3, 1, 'products', 23, '{}', '{\"name\":\"Onion\",\"unit_id\":\"13\",\"price\":\"7\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696915/products/sc2lbny5odimv2dlrrue.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:35:16'),
(164, 7, 13, 3, 1, 'products', 24, '{}', '{\"name\":\"Lemon\",\"unit_id\":\"13\",\"price\":\"12\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696947/products/p6palpor3lybdoaquefl.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:35:48'),
(165, 7, 13, 3, 1, 'products', 25, '{}', '{\"name\":\"Thyme Leaves\",\"unit_id\":\"1\",\"price\":\"30\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697130/products/lzvv12itfruxo9gfgm1d.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:38:51'),
(166, 7, 13, 3, 1, 'products', 26, '{}', '{\"name\":\"Black Pepper\",\"unit_id\":\"1\",\"price\":\"15\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697179/products/ifkcp7eqwrlbbbsgrcir.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:39:40'),
(167, 7, 13, 3, 1, 'products', 27, '{}', '{\"name\":\"Salt\",\"unit_id\":\"2\",\"price\":\"60\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697198/products/y7mao7khkxk9peid0ajr.webp\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:39:58'),
(168, 7, 13, 3, 1, 'products', 28, '{}', '{\"name\":\"buttah\",\"unit_id\":\"1\",\"price\":\"70\",\"product_type\":\"simple\",\"category_id\":\"8\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697242/products/ubkdpykwf1tyebgaxd3g.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:40:43'),
(169, 7, 13, 3, 1, 'products', 29, '{}', '{\"name\":\"Chicken.\",\"unit_id\":\"13\",\"price\":\"120\",\"product_type\":\"simple\",\"category_id\":\"10\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697280/products/jur2kqx4lasmecs0d3oq.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:41:21'),
(170, 7, 13, 2, 1, 'product_category_table', 11, '{}', '{\"name\":\"Poultry\",\"description\":\"Egg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:42:08'),
(171, 7, 13, 3, 1, 'products', 30, '{}', '{\"name\":\"Roasted Chicken ...\",\"unit_id\":\"25\",\"price\":\"250\",\"product_type\":\"recipe\",\"category_id\":\"9\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697419/products/txjxthhckczv743oypto.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:43:40'),
(172, 7, 13, 3, 1, 'products', 31, '{}', '{\"name\":\"Roasted Chiken B1T1\",\"unit_id\":\"25\",\"price\":\"450\",\"product_type\":\"composite\",\"category_id\":\"9\",\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697470/products/aufmkryjkww5mp8kimnf.jpg\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:31'),
(173, 7, 13, 3, 3, 'products', 30, '{\"product_id\":30,\"business_id\":7,\"name\":\"Roasted Chicken ...\",\"product_type\":\"recipe\",\"category_id\":9,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697419/products/txjxthhckczv743oypto.jpg\",\"localpath\":\"uploads\\\\1764697417888-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:43:40.000Z\",\"quantity\":0,\"unit_id\":25,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:40'),
(174, 7, 13, 3, 3, 'products', 31, '{\"product_id\":31,\"business_id\":7,\"name\":\"Roasted Chiken B1T1\",\"product_type\":\"composite\",\"category_id\":9,\"price\":\"450.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697470/products/aufmkryjkww5mp8kimnf.jpg\",\"localpath\":\"uploads\\\\1764697469440-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:44:31.000Z\",\"quantity\":0,\"unit_id\":25,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:42'),
(175, 7, 13, 3, 3, 'products', 21, '{\"product_id\":21,\"business_id\":7,\"name\":\"Longganisa\",\"product_type\":\"simple\",\"category_id\":8,\"price\":\"120.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696825/products/u98u5xpeugfxruoswvd1.webp\",\"localpath\":\"uploads\\\\1764696823539-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:33:46.000Z\",\"quantity\":0,\"unit_id\":17,\"unit_multiplier\":5}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:45'),
(176, 7, 13, 3, 3, 'products', 22, '{\"product_id\":22,\"business_id\":7,\"name\":\"Hotdog\",\"product_type\":\"simple\",\"category_id\":8,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696867/products/ktjutyxtdjqkebzzrcds.webp\",\"localpath\":\"uploads\\\\1764696865532-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-12-02T17:34:27.000Z\",\"quantity\":0,\"unit_id\":17,\"unit_multiplier\":12}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:44:45'),
(177, 7, 13, 2, 1, 'inventory_table', 51, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":28,\"transaction_id\":51}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 17:45:04'),
(178, 7, 13, 2, 1, 'inventory_table', 52, '{}', '{\"items_count\":5,\"type\":\"stock_in\",\"stockin_id\":29,\"transaction_id\":52}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:05:27'),
(179, 7, 13, 2, 1, 'inventory_table', 53, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":30,\"transaction_id\":53}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:11:49'),
(180, 7, 13, 2, 1, 'inventory_table', 54, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":31,\"transaction_id\":54}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:12:37'),
(181, 7, 13, 2, 1, 'inventory_table', 55, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":32,\"transaction_id\":55}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:13:01'),
(182, 7, 13, 2, 1, 'inventory_table', 56, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[56]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:13:18'),
(183, 7, 13, 2, 1, 'inventory_table', 57, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[57]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:22:21'),
(184, 7, 13, 2, 1, 'inventory_table', 58, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[58]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:22:27'),
(185, 7, 13, 4, 1, 'purchases_table', 34, '{}', '{\"sale_id\":34,\"total_amount\":720,\"items_count\":1,\"receipt_no\":\"LOL -12031\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(186, 7, 13, 4, 1, 'purchase_items_table', 36, '{}', '{\"purchase_id\":34,\"product_id\":22,\"quantity\":\"36.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(187, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-36}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:40'),
(188, 7, 13, 4, 3, 'transaction_table', 34, '{}', '{\"purchase_id\":34,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:45'),
(189, 7, 13, 4, 1, 'purchases_table', 35, '{}', '{\"sale_id\":35,\"total_amount\":700,\"items_count\":2,\"receipt_no\":\"LOL -12032\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(190, 7, 13, 4, 1, 'purchase_items_table', 37, '{}', '{\"purchase_id\":35,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(191, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(192, 7, 13, 4, 1, 'purchase_items_table', 38, '{}', '{\"purchase_id\":35,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(193, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:52'),
(194, 7, 13, 4, 1, 'purchases_table', 36, '{}', '{\"sale_id\":36,\"total_amount\":450,\"items_count\":1,\"receipt_no\":\"LOL -12033\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55'),
(195, 7, 13, 4, 1, 'purchase_items_table', 39, '{}', '{\"purchase_id\":36,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55');
INSERT INTO `business_logs` (`business_logs_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(196, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:58:55'),
(197, 7, 13, 4, 3, 'transaction_table', 35, '{}', '{\"purchase_id\":35,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:59:06'),
(198, 7, 13, 4, 3, 'transaction_table', 36, '{}', '{\"purchase_id\":36,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 18:59:08'),
(199, 7, 13, 4, 1, 'purchases_table', 37, '{}', '{\"sale_id\":37,\"total_amount\":500,\"items_count\":1,\"receipt_no\":\"LOL -12034\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(200, 7, 13, 4, 1, 'purchase_items_table', 40, '{}', '{\"purchase_id\":37,\"product_id\":30,\"quantity\":\"2.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(201, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:24'),
(202, 7, 13, 4, 3, 'transaction_table', 37, '{}', '{\"purchase_id\":37,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 19:37:28'),
(203, 7, 13, 4, 1, 'purchases_table', 38, '{}', '{\"sale_id\":38,\"total_amount\":120,\"items_count\":1,\"receipt_no\":\"LOL -12035\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(204, 7, 13, 4, 1, 'purchase_items_table', 41, '{}', '{\"purchase_id\":38,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(205, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:05'),
(206, 7, 13, 4, 3, 'transaction_table', 38, '{}', '{\"purchase_id\":38,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:00:10'),
(207, 7, 13, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgeds\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgends\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:03:08'),
(208, 7, 14, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgends\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":1,\"name\":\"illegal\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 20:16:04'),
(209, 7, 13, 4, 1, 'purchases_table', 39, '{}', '{\"sale_id\":39,\"total_amount\":360,\"items_count\":1,\"receipt_no\":\"LOL -12036\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(210, 7, 13, 4, 1, 'purchase_items_table', 42, '{}', '{\"purchase_id\":39,\"product_id\":21,\"quantity\":\"3.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(211, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-3}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:30'),
(212, 7, 13, 4, 5, 'transaction_table', 39, '{\"purchase_id\":39}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:32'),
(213, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":3}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:38:32'),
(214, 7, 13, 2, 1, 'inventory_table', 59, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":33,\"transaction_id\":59}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:49:00'),
(215, 7, 13, 4, 1, 'purchases_table', 40, '{}', '{\"sale_id\":40,\"total_amount\":2880,\"items_count\":1,\"receipt_no\":\"LOL -12037\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(216, 7, 13, 4, 1, 'purchase_items_table', 43, '{}', '{\"purchase_id\":40,\"product_id\":21,\"quantity\":\"24.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(217, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-24}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:52:57'),
(218, 7, 13, 4, 3, 'transaction_table', 40, '{}', '{\"purchase_id\":40,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 22:53:01'),
(219, 7, 13, 2, 1, 'inventory_table', 60, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":34,\"transaction_id\":60}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:28:22'),
(220, 7, 13, 2, 1, 'inventory_table', 61, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":35,\"transaction_id\":61}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:28:25'),
(221, 7, 13, 2, 1, 'inventory_table', 62, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[62]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:31:23'),
(222, 7, 13, 2, 1, 'inventory_table', 68, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":36,\"transaction_id\":68}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:31:50'),
(223, 7, 13, 2, 1, 'inventory_table', 76, '{}', '{\"items_count\":6,\"type\":\"stock_in\",\"stockin_id\":37,\"transaction_id\":76}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:33:45'),
(224, 7, 13, 2, 1, 'inventory_table', 77, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[77]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:33:57'),
(225, 7, 13, 4, 1, 'purchases_table', 41, '{}', '{\"sale_id\":41,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -12038\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(226, 7, 13, 4, 1, 'purchase_items_table', 44, '{}', '{\"purchase_id\":41,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(227, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(228, 7, 13, 4, 1, 'purchase_items_table', 45, '{}', '{\"purchase_id\":41,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(229, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(230, 7, 13, 4, 1, 'purchase_items_table', 46, '{}', '{\"purchase_id\":41,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(231, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(232, 7, 13, 4, 1, 'purchase_items_table', 47, '{}', '{\"purchase_id\":41,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(233, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:10'),
(234, 7, 13, 4, 5, 'transaction_table', 41, '{\"purchase_id\":41}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(235, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(236, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(237, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(238, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:34:26'),
(239, 7, 13, 4, 1, 'purchases_table', 42, '{}', '{\"sale_id\":42,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -12039\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(240, 7, 13, 4, 1, 'purchase_items_table', 48, '{}', '{\"purchase_id\":42,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(241, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(242, 7, 13, 4, 1, 'purchase_items_table', 49, '{}', '{\"purchase_id\":42,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(243, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(244, 7, 13, 4, 1, 'purchase_items_table', 50, '{}', '{\"purchase_id\":42,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(245, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(246, 7, 13, 4, 1, 'purchase_items_table', 51, '{}', '{\"purchase_id\":42,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(247, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:08'),
(248, 7, 13, 4, 5, 'transaction_table', 42, '{\"purchase_id\":42}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(249, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(250, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(251, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(252, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:35:13'),
(253, 7, 13, 4, 1, 'purchases_table', 43, '{}', '{\"sale_id\":43,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120310\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(254, 7, 13, 4, 1, 'purchase_items_table', 52, '{}', '{\"purchase_id\":43,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(255, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(256, 7, 13, 4, 1, 'purchase_items_table', 53, '{}', '{\"purchase_id\":43,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(257, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(258, 7, 13, 4, 1, 'purchase_items_table', 54, '{}', '{\"purchase_id\":43,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(259, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(260, 7, 13, 4, 1, 'purchase_items_table', 55, '{}', '{\"purchase_id\":43,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(261, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:52'),
(262, 7, 13, 4, 5, 'transaction_table', 43, '{\"purchase_id\":43}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(263, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(264, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(265, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(266, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:37:59'),
(267, 7, 13, 4, 1, 'purchases_table', 44, '{}', '{\"sale_id\":44,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120311\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(268, 7, 13, 4, 1, 'purchase_items_table', 56, '{}', '{\"purchase_id\":44,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(269, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(270, 7, 13, 4, 1, 'purchase_items_table', 57, '{}', '{\"purchase_id\":44,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(271, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(272, 7, 13, 4, 1, 'purchase_items_table', 58, '{}', '{\"purchase_id\":44,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(273, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(274, 7, 13, 4, 1, 'purchase_items_table', 59, '{}', '{\"purchase_id\":44,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(275, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:39:40'),
(276, 7, 13, 4, 5, 'transaction_table', 44, '{\"purchase_id\":44}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(277, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(278, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(279, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(280, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:40:33'),
(281, 7, 13, 4, 1, 'purchases_table', 45, '{}', '{\"sale_id\":45,\"total_amount\":840,\"items_count\":4,\"receipt_no\":\"LOL -120312\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(282, 7, 13, 4, 1, 'purchase_items_table', 60, '{}', '{\"purchase_id\":45,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(283, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(284, 7, 13, 4, 1, 'purchase_items_table', 61, '{}', '{\"purchase_id\":45,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(285, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(286, 7, 13, 4, 1, 'purchase_items_table', 62, '{}', '{\"purchase_id\":45,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(287, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(288, 7, 13, 4, 1, 'purchase_items_table', 63, '{}', '{\"purchase_id\":45,\"product_id\":31,\"quantity\":\"1.00\",\"price\":\"450.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(289, 7, 13, 2, 3, 'inventory_table', 31, '{}', '{\"product_id\":31,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:35'),
(290, 7, 13, 4, 3, 'transaction_table', 45, '{}', '{\"purchase_id\":45,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:41:40'),
(291, 7, 13, 4, 1, 'purchases_table', 46, '{}', '{\"sale_id\":46,\"total_amount\":390,\"items_count\":3,\"receipt_no\":\"LOL -120313\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(292, 7, 13, 4, 1, 'purchase_items_table', 64, '{}', '{\"purchase_id\":46,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(293, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(294, 7, 13, 4, 1, 'purchase_items_table', 65, '{}', '{\"purchase_id\":46,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(295, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(296, 7, 13, 4, 1, 'purchase_items_table', 66, '{}', '{\"purchase_id\":46,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(297, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-02 23:45:01'),
(298, 7, 13, 4, 1, 'purchases_table', 47, '{}', '{\"sale_id\":47,\"total_amount\":250,\"items_count\":1,\"receipt_no\":\"LOL -120314\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(299, 7, 13, 4, 1, 'purchase_items_table', 67, '{}', '{\"purchase_id\":47,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(300, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:06'),
(301, 7, 13, 4, 1, 'purchases_table', 48, '{}', '{\"sale_id\":48,\"total_amount\":290,\"items_count\":2,\"receipt_no\":\"LOL -120315\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(302, 7, 13, 4, 1, 'purchase_items_table', 68, '{}', '{\"purchase_id\":48,\"product_id\":22,\"quantity\":\"2.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(303, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(304, 7, 13, 4, 1, 'purchase_items_table', 69, '{}', '{\"purchase_id\":48,\"product_id\":30,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(305, 7, 13, 2, 3, 'inventory_table', 30, '{}', '{\"product_id\":30,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:11'),
(306, 7, 13, 4, 1, 'purchases_table', 49, '{}', '{\"sale_id\":49,\"total_amount\":260,\"items_count\":2,\"receipt_no\":\"LOL -120316\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(307, 7, 13, 4, 1, 'purchase_items_table', 70, '{}', '{\"purchase_id\":49,\"product_id\":21,\"quantity\":\"2.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(308, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(309, 7, 13, 4, 1, 'purchase_items_table', 71, '{}', '{\"purchase_id\":49,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(310, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:14'),
(311, 7, 13, 4, 1, 'purchases_table', 50, '{}', '{\"sale_id\":50,\"total_amount\":120,\"items_count\":1,\"receipt_no\":\"LOL -120317\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(312, 7, 13, 4, 1, 'purchase_items_table', 72, '{}', '{\"purchase_id\":50,\"product_id\":21,\"quantity\":\"1.00\",\"price\":\"120.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(313, 7, 13, 2, 3, 'inventory_table', 21, '{}', '{\"product_id\":21,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:20'),
(314, 7, 13, 4, 1, 'purchases_table', 51, '{}', '{\"sale_id\":51,\"total_amount\":20,\"items_count\":1,\"receipt_no\":\"LOL -120318\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(315, 7, 13, 4, 1, 'purchase_items_table', 73, '{}', '{\"purchase_id\":51,\"product_id\":22,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(316, 7, 13, 2, 3, 'inventory_table', 22, '{}', '{\"product_id\":22,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 00:07:21'),
(317, 1, 1, 4, 1, 'purchases_table', 52, '{}', '{\"sale_id\":52,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-12031\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(318, 1, 1, 4, 1, 'purchase_items_table', 74, '{}', '{\"purchase_id\":52,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(319, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:38:18'),
(320, 1, 18, 5, 2, 'access_codes_table', 0, '{}', '{\"code\":\"2526-4BGR1\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:50:31'),
(321, 1, 18, 1, 1, 'business_user_position_table', 12, '{}', '{\"user_id\":18,\"business_id\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:50:31'),
(322, 1, 1, 1, 3, 'business_employee_table', 18, '{\"user_id\":18,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"testing2\",\"first_name\":\"test\",\"last_name\":\"tester\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":18,\"bus_pos_id\":\"3\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 11:51:57'),
(323, 1, 1, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:32:00'),
(324, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":60,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:56:43'),
(325, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":60,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 12:56:44'),
(326, 1, 19, 1, 3, 'business_table', 1, '{\"business_id\":1,\"business_name\":\"Minji\'s Donutes\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '{\"business_id\":1,\"business_name\":\"Minji\'s Cafe\",\"business_cat_id\":4,\"name\":\"Bakery\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 15:33:58'),
(327, 3, 19, 1, 3, 'business_table', 3, '{\"business_id\":3,\"business_name\":\"Hanni Palm Oil\",\"business_cat_id\":12,\"name\":\"Butcher Shop\"}', '{\"business_id\":3,\"business_name\":\"Hanni Palm 5 Tiger strikes\",\"business_cat_id\":12,\"name\":\"Butcher Shop\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 15:34:16'),
(328, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Employee\"}', '{\"user_id\":4,\"bus_pos_id\":\"5\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:10:25'),
(329, 1, 4, 4, 1, 'purchases_table', 53, '{}', '{\"sale_id\":53,\"total_amount\":225,\"items_count\":3,\"receipt_no\":\"MINJ-12041\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(330, 1, 4, 4, 1, 'purchase_items_table', 75, '{}', '{\"purchase_id\":53,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(331, 1, 4, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(332, 1, 4, 4, 1, 'purchase_items_table', 76, '{}', '{\"purchase_id\":53,\"product_id\":7,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(333, 1, 4, 2, 3, 'inventory_table', 7, '{}', '{\"product_id\":7,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(334, 1, 4, 4, 1, 'purchase_items_table', 77, '{}', '{\"purchase_id\":53,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(335, 1, 4, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:17'),
(336, 1, 4, 4, 3, 'transaction_table', 53, '{}', '{\"purchase_id\":53,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:23'),
(337, 1, 4, 4, 3, 'transaction_table', 52, '{}', '{\"purchase_id\":52,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:14:25'),
(338, 1, 4, 4, 1, 'purchases_table', 54, '{}', '{\"sale_id\":54,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-12043\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(339, 1, 4, 4, 1, 'purchase_items_table', 78, '{}', '{\"purchase_id\":54,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(340, 1, 4, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:13'),
(341, 1, 4, 4, 3, 'transaction_table', 54, '{}', '{\"purchase_id\":54,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:25:57'),
(342, 1, 4, 4, 1, 'purchases_table', 55, '{}', '{\"sale_id\":55,\"total_amount\":210,\"items_count\":1,\"receipt_no\":\"MINJ-12044\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(343, 1, 4, 4, 1, 'purchase_items_table', 79, '{}', '{\"purchase_id\":55,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(344, 1, 4, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:26:09'),
(345, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":5,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Cashier\"}', '{\"user_id\":4,\"bus_pos_id\":\"7\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:35:10'),
(346, 1, 4, 4, 5, 'transaction_table', 55, '{\"purchase_id\":55}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:38:52'),
(347, 1, 4, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:38:52'),
(348, 1, 4, 2, 1, 'inventory_table', 78, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":38,\"transaction_id\":78}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:48'),
(349, 1, 4, 2, 3, 'inventory_table', 79, '{}', '{\"items_count\":1,\"type\":\"stock_out\",\"reason\":\"waste\",\"transaction_ids\":[79]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:54'),
(350, 1, 4, 2, 3, 'inventory_table', 80, '{}', '{\"items_count\":1,\"type\":\"stock_out\",\"reason\":\"waste\",\"transaction_ids\":[80]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:58:57'),
(351, 1, 4, 2, 3, 'inventory_table', 81, '{}', '{\"items_count\":1,\"type\":\"correction\",\"transaction_ids\":[81]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:12'),
(352, 1, 4, 2, 3, 'inventory_table', 82, '{}', '{\"items_count\":1,\"type\":\"correction\",\"transaction_ids\":[82]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:14'),
(353, 1, 4, 2, 1, 'inventory_table', 85, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[85]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:28'),
(354, 1, 4, 2, 1, 'inventory_table', 86, '{}', '{\"items_count\":1,\"type\":\"production\",\"transaction_ids\":[86]}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-03 16:59:35'),
(355, 7, 20, 5, 2, 'access_codes_table', 0, '{}', '{\"code\":\"2526-4AGR10\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 04:44:31'),
(356, 7, 20, 1, 1, 'business_user_position_table', 13, '{}', '{\"user_id\":20,\"business_id\":7}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 04:44:31'),
(357, 1, 21, 5, 2, 'access_codes_table', 0, '{}', '{\"code\":\"2526-4BGR1\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:06:12'),
(358, 1, 21, 1, 1, 'business_user_position_table', 15, '{}', '{\"user_id\":21,\"business_id\":1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:06:12'),
(359, 7, 13, 1, 3, 'business_table', 7, '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":1,\"name\":\"illegal\"}', '{\"business_id\":7,\"business_name\":\"LoL of LEgendss\",\"business_cat_id\":15,\"name\":\"Beverage Manufacturer\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:19:31'),
(360, 1, 1, 4, 1, 'purchases_table', 56, '{}', '{\"sale_id\":56,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-12045\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(361, 1, 1, 4, 1, 'purchase_items_table', 80, '{}', '{\"purchase_id\":56,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(362, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:01'),
(363, 1, 1, 1, 3, 'business_employee_table', 4, '{\"user_id\":4,\"business_id\":1,\"bus_pos_id\":7,\"username\":\"testcase4\",\"first_name\":\"test\",\"last_name\":\"4\",\"contact_no\":\"09662738471\",\"position_name\":\"Operational_Support\"}', '{\"user_id\":4,\"bus_pos_id\":6}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:23'),
(364, 1, 1, 1, 3, 'business_employee_table', 21, '{\"user_id\":21,\"business_id\":1,\"bus_pos_id\":9,\"username\":\"toffee\",\"first_name\":\"toffee\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":21,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:34:54'),
(365, 1, 1, 1, 3, 'business_employee_table', 1, '{\"user_id\":1,\"business_id\":1,\"bus_pos_id\":1,\"username\":\"testcase1\",\"first_name\":\"chrowmell\",\"last_name\":\"tipura\",\"contact_no\":\"09665263746\",\"position_name\":\"Owner\"}', '{\"user_id\":1,\"bus_pos_id\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 06:36:45'),
(366, 1, 21, 4, 1, 'purchases_table', 57, '{}', '{\"sale_id\":57,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-12046\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(367, 1, 21, 4, 1, 'purchase_items_table', 81, '{}', '{\"purchase_id\":57,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(368, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 06:56:42'),
(369, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:05'),
(370, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:40'),
(371, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:00:41'),
(372, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:04:28'),
(373, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:04:42'),
(374, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:08'),
(375, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:09'),
(376, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:09'),
(377, 1, 1, 3, 3, 'products', 4, '{\"product_id\":4,\"business_id\":1,\"name\":\"Onion\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"5.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487480/products/zsegd5wiurryam7zjg2g.jpg\",\"localpath\":\"uploads\\\\1764487476164-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:24:38.000Z\",\"quantity\":40,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:11'),
(378, 1, 1, 3, 3, 'products', 5, '{\"product_id\":5,\"business_id\":1,\"name\":\"toyo\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487632/products/xditlegru20b6f8ea8pm.webp\",\"localpath\":\"uploads\\\\1764487628595-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:27:10.000Z\",\"quantity\":-60,\"unit_id\":5,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:12');
INSERT INTO `business_logs` (`business_logs_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(379, 1, 1, 3, 3, 'products', 6, '{\"product_id\":6,\"business_id\":1,\"name\":\"beef stik\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"210.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487721/products/ihnqzwibiqh0b31puokx.jpg\",\"localpath\":\"uploads\\\\1764487717524-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:28:39.000Z\",\"quantity\":10,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:12'),
(380, 1, 1, 3, 3, 'products', 7, '{\"product_id\":7,\"business_id\":1,\"name\":\"vinegar\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488554/products/hlaaagppphwgnp4bynea.webp\",\"localpath\":\"uploads\\\\1764488550113-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:42:32.000Z\",\"quantity\":49,\"unit_id\":5,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:14'),
(381, 1, 1, 3, 3, 'products', 8, '{\"product_id\":8,\"business_id\":1,\"name\":\"Adobo\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488708/products/afqr8hyp2yosg7vm5t25.jpg\",\"localpath\":\"uploads\\\\1764488703724-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:45:06.000Z\",\"quantity\":10,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:14'),
(382, 1, 1, 3, 3, 'products', 9, '{\"product_id\":9,\"business_id\":1,\"name\":\"Pork Meat\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"220.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489852/products/lz86xq1uybhv6ypahlsf.webp\",\"localpath\":\"uploads\\\\1764489847625-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:04:10.000Z\",\"quantity\":4,\"unit_id\":2,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:15'),
(383, 1, 1, 3, 3, 'products', 10, '{\"product_id\":10,\"business_id\":1,\"name\":\"Sinigang\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489975/products/kyekfez4lxguyfawy7it.webp\",\"localpath\":\"uploads\\\\1764489971658-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:06:14.000Z\",\"quantity\":11,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:16'),
(384, 1, 1, 3, 3, 'products', 11, '{\"product_id\":11,\"business_id\":1,\"name\":\"egg\",\"product_type\":\"simple\",\"category_id\":2,\"price\":\"5.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490405/products/dtfpulhom95segosmdp6.jpg\",\"localpath\":\"uploads\\\\1764490400693-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:13:23.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:17'),
(385, 1, 1, 3, 3, 'products', 12, '{\"product_id\":12,\"business_id\":1,\"name\":\"pancit malabon\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490472/products/wjekoi2xtdbabfhszwny.jpg\",\"localpath\":\"uploads\\\\1764490468597-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:14:30.000Z\",\"quantity\":1,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:17'),
(386, 1, 1, 3, 3, 'products', 13, '{\"product_id\":13,\"business_id\":1,\"name\":\"pepper\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"30.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492492/products/yfkenfprgnbp0keejkxa.jpg\",\"localpath\":\"uploads\\\\1764492487429-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:48:10.000Z\",\"quantity\":92,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:18'),
(387, 1, 1, 3, 3, 'products', 14, '{\"product_id\":14,\"business_id\":1,\"name\":\"Kaldereta\",\"product_type\":\"recipe\",\"category_id\":3,\"price\":\"200.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492533/products/xtufwxeotw4p17ropdum.jpg\",\"localpath\":\"uploads\\\\1764492529270-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T08:48:51.000Z\",\"quantity\":4,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:18'),
(388, 1, 1, 3, 3, 'products', 15, '{\"product_id\":15,\"business_id\":1,\"name\":\"beef\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"250.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764495504/products/uaib3ojtptcmvx7bamti.jpg\",\"localpath\":\"uploads\\\\1764495502713-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T09:38:25.000Z\",\"quantity\":100,\"unit_id\":2,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:19'),
(389, 1, 1, 3, 3, 'products', 18, '{\"product_id\":18,\"business_id\":1,\"name\":\"black pepper\",\"product_type\":\"simple\",\"category_id\":4,\"price\":\"30.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764516625/products/zrebrw6zqr84lk7qjrb0.jpg\",\"localpath\":\"uploads\\\\1764516622386-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T15:30:25.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:20'),
(390, 1, 1, 3, 3, 'products', 19, '{\"product_id\":19,\"business_id\":1,\"name\":\"hysi\",\"product_type\":\"simple\",\"category_id\":3,\"price\":\"89.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764525168/products/s7y9mex8kvl4xjxtyxin.jpg\",\"localpath\":\"uploads\\\\1764525165232-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T17:52:48.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:07:21'),
(391, 1, 1, 4, 1, 'purchases_table', 58, '{}', '{\"sale_id\":58,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-12047\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(392, 1, 1, 4, 1, 'purchase_items_table', 82, '{}', '{\"purchase_id\":58,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(393, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:08:49'),
(394, 1, 21, 4, 3, 'transaction_table', 58, '{}', '{\"purchase_id\":58,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:03'),
(395, 1, 21, 4, 5, 'transaction_table', 57, '{\"purchase_id\":57}', '{}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:06'),
(396, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":2}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:09:06'),
(397, 1, 21, 4, 1, 'purchases_table', 59, '{}', '{\"sale_id\":59,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-12048\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(398, 1, 21, 4, 1, 'purchase_items_table', 83, '{}', '{\"purchase_id\":59,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(399, 1, 21, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(400, 1, 21, 4, 1, 'purchase_items_table', 84, '{}', '{\"purchase_id\":59,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(401, 1, 21, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:16:40'),
(402, 1, 1, 4, 1, 'purchases_table', 60, '{}', '{\"sale_id\":60,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-12049\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(403, 1, 1, 4, 1, 'purchase_items_table', 85, '{}', '{\"purchase_id\":60,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(404, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:20:57'),
(405, 1, 1, 4, 3, 'transaction_table', 60, '{}', '{\"purchase_id\":60,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 07:21:00'),
(406, 1, 1, 4, 3, 'transaction_table', 56, '{}', '{\"purchase_id\":56,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 07:32:15'),
(407, 1, 21, 4, 1, 'purchases_table', 61, '{}', '{\"sale_id\":61,\"total_amount\":10,\"items_count\":1,\"receipt_no\":\"MINJ-120410\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(408, 1, 21, 4, 1, 'purchase_items_table', 86, '{}', '{\"purchase_id\":61,\"product_id\":4,\"quantity\":\"2.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(409, 1, 21, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:43'),
(410, 1, 21, 4, 1, 'purchases_table', 62, '{}', '{\"sale_id\":62,\"total_amount\":210,\"items_count\":1,\"receipt_no\":\"MINJ-120411\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(411, 1, 21, 4, 1, 'purchase_items_table', 87, '{}', '{\"purchase_id\":62,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(412, 1, 21, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:52'),
(413, 1, 21, 4, 3, 'transaction_table', 62, '{}', '{\"purchase_id\":62,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 09:57:59'),
(414, 1, 1, 2, 1, 'inventory_table', 87, '{}', '{\"items_count\":1,\"type\":\"stock_in\",\"stockin_id\":39,\"transaction_id\":87}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:01:22'),
(415, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:16:08'),
(416, 7, 13, 1, 3, 'business_employee_table', 15, '{\"user_id\":15,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"andrey\",\"first_name\":\"andrey\",\"last_name\":\"leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":15,\"bus_pos_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:17:18'),
(417, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:01'),
(418, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:33'),
(419, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:46'),
(420, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":9,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Employee\"}', '{\"user_id\":20,\"bus_pos_id\":5}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:18:59'),
(421, 7, 13, 1, 3, 'business_employee_table', 20, '{\"user_id\":20,\"business_id\":7,\"bus_pos_id\":5,\"username\":\"blackie\",\"first_name\":\"Blackie\",\"last_name\":\"Leonor\",\"contact_no\":\"09123456789\",\"position_name\":\"Cashier\"}', '{\"user_id\":20,\"bus_pos_id\":9}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-04 10:22:29'),
(422, 1, 1, 2, 1, 'product_category_table', 12, '{}', '{\"name\":\"Ready meal\",\"description\":\"dwdw\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', '2025-12-04 10:56:52'),
(423, 20, 29, 5, 1, 'access_codes_table', 9, '{}', '{\"code\":\"2526-4BGR3\",\"year_created\":2026,\"year\":\"2025-2026\",\"section\":\"4B\",\"group\":\"GR3\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-19 21:46:34'),
(424, 7, 13, 4, 1, 'purchases_table', 63, '{}', '{\"sale_id\":63,\"total_amount\":12,\"items_count\":1,\"receipt_no\":\"LOL -01201\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(425, 7, 13, 4, 1, 'purchase_items_table', 88, '{}', '{\"purchase_id\":63,\"product_id\":24,\"quantity\":\"1.00\",\"price\":\"12.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(426, 7, 13, 2, 3, 'inventory_table', 24, '{}', '{\"product_id\":24,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:45'),
(427, 7, 13, 4, 3, 'transaction_table', 63, '{}', '{\"purchase_id\":63,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-01-20 01:10:54'),
(428, 1, 1, 4, 1, 'purchases_table', 1061, '{}', '{\"sale_id\":1061,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01201\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(429, 1, 1, 4, 1, 'purchase_items_table', 89, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(430, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(431, 1, 1, 4, 1, 'purchase_items_table', 90, '{}', '{\"purchase_id\":1061,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(432, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:21'),
(433, 1, 1, 4, 1, 'purchases_table', 1062, '{}', '{\"sale_id\":1062,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01202\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(434, 1, 1, 4, 1, 'purchase_items_table', 91, '{}', '{\"purchase_id\":1062,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(435, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(436, 1, 1, 4, 1, 'purchase_items_table', 92, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(437, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:29'),
(438, 1, 1, 4, 1, 'purchases_table', 1063, '{}', '{\"sale_id\":1063,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01203\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(439, 1, 1, 4, 1, 'purchase_items_table', 93, '{}', '{\"purchase_id\":1063,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(440, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(441, 1, 1, 4, 1, 'purchase_items_table', 94, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(442, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:34'),
(443, 1, 1, 4, 1, 'purchases_table', 1064, '{}', '{\"sale_id\":1064,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01204\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(444, 1, 1, 4, 1, 'purchase_items_table', 95, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(445, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(446, 1, 1, 4, 1, 'purchase_items_table', 96, '{}', '{\"purchase_id\":1064,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(447, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:39'),
(448, 1, 1, 4, 1, 'purchases_table', 1065, '{}', '{\"sale_id\":1065,\"total_amount\":230,\"items_count\":2,\"receipt_no\":\"MINJ-01205\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(449, 1, 1, 4, 1, 'purchase_items_table', 97, '{}', '{\"purchase_id\":1065,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(450, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(451, 1, 1, 4, 1, 'purchase_items_table', 98, '{}', '{\"purchase_id\":1065,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(452, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:43'),
(453, 1, 1, 4, 1, 'purchases_table', 1066, '{}', '{\"sale_id\":1066,\"total_amount\":470,\"items_count\":2,\"receipt_no\":\"MINJ-01206\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(454, 1, 1, 4, 1, 'purchase_items_table', 99, '{}', '{\"purchase_id\":1066,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(455, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(456, 1, 1, 4, 1, 'purchase_items_table', 100, '{}', '{\"purchase_id\":1066,\"product_id\":10,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(457, 1, 1, 2, 3, 'inventory_table', 10, '{}', '{\"product_id\":10,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:02:48'),
(458, 1, 1, 4, 3, 'transaction_table', 59, '{}', '{\"purchase_id\":59,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:06'),
(459, 1, 1, 4, 3, 'transaction_table', 1061, '{}', '{\"purchase_id\":1061,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:10'),
(460, 1, 1, 4, 3, 'transaction_table', 1062, '{}', '{\"purchase_id\":1062,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:12'),
(461, 1, 1, 4, 3, 'transaction_table', 1063, '{}', '{\"purchase_id\":1063,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:15'),
(462, 1, 1, 4, 3, 'transaction_table', 1064, '{}', '{\"purchase_id\":1064,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:17'),
(463, 1, 1, 4, 3, 'transaction_table', 1065, '{}', '{\"purchase_id\":1065,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:19'),
(464, 1, 1, 4, 3, 'transaction_table', 1066, '{}', '{\"purchase_id\":1066,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 08:03:21'),
(465, 1, 1, 4, 1, 'purchases_table', 1061, '{}', '{\"sale_id\":1061,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01208\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(466, 1, 1, 4, 1, 'purchase_items_table', 89, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(467, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(468, 1, 1, 4, 1, 'purchase_items_table', 90, '{}', '{\"purchase_id\":1061,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(469, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(470, 1, 1, 4, 1, 'purchase_items_table', 101, '{}', '{\"purchase_id\":1061,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(471, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:46'),
(472, 1, 1, 4, 3, 'transaction_table', 59, '{}', '{\"purchase_id\":59,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:51'),
(473, 1, 1, 4, 3, 'transaction_table', 1061, '{}', '{\"purchase_id\":1061,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:28:55'),
(474, 1, 1, 4, 1, 'purchases_table', 1062, '{}', '{\"sale_id\":1062,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01209\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(475, 1, 1, 4, 1, 'purchase_items_table', 91, '{}', '{\"purchase_id\":1062,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(476, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(477, 1, 1, 4, 1, 'purchase_items_table', 92, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(478, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(479, 1, 1, 4, 1, 'purchase_items_table', 102, '{}', '{\"purchase_id\":1062,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(480, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:24'),
(481, 1, 1, 4, 3, 'transaction_table', 1062, '{}', '{\"purchase_id\":1062,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:31'),
(482, 1, 1, 4, 1, 'purchases_table', 1063, '{}', '{\"sale_id\":1063,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-012010\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(483, 1, 1, 4, 1, 'purchase_items_table', 93, '{}', '{\"purchase_id\":1063,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(484, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(485, 1, 1, 4, 1, 'purchase_items_table', 94, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(486, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(487, 1, 1, 4, 1, 'purchase_items_table', 103, '{}', '{\"purchase_id\":1063,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(488, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:37'),
(489, 1, 1, 4, 3, 'transaction_table', 1063, '{}', '{\"purchase_id\":1063,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:29:54'),
(490, 1, 1, 4, 1, 'purchases_table', 1064, '{}', '{\"sale_id\":1064,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-012011\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(491, 1, 1, 4, 1, 'purchase_items_table', 95, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(492, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(493, 1, 1, 4, 1, 'purchase_items_table', 96, '{}', '{\"purchase_id\":1064,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(494, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(495, 1, 1, 4, 1, 'purchase_items_table', 104, '{}', '{\"purchase_id\":1064,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(496, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:00'),
(497, 1, 1, 4, 3, 'transaction_table', 1064, '{}', '{\"purchase_id\":1064,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:11'),
(498, 1, 1, 4, 1, 'purchases_table', 1065, '{}', '{\"sale_id\":1065,\"total_amount\":220,\"items_count\":1,\"receipt_no\":\"MINJ-012012\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(499, 1, 1, 4, 1, 'purchase_items_table', 97, '{}', '{\"purchase_id\":1065,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(500, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(501, 1, 1, 4, 1, 'purchase_items_table', 98, '{}', '{\"purchase_id\":1065,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(502, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(503, 1, 1, 4, 1, 'purchase_items_table', 105, '{}', '{\"purchase_id\":1065,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(504, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:26'),
(505, 1, 1, 4, 1, 'purchases_table', 1066, '{}', '{\"sale_id\":1066,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-012013\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(506, 1, 1, 4, 1, 'purchase_items_table', 99, '{}', '{\"purchase_id\":1066,\"product_id\":9,\"quantity\":\"1.00\",\"price\":\"220.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(507, 1, 1, 2, 3, 'inventory_table', 9, '{}', '{\"product_id\":9,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(508, 1, 1, 4, 1, 'purchase_items_table', 100, '{}', '{\"purchase_id\":1066,\"product_id\":10,\"quantity\":\"1.00\",\"price\":\"250.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(509, 1, 1, 2, 3, 'inventory_table', 10, '{}', '{\"product_id\":10,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(510, 1, 1, 4, 1, 'purchase_items_table', 106, '{}', '{\"purchase_id\":1066,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(511, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:30:57'),
(512, 1, 1, 4, 3, 'transaction_table', 1066, '{}', '{\"purchase_id\":1066,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:31:11'),
(513, 1, 1, 4, 3, 'transaction_table', 1065, '{}', '{\"purchase_id\":1065,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-20 09:31:15'),
(514, 1, 1, 4, 1, 'purchases_table', 1081, '{}', '{\"sale_id\":1081,\"total_amount\":70,\"items_count\":1,\"receipt_no\":\"MINJ-01111\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(515, 1, 1, 4, 1, 'purchase_items_table', 107, '{}', '{\"purchase_id\":1081,\"product_id\":1,\"quantity\":\"2.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(516, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:46'),
(517, 1, 1, 4, 3, 'transaction_table', 1081, '{}', '{\"purchase_id\":1081,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 13:59:52'),
(518, 1, 1, 4, 1, 'purchases_table', 1082, '{}', '{\"sale_id\":1082,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01112\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(519, 1, 1, 4, 1, 'purchase_items_table', 108, '{}', '{\"purchase_id\":1082,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(520, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:45'),
(521, 1, 1, 4, 3, 'transaction_table', 1082, '{}', '{\"purchase_id\":1082,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:50'),
(522, 1, 1, 4, 1, 'purchases_table', 1083, '{}', '{\"sale_id\":1083,\"total_amount\":20,\"items_count\":1,\"receipt_no\":\"MINJ-01113\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(523, 1, 1, 4, 1, 'purchase_items_table', 109, '{}', '{\"purchase_id\":1083,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(524, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:03:54'),
(525, 1, 1, 4, 3, 'transaction_table', 1083, '{}', '{\"purchase_id\":1083,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:03'),
(526, 1, 1, 4, 1, 'purchases_table', 1084, '{}', '{\"sale_id\":1084,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01114\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(527, 1, 1, 4, 1, 'purchase_items_table', 110, '{}', '{\"purchase_id\":1084,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(528, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:08'),
(529, 1, 1, 4, 3, 'transaction_table', 1084, '{}', '{\"purchase_id\":1084,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-11 14:04:31'),
(530, 1, 1, 4, 1, 'purchases_table', 1085, '{}', '{\"sale_id\":1085,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01111\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(531, 1, 1, 4, 1, 'purchase_items_table', 111, '{}', '{\"purchase_id\":1085,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(532, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:05:57'),
(533, 1, 1, 4, 1, 'purchases_table', 1086, '{}', '{\"sale_id\":1086,\"total_amount\":220,\"items_count\":2,\"receipt_no\":\"MINJ-01112\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(534, 1, 1, 4, 1, 'purchase_items_table', 112, '{}', '{\"purchase_id\":1086,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(535, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(536, 1, 1, 4, 1, 'purchase_items_table', 113, '{}', '{\"purchase_id\":1086,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(537, 1, 1, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:11'),
(538, 1, 1, 4, 3, 'transaction_table', 1085, '{}', '{\"purchase_id\":1085,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:46'),
(539, 1, 1, 4, 3, 'transaction_table', 1086, '{}', '{\"purchase_id\":1086,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-12 14:06:49'),
(540, 1, 1, 4, 1, 'purchases_table', 1087, '{}', '{\"sale_id\":1087,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01131\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(541, 1, 1, 4, 1, 'purchase_items_table', 114, '{}', '{\"purchase_id\":1087,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(542, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(543, 1, 1, 4, 1, 'purchase_items_table', 115, '{}', '{\"purchase_id\":1087,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16'),
(544, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:16');
INSERT INTO `business_logs` (`business_logs_id`, `business_id`, `user_id`, `module_id`, `action_id`, `table_name`, `record_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(545, 1, 1, 4, 1, 'purchases_table', 1088, '{}', '{\"sale_id\":1088,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01132\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(546, 1, 1, 4, 1, 'purchase_items_table', 116, '{}', '{\"purchase_id\":1088,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(547, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:18'),
(548, 1, 1, 4, 1, 'purchases_table', 1089, '{}', '{\"sale_id\":1089,\"total_amount\":140,\"items_count\":1,\"receipt_no\":\"MINJ-01133\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(549, 1, 1, 4, 1, 'purchase_items_table', 117, '{}', '{\"purchase_id\":1089,\"product_id\":1,\"quantity\":\"4.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(550, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-4}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:23'),
(551, 1, 1, 4, 3, 'transaction_table', 1087, '{}', '{\"purchase_id\":1087,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:30'),
(552, 1, 1, 4, 3, 'transaction_table', 1089, '{}', '{\"purchase_id\":1089,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:32'),
(553, 1, 1, 4, 3, 'transaction_table', 1088, '{}', '{\"purchase_id\":1088,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-13 14:07:34'),
(554, 1, 1, 4, 1, 'purchases_table', 1090, '{}', '{\"sale_id\":1090,\"total_amount\":235,\"items_count\":3,\"receipt_no\":\"MINJ-01131\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(555, 1, 1, 4, 1, 'purchase_items_table', 118, '{}', '{\"purchase_id\":1090,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(556, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(557, 1, 1, 4, 1, 'purchase_items_table', 119, '{}', '{\"purchase_id\":1090,\"product_id\":5,\"quantity\":\"1.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(558, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(559, 1, 1, 4, 1, 'purchase_items_table', 120, '{}', '{\"purchase_id\":1090,\"product_id\":6,\"quantity\":\"1.00\",\"price\":\"210.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(560, 1, 1, 2, 3, 'inventory_table', 6, '{}', '{\"product_id\":6,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:55'),
(561, 1, 1, 4, 1, 'purchases_table', 1091, '{}', '{\"sale_id\":1091,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01132\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(562, 1, 1, 4, 1, 'purchase_items_table', 121, '{}', '{\"purchase_id\":1091,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(563, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:07:58'),
(564, 1, 1, 4, 3, 'transaction_table', 1090, '{}', '{\"purchase_id\":1090,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:08:03'),
(565, 1, 1, 4, 3, 'transaction_table', 1091, '{}', '{\"purchase_id\":1091,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-14 14:08:27'),
(566, 1, 1, 4, 1, 'purchases_table', 1092, '{}', '{\"sale_id\":1092,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01151\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(567, 1, 1, 4, 1, 'purchase_items_table', 122, '{}', '{\"purchase_id\":1092,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(568, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(569, 1, 1, 4, 1, 'purchase_items_table', 123, '{}', '{\"purchase_id\":1092,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(570, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:48'),
(571, 1, 1, 4, 1, 'purchases_table', 1093, '{}', '{\"sale_id\":1093,\"total_amount\":40,\"items_count\":2,\"receipt_no\":\"MINJ-01152\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(572, 1, 1, 4, 1, 'purchase_items_table', 124, '{}', '{\"purchase_id\":1093,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(573, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(574, 1, 1, 4, 1, 'purchase_items_table', 125, '{}', '{\"purchase_id\":1093,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(575, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:09:51'),
(576, 1, 1, 4, 3, 'transaction_table', 1092, '{}', '{\"purchase_id\":1092,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:10:04'),
(577, 1, 1, 4, 3, 'transaction_table', 1093, '{}', '{\"purchase_id\":1093,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-15 14:10:06'),
(578, 1, 1, 4, 1, 'purchases_table', 1094, '{}', '{\"sale_id\":1094,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01161\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(579, 1, 1, 4, 1, 'purchase_items_table', 126, '{}', '{\"purchase_id\":1094,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(580, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:26'),
(581, 1, 1, 4, 1, 'purchases_table', 1095, '{}', '{\"sale_id\":1095,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01162\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(582, 1, 1, 4, 1, 'purchase_items_table', 127, '{}', '{\"purchase_id\":1095,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(583, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:27'),
(584, 1, 1, 4, 3, 'transaction_table', 1094, '{}', '{\"purchase_id\":1094,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:37'),
(585, 1, 1, 4, 3, 'transaction_table', 1095, '{}', '{\"purchase_id\":1095,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:10:39'),
(586, 1, 1, 4, 1, 'purchases_table', 1096, '{}', '{\"sale_id\":1096,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-01163\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(587, 1, 1, 4, 1, 'purchase_items_table', 128, '{}', '{\"purchase_id\":1096,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(588, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:03'),
(589, 1, 1, 4, 1, 'purchases_table', 1097, '{}', '{\"sale_id\":1097,\"total_amount\":350,\"items_count\":1,\"receipt_no\":\"MINJ-01164\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(590, 1, 1, 4, 1, 'purchase_items_table', 129, '{}', '{\"purchase_id\":1097,\"product_id\":1,\"quantity\":\"10.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(591, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-10}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:07'),
(592, 1, 1, 4, 3, 'transaction_table', 1096, '{}', '{\"purchase_id\":1096,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:11'),
(593, 1, 1, 4, 3, 'transaction_table', 1097, '{}', '{\"purchase_id\":1097,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-16 14:11:13'),
(594, 1, 1, 4, 1, 'purchases_table', 1098, '{}', '{\"sale_id\":1098,\"total_amount\":105,\"items_count\":1,\"receipt_no\":\"MINJ-01171\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(595, 1, 1, 4, 1, 'purchase_items_table', 130, '{}', '{\"purchase_id\":1098,\"product_id\":1,\"quantity\":\"3.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(596, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:37'),
(597, 1, 1, 4, 1, 'purchases_table', 1099, '{}', '{\"sale_id\":1099,\"total_amount\":5,\"items_count\":1,\"receipt_no\":\"MINJ-01172\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(598, 1, 1, 4, 1, 'purchase_items_table', 131, '{}', '{\"purchase_id\":1099,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(599, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:39'),
(600, 1, 1, 4, 1, 'purchases_table', 1100, '{}', '{\"sale_id\":1100,\"total_amount\":30,\"items_count\":1,\"receipt_no\":\"MINJ-01173\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(601, 1, 1, 4, 1, 'purchase_items_table', 132, '{}', '{\"purchase_id\":1100,\"product_id\":4,\"quantity\":\"6.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(602, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-6}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:41'),
(603, 1, 1, 4, 3, 'transaction_table', 1098, '{}', '{\"purchase_id\":1098,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:45'),
(604, 1, 1, 4, 3, 'transaction_table', 1100, '{}', '{\"purchase_id\":1100,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:47'),
(605, 1, 1, 4, 3, 'transaction_table', 1099, '{}', '{\"purchase_id\":1099,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-17 14:11:49'),
(606, 1, 1, 4, 1, 'purchases_table', 1101, '{}', '{\"sale_id\":1101,\"total_amount\":105,\"items_count\":1,\"receipt_no\":\"MINJ-01171\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(607, 1, 1, 4, 1, 'purchase_items_table', 133, '{}', '{\"purchase_id\":1101,\"product_id\":1,\"quantity\":\"3.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(608, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:10'),
(609, 1, 1, 4, 1, 'purchases_table', 1102, '{}', '{\"sale_id\":1102,\"total_amount\":15,\"items_count\":1,\"receipt_no\":\"MINJ-01172\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(610, 1, 1, 4, 1, 'purchase_items_table', 134, '{}', '{\"purchase_id\":1102,\"product_id\":4,\"quantity\":\"3.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(611, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:12'),
(612, 1, 1, 4, 1, 'purchases_table', 1103, '{}', '{\"sale_id\":1103,\"total_amount\":60,\"items_count\":1,\"receipt_no\":\"MINJ-01173\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(613, 1, 1, 4, 1, 'purchase_items_table', 135, '{}', '{\"purchase_id\":1103,\"product_id\":5,\"quantity\":\"3.00\",\"price\":\"20.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(614, 1, 1, 2, 3, 'inventory_table', 5, '{}', '{\"product_id\":5,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:15'),
(615, 1, 1, 4, 3, 'transaction_table', 1101, '{}', '{\"purchase_id\":1101,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:22'),
(616, 1, 1, 4, 3, 'transaction_table', 1102, '{}', '{\"purchase_id\":1102,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:47'),
(617, 1, 1, 4, 3, 'transaction_table', 1103, '{}', '{\"purchase_id\":1103,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-18 14:12:49'),
(618, 1, 1, 4, 1, 'purchases_table', 1104, '{}', '{\"sale_id\":1104,\"total_amount\":155,\"items_count\":2,\"receipt_no\":\"MINJ-01191\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(619, 1, 1, 4, 1, 'purchase_items_table', 136, '{}', '{\"purchase_id\":1104,\"product_id\":1,\"quantity\":\"4.00\",\"price\":\"35.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(620, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-4}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(621, 1, 1, 4, 1, 'purchase_items_table', 137, '{}', '{\"purchase_id\":1104,\"product_id\":4,\"quantity\":\"3.00\",\"price\":\"5.00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(622, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-3}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:38'),
(623, 1, 1, 4, 3, 'transaction_table', 1104, '{}', '{\"purchase_id\":1104,\"status\":\"finished\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-01-19 14:13:53'),
(624, 1, 1, 4, 1, 'purchases_table', 1105, '{}', '{\"sale_id\":1105,\"total_amount\":240,\"items_count\":3,\"receipt_no\":\"MINJ-02151\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(625, 1, 1, 4, 1, 'purchase_items_table', 198, '{}', '{\"purchase_id\":1105,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(626, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(627, 1, 1, 4, 1, 'purchase_items_table', 199, '{}', '{\"purchase_id\":1105,\"product_id\":4,\"quantity\":\"1.00\",\"price\":\"5.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(628, 1, 1, 2, 3, 'inventory_table', 4, '{}', '{\"product_id\":4,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(629, 1, 1, 4, 1, 'purchase_items_table', 200, '{}', '{\"purchase_id\":1105,\"product_id\":8,\"quantity\":\"1.00\",\"price\":\"200.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(630, 1, 1, 2, 3, 'inventory_table', 8, '{}', '{\"product_id\":8,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:39'),
(631, 1, 1, 4, 3, 'transaction_table', 1105, '{}', '{\"purchase_id\":1105,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '2026-02-15 14:19:53'),
(632, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:39'),
(633, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:41'),
(634, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:23:59'),
(635, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:02'),
(636, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":1,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":false}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:11'),
(637, 1, 1, 3, 3, 'products', 1, '{\"product_id\":1,\"business_id\":1,\"name\":\"Classic Glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"35.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg\",\"localpath\":\"uploads\\\\1764479035320-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:03:57.000Z\",\"quantity\":56,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:20'),
(638, 1, 1, 3, 3, 'products', 2, '{\"product_id\":2,\"business_id\":1,\"name\":\"Barbarian\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"20.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg\",\"localpath\":\"uploads\\\\1764480519450-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T05:28:41.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:21'),
(639, 1, 1, 3, 3, 'products', 3, '{\"product_id\":3,\"business_id\":1,\"name\":\"strawberry glazed\",\"product_type\":\"simple\",\"category_id\":1,\"price\":\"25.00\",\"sku\":null,\"picture\":\"https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg\",\"localpath\":\"uploads\\\\1764486994848-offline-image.jpg\",\"is_active\":0,\"created_at\":\"2025-11-30T07:16:36.000Z\",\"quantity\":0,\"unit_id\":1,\"unit_multiplier\":1}', '{\"is_active\":true}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:24:21'),
(640, 1, 1, 4, 1, 'purchases_table', 1106, '{}', '{\"sale_id\":1106,\"total_amount\":35,\"items_count\":1,\"receipt_no\":\"MINJ-03051\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(641, 1, 1, 4, 1, 'purchase_items_table', 201, '{}', '{\"purchase_id\":1106,\"product_id\":1,\"quantity\":\"1.00\",\"price\":\"35.00\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(642, 1, 1, 2, 3, 'inventory_table', 1, '{}', '{\"product_id\":1,\"delta\":-1}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:10'),
(643, 1, 1, 4, 3, 'transaction_table', 1106, '{}', '{\"purchase_id\":1106,\"status\":\"finished\"}', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0', '2026-03-05 09:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `business_permission_override_table`
--

CREATE TABLE `business_permission_override_table` (
  `override_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `bus_pos_id` bigint(12) UNSIGNED NOT NULL,
  `feature_action_id` bigint(12) UNSIGNED NOT NULL,
  `override_type` enum('ADD','REMOVE') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(12) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_permission_table`
--

CREATE TABLE `business_permission_table` (
  `bus_permission_id` bigint(12) UNSIGNED NOT NULL,
  `feature_action_id` bigint(12) UNSIGNED NOT NULL,
  `bus_pos_id` bigint(12) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_permission_table`
--

INSERT INTO `business_permission_table` (`bus_permission_id`, `feature_action_id`, `bus_pos_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 19, 1),
(20, 20, 1),
(21, 21, 1),
(22, 22, 1),
(23, 23, 1),
(24, 24, 1),
(25, 25, 1),
(26, 26, 1),
(27, 27, 1),
(28, 28, 1),
(29, 29, 1),
(30, 30, 1),
(31, 31, 1),
(32, 32, 1),
(33, 33, 1),
(34, 34, 1),
(35, 35, 1),
(36, 36, 1),
(37, 37, 1),
(38, 38, 1),
(39, 39, 1),
(40, 40, 1),
(41, 41, 1),
(42, 42, 1),
(43, 43, 1),
(44, 44, 1),
(45, 45, 1),
(46, 46, 1),
(47, 47, 1),
(48, 48, 1),
(49, 49, 1),
(50, 50, 1),
(51, 51, 1),
(52, 52, 1),
(53, 53, 1),
(54, 54, 1),
(55, 55, 1),
(56, 56, 1),
(57, 57, 1),
(58, 58, 1),
(59, 59, 1),
(60, 60, 1),
(61, 61, 1),
(62, 62, 1),
(63, 63, 1),
(64, 64, 1),
(65, 65, 1),
(66, 66, 1),
(67, 67, 1),
(68, 68, 1),
(69, 69, 1),
(70, 70, 1),
(71, 71, 1),
(72, 72, 1),
(73, 73, 1),
(74, 74, 1),
(75, 75, 1),
(76, 76, 1),
(77, 77, 1),
(78, 78, 1),
(79, 79, 1),
(80, 80, 1),
(81, 81, 1),
(82, 82, 1),
(83, 83, 1),
(84, 84, 1),
(85, 85, 1),
(86, 86, 1),
(87, 87, 1),
(88, 88, 1),
(89, 89, 1),
(90, 90, 1),
(128, 1, 2),
(129, 3, 2),
(130, 4, 2),
(131, 5, 2),
(132, 6, 2),
(133, 7, 2),
(134, 8, 2),
(135, 10, 2),
(136, 16, 2),
(137, 22, 2),
(138, 23, 2),
(139, 25, 2),
(140, 26, 2),
(141, 27, 2),
(142, 28, 2),
(143, 29, 2),
(144, 30, 2),
(145, 31, 2),
(146, 32, 2),
(147, 33, 2),
(148, 34, 2),
(149, 35, 2),
(150, 36, 2),
(151, 37, 2),
(152, 38, 2),
(153, 39, 2),
(154, 40, 2),
(155, 41, 2),
(156, 42, 2),
(157, 43, 2),
(158, 44, 2),
(159, 45, 2),
(160, 46, 2),
(161, 47, 2),
(162, 48, 2),
(163, 49, 2),
(164, 50, 2),
(165, 51, 2),
(166, 52, 2),
(167, 53, 2),
(168, 54, 2),
(169, 55, 2),
(170, 56, 2),
(171, 57, 2),
(172, 72, 2),
(173, 73, 2),
(174, 1, 3),
(175, 2, 3),
(176, 4, 3),
(177, 5, 3),
(178, 10, 3),
(179, 16, 3),
(180, 22, 3),
(181, 25, 3),
(182, 26, 3),
(183, 27, 3),
(184, 29, 3),
(185, 33, 3),
(186, 39, 3),
(187, 44, 3),
(188, 45, 3),
(189, 46, 3),
(190, 48, 3),
(191, 51, 3),
(192, 52, 3),
(193, 53, 3),
(194, 55, 3),
(195, 58, 3),
(196, 59, 3),
(197, 60, 3),
(198, 62, 3),
(199, 63, 3),
(200, 64, 3),
(201, 65, 3),
(202, 66, 3),
(203, 67, 3),
(204, 69, 3),
(205, 70, 3),
(206, 71, 3),
(207, 72, 3),
(208, 73, 3),
(209, 75, 3),
(210, 1, 4),
(211, 4, 4),
(212, 10, 4),
(213, 22, 4),
(214, 25, 4),
(215, 26, 4),
(216, 33, 4),
(217, 39, 4),
(218, 44, 4),
(219, 45, 4),
(220, 46, 4),
(221, 51, 4),
(222, 52, 4),
(223, 53, 4),
(224, 59, 4),
(225, 1, 5),
(226, 4, 5),
(227, 10, 5),
(228, 33, 5),
(229, 58, 5),
(230, 59, 5),
(231, 60, 5),
(232, 62, 5),
(233, 65, 5),
(234, 66, 5),
(235, 67, 5),
(236, 69, 5),
(237, 72, 5),
(238, 1, 6),
(239, 2, 6),
(240, 4, 6),
(241, 8, 6),
(242, 10, 6),
(243, 14, 6),
(244, 33, 6),
(245, 37, 6),
(246, 59, 6),
(247, 64, 6),
(248, 66, 6),
(249, 71, 6),
(250, 72, 6),
(251, 73, 6),
(252, 1, 7),
(253, 3, 7),
(254, 4, 7),
(255, 5, 7),
(256, 9, 7),
(257, 10, 7),
(258, 11, 7),
(259, 15, 7),
(260, 16, 7),
(261, 17, 7),
(262, 18, 7),
(263, 19, 7),
(264, 20, 7),
(265, 21, 7),
(266, 22, 7),
(267, 23, 7),
(268, 25, 7),
(269, 26, 7),
(270, 27, 7),
(271, 29, 7),
(272, 44, 7),
(273, 45, 7),
(274, 46, 7),
(275, 48, 7),
(276, 72, 7),
(277, 73, 7),
(278, 1, 9),
(280, 10, 9),
(281, 33, 9),
(282, 39, 9),
(285, 6, 7),
(286, 32, 7),
(287, 33, 7),
(288, 34, 7),
(289, 35, 7),
(290, 38, 7),
(291, 39, 7),
(292, 40, 7),
(293, 41, 7),
(294, 51, 7),
(295, 52, 7),
(300, 66, 7);

-- --------------------------------------------------------

--
-- Table structure for table `business_position_table`
--

CREATE TABLE `business_position_table` (
  `business_pos_id` bigint(12) UNSIGNED NOT NULL,
  `position_name` varchar(999) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_position_table`
--

INSERT INTO `business_position_table` (`business_pos_id`, `position_name`, `description`) VALUES
(1, 'Owner', ''),
(2, 'Head_Cook', ''),
(3, 'Shift_Supervisor', ''),
(4, 'Kitchen_Staff', ''),
(5, 'Cashier', ''),
(6, 'Marketing', ''),
(7, 'Operational_Support', ''),
(9, 'Employee', '');

-- --------------------------------------------------------

--
-- Table structure for table `business_setting_table`
--

CREATE TABLE `business_setting_table` (
  `bus_set_id` bigint(12) NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `logo` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setting_table`
--

INSERT INTO `business_setting_table` (`bus_set_id`, `business_id`, `logo`) VALUES
(1, 1, 0x89504e470d0a1a0a0000000d49484452000001f4000001f40806000000cbd6df8a00001000494441547801ecfd799c25c775df89fe2232efbd55d57ba377341a8d85200062e38aad4134766e20299114a5f98814492db4bc682c8d6cbf993733e43cdbf32c51f6f37c66e69ff9d8d2c8f678fc79e367f3c996482d24282e0077800417890b00622389b5f7aaba373362be27f2deaaeaea6ea0ea565557555724f2774fc4898813277e91192723b31bed958fcc406620339019c80c6406563d0339a0affa29cc03c80c640632039981cc80b4b4013d339c19c80c640632039981ccc059612007f4b34273ee24339019c80c640632034bcbc06a0ee84bcb4cb69e19c80c64063203998155c4400ee8ab68b2b2ab9981cc40662033901938130339a09f8999accf0c640632039981ccc02a622007f4553459d9d5cc406620339019c80c9c89811cd0cfc4ccd2eab3f5cc406620339019c80c2c2a0339a02f2a9dd9586620339019c80c64069687811cd09787f7a5ed355bcf0c64063203998135c7400ee86b6ecaf38033039981cc4066e05c642007f473715697764cd97a6620339019c80cac400672405f8193925dca0c640632039981ccc07c19c8017dbe8ce5fa4bcb40b69e19c80c6406320343319003fa50b4e5469981cc40662033901958590ce480beb2e6237bb3b40c64eb9981cc4066e09c652007f473766af3c032039981cc4066602d319003fa5a9aed3cd6a565205bcf0c64063203cbc8400ee8cb487eee3a339019c80c640632038bc5400ee88bc564b69319585a06b2f5cc40662033f0920ce480fe92f4e4c2cc406620339019c80cac0e0672405f1df394bdcc0c2c2d03d97a662033b0ea19c8017dd54f611e406620339019c80c6406a41cd0f3559019c80c2c3503d97e662033701618c801fd2c909cbbc80c640632039981ccc052339003fa52339ced670632034bcb40b69e19c80c240672404f34e49fcc406620339019c80cac6e0672405fddf397bdcf0c64069696816c3d33b06a18c8017dd54c557634339019c80c6406320367662007f43373934b32039981ccc0d23290ad67061691811cd01791cc6c2a339019c80c64063203cbc5400ee8cbc57cee37339019c80c2c2d03d9fa1a632007f43536e179b89981cc40662033706e329003fab939af79549981cc4066606919c8d6571c0339a0afb829c90e650632039981cc406660fe0ce4803e7fce728bcc406620339019585a06b2f52118c8017d08d27293cc406620339019c80cac340672405f693392fdc90c640632039981a565e01cb59e03fa393ab179589981cc40662033b0b618c8017d6dcd771e6d6620339019c80c2c2d03cb663d07f465a33e779c19c80c640632039981c5632007f4c5e3325bca0c640632039981ccc0d232f012d673407f097272516620339019c80c6406560b0339a0af9699ca7e660632039981cc4066e02518588480fe12d673516620339019c80c640632036785811cd0cf0acdb993cc406620339019c80c2c2d032b3ea02fedf0b3f5cc406620339019c80c9c1b0ce4807e6ecc631e456620339019c80cac7106d678405fe3b39f879f19c80c64063203e70c0339a09f335399079219c80c640632036b99811cd09770f6b3e9cc406620339019c80c9c2d0672403f5b4ce77e32039981cc40662033b0840ce480be84e42eade96c3d339019c80c64063203d30ce4803ecd454e650632039981cc406660d5329003faaa9dbaa5753c5bcf0c640632039981d5c5400ee8ab6bbeb2b79981cc406620339019382d0339a09f9696ac5c5a06b2f5cc406620339019586c0672405f6c46b3bdcc406620339019c80c2c030339a02f03e9b9cba565205bcf0c640632036b91811cd0d7e2ace731670632039981ccc039c7400ee8e7dc94e6012d2d0353d61d2903229f9981cc406660f919c8017df9e7207bb04a1878dd5577bdefb657dffcdfbdfbc01b3efade9b5ff5d1f7dd7aed47df7dd31b3efaa66b5ef39183975f9570fb95d721affbc81b2f079759daca5e43fe751f79e395c804cad6883c78d5eb3e72f02a38388dbcfdcad77de4f6cb0daff948e20deede78d5751f3940dd9bae3af091d7bfeaeefff6d5d7fccccfaf92cb23bb991958760672405ff629c80eac1606b68dd67f77e7bae31f59ef7efa914ef5d47f3f523dfddf6f0c3ffdc8ce91173eba7fd3f8472fde32f9d10b379ef8e8059b8e7df462e42b76f43e7ad1a6e31fbd70f3f18f5e64d8884c18ffe84567902b4dbf7fc3b18feedf70021cc3e7f9fbbd6fdd918fee5b770c9c466e380c6f873e7af1a6237dfbf4415f176d384efe045c4e7c74fb68f59babe5fac87e6606969b811cd0977b0672ffab8601efea2dadfaa86f5747b58e97ed6555ab1dc735ea4e6844c7d40e47d48987c91fd5883baca27a4e1d1d6a10fb72905f25d2c631c0d458e6e1fba0ede964db1d515b475482b68ec29d01fec221ad0f3fd5baf86c5186c33b948fcc4066604e0ce4803e279a72a5cc80440c57117bae157b2a8254c4a0327655c830896cd08aa7ca96c665fae5c5e48af3c1b949190ac12948fcc0555bc7d4024e93ca4766203330370672409f1b4fb95666c01870f6939119c80c640656220339a0afc459c93e6506562103d9e5cc4066607919c8017d79f9cfbdaf3206027b74deb6af32afb3bb9981ccc05a602007f4b530cb798c998155cf401e40662033f0720ce480fe720ce5f2ccc0340391a40191cfcc40662033b0b218c8017d65cd47f6660533e0e4f2dbf6b3383ff679e36c7597fbc90c9c0b0ce4807e2ecc621ec3596120286fcecf0ad1b993cc406660280672401f8ab6dc682d32e0746a448f28d72217676bcce706bf678baddccf5a672007f4b57e05e4f1cf9d01a7a9fb25071ae52333901958610c4c2d502bccafec4e66600532e06c3f6e5881be6597d62a0379dc9981010339a00f98c83233f0f20ce460fef21ccdab868f92615e8d72e5cc4066e0b40ce4807e5a5ab23233707a069c73a72fc8da2561c0b9ccf792103b67a3b9e26a622007f4d5345bd9d76567c0be9d1b96dd91ec40662033901998c5400ee8b308c9d9ccc0991808f6d7d053349f79db0cd2cb2507de5aff8641be914e5109d1cb2598bed19de60fed5be1bc607f577c26663636bde55d147d3710c7404ff2a54ffc7de90ab974b53390fd5f5c06fce29acbd63203e72e037568fe294fef5a8a04764313243d016b793060db85b2ef83d404f0467a572bd6950a572658702dbce45d0fd45a4850b7c01c6214f15ab5932c8d41faf18adea90ecdff87c751a1245920ad0d42260d56df60750c12cea1b03a50acfc77ff21239f99813932d0dc3d73ac9cab6506d63203be949c731241c7a95013af0839b673b7d0b32c521c0450fc8af844e6a433e2530a8cc4eebaf2aa42545505557554afd73ba9ee30194723e7ec97849dd88ffd20efdcb4defee05b13b0250be416b0adfa9931ddf6cc75724966e0a518587b6539a0afbd39cf231e9281914e2756bd5eec4e4caa2c0aad1b1d11a191dd6957c175cfbe54a55a41350174802027622ada46d6815bdc150abc5550d1966f8d25149d756a8daea7bd401c0a8e8e8a20d9cebba45fd7e73505747c72ced16f5f9945662033b0e40c70b72f791fb983ccc039c140983c7ea4e5621c2d9c5c6f52e3470fb3278e803cdbcfc282dad994d65742102e2538f2c4510d648cb58aa2e01301419bad7a20c04f766b4d4cd69a9ca8543aaf166f1c864149bb829d7e59c5f457cf6cfce2b0808e983ae936057693a64cbb754bcc01ceb939d4ca553203679f8195d8630ee82b7156b24f2b92815635717c9dafe3fa425aafa00da5575149be572c13e8bb9e940fe3f2f50ca43cfaba2bd53d11ce79cf5dcb02a9057062be4adf520bb86ee4e1a41e0a45afd6081fcf5b04740bec66d7cba5b9b3a03e78b56e81dc900a66fc983f33b2399919c80c2c9001bfc0f6b9796660e530f09ef714af7ce5db375c7cf19d9b4ec57bd00d30281fe40772a03f59bef6b5776e7adf1bdf78d1c5eb74feee7ac26f3e76485b4e1cd55e3ea25fc80ef24276b9fbe575f6a5d37e02a8f9b09f687a2118e44d67d847f9de58e8bc1395361f9bd4b6895adb27a41d607bd7691b0f23dbba85b683f9ca2db4ddc4febe1379b00912dd6bf661413d8102aaf0db9c3998373ce4dfccc0e919184e9b03fa70bce5562b9081ab1e8db75cb2e5c8375eb7e3b943afdffe93436fd8fee4a11bb73f71e8faed3f3ef4baed3f3cf4da1d8fa2fb3e78e6d06b761afefad0eb76fc55c26b77fed5a1d7eefcf1a137ec68f0ba1dcfa07feed01bce7bfed0d5e189172fee3dfec81bb78d5cf8ce57ec73bf70cd957aefab2ed7bb2ebe48efbd70af7ee1c23dcb847dfa857d17e9172eb8045c4aba0fcbefbb54efdd77997ee1c22bf4ce9dfb75dbc816dd14d7e9fab05eafeb8de8d5bd515d3d39a26bc85f1537ebaa00e6292ff39bb5cd75b4cef1f23d2abdd61787734e1ea87f5024dba11bfaaa244ef700900af24f6620333014037ea856b95166600532d00e93ebd7ebd09e2d7a4e5bf5136d8b3fd179f58fc1d3da563fadedd5d3da1a0c8d7e4bf8b1b6c4a7c193da8c7e73f8495fa223bd056c73cf6b9b5e749d433fd66e3fa91da1d2799313dad6ed695b6f52bb434f7b78adbd6c92bef7549576d7951ad94d72575f770181757715b4e9f884361e1bd756dba1574ebb2aaf1d75a92d5ddfa0377fb999369b5d5ba3be5449b4f65c13f6aa1d91ce82b703a8653b749349c98f03f9cc0c6406169f01bb07e76235d7c90cac78064e14950bbee7e4c7092527e4dca4ecef61970a7c4736d42a882c76d1b7784ddc265d022fa782c06770bc0b367857d1b692e2845c9c5459448920e94149fdb6a41258005b3ed48aea29ba8953a1aea22655d527a4a2070393e293b92af4b517ad9a3f1dcf10188dc4b0e72dd39f70af23e6031cc10fc6bcc738d2fe04bcf142329db3837a52cee127cca14eae9219c80c340c34775f93cebf998155cd408c2de7622c7cb430101479a75bf37dbb26582bfd7deca8e86b8960ed5413c42a8258453ec8a57814d0c504b9a69e525d7412751cf02a82473a892865ed9617115f0c01698892007e3792b4d09b1697c5830c49341e610acf7849725a5047cc396fadd3ff3026582b6153e2f928651cdd5ab9c9812e15f063fd989e643e330399814564c0eeea453437a4a9dc2c33b0080c1455dbb958724ddb9ebc4dc86ea9c7b6b45794ea1552ed2bd053f43dd92edeb38397234d4da500486422f0cbd08427bcb207038405c2c89e3cb6885a20581a10d445f05a3e30b008421fa41d3ed9434781f4445387ef1e38fc77a91cffd338f09fa1514dc380a6728c1dc22d29ba4ad27e4c5f40e7206dd2e0a96ff2e530f0e7e5eae5f2cc4066609a81c1bd38adc9a9ccc02a658090a682f7bc4d20710418af202fdba55b6ca97d202dd9ff93bd092c811d3ab19d6027e080c9347c179482bc8ba205f502964c1752da7412bb7b4a97efe4f64d3e5b60268d87b2bcc9043cebe7cd7b1171231f0a0c8c9a2c6d28372e8645119582ba38308f4d129c584e7ab34b369f9981ccc05960c0eebbb3d0cdb276913b5f230c38371ecbd80d65eca90c35c13da4b0e6e28000bbdc9d9476a72db9d0910fad06e83c70b68325c8590b7b75ef08da8e2fce0d2655f05ddabb71c9f16d3aedf06b59f5e582f8a420c79892647c242369fbcc901e64525e3cc8f07043b17d3f3704da44b9297e5c948681efb70b92027d1948a693eee841b23a49c1cfa08f99c11f753e3318c5e0dd00001000494441540399814560c0eeb94530934d6406560003ce4582702cf8865ec48a4012085281a065a870b0797d9e02dd60a76a9198129934503ba630d404a86865c00210a18954ff4c05fcb87e7ed9040e98df86291f0229f3cde44ca03ee9a4ce49f9e133c68f594bc025678919e66606f519ea974d3a87b197ad952b64063203c6400ee8c6c24290dbae180682d645c57624ac1396a5220476d4b50a76eccebe95030a15f1b8f23eed5aed357cf081dd6583da0d02b9a71e60b71bb1126347b53a3219488bb4d49208a40e83cb051c6234a1010f3252480f31cd434d8487c8e3498083c0034e4dbaeac3d2cd98533066dcc3483a96b5b39db9c1f20318273303b9e5076559660632038bcf805f7c93d9626660f91808cedb3f0b22c512273cc10dc1f7704fb0f329d8099da7dc11888862b2230825f92851c782be0576dbc9d704f3da95b274a47a20442aa190783daf48936141d3a973ca8643350ba9637416310d56975aa61663c31169f087faacac0fc7981d690323961d1e76bce919a7e50d667218a4b6890bf1b0d0c074a410d6a397b3071e72b02d393e4fe08cf1abc181ffce7c4965355a7bc840e4333390199837037ede2d7283b3c940ee6b3e0cd427e48a10bbcea92e3aaa5c4b91fde8c084fd61b9765da8150a02904f6a47e0f7c1930fd4ac147d2dfb4373b1bf33af53309782afa80fd8e54b041e82228ae67488211069d33c38587b32f82d02640415fd1a229f06d2c3093ee2843962955579a71e43a80a7c2eba34ebc902a6d2d13ccca024e7803dcaa0b307100535f502e30d8c5b43435387e70d009ef2b0e04c4710af797b61106329024a878faec7bc7495de8aa0b7327be8487fd320fd79042bebc9027ea449c443f12685643e330399813930c09230875ab94a66601530501068a30bce0265705e841845a40830e6bee3c7f31ade87a826a821d53f1c51075880f1a85d82678729829552d073d8f70444436a451d59d0d1020efa9441c95832149c348005fc93ba4875ad9caf0ba4533d5aa5d67c3a503f502a3572b223a28be4235c84a40aa64e68f22939ef1f6b1bfbf69ccc6680a7a8805f11029b32cc92e654441f4804a4f049695ebc5550e44d48c03fd30734968ee4b1482e9f9981ccc05c18b0bb692ef5729d739181736c4c3146c7900c083bb9bc53d09856790bcaec061d10bb460b32a995550745540ae0ed5a6a13593a26410b94e42dd80b490452026d863d9b87874010c4a0edf8239d987f40ec6623089e5d2d5041196f0f9a07911a1f835c94bcfd7d78dbc51b78db2002a308de62dc91a0394048695c765220500ef4e2084967faf981a6d892a28b20804ac17715f137f24623ba1a1d7a2a46fa103e9054eadb05da7ac538aa183648611474a4d8918ff667131a041b9735cac80c64065e960156bc97ad932b64065607034574c105cfaf9a20d5040d0b6616182c900cf4d1117c0601c74961c6086da38b4a26ed75b18f52c2a08e2361b0bbc724d9614f6beeb04f5453029e0c02bd5c908dc560e92950a7f9436f922370cb5ea54f01a74ca7d31d9459509d559ec6860ff395a987648b51249934fc189b00ffcd3f67d1dc1e36928fade4b3ebe703afe60de241c463c3f876f8329018cb67662033304706ec0e9f63d55c2d33302f06ce7ae52a56aef6b100b22098e2085ec4b4232d0883257ae226812600ab139c64afb5a7eb5a398dfae7403fa897a4dd3505154cd29ed490270608623a09044276eb4dc00e04bf20f57d353955b7f66cda412854b04b77836fecc996d2e1d4b4b5761e8d23501a48727a39ea7a60ba6150d0a72748bbd0c156014a1e7cca24cdb64b7ea1b7f284517c66074edae3b7a76f1ce10cbc53a8695ba98c93bc19e9217b2a628fc78f40793e33039981b930e0e75229d7c90cac0e06782d2d42b5b320102cd5b89d024749a42e1aa4d7b876e91b4400523a66c7660be65660d260813ffd41349a55c07456be306088b0251e3a921df315388265c130ac34e9d30fb9e424923ab2a70b82742a1a48d128294c9ad2600af289174b9b116c90b4408e2098daafe62d6901a766cbc3a36f8c241f02413af4f38814f8addca31708d40fb2872a8354c9f389a14016eab25fef11d04382f29119c80ccc89013fa75ab9526660a531701a7f08d7f204137b75ec643b3e8206f51c91d7a51d614b8e57bd29cd2ed111643c81b1882270280533479a26324133b1116ee094247136490bee33e3a9b5992fcc7ee50aece1b9a703d22294895108bfdc0c04027e044ae58eae6893f22415240bd67c4648dfd85d4dbef97e2d2b03c1f19d5b52b4a6483b2361d5f286807e18296ca73e911698033e44fb7e9ebea3f71493ecfbe3f193802d839b542c2615f035f9e6222e593975a7e6ae56525392cfcc4066e0e519c801fde539ca355611032e05415948b47085e71624c89b9e68ec9106c7eb609fa014342c701834e3b096833033505b9d82828282e6c16150327f19f0d002a9edf6edefb9f79d9e3684bfd697f523fc4e05ce7eedb63590b62049506c822a4e0d023bfa407a8014acd1d1e2a43390331f5239b6e725692bd1a7cc8a656cc76d72a0ab14f12d5a90c717593d93e81a7feda143d491cc8701cc42039fca9a74fecd0c64065e8e81feaaf072d572796660e53350946dc54aecb4d9bd121d2c107a05e264b4d0d980efd32eaa1fc43d750d3ae9884ea2f994cec548fdc8775d27fbd3ef654dba87ce2ac5a96a4324a26a821b5ffec5b3057004308263e338518ec160dffcf558a74464153da901544b044cb12b4e48019372350821a8280af57a3d39e714198bf7b082de39f24ec9e66028f391a22f46407b7c90b05f60cc3c75323b4a6f1dcc8f2829285a7dc79b0264f21949568ea708cfdb12f1f644b145cd966a5702a749fca4713e3303998139306077df1caae52a998155c2402ca3534b5144aae4725020e0454720f1ec08d32b605e05f78b2df01868a401ac99a54d3ae7e49c939753090a83c528439464400c737a1a790bb0353ed65dd5754fb53d915810432ffa4af6e903f7f1418ca5810886a2d0fca458e970e9971fb38ca085738e8716a9e0f57cc9083c363d0d3c0f25917eccae5373cc574a41059c1618f434f62ae8b12511980be6c0f156c15b7ff8e09c93738ef206ce998c786410fa487921b906117f2ded4d2a1f9981ccc05c18f073a994eb64065603032cfe21ba5615082691c0d07cff6e027948419d80591038fba8789f5db1d36d5e798b1de1346cbc29580e825e34cd008ea045fa241df9b99efd7a8eb7051d458db24befa02b0ba7b2e4962cc9d8c94e5aa2af3e1c922a724e52829373864222982aed7209a88c5fb183a645dc2fc473828ae0185c60631c54f000d1e281a115a27ca85f12833f6d7f7a19b13f41fb49791e105ce5b05fc8576da4a7bf0170cffa078ecf0806d5857cedf0ab0b26e093d7f3627ee0a3624cb5414ef63641f9c80c6406e6c4809f53ad5c2933b00a181871bdd009b1d7aaa25a954b28491b8aba2690d5e82aa421204d1791d3b0ba6d5ea74fc99ed5a33c8ac0c5c3018190e8235964352c84176c6aa22b752b76e7b5e856ddb2a5095f68c24915328187934902dc04380ec6674285c6c144aad3d2246d262d4d509f20c087f6a8babe546c8fa847bb9e8fd48922e62ab49c020f10353893b4879dc19fec9f2ded61a85b44f50aa92a4aec76d4d53af5fc7a758b8d603dbad12974dd3a4d4ea129ebf9960c93be93cac68b31c64e995ba79e1b953c5808c7b96d66600d319003fa1a9aec737ca86e7b71bcbd25745b9b08c29bba519b8940864dc84d44a68d09d2a60a98ae576a63d2790dea58fd01ac6c131fb73784426304477b996fdfa0a38349bb735c149b480d7df04a5aad11a9bd41bda2ada3187bb1f07aa1ddd173e0f99151bd4840361cea9006873b1d198e745a3a429d17473a7a11fd8bed75b23a87dba33a4c9b04f4cf62f319051d1ba57ec7eb704b3ad20a3a5cd43a5474c957807c094c3f2f291dc7e6f1ce483cda199b38d2da70f870b1e98523e596178e145b2d7dfc50b969f250b9a1421f0e159be28be516bd589e47dfe7c5c3c5d670d86fad5e2cb6f40e15dbba2f82178a9dd50be5b6fab0dfd63be6371d1b0fa38f0ccd6f6e981958630cd8b2b4c6869c87bb9c0c5c79e37ff19e1b6e7cdbff7cdbebeffafddb5f7ffb1fdc72fded7f70d34db7ffc1cd37dc3194bce1fa9bffe0d61b6ef883b7dff8863fd8e3277ee37cd5adbd04cadda1a3f3e398ce0fa3da1bd6696fbd9ef4984cb7278c690fba3d26a9b3278ec8707e18a1ee34ce47bf5323daee46b4c9b735a64216d48dbfe8d2af88971afa7018a99dba3c803c7ef8981e7cea693df0e493fac2d34fe90b3f7e1afc449f7dfa697ddef0e4d3baff89060f3cf1a4eea7defd4f3dde484b0ff0c4538d2e953daeaf3cf3633df4fc4ff548ef849e54574f15937ad24fe8697f424fb9e37a8afdbde149379ed2b3e55356d74de874f229d7a34d5b3ff6ebfefd9371fd879fec6df8b5c77a9b3efc5875de871feb6dfdb54727b7fecaa3ddf37ef947d5960f3ddaddfac1c7aaad1f7ca2bbf5038f75b77fe0b1c96d1f7cacbbe3833feaeef8d063dded94effae51f7677fcf2a3bd9d1f7a7462c7071f9fd8f4a1a727c67ef5c538fa3f0ccd6f6e981958630cf83536de3cdc6566607bebf9b7ed1d7dee83fb3a4f7ce0a2f6631fb8b87ce203973ae09f1c4a5e52fef403fbe24f3eb0af7ae6972ee8be78707fd5d5fe9ed745bc53be70b2adfddd75bad0d01b23bd5efbba63e4d7cfc0a82eec7528ebe8a26e47174f7652da747bab8ef6606767686b6b5d6aacf6e94fb9bba8f4a7c5110b62333aaf6e6b54ec6ef5639e10feeac484be71ec98be7ee2b8be363eae2f8f1f459ed0574f9c406738a607297bf0f8713d74ac81a5bf3e7e5c5fb7ba278e26f920f2c11387a97b585f39f2bc1e1a3fa4ef11981f6df5f4a34ea5c7dae37aac33a9c7da5d30a91fb5e68119751f2da547b451dfabb67ff13f7ef9bdffe6b35ff9fafff74b5ffddcbfffd2973ef5efbff895fb2cfdefbef2952ffc1f5ffad297fef597bffaf97ff5e52f7ff60fbffce5cffce1d7befca93ffcf2d73ef3870f7cf5b3ffeafeaf7efe5f7fe92bf7ff9baf7ce533ffe6ebe0c12ffdf9bf7ef0ab7ffeafbff4f5cffc9baf7ef5cffeddc3f7ffdbcf2e88e4dc3833b08618c8017d0d4df64a18ea687568d3bade33edd1ea19d7e9fe54a4b5bef79cd655cf9c56aeaf9fd586ea799d496e0e87b4a1f7a246ba873432795ca3dd1e75854edad875d874da8034acef59ba85aea58d96ee456d48d2f5f34eebab3e782848655549ff8546d849b709e8c542a3f88c49084e32d465a90970981dfb21be29dbab74c3e1b2adc3236d1d01473b6d02ff888ef12dfc6867045d034b3765566ee8e80875ad8db53dca2bfaa3ad4213eb4a9de073f4d1b674b4edb1231deb441ded901f12c75ba55e2c4af14abd963e1a660c2d27330399816560c02f439fb9cb35cc40a95ee17b271c87e40a39e7403c23248b132f8150a9289c781bae1a5b95ef20dbaad51c3ed2d605455fabf641b52b446f0a8e1aae27af201fadae47ef55f9064985ba4db5a28e2ad94dd775ad58789195a71edb746a0c7f9a6f659c94af4f28e244edbc5c6b5491eff61ecf1ca65dc07fc6c008f0342ae058885e3d06dc63bc819d7de4a9c06490b3ff079b2af415e521b624d7665c25e826b85853c258b143611a3b5d0fcb7527d400001000494441542505afce570a61528b7464339981ccc00218f00b689b9b6606e6cd807375e9159ceb0794791b98d5c0ecd8454c5c5303270b6ca91a012749348174ea92402903790117a9dd14a4aae4a82d0582ab27709afd22d08274aa405bb24d72a1bf182f541386eb6429625bf41355cafab640eb524948bfcd8f4fe38441d5f8285a0f1049471a246969a0584826850d5769710f6caa526d13b0b886b3b5cc4066600806f2ad380469b9c9f00cc4e80939c3b7cf2d33034333901b6606ce710672403fc72778a50dcfb910cd27db499acc58dd0c38e77885af7c640632032b80811cd057c024ac2517f8fe6bef69d7d290cfe9b106deb7e457ee698af34f6660d919c8017dd9a7606d39e0e409e83e3a67df76958fcc40662033901958240672405f2422b3993932e05c7ae5ded4ce975fc343fecd0cbc0c03b93833300706f28a3a07927295c564207d439f11d417d376b69519c80c6406d62e0339a0afddb95f9691d731cafe0eb7fd3bddcef1017659bcc89d2e2e037919595c3ecfbab5dce139c240be13cf9189ccc3c80c9c6d06627e1e3bdb94e7fe32032fc9400ee82f494f2e5c6c06f8826e61c0b0d8a6b3bd6561c09690fc071c9785fad5d269f6f3ac316077e359eb2c77941920a0dbea9f027ae4f57b6664753390ff30c4ea9ebfecfdb9c5400ee8e7d67caef8d144e74a9c4c011d99cf738081700e8c210f61d532901d9fc1400ee833c8c8c9a567c05b40b7fffd6bcc97ded2b37d567ac89bf4b34273ee2433f0f20ce455f5e539ca351691813aca0727b78826b3a9e56520cfe5f2f29f7b5f4a065699ed1cd057d984ad7e779b4b2efd9b6831301ccb0f0ba57fe9ab9e1952d2ce1f7b260df460a7671f69d57898b0acec5f5033a40c3f7cdbe777705a4d4be39f03a2b1fd6b65e939c4dbbf896685c0f40692439ca9cfe834fd2fab05914d3dd9bfa416c4d70953a47f314de9b0accc03c6e69a4cd2279de9fbb946ccf40d4e52f940363516fc9bf8a9176c261bc80c640616ce80dddd0bb7922d6406e6c8c048ab1343af8aa11a57ab1509318e30590c85e80ad58534117ba9f7504502a25720d015454b21d83f839a8ab01f089c2852b82454926c13878ad89453b39fb05bc2d0cfba4a2176e59c53e15baa7a51c19e204285ae568c0b4154c45e010bbe0a72f88235a9f4eae29b5c29a70ea52d50c8b982f13528d452195b72ce3510e506ea38673ac9f1141302166354e13baa7a8e1a6df5262b793979a7051e3c80307eefc302ede4e6998135c9c0a20fda2fbac56c3033f0120c4cd6b157b446a36fb5d4edf514088c21568a44df61649ba83452161a25d8b67d214fa08a04b0189c9c73044081e980835a0673d1d9cf69405c4ddac0eed363bf289cec7f8653dbf7025faa85ef2a08acf8ec9c4bfd38379cf4ed524559ca95f45148e20142c25fa27bc0fe34aa3e57dd24634d303510b003887d1e8349f2f61062e902bbce35be95f45314a5daedb6227d54555722c5cf024e7c5d40ebdc34339019583c06fce299ca9632032fcf40afaeab491571dcb3532cda2202cb13c486412b06f963c7d43a7e42c5f8b8fce4240f06fdc0e7d8999612bf091581ab22405704cade0c54d40bd43069083c0c102a359015c1b15bf5d44356f4e708e422a8632e0dd61e1e821ce171fe309f4ef030738c370093aa54938e75575e3db57dadb26427edbb2a5c57cef346a08f02e95d0f3de5f8ef132c1de41963938f29edb01bb0d9eb4eb0339fd4c4c478f2db1e503a9d4e4ae79fcc4066e0dc60e0a4807e6e0c298f622533b0b153b9229e90aa09952d87ab931201cd6962ded2d36ea45568849da72ba3424bea8d48c746a25e2c2775a8ece968abd6d1764838c22bfe23a40fb7a30e75ea044b1f217fd4ca0cbc87b77a494f7e625d4bc747bd26c64a1dc7fef14ea1c33ee83001d5d2c7474a9de878508079ca9142ddb1962691011f220f20c13e1fc08dea130abd63f27142d1f501478e314ff335a9945717d993e224305921bb8a3c1854f6f8c41b86163cad5bb74ef676a120dfeb4daadbedc2ff424fbf5003b97d662033b0480ce4bb7191883c57cc5c79e57bda97defe4b975c75cbbbae79f51bde76edab0fdc33036fbbf655077e26e1d5076696914e75adbc81b57d435f6736de809df7dc75d775576cd3f657ee6e17fbb777b47353a1f3776dd29edd9bb57bd7e679cb5db4dbb4639336eedcac11ec8c5c789e36bcea42adbfee628d5d7b9146c1d8ab495f7789d65d7b09fa8b34769de1628da0efbcc6cafa203f66edc03aea18d6d3c65fb64763d75cac0e760fef18d50b5b5a3aba739dc6f76cd6c49e2d3aba6d4c47b61bd6cd5b1e3f8f36eb0b75d715ea6c5daf1de79fa7bde0823d5bb56fcf79ba60d756ed8197ddbbb7c0cf16eda2bf5da477edde0c6f5b1276a73a5b293f8fba7decb676e725ddf97b7668fbb62deaf6c6353179423d02bc385ce155b4788220bde0135b0bb6910d640632030b66c02fd8c29c0de48aab8181eeaeb10b76b9a3fff6fcf2c8977695cf3eb42f3effd0fef8d3872e0a3f463ef9d0c5f1e984fde169f23f7de8023dfbd05efde4a10b5acf3eb43b3ef7d0f9ee9984bdc5730fedf1cf3cb49776fbdc7394fdf46bdb8b67be76c3153b5ff7aebb6fd62fbefbad7af7dbefd13bde7697ee7ddb3d7a3b98af7cdbbdf7e8de77be596ff999b7e82defb957eff8c07b75cf7ff921ddf1dbbfae3bfffeafeb8effc7dfd11dff15f2bffab06e07967ef36ffdbadefcdb1fd65dd4b1fcedc8dbc95bfa2eea36f81b3279c76fff0dddf9f77e5d07ff9bbfab1bfef68774e96d3769ebd597825768e31517abbc6897365c7e91d60f890d975fa81dafba4c7bafbe42d7dcf406dd71cf1df0f02638b9473fc3d87e067eeebdf72e740079af7165d2607c51e71de80c6f375dcac3492abb9b766fd27bdff3b3baebeedbb475f326391715630de2a25d8ace393e372c9ab96c2833901958000339a02f80bc73b1e9bac9eec8ba387ef1661d1ed9a617b5353cab6df54fb503ecac7eac9df593d3a89ed6f6f08cce8bcf6b6b7c01f94292db486fd57332ec70a67b4eeb277f5cd42f3ceac7744c23e5a4c646bc46787ddd6e7975da521bcc5bd236d9182bd41a65b7c94e579b47a42da5b481f7e31b0a69735bda34d287a5fb30fd16d2264f874d1d35ed3ad2e65159fac5b2e6557e94bd8e3fc66bf8f1f52d9d58d76e30369c3c86df47cba8aa5da8bdaea3d191963a4e6a1126dbbcda1f6905b579f5dfe2957c9b4f148691d28b6aea30c4f60c74a867754ddf819b366535afef47da5ec74f1c561dbae995bb7c13d04308ca4766203370ee30e0cf95a1e4712c0e03314e38df3b56b67b47d5a98ff4711c69f9a31aa91b74ea636a8763293f5a1d461ed14838aad17e9bd18a7c7d5865ef798d5487b4a198d00682d246be49875869bc3ba93a069c0e7cffad8693aa54f726647f902cc4aeec0fb5a9c4561954137c898a92fdbd3483e54d5a300381b44145ddaf83b43a04570d6065d8128150ae56c503483552ea183bdd13208e8ee83877d009308ecdf94a6b3b41201f2fa4491714b1a1801f7c472f55ab8d8f0ed920ca93f6aa90951cd26079930df87eceb77da76ee2d45b1db81ec3cfd23b154521efa5aaaad22edd39a77c64063203e70e03dcdee7ce60f24816ce402b4eba8eab4b1fc68987950ac76e8e6020107ca19aefa5b52f55156dd5be4560913c81c6f551b2b3b43f7d5e78daa26bd1de135854d729881ceb7615db23eaf9b62a109db01186469bfeda21ca13a43cfd29f4d05412bb59c23ac64303f50f862303015409e8f10107647f9dcdfeaada00a613e3963528193b0f2035d5658190c8d8adccb657745e72c5bc65c0c624f6bb66bb70aad93147c6609c7b075f8c4576e0a7a7efc6cd2827fa051e384579da78387629cfd8696b0f20065f044d4e8ecb310ff6babd661e9c738af85bc768d61704e62f32fa05d9c88d33039981c56120df8b73e2716d552a63af68859e0af5e4d42cfa35412b70b5a4f041bae72c94b2b54c41241054aa84821d614170f1b1265fd3be0201341c5acd9a80d26830d8a8f90dc0ceb94b4f902b804f3e44fa088a043f828c02d1cfa4594c204f85941cfc58b9d51bc0f2331178e59dda100cad4de427015b110eac6eb034231d5656505083d41e5b744197030e2ca7f486dc11366d036f48ee304ec9ea19a887d2f890626aef98033755ded4a10a15679e744ced999af9a5adbdb070aa65e52333901938eb0c3477e459ef3677b8521968f3ba96801e006fab2bdc2448f26bc14b0415c20b399fc24624a8b92816f40022f56b1e026a95bc36b640db0494283b52bd940c96250446025590e92d480d0333149c643b6a7ef149098102ebca64a027e1270ea2b5b3d14a8db4710dd068fa25044cd35b8bd436f543d94052607d5b9d04f2c349e3b2b90d8d0b7ac092d4d8a2b3d4b9953bb86a902aa49f987e67fe58cd99f994662cb2f12699348bf6e39c0bc115a73ab2683d64439981ccc05c1938edfd3fd7c6b9dee230b092acf49c8fb189c44a018b80189c297ccaa7c030c3e168c192406f2b7aa05e13949a0a91b691101f93748a04a768f529b67aa6996d8fa2799dd10c29d083b0aea9c3428c5ddc8646399dc2111e261aad351fc06a18acc4a4e9351504036aeb27366da7f452aa27cd5b8ac325603792e89f960c1418529a913938b67e0cf6f063555339f52c2d262d497e06e556d760799314f5cf34ba7e7ac1c25c5cb0916c2033901958380376672fdc4ab6700e31d052cfb542e55a84c99456e54a45828a80435ba4d7eabc4e8f425f50ded4ab65f58aa44b7b756c74f9cede731dea7454f39abee6db2d2151338f40501a06031b16b0ecedb8fdf935cf77811628788f5dd8fb6cd2b86c8e36d523c280288264ed06b0bca185bea89bb2a62d0a4e7b48b0f2d41f362c5dc4c89b8930143c9f0b8a1064f62ce01ab796c63538f409213d00719b12d07d8295321c1a4467698f8b807a01289a92fa563400ed648f3c0339d0339f53c90524f8f01217d03c37cd0c64061689815977fe2259cd66561003f373a56bd5bd8b83001b2d48583048b0e00554f35abd4213882c76090da0b44b25d6c80248a44624c8873e623f8058e02aeca100386a0e7b867ee3814cc13062cd8048674ae35fbfaef029e94ff763750748e521fdca74a49a719198719e4e37a3f82593e6af71e16380999002bb35b0f1186a47ce8230600464ecd7409233f4215a8b3a0953e3a39ee9a6f24a878b08f4f670406a314eb3b81876b28dcc406660810c70d72fd0426e7e4e31d0e1957b114304ec3a23013a34601fd8e8aa14cc0bfb436f098190d1a0298fbc64af691b0833200aa9a64e8c2a02883db5434ff69dde13ccb480c3825eda847325077a499d993d8296f52a3e03c8493dca6bb69256c5c0065e062b9329ac8de3e74ca0bdf5636d2cd81a2c9dfaa78de5878105f5c2780110ad044966cb36db06997f8cc782b181e219a7e37903e7fa1a6b176c50d4efabfac2ea0cd0579d52a7af9f8770cee1eba95ecdc344ae9a19c80c2c120376872f92a96ce6dc61a08e8494349c8280eb1554107058ba8937017d206484b4a32483ce534e9e7a8376277ddbc6067b7eaa066027979dab0853e417180ba2059464092f316bd613ec1bb723857d0b72a492771ae8510cf4c967abdbd7352331630694fdb3d1539bba913efb6a45f2969eafb4364ed1c41402a9c49df949193e20940000100049444154ba39d1a67c5f32a6462f0dfa1ce45f4e36f5e1ca2a269b96181e61060fc35bc92d33039981c560e0e4156b312c661bab9a017be5de0d843d5fa47114512a839462083bbaca7b55debe957b89b0ae58ca052f4799d5a953b9574da0b5e061ba82805ea847f50a7d4bb53aeaf15dbeee0742af4858983fc4e1e9dbe343c49780152550e024fbd3ef0652e981c3be8d53924e87bf4520e96ac90359863c7a143cac78d9d864f93e7ca4844179cbd35f2a43baa4171c58f9dca5d9c39c06e87b90ecb8c103942a0c0264240047eb4ccd8187f48eef8c21a6b2469f7ec92739f3277564ad1a256ecb1e6a029c0d8d58a88ea56b2ce6dfcc406660391998bebb97d38bdcf78a61a0d5b2259e151e8f22983a090691efe9750ac416b00b85a65a0a48221759d6230d12489324308a60aa1478bc28210044bea95bdd9aab6f10c4640a719c245f3a6f0151165c41c0b7e8a8df3f2d9047fbd36e16d8802545f7fde2e4576a9f148d1761467be1b1d28193492efe8ff5673d0f30b30787af16d4959c4e19a548afb91f69fccc8bf533c50d5c183742ca3a99bbb933d53c89b53355cafacc406660e91958bad56ae97dcf3d2c0103adc9687fab98edb95d1a05e1a4042d76e56d550e3985b602c13d050d673b480b4b041e7c0a2cf103907d99d329103c030179de9236be694d80a675d37dbf3ffc27d06b80bef6947c5f6ffef693490487b114f482704f5387e9adcf48795f19fbe39daf6c9ad33875d0c898de6c3469cdd007d2a742c47b4f5c76c024f9a9334ca59a04f9beef4d7efad7381c1665b4bfc3d073d3d6722a339019582e06fc72759cfb5da10cb45a842b5f4482a5bd120f299098af811f40f076aad05612e9e6556f504cc1420a1604d53f2c98f69303e1351d08073af577faf39766019f0452ff485eef9b76269a8bbcf99da99f4e3765d1493381b5a68a8dc9b6f826adaf468bd756a3198fb533f57ce4a0aeb51b0e38cc4c9cdab6f149e6abf96c201dfb32e96964944dbfa54031cfd3c1b58b9173e1239967d7b97a662033701a069a95ec340559b53619986481aebc2faa7e40aff9be1c7d8fe0d553a1719571422d9d50e98ea11b975c4f81c810882d21050c9de1b0e037b3c8c9f1fddb4281859f619002137d3b7bc020b860b0e900639e8709074c364afb9d79b90799cfa69d09d3d9380ccddb8781df260d228406c61e44d75af8613e4dc37c36881e6622929f8d41b98d71ca023c58fa64bfa294e626e8e4c3918d8c6738d098d373a5d8bf0f47329f9981ccc0b23270eabdbfaceee4ce979b815816c42957c618932b768114242d687a74f607dc9c02afb895424caa34f563b50d2808a6fc122cecb7a92fda59ce40272616095116b0ceb8dbecfba2c1e1f0040cb2b2a70a4633c8a7ec20931cb540481fc97f4b4b49ade963909f964dd94be59b32b367b0fa6796c9dd1494a93790240763760472c7834de3d8c00e15669c366f569e66688a93647946adf924bd5d076e0675ca47662033b07c0ca47b7bf9bacf3daf34065a3da90cde956c555b9553abf24affaa685daa0805f1a02585d184103b52fa436e4e510d84349dd2e1f93d4d709911905c142dc250a073290559443a43fa4d3fd86d82ddac80352bab93a2776ac9184d9aad3e66fa4b91f96c231bc0f1a0639f12e62b259cecc31390cdc6e964532fe0576c78a23f259f02de48e68f523e4a890fd31bf03005eed983a69a9da94c78d0cc5dc4fa7c602612acab94c83f9981ccc07232c01dbf9cdde7be5728034480a81424081464fa9b300b392501a050edec5b7b87f031b884bc9c050883ecf0b469567a0b17c28ea8dd408a66d4aa897e925c8c1fff12465eaa4cb6d39405c6e62180fcc0d26cf7d2f8b095a49a366a0eb429315f991a59e796388d347b7e8aa7c62118a4763f9db88d8a49daa704e39d56f81879212ea44b55edc7ca02e3657ed0cf1829f6e67f0637ff36b945662033b0340c70d72f8de16c757532709c0d788ff7eac164ac64ff8468ed02013c88cdba2ae7d2df21effa0259c8fe0a9a2330183c720a046f0b22ce7e484755a2899c73727c8def756bc93b3547440c03c939fca8a2ca5647ae2ca41eaf187c7359a7cf0666561c0349f2a4139f9520829c9a004d5dd70746a5aaa6d0cbd11709059e4602e388c1c939af61ff73b40cc102acd2e19c93f9ec1c76fbfd9b1fa9901f0f4e775255b834a3c86a02de9e78d7c6a69b51463244b5ca92c4e0a42ebe689e88d40fd6b1351f98ca32339019583606f2adb86cd4afcc8e5d652f7d1d618630d521aa5b307612b16bca615bc3a39a804011cbba409008fc4e414e955c3459abea4da828a35aad82583ba9e89deabaa6414b65d15124b8d350a2d53070455b18530f9375e5a492bcc7b77e50c711caed0cfc00a2dfccb1a09c3e29f3e49cc93e545568d0d2145254d5247c21578ec8fab2ecb0e03904136db98207231e0c6afa14b603893a90719ebe195322dc2566054fd1a133a9029d0725a01c75a04d34c496a22bd5eb06b8efa8a6b3124e3c830bb156ddeb4a48b212ad4f06639c938ea6ad7670ad0ece92ce67662033b0ac0cd88ab1ac0ee4ce5722033ef67a15c1202ad49e759f059ea8e5aa206712f8a9745731f46680a0ddcf2b74e51d65755793dd4975bb519ea0e208c2861e5b7eef09687e446e485415c1d57768df5624c8495cd2f415ea8aa0eb2037f481983a4d473dab3ba5eb27a21a2d32696c27db1a910a7b4828d58b5ebde012c62bc75b8b72680402eeb1899ebad8abb05b13a0cbd6a81c0f3a8107a69a1db6831ff5e1d96dcf84331efb634ff50a1ec08073c6073e237d39cadc78d99b80baeea9e49b42a7cd7078f8b2790bb147f970a87883737862a23ada9be4712ab1957f320399816564c056b565ec3e77bdd218188b3f75db3ae3c5865657637e42a3ad4a23ad800c1a6957eab46a8d9615e8822a9559f908bb7093162c3aed20039b378d8c7a95b4ef749cb66ddb4860af74629c2036299d98a835391917848a078e2a94d8ad55052ee7915129bd1a0f8ae90f8f89234804b02968c6e166a407c9d84f106465afdb6dfb3fd923ae8ea81c5d27d75ea79a201fdb1d857204b4c170b2ecac577b74a302c1fac523e33a6adcd4ecb663a93a141aef46c6368d895e931e474ec01dd535de73206a024e0de33d698276dd4906879d23878fe9bcf3ce53bbc50348efb8142655da1c32276de6a6cd73c030b0eb61cfd656b9ad385ef4199b93c89532039981a561801570690c67ab4bc7c06577ffcdf7de74c7cffebb3bdf78fb5fdc75e0d6fbee3a70cb90b8f9be3b6f7edd7d771eb8f1bedb0fdefe17f71cb8fe93afdf72e45ffcec4d17f8f7bde93afdc2bdafd73bdff45abde34dd7eb6d6f7e03b8416f37f99637e8deb75caf7bdf7c83defaa65bc0ad5378f39b6fd59bdf7cdb34de7487eebeeb76dd7dcf1dbae1861bf4c4134fead39ff99cfefccfff529ffad417f4277ff6197de24f87c79f7cf253faa33ffe33fdf1273ea5af3ff4b0aa632744b4926f11a52c88ab1fcc4dce9a92c85e9ccdb1d2c69ed87792a44c76f06d5eb63befacd3ee7d17e9e2cbafd445575ea9fd975fa18b5f750df9ab74f11557ebe2cb8790975fa34bafb856bb2fb84c4727a407befcb0fee4939fd57ffec46712fee88f3fad4f9237fcc99f7e5633613a83d54f80c33f31fcd9a7f5894f7e8676e04fefd3c7ffff7fa207bef465bdfe0dafd5dbeebd27e12d6fb95d6fbee756dd7df701e6eda0dec29c0d8377dc7393eebdfe027fc3eef1bff39e03afbfefad37df72df9b6fb99e6bf1b5f7dd76eb8df71dbcf596fbeebce5e07df71c3878df9b6fbc05fdcdf71d3cf87a7003e95befbbe7c6db28bbf1be37d3f6cd5c876fbbf9b5f7dd7bf3abef7b1be97b6ebef9be03b7bee9cfafbbeb97fe479b86a5c2ebee7cf7fb6f3f78eb7fb8e3d6377efa8e5b0fdc7727b8e3961befbbeb167c9c0dee93bb126ea61c0c7ddfdd72df3db7180e34766ec1d61961bebc14683bac1fd6a78d67f638e791bfc76c24dcc25c1b0e32a65b98d303f7bd09bfeeb8e5cefb6ebbe58e947e2b73fab60307ee3b70f0edff62ef7b7e9327efa59ad5b56bd7afdda1afde91af7387deb02dfcf4ad3beb276fdf1d7e7470777cfce09ef0f8bce59ef8d8c10bf564c2eeeae9dbb7879fdcb5a33cfeba8b778c68dfae75dab57d832ebc60872eb870bb2ed88704fbf66dd3fe0bced385fb360393e7691f752edcb73dc9fd7b77a4361752ef42ea5fb06f97f65f74be2ebdf462eddfbf5fcfbf78583ff8c163fae1a34feab1c77fac1f3dfe8c1e7b62783cf9d4b37aeae967f4e4533fd173cf1f5265bbeb50abe6957b95be7f07297d28b6028338bc64bb6f5291406e41dd4076d649bdba56acb1c16e7f64fd068d6dd9a6d1cde7a9b379ab3a5bce537bdb76b5cfdb31a4dca9d6d6dd1addb04de35da71ffce8c7fac1234fe9873ffa899e78faf984d9dccce6ebf1c79fd58fe0cfe4e34ffc448fc3e7138fff049de1693dfdd4337aeaa91f6bcf9e5dda733e73b897f9bb70a72eba64b72ebde47ce670bbf6337fc3e092bde7e9ca8bb6ea82f5dd4bb785670fee9cfcf1c13ddd270eeea99e3cb8a77efae0f9e1e983bbeb270fee02e787a70e5e807e1fb8a0fad1c1bdf58f0e9e1f8195810bea270eeead1aec21bd2bfcf8e0f6f0dced1bc29177685ec7fc2a6f0dcf1fd8159ebc6717feed36e043f29bf49ec058fad85b3fc53df6e4c1bd8c6b4fb0f159deca1f47ff38faf9c93dd5e3f0f2043c3d7e7037f7ee9efa4cf249caadbf9790c3defff4b927b57d02ff9f601cf393c6c9f9f0723ef3bc07983c1fbe0c7bc26307f730bf3b19db2ee67377c2e30777f59e3cb8b57af6e7db2f1e6fcf6fa672edb930c08a35976ab9ce4a62605d776274f3e48bed4ddd17ddba785c23f1984604e629c7c2098df68ea8d305d5385f5c6bdf290b8d8e8ef17a799457cb63ea966d55454735bbd45038c582a058d42a5ca5c27713bc9f404ec8a4f79348c0b773e77bbcb13ec1abe349bee156e915b8f7a59c6fc963338436fa0520b678cd1c150397712ce55dc96be511c9156caa4bb546daa4f1d776e769b7aed31e16d40d16d409dd565b22d027306ed7c68e7d9b36599692edfed9b947c622d7a2ee02d01e934636c89563aa453fe5a86a5ebff7ea42864a2d190263adfb08a1056f803137fa52c1d2c62775521a19eb529181d91fb2735e6af162bc55069545a51ef33e317e08cef894c05cf92190e637f4f0b392abbb6ac549aec309ad73931a75e32aeaa3e88eab138e6b048c19ea631a0dc734168e247de17860724e9cf852abe4bae28a83892ea87c19ba10a4253b0aecb7ea8956bb9e7048b5e284da6102df26d5a97bf8dd9d46246d6364cc23a16af4f104633e764674e2519d11f0d1e1f3c74b6124f569fd9e09f41f8f35fdcf578ab601bb06eb67be12ae3a3536aa136a2313c251f83ba4767c516538ccd57b542d771c5e8f81e32a352ea7b84edab26473ba960dfbb53cf8d53af6b2ae58f2bb6042058b0f8b923c0bccfc65a58ef72cbc957cef98d43baeaa3bae49be194f565181805547a73a92460610839342245018588c632d07226864a07c1ae90f61f190e069d6ed4da82ccb86f6586097a42f24832328ce57ba52adce889c270454815d7994f75cd2cea966775e4d4ecadca503eb0834a78f8d9ccb6fd5ed4ad48f3128d6910794ca862f39af20a7607248980de177c0d76e0882663923cb2ff40000100049444154fb836e2c7b41850ad2628c0338d2f124b414e9dbb90249f08643475b0da42fd4e36d45bbd352557515b846eccd4588954a785a37d6616cd50250cb8ea2706a17784c50a02315d86fa9ab8285bed4a4f0025d8f051e50d6c60f1f7b492ff28e6b6770fd087f1de505c1a520d8890705eb63c9105d81ebce7c2ef1a34dff25be95e603be79cb13c03d81bc0c3d995f25be4d833191f7d437dd6c5960b385bd334a781af4753ae918bf67ee4e2beb093938f2f5240f543dcd573a1e580aec1bdc1032b581a3c4978d91b92ee1a945da742dae8716e936ba740da89649875cb2f95ce386fd1a1fffaa1c7ee5c4de58ae62518ef2f2bc3ef611e53c65e4f69a0c650adc6d766d234557911bd0826224e00a7b0537acc129c8d18743e7ac0dfd86935050a390e4a43e5c140bb953acb89109886de724163ee71c75a3ac1fa523480ea09dafc4acec4f70174591ec5970548872ce91e7e1019f65107d1bf05f1cfd702cf371001f3535221ca556e001c44b2ccace3939e754ba32f16d6b52017fa98db51b02b2f102cf038f39e23dbcf4ba2a0990e6dfa0dca4fdbfe50d329e80957b55f85b03244f03bef1188b85225ab2c9e7142c19a4f1ed9cc35c54810c3cb849e4878453218f1d6f0f230416f146c6972de82fc4b65d23a567fe833c1e05baa9a9ab58e25ba9901e424490af648b7f611329293aaf883f962f09a65e01edd29d465b9073d0937cb56bbd60be67f61818814b5ed5724cbc83779b8bc09852bd744d9199afc49a8fc27a3823ec7fc47c46d0bea065c13c1443492f46be20d8f8a3e397372be26d0b294ecf3ad2918b6db56a899742722a95e63fcd67459d7c2e05037e298c669b4bcb40643f51a785cffa4977932580a511dc3ef6ab9795dc78dc68115b8305cba71b4e4a37a9942c3874b6e035b03e6642fdc32ea569f828029f639931c99249dee9e4239c941de4e62bcd4863d9fcb39cc1fa37293c088ccf6403b4f8c22ffea1216d750da65b1610a0a7fa4d83882c864ad0198f4809486d079ca1b2194b81657a0e8333fd2cc4d32967d5994336f1860f9e2027ae13c1b7cc0789df00c751a6b7ee12083ee2613150cfbcb62bc682f7e0ba1b5c78e99a4b3669be8467c41ff3c5ba703c543845fcb651045329a66b2725990fd3011751f04685715b4da516e270c0ceb94aab3b13c3a6e7dadfec7ac3f637bb1d9c4ca9fa69e618f2784812bc89001f65ac89636aae49e7737119b0fb69712d666b4bce40600f442783fb83643e3303e728033302ead28c3045e77c2f2d0db9d9ea59662007f4b34cf86274c76b327b0cce8bd06290996dac6006bc6dea97f6fd6c645bbe8219584cd75690adbc762dd164e480be44c42ea5d9187de08e8861f0066d293bcbb63303cbcac0ac0fda8bec4b7e385e6442e7668ee56b6e1573adf9319003fafcf85a11b59d0b918528df142b6236b2134bc540b407d6257ee51e5cb4fbc8b054c3582376e735ccccf7bce89a7be51cd0e7ced50aaa99befbad207fb22b9981d5c90077927dbe5a9dceaf02af637a5e3ac5d1ccf929942c8e2207f4c5e1315bc90c64068662e0a5d7f6b44b1fcaeedc1a2db5fdb979916bbd1c03b97c6e0ce4803e379e56642d5ebbaf48bfb2539981f93170ea1bd841a08d7c5d9a9fadf9d58ede731bd9bbfdf9b5cbb5e7c680fdbf0f4e53f3d4093f4da5ac9a3f0339a0cf9fb315d3e20cafb3568c7fd991ccc0c219e0a5f8c28d9cd1029fd02d9a1bce5827170ccfc019d6a815c6f7f0e35b692d73405f693332077fd2536ffa9f5acca172ae921958c50cb07d5e5aef63ffffc2b3b4bd64eb27339003fac97c2c5a2e07f445a3f2ec19e2a9b77f43bcf4f7c7b3e751ee2933b0c80c1067a3589ee2d4ff866d913b68cc395eb993eadf4fa4f2b9e40cf090c6c42e79372ba683b3e94826f66cb29dfbca0c6406e6c580735ad2358a8763b39f03baceea619c9fd50ed74a6799d8d539d3ac734bbb73599db464afcf3506a2542ce59808e86e29ed67db9981a565e064eb39a09fccc7aac8356f095785abd9c9ccc04218b0606b58888ddc3633b06618c8017d154e758ccdeedcfed9d455e87e763933d067c0fedd2d60ef9bfa1afbd7cefac9b3229c9bfe53f4f657e5ecd68af43cf8df2abb18c83567745e094d36fd5a69485f054e5e4aa7ada66a27fd58d94c9c54b88a32360629a47f4d4d91f1c722f1131883cda38b24383d75bc6a5eb5d40a3c9e85c41705f95c7406988545b5998d9d050622f13c0696a2b3d057ee2233b0540c5800ad7cc952df566091b720e0557175dbc26f61a0e08d78b4f8b0542ea8f4eab958d791609d7a464694742cd9df2401e649c4ab0182232aa117474dfde05bc2802203f2d44b812c446cdbd7024f902b1264638c92953332954a1ad3ae4a3074797870ce31ea764244e99c53e1ea343e1bab0f412d3781aeab0047b11c533e968601bf3466b3d5a564c056381f9b1eec866952f93733b03a198804051908eb4a906a8282054b465483253b5bb1eeb55c08b613b7201e634d608eb8c35d167ab260247ba608514db9951928a76e4d9d10bb8aea49b1520cb85b7555872aa142572704d531029341662b04d2aaa77435fdac2a98ff8c2dc003495550d2f85fa94a63a9245730a38ef1da382bf5e0a73779222a1f4bc2c0ea0ae84b42c1ea33ca43ae5b7d5e678f33032733600fa30501c1e0096c62e90fecf066822de092ae51be77a2289d784f20150421db359b3fa50f2a08d32541d8e09dc81b022e196a76a095468b5a23be52a7aca75096412df425c61c0f2a3c2d281451751955154e35a81895c980e1c0467e75a2198b8d83271f3938b3f146761b9171d545a113554f13f20aed11b97647ad4ea975ad5ed8d3390203cac7223390495d6442cf96b9e09a9e625f36b9fc9b19584d0c84e42cfbb724073f76497b767dad38eec6c2a10db7dc79ef3baebee783efb8f42dbff98e0bdef2db09967ee53d7f0bfdaf9c846beefad5b71baebee764fd54fe4ef4e09abb7ff9de9b6f7bfbdbf76d1b79c5a517ed6e5d76e91e5d7ee9f9baec15e7eb9517efd5e5afd8ab2b2ebb40975fb6b70179d3bdd2f229bd2fe92fba70872eddbf5397ecdba18bf7edd445171a76eb226c5c72e93ebdfe86d7e80d37bc5eafbbf10d7add0dd7ebb5373678f54dd7eb35fdb4e9572718d70d37a671bdeec6d7324e70e3ebf57ac66a637bcd8d37e8c65b6fd1eb6fbe4997bfe6757ae5d5d7e8d5afbd5637bfeecae2159b8fbcfdb67bdfff8eebee79ff49f377f599e6edb4fa0fbfe34aae8157def31bef78e53dbff98e4beff9ed775cf2e67ff0e69df7fec38b06d7d25a9339a04fcff82a4ae530be8a262bbb7a0606a2edc6d9bdd5bc96add9ff5a5eecd20b5e618f86a3da5c3dab5dddc777ec1bffeec72f3bf1e0c7af38fe858f5f77ec731f7fcdb1cf7cfcbaa39f26fdd98f5f79ec2be813fee315c7bff21f2e1ffff27f3490b6bc61509e24651f4f38f1d5ff7051efbbffe18dd7ecbce1d603af72771cbc5677dc761d788d0ede7aad6ebbf5ba845b0f5e27c3207fdbadafd16d7dddada4df72d7cdbae74ec301dd7d17b8f316dd7df71bf5a637ddaeb7bcf56e7de8573fa80f7ef803fae0af7e481ff8f02feb837fe357f44b263ffcabc85f4167fad50af3dff021fd32e3fbe55f63acc80ffe1aba0118e7affced5fd7affd9ddfd0dffcaddfd287ffeedfd1077ff19ddad47dea7fef3cf5c0c72f3bfe8d342fccd7bce595c7eefff8d5c73ffdf16b8f7feae3578edff7f1cb26bef0f18b261ffa77e74ffee09d67b8e4ce79750ee8ab778a6d23b37abdcf9e67066633106d39f26a5ec5d7ea8449adab8f10d89fd379bd27b56bf247dadd7d143c46a07f4c3b7a8f6b7bef096def3e6570483f0396375819759f4e92f2812cb7d6cf14233ae6d68f7a6d182b12d68f3a8db6a5519360ac238d1846a246c06807d97132bda12c7bbc5eafd4e2b57b7acdceabf6c2d76ab5a33a23a534d65231d6566bdd88da03ac1f53b16e54c5fa0ed2d2ab1fda0049ebdb8c8971ad1b93678c7ec3a8c4f70c577ad57c7fa8bc974a259ecbe34f6a4ff122f39ae66e3027f393ccfd8e1ed741f548ba1e76554f684bf5e38d63e1f98db32fadb592f76b65a0cb3ecec577202ebec96c313370f618707cb36ef10dbd156abe5f5bbfcebe5aabe28b76cf75d4732df6ebb64445ca037bf81efbf940c00fd4b3bac01e6b5d905e028e6fbab3cb4de77872883d6cd651a15ba99aec2a54b5625d4b7550e8554dbe0a8ae86bf42721f478a140df261d6d184b8c3d05de3004c61464e5a0ee29d65dd594d5e82bead706ecc5ba4a6556beda5007c694fcafe0ab9b60e3a9838dc9d05551d6623ad56e97f2adb624a789c963ead4c7b4d14f30af152a387443407678391e047d8c48c9a69a5f2b5893f06b72d4ab7cd05cfaab7c04d9fdcc40b3ec3ac5b408135b132591b01d4520e7357c0096779414aa59fc0d550aeaa814adc01243c29a1745a1b2701201dc600121e97c8b7e0a796ff048afd235b2e84befbd4420b20703e79c5c41b9d9720edf8288f6227e49de8926b27af607c6ec61a2d145593e52be1ae11ce30236863489368e3450af000f365e415120807727c615ec8fc213d4a3a4b136bbf6c9e3822972673e9d6bfa70ee5429eb4f5e66cf61c2f3f8e740497aad9ed0bd5687be7ac7eded91f764f7732e33b02a1970c196e281ebb6240f607f37bd5424403856ec826050b2032ed9e5da1f987342d96fd60f9d2ce529849e5656b4afd9c589206cf57bb63beeb7b75db7255bad9606e98a9db43d3004da441286dac24f24080f10f09d878e204f09018a9dbca8ebad0ffa738e72eaca0600226917b142da03eb73d5c331fa383d8ae89af96b34305d4fc8fba0364f4a16e07bbce9283a631aef51c64313ef3e64f342eeb4f366656784980ba3d8599fbc59e1ad87b83ed28343e3c09afbf56b6ec4e7c2806d953917c691c790193006088216df0c294b808c84c8a88245deb36cb36a5360e506927d9d2d5f81dac3c1617dea1180c064764f874099a1a96b35a2fdf4e11409dcc1824a1fc2a369f4ab251107b11d19d8d41a52c1aafc2146338681eb5e8983a9b10731484955823dc850237155f11054391e9e5cb39736fd30c0b042ff1a512c847153250f52620dfed81db106877d0e0c393af109f2ec0c24f79219582206b88ca72cbb48180422980796e59a0059b3f8d72cfc21a5bdea942e54ab0d9a80e0480d03acd11301c7550a09b582072e90ef83bc1465883898c08e53d417f5a2b32296d1388d88af4a05e8e841a94c964a01d099b9f4a3740c02e36a93c9791b0b08f01099b3c1189ab28098860dd972356f302a027a606ea9002f7128585f8aa5a27da2e17a8840d1bed31bef6679ed61ed8e7c35cfb57d3be2065acd43c8be670602012012fce2d4b51c58d80df11472ac8e4f6aca931441f7946a432a662c8329f8929f92ecfcf02ab2131432c1caf05d4817a86b69bddce1e5c3d440251bd0cb3559e9e5fd79486ec2854987ce29c8a4e5c5fccaf8a1dce6cf8b0a1404f441168c1db9614fb31552e394c2549249b3367fec6a5c9b235fc5a3768e8f71f81fb98011abfdccfeaf61066a16768345005bec1dbbed22760901b50a5e41792e754f80b06fe88ed7b7f6a7e20bf508af5dcaabc45c24370c023bbb38d8d5c51129760837ad04c51679033b3e767dce1046e4421bb41264af79930741281a48721655d43f086432a4df7779af0000100049444154870146c278c5e892cef45677b5c2866863b0f190768c8311ca336f464260272e82b6e059ce5123c831978e3926235bbf026d23da61909e8f5c4f72930abeabda075505f05ab3c71a1efa9a9df33cf0ccc08a60606a414f410e975cc5f25eb1bcd7a0925c0d78f52d0e176441428a124141498a540a214349b384b1973807cbe3409e5cd5425413a0420a623e0afff1936a0ecc3e03a58a1ecfb197c68c9c5d6935e76d8e2c98f31066c388cc62e0d5bad21fe26dc6ea7828f3a08815d3d97015e0651818df45df96a5adcf64a7e9cab26b0e6b78e86b6eaed7e680f3a857340316d41b07435ae01dbb374f7816c121505013196b56a99a6fe735df5c7bbed0205da7a0a821c341b070430f95e4ba53700408c71b00a59d9fe99b72af2efd182aa4a146f640e44d41c496a14606390b6a846d17357d10c89b0c8349ad1a291b83a364358271a88fe818433a6b7e0310f3e4d5f32d7541cdfc99d2ab86af5e03d29eb91e16d66549772d2e90924f1f455daa082d9555dbba5a93b0ab6a4d0e7c350f3a46e7ec759361f1c6115888cc5a7349386e10a59bd5742f07779a0a8d1d452bb334985ad4acfa60b50b96190a4ed8b055d3d5f86efd08493fb20369fd192c2bebc760192b330930a193cad0ad9ab319f394bb53639dd228d14f762045c8d169ea69e8c3b864497601ee03560c62c7dae865fdc98e462f19e1912b2ba4fa4df00b32ff0c9698baae934db335dd2ab576666f91401f8da5d008590ffd644a9b7e165c4cbe4fd53ac99f98c606231407a5e1f7837644da180db263aa6fcbac4298fffdb1430973ce1806d7561a24d780a90cd40b8cdfea957d5a502ff8f4f46730bbd6db60a7be60c3abd48071b04a5d5fd36ebbc00d62bb1763c12ee661200299fd751c43c49e6cf5e10651faee55b068796ed201445a5387d537c8da4869e98b497a3280654dc94e49de40f8e58656b21f657dca7167d3c6d170184881debba04abeb9c1374deb832775cf7750bbd9bded985c4f69d7656553104700381001f664c290fcf7940d40329d567f0a49b39c3f0d6fe6a33bc90dbb3e4c61433188f10c74a6b7fc6220c0b1980119711e8e8d43d95130272d121e50ea0c31d574d471d44fbbb5b42326a0f31dbc766d55be4d49495bc9bea1179417f677b769a3042f1bb395b598579f74a98be17ea2a73f2f45bb46017ea8efa5491f957cd1cc830b3f522f808ab7068698da0c2a8594a05a92724e816bbf76429a2ac831aee6afa90405e64653b07243e0671ac14909d4b3fa035069794f5749c078926d02ec1ee49af0a154590b6f6b39eebd74bf4b72754b45dd91a823ababe18f48d31eaff3aba2a08fc83c992f3ddef0074ad6e6c995bc3607be9a47eda2732e2afd0fa7163c0e67177fc4cc4072135a5696479d24693a4c2b29cb1f772305566906cc8e81fab12f459a8ab285c864caa73272495a7bd20b3a63e3164b87589ccf6c8a310838ab613f834b3f9ae26458f1c99a5373ee34ed4eadb5ac1a462b259e75d2612337f70d7e41c3304b7da47ee811a39c92cd85e1a49e2d431d13cc05618e45382688f98b04c8012c6fbe153c6859bdd4843a03e9f0bbd9dd379a617ea3b3567dffa76c9beea530b3fe743a10b0ad95675c32e72c936075a4a63c7598b468a4c499863c1abb9ab3df4376f332cd9a401d94968554b7246df0c933cf834b334fd4b1f2744de07b92a65808b8321cdd81c64a90a33f7b446af26bef1766d7dea057fb880b45574419184a24371ca498da4b01199402314fdbe2a610afb165e9246bca79fa4d7aeada42341beadb1ad4e7a95c964e6d689bd2b4edf785414ecb0fe77b4c8ba65dbeb0c19b8000644b4874e2ae4e30eb81ac21e9ac9c7c4a4fc97ec299c49e09aba7012b7d89deec4c012396a6dad29d8b65d9e60ade2d4026da4eb19b98423b8ca4d93c4e9b1ec3199bcc5ae8d35505f7d62681b989701f09a08633da99734133e6084709b4b37e109c5101c266a27f355066ed109c16b03c6f0b48a693261aa0a91f7968099445d03f678db3af3d8de09a64cc367786d354587655607e9892c60f78541f366283f19a744d8da9df699ea7548b919841f262985b5d36ec6a595d1e676fa5e87c19bcf3dc2d6e0177454841cc993958b54ba141b01b14cd4b9eb6200d404537e336720a6a6c2407299d79367d88b691457966c97cd3d6652490477676d6d6168ee84c5b91add53c5004240b338b62e88fcb16685b609a3c7baae487f9258e46d28af42a3d6d4155b011cb828d5162103a2932a890cad4af8762f1cf647b60b6e134e598f724d3cf0c7df22d297171a037c9a4599b0152e4403f9527dd6f368c68ae019b6d603e1b1247710ee6828cdf5411822de0225256278da75131922671d2efc2fc3fa99f93ec9e9d8c2d3f06196f330768e9a40b538ec494c763ca527aaa64b1130be574b1fd397bf6d6eec8cf1ec78bdf93937704f4c21635d9c11d9216ba794a6b1fdb52fa9ed542160a044819ecfb562a379b9e4e788d36a56f71ff02ea7890da13541d696777375220a033a964a74836cc7eb4bf973ae87318bf67b489a483bc6c8130c875255fcbfe5e6af45dbaee4d95996b81b70ea60f7cef8dbc35b0053dd2de6c34101ce0ea194fe3c270c60a67b5c0c6641874ea23c3370c144906316172e8357dcc4859c1309861622a495f53e93324b81e229c5b8f67a82151a72933ae1dc901c84f9529cd95cde130c0a8e4c234641e1924e334a627e619e5d40d8e87c33ec4610faf09d68c7254d367ca37edad8eede20d341797ad0607231a246748d31a66a8487a463c0d14d6ef7281eeed1c70df7089c6a60a3f8d4372521ab04e3a9a36707392763132a772b61856578b8db53dfad5324bb3fc8ca1289838e759d81c98553cef6c63038b2cb283c676331aecc64b3acb18accea0cf243daf13538dfe8fd9e927a784576a6a3fd6c6d0b7134c4ed51b2661fd79960f6b3bfbcd4034651f56af59a84d11d3623b333f9db6f273014e31c58d66e4fd11f5c73d35afa7596cfb35e720e6bb20a795be6fd7d206b27d9fd49f4534cd99ae134b9e34025380d3e950cfeb8c336acf4ca39ef289f419cfa68d3d440daad8252e586fa4c414249c96e6a9f1516f959e83ebc8c69bd236a506c633787b31187b239b6bc6ea1b7ba90d7517f374aee969316dae165b8b7157ac96b19e337e468260904f4b8edd1876530c83694202c9d9887d9ded4828b37b04d80e63103ea9c049595a884dd68aec7a233b64210d21c98a7ad861e5b3b6cebeab5b9b34026918df531b9935af881cf020d20928dc00a1900bbc5100a98c3a81b707c139292daaa7de065e21d59a9251273db8c4935ed333bc1573e228beb846909a75a6f1ced22d200bc530751a03b354c1490d1c1218bbe866559b77d6668ecb2acdcd7ce54b75e682e79af192f135132fd128d898805d8f42a6b653f503611ec429c569130d47d2409e52c9da2704357f4afe941a6755619b8a34ce0147b37a9f9e9398e668667148f7d04ccdc2d346cdc2adac5e0b5cb1abd7f9b5ea79cddbef8a99b3ffb146747d16ec86b2e47ce55470ad650158bc9296026982703fe02a1de892de6e19d2566698d2a1b7bcc174030cf2499a4d83b5af3578824fe6e7ebf7a0be354eb6435a30d202430037d9a0440f425b1eb850cab1587ba495bb28991f492ab00c37e02941890774d352b2058a82744e719f722be92736ce0c1cec73155940230f31818799c8480d8130633a0d25b908b584870b7de30319c993b66b3481749a1fd4439c36e7d3cd1cc969182706bd0c2f91260144ab97609fad9ac740c171039d7ac45355ab51631cda55d07f4453ba6fec0f08323ebb579abfa52015e4d3f8fab22f922aff2c1e0336178b672d5b3a2b0cf44aaf13ccdc04774960d1f02cd843c1bc0d95bceb29d493b2605e9685babd09a57fbbd9494a8baabdca36282d9fb680e9650e5be80c45e1d4eb75e5d8a917dcfd55d595e74e2ff93e39b5ec2dc0ff02bbf420c54a157efb91755217e7ec8987c02efbfbc50472a53f2b405027ef41013cdff13d01ce63234191860602451a37d940baae85d39651802fe722e371892394cb7ae25d7f4e780332f0798647ceb926e70a4550c92938af1e9cd7f67fefb2ff35277a9d01515eb331a81b2833f8b2a5105daa57d751455108856ae6bae95ce941c8c7416e0eb23f965857f24ee2b234cf65f35cf8a876cb73cd76d1c597450c75aa637644b0499e623330b7de7bd501fbad8e7c31631ce8a2bc06633d93b43ad1174a0fd7453bf15ac1adf38d2d3a96e8c7faf52923d9bd25f892d957904e02d9992703efc281d589b196da05a548ae43d3bd2cb856b584f08a04ebc848a24ee9471cb595892227518bea722126269c73e8167a329ba1b1912825e99953c49a3cfd9a1cf52a1f7451bfd075e5e1aa1839a15e785ebdfa4555f530f205397f44add6b822417d62a252a80fab3d526964ac66913aaee04e506620c84fa5a92fd31da76c9c7a2790279aba497f22e523f5bbd561f97252aeb0f6c791c7594027786838a62a1ec2f717c0f0fe777b2fb05e1e65313eacb235214d1e112b8c54ba66966b5bfc7a52554975174cb20692af7b7253ba1e7a5001f44d3dab0b2c0a056c5870626136abce16a4289627d7f4b1e27ea7fd8a7859b37c0664858c2a153cc186e015413738f8773a93b4c05f057fdaf2aa9626bb3df58c4738282c90236b38b7a0559625393b83fd9c1904c0a6d08bd5be81ec086ab5f197e07562fc08fd8c33824a1393c7347ee210152a29f60890cc1b731449eb0cd211c867965bdefaaaeaa85eed34d98bea62cec65ac74203747928b4f253a54b9c186f8649a249178e6b47db04af5e8cf8c8e906f3010f2e50cb74602e27369ca33db00710c1ad48cbb845ad97037c18274b02f325dd2f3dee1f2e86a9bca54d07a1e99e439a1f69bc51c67de13c0f79f091740bfb817ad69b691b7534cd747e2da5b883d6d270cf8db19ee79f8ae78d3da34e71429bb7446ddc3a2ca4d688d42178afdb286ddc2c8dac3fa15a3f05cf81e755b48fca77804943e730793072244947be1880f254bf7d5c450b906f8d1c577bec9854bea8e09fd1864d93dab2551adb28addf449fa417e2ffa6f3b083dfebd8988f8d1e53f7d8934cf271302e758f4881be0d115d02f9883e9e900c81a01d587c122cd81b4c67e8ebab096ca16f1572ad96e43d4124d2ded3cf0a385d38c5095bd2a2f3ea55413d1e408af60873c964b73a0a454bb5efa8a71673b86e68149d31addfb809bb1d45228bf527824d2067907769f1b60d62e3606411570314e959c989074132b34e6be3b0337efc98c6465b5abf6e441bd677b469c308e9b6c6460a6ddcd856bb8c6ab5a2dae074b2d396da06ca077250afe44dd7c8d87a159d51b9d6a87c7b8cf43a9523ebe53bebe4c89b3c138af63a19ac7c50b71859a772743d6d4714cb52f285e4d41cb1193f236ef2a68f240d88d39d16c43dd79be0d5aaf3f42a2e3ec0bc9ee05aeeda75ceb5dd3d03c2a4b4a4e8df23833e06013edd4f9429d07f25d903b1f93a39a97a7242a5772a8b225d0ba71bf75c75219162b53d3f06c41a3e33034b30f93bdff7b175d7bee9c39f3878c73b1f3d78c7bb1ebdedf6773d7ac7edef7cf48e3bee056f4db8ed8e9fa56c80773e7a1b750d079107ef78c7a307ef7a6bc2cd07dffce81b6f7ffba3b7def51eeabfe95b3f7beff55f7acfc17d3ff30ffef69b8abff711ad032400001000494441545bd7ebeffee64dfa3bbf75937e03cc5f1ed0dfff6fefd0dffdfb77eab7ffc16dfacdbf7f403fff8b37eb8a6b366bef452d5d7af9065d70715b175c34d2c841fa22d395e8911797da8b7e2f75f65e3c427a04fd34f6eeef68effe96f6ec73bae2aa4d7ad7cfbd411ffe5bb7e0ef01fde6dfbb1ddf0f80e1fcff2f19fb6ffce6cdf87ebbfed66fdca65b6eb94ccffef47bfaebaf7f4edffbca67f5c387bfac1f7ee37e3df2d017f508d2d23ffcc617f4fd6f3ca0ef91ffde435fd6f71f347c553f7c103cf4553d827ce4c1af21bfa61f92ffe1830feaafbef94d3df2bdbf56f785e7a58909855e8f4d3cb01dc9125c3f7337492470e125ab979d8ed66dd8ac7d175fa2575c79b5aebce6d5bae2bad78146bef2aa6bf4caabafd52bafba4e2f252fbffad5bafc9aeb64f295569fbcc97d17bd429b366fe5e1cfa90af8c2225d0073ca8291c906f8da2466fd3af2068f9c3eedf5b261ef05bb74f73d77e8e7defd4ebde3de37e92d6fbd4bef7ae79bf58e77dca3b7bff54ebde7dd6fd77bdff576e4db4e2bdffdaeb7eae77ef65e0de47bdefdb6a97a66f3dad7bc56575efb1abdf2aa6bf58a575d93e4a5c6c5abaed56520f162f929581db8b23c3c1827af345e5e751dedaf06d7265c7af9ab74d1a5973320c61501a9614e7bd3e11cfc10d40781ddecc46e57cffff427fafeb7b936bff50d3df2ad87c1a9f2fb0f7e9d6bfcab60a9a4d99e816f7cb57fdf7c3dc9471ffaba12be89fce683fad1771ed6e38ffe40c70fbfa0ee040f21369845c7f07c2fba2b67d9e0da1df91212dd9da8cb4de1f13bb676bfb77fc7c477f7ef9af836f23bfb778e838987f7ef1e7f78ffde130f826ff4f1f0fe0b8f35d877fce1fd179cf8e6febdc7bf051ede7f49f7bbfb2fe9fdf5fe0b8f7f7bffce171fbce2bcc30fbdf6b20d3fd97ec9fe09b7f7a2099dbfff982eb8e884f65e7c6228b97df7216ddb7558bbf61ed7de4b2bedb9604265e749b9ce132a373cabd6bae71aac7f462dc3869fa83503a5e9d635656dd2ed75cfaa5cffac5a066bbbf905951bb131f6b48ab1a7b46dcf319d7fd124417e92207f3cf93cacff36fe6dbb8e6bcfde5afbf695dab2b9a723879fd4f1433f516ffc05c5fa5892bdf1e790cfa91a7f16f94c4275e205f54ef0caffc411e400d467d7d34bba267dfcd0f31a3f76181c5561774bab946fb5d522501a96f0329a93694f9cf4b6f3632764ee0d1a05f9a4199fe86ab20e1ab1d7219bb6489bc1864d721bcf93db945e8f481bd06d243d576975fb18ddbe432363eb643bc8aaff5a35ba424e051bc9a8c141484227101bf00a5ca739d2ce9c32c7eedc3182dee4096d3f6f9376ef3a4f3bb66fd1b66debb587f4ee5d9bb573c7469db7756c4ed876deba53ea6dd9ba9ea133f6cde789d75c09cec6d5e7c199dcb035e93590563e05da6eda2c97f8dcacc2ea004fbe5cbf517e744c820bb11b65d0a4a3a4005ee2b4e03f135475ce29edcc49a793bcfdd982a3470e69fcf0f33a91f0dc6965efc4e1fef5bd547270ef0c24fd8c735f19b88f1adf9ed7f89117b92f9fd3517c3d4eba2ca4919136c3314e108b761ad98b666cd519f2abcee355e0f016bda875d58bad0dd5b3da94f03cf2796da89fd3c6ea05ad0fc81a5dfd2ce967b511b9a97a8e3acf6933722365eb83953da7b1c99f6addf84fb4b9f78276b6c6fd263f5994d5b34edda7a50ae87996bd67556b38d9ea1c2238bd2095cfc1ecb352f1825c795865fbb8145f407fa48fa3c8d9388c0eb41ac4f28862eb28ed8fa2371c53ac9ec7ee21b982bc7b51ae65e9177813f922695ec30fe9774dbb083a9bbac9678517092047d5f295368c8ef0a5581a3f7a44beaae5ea1ad9035df9baa70238d3d515e96e82e79560423d419d2e6d0c95465b853aac3e9edda7b755192976e8816fc7815d9256d4c10e197f82e38733cacb972c9a0495567b144dc93523856ecd1b860ad412df8b1bd028a5e72083a71df5ac23e3837ea22f14e9876707624fa02fa9280a2475f93dd3e94fb39edbae545cd586a270f2bc85e8f64e48719257f83dec1f570c13cc4697b201aa7efaf4d2f181c13babdb945b9e49468bafc1617b007c4edf2b90ae25d14be26720adccd2060bbca92d63b4b49539d2ae50487906e7b0cba91987bd7948592b4b8933ff38e794f8e07a4dd2aabac8bc967231a824dd71953aae06a7caa29ee4fa9e004b25cdf64c8c43eb843c9fa90ca35038568afbc8f189d0a988b502654e9562e8291f8bcb805f5c73d9da8081920bb743e01861d7d201250b80e79ba59ca55ae44a593af852c17b600b080b813778d548836f8f28d0863558150b46374a130498bad392366d947c87bdd0b0c086dd5420d65dd5bd0945056c9a6bf82771d3859350b38834a86432928f2cea067bc59a504fb773ce498c4f2dfa62889428c61efdf4b8b17bf85e80e1fc772c9cf5f14304a8a32a8aa882be62cf89e1a80c235ad7daacb61b998536b3804e8005bbe59d5a4495f6149cdae80ca6c74939e62f864a0eafa184f114f27c1ff536a6a458393f165f1a6f7c123146553cd4d45c3b6204f22df912bef9d65b74b8b6b8ce425168be88b4116deb5e9dae03c1bd38ac3f082225544e8383b8230b408d446b89019f6403987d46aeadb2e5b113152bf88f9522df6a5320208d9226dd0671ee32f26020eadb75181803178fa2f74ad2c65594a441d95280af06856aca2c5da36bd2d47180bcecc1a9b07491da7ada8a7b1be715e464f362a819b3499c9ef3e99c9baecbbd2683f7725e2a088c65ec690ab3d21d1f7436d02a820c651934138107b1c0baa26a92efe5955a8e7205b5a10a568c99e9b1e5d48219e09258b08d6ce0340c142c460541dda45db8e2226ee0b9a50b00f511d0367067464729301965fa06b6e3712c0e45e1e40934d624ba42932cd45d9eda03b78452a341e3f948164aecd88ec17bafa2dd96a39f8a1da82da09132877e26ac5e83127fbc06652a7cca7beadb1a39532fec085f23108795958527c539b4ef36cea862a4255f9226a08bc0eb59e27c2ca5c0d858f862a0ccd2f890d27521178a549eeaa0773128aa0f4b0331770e7b66b38077c783941cb670d9c613a95313642cbb5210d4e734391464de160563251f1d6576f1c04f48e9c894d49488b13765d1da53e7743206aee2e864d2ca4d8a1e7c59c879f8a62d54ca3927ef7d92757fbec5415345c7b58f53964675da73503690939393781c55725d1636cfcc0be6d5b239b1f919582150a4e419a4e381cd393aa7dc39a7a9bc354a9d996fde72e2b2e121c5ae0897f2566cbe5b6620653c515c8b1fc615a8640f4d111202062a10840dcaac9d831f5147e9b07e424acdfef15c87b375290fc7ae3f974c1c9356492c0e3e3676dc19a45dbfe6d3d2c81a3f7844614e5c886afa8912f3e212a23a7c9e2a7d21a64b858b4858b1fa54ab7a210d6d317e30bd186656bd0dbfea47b02207b045e28637d76aee7743745cf82c269251ce6d4b3af07a9875862757aa93b7ffc39add98f6105006a70278168cc0ee90f758dcbf2c6edc082d27f9e0d55221a505c06e8c61203957c8b996b0c8028171cc94450b9d4be02e55027aeb8a61982b0df02f2d522c5449cf4ddddcc8cd8d2e6e5c0c37a7c35e51628b6cdf968d5d66745838fcb5a0816d5be49c73325ff995780d295eb11a22e9062c267016440d745626fab6fc000ca53fa4281b9e734ec63f6b125583d2c1ea64651ac8a45cce1f7c94c7018393f16ad750c12ed6f159c139c7880b89e012ac1ed766e4ed51e1442e5066da9796cd621c6532f566dc2bca614bcc7b24b8b40a2feb37d9c615abd2f0e945cd538043125af397eaa4852f054e013cb39cb7e82dc982a4e8a760371c7920ab63a120bb9e68693e0c03fab0be45307498917185745cb705d20293a71767e586411a69e32c8254e0b118bbd54bdcd0d6d225edcd76032fc705e3f1b1a0456ac398445d9b938488a20f6b3f806813691b1a22a9c4d9e7c439a79afed3830403088c272eadd4c9f64b45e6c0e62130ae98e095eaf4fda86a0f3d76c5447cad24cf3a5844553c58177ec40603863f3d0f50d08081201703524ad74a4aadbd1fbff6867cf6461c5cbf2fd70407aeb8be02e19a8b8fa2be3a72234ceb6c21e0baa7e2608a28236a9a49a7c8c229daf9b4782b1d21fd7239cf4f0e168a99b26fe165c57cdb58fd331a1dd2ff297bb4373259001b1579165e4892215066f3115868c4c22738344467bfb6082149f75b594b354748b59b746c04f59ac4caf8b57189853d02f50f5bdc0c9e913074357506d792a0a43fd2a8a96bc8ae3971cc5552f5a4d3fa3185f56b7226022c2638f57d694ac9e2756c32fc9a9fe619c9339cd6c28a4c2e14a26f295d0a08b38640d77860dc4961e079e2c9740d3f56c7602d1611695d7809bb4df49206d779920e2fcdfbe590367607855c5bc917cb8394369fd0c3201ac9c666a0b6d045bb17ed06d4c20eb7b0e6e7546b63fb9c1ad04a1f8c8b9241f9c80c64063203998169061629e5fb6f3016c9dcaa329303fa124d57b087d625b29dcd660632039981cc002f2a78e59e7998662007f4692e1637c51b74f1f24e6738ecb59de10cc5599d19c80c64063203f360e065dedecfc3d2eaad9a03fa12cd9df37c011f7cef5aa23eb2d9cc40662033b0d61908a7ecd2d76e585bbb235fb6bbc0fec08b61d91cc81d670632039981ccc06232b0426ce580be741391fff0e5d2719b2d6706320399812906f2ebf6868a1cd01b1e16fd37849003faa2b39a0d6606320399816906a27772ce4d29ced155776a7c2f97c801fde5181abe7cfa2acb8f8fc3b3985b6606320399817930b0963f68e6803e8f0b65fe558d5ec3c92d4d93ff2efac99ce45c6620339019c80c2c8c018b2df3b6901bcc8181d3ecca2d88cf267c767e0e967395cc406620339019c80c9cc2408e27a750b2348afc77ce9786d76c35339019c80c1803a7d943997a4d610506f435c57f1e6c6620339019c80c2c8081b5fe07e166529703fa4c361631eddcf49f895b44b3d9546620339019c80c64064ecbc09a0be8a76561499446ad2168f0afb14439f55ca9204faa968fb542fad787940e17bd525dfbd8ae2801af4a450cd4977c4095cea068ed9cb54791ea0f2169129cfdfb51f884a40734f8807f24863cadbd359d2d4db7c8880e832534011548a7e82bb8a941c3df1465d46cce86bbc8039781068ddab807a69b023c4478a9815993cd82f1ae26a794d6f047dfcce90c448666385dd95c74d6d610929da8e6934f60444a98b2e1a6524325b0ac083f83c6cc403f693cf79308bb1a12a2fabea0e4242b8314c85186b42bb2c95b495070928d25e27992e453e545f8b11ec4b5b008a61666625e638249ea07f1b3b05e1b5e3133e075b67c79f334a6520191699d424edd53e80767cdfd195c81c7a458cf923e366d99dd941d465a9f06bbee1c7d47ae91beb13529b832d6e4b8977cd04e45a85889a2825c9c54cd7f1597739780dee3a22b434fad30a1182b5504661252e08a0481bab59b54ed26a8d993eb75d5aa6aa59b4656ad5239e254854939a27c64b58e85347f6937545bdde0e55c47f26dacb7cc905493f4a403d2806b4af04d39c18f0ea7d3788a0146cb729c1678ea998e7a3cb750842dc61e02c63c75cc67ef306e67bfaed59f2fe2083e8c4901ff5d4b75ece2d6a454c0380b87f557d167305e91b57ad4e197b1f4f00d954e42faf79bbd7aa154175fba2c44b16c9ee2668200001000494441546b92c5a7866388328711519e71a4cc427e9c93b84e54075515d702ced4f88d97f8401ef22aa09a0999818a3a0304da18625f9a3eb5671263e168da93cc461590f4475b9c57dd433facefe97fb7e9148b42153c795f28f42a15ce2b865a55dd53a4cf0104ffae8e7235fd93aeb9986a05f3907ab18f5a91fbc2a0886fae6a3870b55416cc5c500fdfbbf054b44a5a4785fe98cf2463f2936123adcec9791bbc57b7877d828d3c0f86ccb3481b97f2de2a9c0156663843f11cd58187c20634801ac16503f29c9e517a17993ee3c3235196f8c9bd59c16390938dc9c6365fd47069dd05fa9884f70a5f62e16553c4e5a8c48355009e7b65e09751348038b8955532d7251c7b0a1c107ef928091f05af13ac2dac62ac61953abe96e39a2f0aee59aa38fa97f9828df948c77556b07efa7a52ded642ec78ae43ef173e2fb8b52acfb53bf22599aec6a86f8fc763eded4f1fed9c3ff9426b6778aeb53bbe009e6b9d5fffb47d7eef99f605dd675be74fa01f7fa17dfef1175b7b8f1d2acf3f7ab83cffc88baddd875f28f71c7ea1b30bec3e74b8b3f7d0a1f6ee175ef07b9e3f5a9cfffc646beb8bc7ab1d93c74f6c51a876aa3bbe35a17762f350b2ea6dc5ce79aabb5bd43db141d5c47ac5de66d5939ba4f175527733d8284d826e1f3d93a69f46a45ea09dfa6591baa6536f935c6f8b7462bdaae32372d5566ef22d8a131be973835463a3c6de5072b3c224c1bc5aafba5ea71047e55b4816905e281459307ccb748631ca46e4ca8e5cab25578e81518972d7427f0aac5e473de7b1c3025a96aa6da18a36c72cb02c5eb10e4a8b96a98645d1620d0b52e135b67e9d5a9d36fd7915ad960ad265bb2543819c09d32550af9c8d7629df6e25f4eaae46c646658bbd8a42aca40af66020ba1ce9f0bbb033b0087b4868974e9ec05bb89e3aeda0762baa282b1088c5416d1e3cdb05129465500b5994b54adea8f8a25249be852cc85bbda2c43f1e46daf818e5093285629abb310a4655ab9da016f997402c4769378d99f5230f6adee0bdc47c2668c661ba19d9a54e12e34ee922cd1b5a4f80947372e66bcd6d534715ed31ae61e6f025c63f73bcb3d3ae35a2c9caa9f26d951dee7bdfe1e1be50403a6c563cd4d655a1ca403ad4a56aa4a1e2e93621b495ea91b77bae97f2e862c9c397d5977a41d86da927cb973a36218db7b61e792e6c7e8ef5f119d6bb675f28773d877c017908c91ac8fa67eb60b9eb0879b0eb28f2d80bc5aee32f147b8e53efd8f3ad3dc79e6b5d70f485d605475e68ef3d7cb8b5fbd0a172c73327dca6c350b6264fbf2647bdc483fe41f75513cf8c5efa3b4facbfee9ffd68f3ebffa71f6dbae17f7a7cd3f5fffc479bdff0cf1fdff4867ffec3cd37feb3ef6dbded9f7d6fcb6dfff4d1f507fee993ebaeffbdc7d7ddfcb12736dcf4b11f6dbae9638f6dbc11dc0c6efcbdef6fbce1771fdd7cf3ef3eb6f9e6df7972fd81df7dba78ddef7efd7b9bbff1179f3a1e3efdc923fadca78e277c7e18f9e943faeca79ed1e73ff5e384cffdc58ff5c5bf7c46dff8f2113dfcb5e37af8cb47f5adaf1cd67790866f210d0f7fe9682a4be5a4bfd547d293fea6c1ea22bff5456c7df9b0bef9a543fa2b6c3ef7f8a84e3cb345479edbaaf117b6ebd04f36e9d04f37e8d04fc03ce58b3f5da7179febe8f9e7bc5809d8696dd4d66d9768c7eecbb56dd72bb473ef2bb579e745095b76ec4f72ebce0bb575c785dab6635f925b77eed5965de7cfc06e6dddb95bdb76eed1793bf668f79e7ddab97bafb6efd8a376671d570e41515e05ff39db7da019fa74b4e4ed4bcd6ef5827dfb74cb6d0775c79beed69d77df9570c75d77ea8ebbee4ab81ddd6971cf5dba3de14e641fd4351b77dc7387def28e7b75cbed07d519b5b72fb5ec708597acefc04aab851c156626b563e798aeb8e2025df7ea4b75ed7597eaeaab2fd1d5575da4575d792172bfaebaeae284ab91575fb55fd7bc6a7fd25f439d6baedeafebc0b5575d28cb5f7b95b5c5c6ab5ea1575d75852ebdf4d234075bb79fcf9cec635e2f02176bcbcefddabaeb226ddab55f1b775f38676cd8b54f066bb379d7052a3a23f21624a1219ee5004e97733b9d4d16556dbe2c8d9fce396ddab2559b765f30e7b16f9cc5d326ee8d5d7b5fa91df0b863e725dab1877be6fc4b99cf8b34d92bf5d0c3dfd737bffd437deb5b3fd4c30fff400f23bff5f0a3fae6371fd137bf657854df403ef8ed47f495ef3eaaaf7dc7f008f2113d88fe21ea3ffc578fe89bdffebebef1f077f5d0377fa0af7dfb317ded872f769feb5cf43fff74d3b5bff3c4c61b7ee7479b0efcce631b0ffc2ef8d8a39b0e809b137eb4f196df031f7b6cd381df7b6cd3cdbff7a3cd07fee9639b6f49b0f4a31b0ffcdef7361efcd85f6dbef563dfdfc47ab9e1b51ffbc9d8abfec97363fb3e075b6bf2e4ce5e93e35eda41ff5f3fd77df88f7ef77f79e0937ff8df7ce14ffeed6f7de113ffe76f7ef18fffcd6f3df89f7effb7bffd47ffebdffff67ffa5ffeeb2ffff1bff87f7ef14ffef0bffbca27fee547bef8c9dfff1f3ef7e7ffe21f7ee6cffee53ffafc27fee01f7ff1137ff88fbffc9ffe0ff07ffee307fef31ffebf3fffa7fffbeffce55ffc6f1ffbf34ffdebdffdff7df2cffec9d7beaf87fef4938f853ff9a31fe83fffc7ef25fca7a1e40ff447fffefbfae38f3faa3ffa8f8f209fd09ffdf1e3faec9fff400fdcf72841fe87fac2a71ed1e73eddc0d25ff8d40ff4f94f834f7d9ff2efeb0b9f6e703ff9fbff82b44903e9cf233fffa9efe9016cdcff17dcf49f7b528f7cf7847efca8f4cc935ecf3e55e8f99f967afe276008f9c24f0b1d79a1a5e79e897af6d95abd6abdcedbf54a6dbdf02a6ddf77b936ef7b85cebbf8f284ad175fa1f32e6ad2dbd06dbbe40aedb8e495da76c965e052d09717231358d82ebe543bf75fac6d17ec67d1db23a222d70d8b6bb4dba6907305f9059e9828d78de9b2abaed4bdef7c87def3733fa777fffc7bf5ae9fff39fdcccfbd5b3f6372367ee1e7f4b3e812de6be9f74ce707fa9f7fb7de45d97bb0650f051a1d11af31d88406a9f08a4eecacea053a1f558c15ba64ff6edd7cc3ab75eb81d7ebe6eb5fad9baebf46076eba4e076e7ead6ebef1354a69f237df780df9eb74e0c657ebe69bae4592467fe046a4e186d7a07b0d755ea79b6e7c836ebcf106bdf675afd7cecb2e63ae5ea1edfb5fa96d17bd52db99bbf32eba523b5e7135fa2bb4f392cbc19560ee72c7c55768f74597f146a4235f300931c24d3c990f74272bce7ece3926ca335fe64b08530e78de186dddb65d7b2e7ee5bcc6bdf392699e76c0db7960dbde5768cbf997e8bc0b2ed3b6fddc277b2fd578b7d0830ffeb53e77ff83fafc030fe9f3f7832f3c98f2f793fe02f8fc039425f9903efbc037f4992f7e437ff9c587487f535fb8df606dbea62f3cf0657df18b5fd5fd0f7c55f77de19bbaef6b8f4cfc7872d3c73efd17fffef73effc97ff5cfeeffc4efffd3073ef9fb1f03ffe48b9ff8fdfff18b690dfc837f7cff27ffe53f323cf089dfff870f7ce20ffe5ff7ffc9ef7ff401d64b83a56dddfcca27feb77ff8953ff997ff28ad99b47df83ffdd3ffcfe3ffd77ffd35add1c356a6353af4d53bece7baebcb4387478beed1759a1c1f5900daaa7b1dd593857ae30e3be2b5bb27bf156c516f6213d25e6b6fe4d5f6009b795d0e26796d6ea04eec43939b24d2099606ae4bbdee66d513ebd43bb14eadb84d2d6de713f736f97a0b76370c8dbabb41b1daa2babb49bdc9f5ead5eba591ed52678bd4e2757e3926f94e83a2251978bd2883236fe05b64936f2b492b3338f2065ec9ab1c51d91e956a273ed32945435b6067adffc35c51f6fabbee8e2baa567bc3a8dc482919d851bb317c1fc5cfd918416730fd187e8e526fc4d0d75b59caa3c3cefaf336e17350e5a2ec7b6dcd7747fb439565ab18c6e593db4c1c9753a596bd6277154171827c572d5eab8fdaab775ea3dbabf4b2341df5ca4a65d9531bbda1c32b7683a5db052f6579f56eafe48b32aae0957b87cf0ec2a2a247e06f04366f3310490f8782600e671634b53c87e71a9a89d95e38c73567d79a770a5c2533cbcbd1758aae00ada12078b36b5bf6e6698ccf5e76ad7b1efc4aec228f4d061efa5aeaf2aabdcb27ac5e2cc9976a648be743105aeaf5d18d2dca5b495fd548f4dd9ec83b1501b8b626eb8e5ee86d68bdb8e5b5cac7e233e017df64b6b8d40c74cbf5be2c36b9d1f666156e7d82f743c8d4669dbcdb28ef81daf2da2017c7c02837e118df884198891174d328282bc3888a38226fb20f4b9bbed428fa4e2a57dde6eeee28546d39d235aff5bca33ca1a3263d0fa931c5da7c5d4700d988cf63d8e792eeb110b108b286289665828a52449269589e001f8bb642d9a10e0bbb07e83405dad4acb8752db1704aa44540911dde7ec040921ce2f46d38371f1d0b37a8eb4a21a1a7182ac6532569e9d9b0bab1eec2010886e9fac24644d73d711c1bb52af2ce39f9b2f13fbd5e86232de80852e15562d705b80935ec44b5d0396cd73d56731e1e041c65260d8ebcf8f6ae48397ea5742a0fcc21e34617a3852f3e467807ed41f2f0dc627e4ad06a4ba597bd658805f30bacdcd2f391f2a59c733ae9e8e723fe537852d1726482edca81f71e77a67d8d764dc29118c37cc77d527d9b37a64e266b78ee8f3b7af8e57e888eebc503bb275c292550868cc031e305813c5a1deaba29b4e454cadb5cf110e6b05d32615e2dd57e7de745e5632918f04b6134db5c5a06aa3a845ea8c2e4e444eac8765d4381d63d16d29ac5212d1ce4a56621158b85f3919bb2924737138ebcb37276660ea89f9f59c7d25627869ef056bec0960f72be965c255b972d1d59dc23b6860186050d8ab597772cf2e2b00549b55ccb2b96515dd7554f5dbcac126c773a8d9a32b1abf062bd51c52eb00eb40b5232633f9e454cdc2665213916d481b432b25ae05157930aae56800739b8f7914590fee8cefed602eba5ce04d6d33396356dbcdaf6aa1d2e9c8b8c095e9c5701e85036ef0b721fbe2caac63a8a4160b7ad9220e0e18ba1603f60dec9b1903bea7aa4c1d20e9e5d60c1574bde24e59293acadf12c6b1bb061411f78fa40573397f295ecaf27066488fd07191e7e22e082d04ce9d28303e3eecb99e5296df368a067e71cbf2beb74ce2912d08574cefc83078f8e64e0be4d6338cdb8e7a2b73a2a18af817b26daa4b54b3189dc2bb52abb77d1dbda12e1cfca0d123e585d60d3e29817cf3deca953e24b83a08229f40e7b74a1aa225fabc4e716d788b4c5b4198bcc805f647bd9dcd960a0ad1e0131f0de5ae2a64a1087a511f3c9bb74473b39370df50f429bec864d37b0ddc47d7816409f6ee27e451725e0fae5563fa54d675050c1eb53cfd55613b8eabac73251b358d74dbf74e21cfdcf57d2260510028ab35d1d104b917878f065cd2bf809ece31b7623b0a06603726e465f16400c533b0b27db9538e718132b1d4e47c62b3b6c6135282a2d6c56071eac685838e75458801507b603c06932cd498897f56f723666ea2d6db03a3365557579e0a9653b3cd30bfb16c8a14385edaa9a6e86ffb5c04c5076ecc630ad5eaf56c51b12c16951145c0a4c3ae9a68341da916d10e560b050800794cdc975ec9c836325bfa92259deae1d0246e0ea31fe1d0f888522fc058ae369a55d971e7b49d2ceae8182bc4943e244cde19c4b8999baa458c61f671cf69696beff0000100049444154fb37bfd2f5e1bd7c513066074e3f6e1bdb609c679256270575f8100fdac6a9d25b939e8ce376a7a5c0fd1b09d6e64223a32541b45b0904a3560e6e3df75ec123b2fd1536df6f53b1f377ae50e90bae12c913d87da863dea143e1129c76872d81d96c7229197065acead80dde5665bb916264c90cdc5cf3958d979e5da82dc62679c856c17f2edd882e55b0df29b0cb922ce73575980ec4a4b732c732ab06e61b0b50cd9379156a89b42bbc6a6e786fbb5ddaf8e8f1dd81f94a27a2873ad8639150c94e572c4c8a938aec2e0ae3c7742c4ab2454b92254d9da040ec37ce62d2a732493346c62082cc5f121438093b01d803822d7a5ae0617e88d703a5a35793bc7e0f7035dbacf9f652985d5f8ccd6076d35c329f2d16d5415fce31169bf4531bce43830d630bbbb0c47c3b797b354bbe4eb942a23c1a9c3d029a47a204b80641a52265a90ef584df915691eb468a4a92e04542ce391529cd630bd78fa82beac8d256ff74d2c668d79dc9d9e5b4e572c484f5a8e6c08e734ede0a486bb90ffc76cec88a69fcc92f74c2b714901983668f6bae79da46e3904bcfae691bb2584f020f4e96ae79f0765ca0d68fb9e0b9009dd5e7fab7d974b4377a2c6d70b4f52c209eb728ceea5158ab509dfe4c8a4f0f962deecf224cc4bc3f879c253899ca25b09a4d2e29033cfdd68e9539dd34dc5c4d67b111fd9b4c73968366b668d8e5804c2a27eedf04cb725f13702da5299dd202cc8deae80de8a463a068ca8333db56c12b5811413c9a34554a503e4f69cded61c045e15300c64110dee06b48de0dc6d0d4f3e8ad9f54856a9617419dba51d4a72d524252e57467f2fd74058ba4339e17c9d4d29b712fdd4564079d767d89cf5339b5e9b6720b26c66b239900bba60d03f3a8c4ec886bc65b451a3a9074a90e73ea2c315fd96f6362d5c2063edf710feaf7076d5c1a2c0bc726647c5b22e5bd9ca5938eb4e9124ccbfd8c3e8054c5e6cd45929140ce83bb6b11e6dbaaf92456b3065891b73aca7b74485af4d32fbac56c70c919685721b44388054fe29e75d202fb3090ecc66b6e480d6ec8bef776e3353a0b7a0eed0076c9006e68ba56b30e90a77d98019116cb4004a2ae38a2c135bda676494fffdce881fa619e32d2c661c37ac72cd639c92b36d2912e0cc1c9d9775aa058e080816f7bd1910e0d2ce8c0a792b4f6c0d2678005a254d7aa2d04c9570c9844d8e9492f1cbe79788123259865806d0d407661a719823f380aae5264f715ecbbb6a51d6f63ac2364d2b388c73e828b8a4042720147ab63a07da4bde5c5eb5b61b7f18f19661e6573c78e5ed1e60e8416c5c50241f3e53c8dc29998972ff092e676011c244efdc9d70a5cbb3ebcdd23e91e76dc430dd4d7c5fefd1a9993c84edc1092cea9f24eb63b0f6aab721d406077a56a7399eb605ec3cc95e7cc80d13be7cab9e2ca60a0249417a1158b60d3d747ffc66c163d7473cabb19030a33d24d92504bc2f48315872c8b6ca45970a6b77c8393738d6e2ebf66792ef54e5fc72bb567f1896961c331ab680e021f9c0c220078f24a801b71a486c8a9334ca55262c6f8527ed68f3ba5fdac0ac364e763d3ea0e304c5f83366663901e46269e8c3b336412b85aacfe12d74a739da013e5469a8192e93282ba4ddb941deaa6b42c8c281dccafec7a661e5d2850196c1ebd02f3be10606cd59e5cde8b38fe864fc16782dd2b6906bceced56d20dca06927989bc8b8f8ed94c81bcc49f4281744467b0b911f50201df02bcedd2a333cf572ded2bda719bc515ed6076ee340cc436f744c93badb6647f65c4c093709ca7140b6463dd16d128b90ab0186b20fb7a21132873d4b3b40b8a3ec8166c435ac0d14d49599bc89210b169698424c72ed85166d0a03ef9941e4206168f6691b04b19b078e8a4a3bf20253de58332eb3b05197cb3f46c0cea0d16afbeb4c56d26a6aa2d34c102085953566cc99b89a902e834b7a7f296309d4930b3cdccb4fafe9f241327345ad049e77067cc3a921ee73c32994cfa908635286fea58a9690c4ea69b0d2bb15a4a7e372933145d3f8db07464fe87052656de69dc19cee05960fc030caac4213918b43f55d289f19eae0f66a22f07fd68aacc5af69da54eb4a08d2f7c0f54704d99bd452cfa554c637aeed7546af98cc56580d95a5c83d9dad2331058d92ac08d215bd49a1e432334776937174f06120baf4edbceee44ec593948f5454d6ec7a97eb9915149b36552363f0e338345de2eb841daf486a616fda4c4dce54c7fac15dd085a1ae87407b51887acd3242bc9a496f3a06ff8e477eab4714d65e69298d57e2e4da6ea2ca4ed80709bfbc1053190d641d2db8c5bc6609d01ea38e081e32d934bbb6fabc7c317d55cb22b76860df8453b7d462ac4346f41e901d11e1287c0b4c5d59d1a9683e951079206443a6d02c8f739b607f601df52504a5b19703cfcdbc3b9b7b9b6b603995eb8572a6383229a4dab20daa7bbb4c9e4df4565c0eea24535988d2d3d03bda2d66451a9577655fb9ec29090ebe16c00dc64f6d49d52831fbb341c19cf2ddc80ccf46937ae8176cdcd4c7df2963638d28e05db166d51c7713f37f02cc20da68d0d9faaed2d81173c18188b33f43beb9bb50549537a7bcb60819cb1f3cd36f8a893e0240ba8819d8641f89ec078743af4fb185ad04fb24f3fa18f413f91fc203da8332507becce8d8fc1e64a3936662cab6f537138306c34afc705328e578ebe308d08e57e32ee90ba534794fdedb9f63e09baba8a7d896033eb409de2d79ea38ca3df51c815e36fee457901c505070cdfc05beb5db1b254f40f104f361a1557e0c3beed40eee94f88cb060fc725f245df3e72122650ddf70aea0c81c1844dae008da1e1404ed823928cc0c96ec2cb053869e3a7583765dd9fe5dce39ec14ceea642c3e032c858b6f345b5c5a06aa921b8f40264596bc4067c382a633ce600b3d1667a84e931cdc8b5e8e85d7f76f629f6e72aa73d3f3ab98aa99d6e326191679cf629d0254bf0fd76f6bf5a7ecf47573cb077cb0d6c17e9a3efbfd4b4e16e00c4a0786a7ca50e052e8e729493e46da507296cfc6f7e6b7e9dab83334b933fce27f729739b331863ea7624e528bbe4cf9419a02ebc740528d648ecc16edcd8ee621c5e26cf50de66f34a37d78c534372e52daef3f4cd9d654996818e4e0dfa3f312cbbeb856489ce60c527fce06d787ec48ba41d97ca5195866b87effb3655f7d269138b0b11b6c36e72bcf64f8b4fa88d680d0405a1abe2d9ffab67c0367815e3d667312746d8699ba42816bc6de2c36b5f2ef62336077d062dbccf69698011f0b37c29d315a4776355ee48782d26d664baf5d0683d544a71cb670184e293045ba9103a99ae5bae6861dc09ee8c5ad6ef64b64a9c0ad2d6a51197fad4d24d7c051c36ace47165158ac64cf36c93f0b1c3614507bafda95c9aaf59740fd142c620bc78a3e9c5c74f2b475c06403a113476860e33c1d285dd0693ec1ccc0462440d3335906013b24fa277eb00b4a53e64ce515a81ba8130da4674aa113e34992b4d99d89d48e3649523e8c4cb61d34027b5312d93547c77ca896edda5af85bf0aad5a97f2dc0dfd40e8f7a6217170ade30f1c62950964685cf360f0da4806d59998bb2b1dbdc14ecde8bbaade2a407c4015ff3955ad0118c3bf3315909fcce40249b4ee68a7a4a4091f4d433e918a3e9fb73a1be0ce84e07bbce07c012e77cc73bab7e2c14b98b026f4d0cd67fa46f310f3269a4f7e1a2934b7a97fa8de8ed3eab30d9e36d57ba06b0256c5141725dc94f2ab2d3afd105d752c5bd6732ff9fe2b424875f12abd9e89232105538163aee2fa68f9b6c513b4b372c76cf60d445ee5160dfed6c29b26aa633291734050d4a49a48561964d6b447d5a28b03044305f19319d16372ce095e500fd3a9052f633e83748d6606a7ca6f704ed06a9a6955be26c020e84ffb6e4cfecd6f835345ef67db7ba0449ab9f78eeb773c802fd9965a5a67c5a5a7f8e80dac8c00c853403f3c94b21b9ccb598a81dfc61a8462bd914dbfc88c3ea4c95db38d02949ab5d29a5535ef8a2198795934d65fd749a4374260980a484f34a874bbf9a735e8b7d440c1a10c9679b41d29c7def497126df1b8d712ee670a6b4f4e9404b4edaf5bb20d39cf31d77bfbecd4b6360aebf4136af83dae646b291c66ada52e221c11098499bf314e8e9cff2763df860f532968281e9ab6d29ac679b4bc240d77b7fa26cbb1365a1aa88927d0b1f06aa6587c384c905c316a9be9174e392e63ee6d7ee6003c97436e9c80d1fbc53c56e7a18d42ce669314936a77f3cc16dfac20ef4d22f9b5a74faf965174162072b9b87f47fd8aa08bc0d7c5ae00974045d51d6d489784c1bca94c64879ecf150d2c3ced9978d5f744df40cb60333f056a47685ea29491a7d34a04bd2d2d3b3925adb9c9925d9d81218aa9d366786a4eb8f7f2adfe7c2eaad18d8156f9876c8bc9cce71659e546ca5f3459f87c4c9b4e5e152fdbe5d2519924d74531c5b5f7dd8423140aa677a71fd4945f02a6b43a1a2ee308d1dd51a5565bb72ee6f0beab64e159a54278c4bcaff63194858f4d32fbac56c70c91988f205afb95ccf6eaed49b4de3fce109c00313262d082bddc8c9e8697eac8fd3a8d3e2ec9a026cca907281dfc0828db033d90e969ac654dd81edf9c9664969cc395b6466286c3c6e2a3fabdfa6c90afb3567cdcf01702f057ce4d46975c8242e91760e383cdbd2fa3e09cd3510ed7a884ee669685427d59a9971366756334d54a0282a58da0549964765e5662ce54d6730fd4ac7e05a9eed675f6ff365e3b2399e8f9c6d6ea179e37bca06dca66bab2f67a6fb75cc55d99cf4f3260a9409d68c7145b51508e6350f71b5f38af6b0009c2aae8e5af97ffd6aac2d3efa57d6e21bce16978e81569cf465ecfab4ab49afb7ec9bf01050d1386937ed4937b5a9edd2009125971b52dc86a63d0576f3ba53b4b314769783995aec5a97368632040d83e635b25838661a26cde2e2d8c1bef4c309f596fd845f67e40da4a5673965e5b391e68236ec74c5a219c07248d93fb701d70501c92be0559ce5bcd2eecd94361f53a0ae3365026decfa4367f31548db77f601985d6a71eda027914eab6375139266f97ed2b81942e38147cc0459ce533528ed9e4a24506af30b7b9aab9435a49db5c1d4424ecffdebd253d7c09e974327b36dd23095768aa96f479703a8d170bfa5f95573d4bca5e9a560ee6c66a913b1528bdb5e6ce49b4af977d119f08b6e311b5c72064ad54519a26b05bb49e8ce6eba6141f366271b481910fdd3727603f6b349ccce27e5d48fdde453997ec2ac0c10d30d2d6eedb486709b7b45725172f5bca53868992c90948c8394687e9c15a66448bf533f53fa29cdb225020b7b60f10b497a996c9cb15bf35404827880a999487ca23bfb124f59c80b600f66694127dd2ce194715adaa75d5950aa6769ea34f523359ad3ae07cb4527384097e6d2c64f3a8d0d4919bf8b749e2d3376ed011b9c0672d037e363dec59cea24e9d5e40792efd233cad335403e0c78d1420efab0fee1db82bb905348f68d74833dfc5bdd06e68328774c988bf4ef181bf7b078d16e0f63f68a9d220aac56a026e5e46afcae7800cd2fdc2163094e9b9d25309b4d2e2503ad5a45a757fb56e0f5957d5fe555968604210457a3c40de9088d2ca732d84d49229d942aed8a6437a5e500f5ad8de94d1b1cad406a907e22e13a4a76b71bb06d37b8d533793063be0000100049444154195944f8eca69a36c906f6e62f23edbd228b44b0deb025ba14075a7687616a214125d187a60e4ff9f25efee65dcd2ea66281336988e6711a8f87ed69589921f256650a8cb7a951d1eaec436abedd977cc72fb80e8b58310b36aa886ce0d9bddb75e554a33398de648dcfa1998dc83c80d01f77a424ce488b9642d7401cd4e777659c01370c88749a6f869451733d5af90cf040637f06c26a04c635575830ac4f9a7f9fae11b3331cf013de150bee85025ffba00f179d0c2705797c75a9bea73b60ff2f0174643883d2df72282615bcc176e315a5f5d4db376b5bb98ec6fd28f5f34b774858f4935959749bd9e01233603beac8ad12033760ea2bb2e44552710859d3a6e2860eb41f802467f441c14552dcebae816502699303c459f9817e20cd82b5b17a11bfd3c294166c761ef43ed0cf5f122ab063f60252d81ef4a9e8a69229e142122bee67869f9e85de29a4b968966ad2e4cde7fe345852acb409b623562a676c511c67595a9fe633307f237310998360736a600a4ef77ad5ea29d5f38a040f43e02d85c9e85cd23573ea1478e0910511ea2b3ac6b83a962c1c958c1f05a425ea19125dd2074665e9549b1f4b1b34a5f7562f41cdb4ebe463e16c380c9a1503c959a78bc217319be697c1d2e8987325bf68c7bc70aa39a893ee35248a82f6f666a6245b00c79ae567ee16a893cfc56380d9583c63d9d2d961603ca83a165b61a21851c59d14eba85881f9cac01dc6cecab17b12afcb62dd93f351353b7fd659d5354fd9ecb06aca48518b32d2fc2a724307f11ff9404960f51a20d226265dad9a5d5b00265d51a85b57128b7460910eec0c2237b86a02fb10b0b6c1b7d40d41dd2a28050acf434ed951c077d187f0b1819ac3210c889570fac2b15846b950ab80330f9f3617e2d5748320d379ca0ae6aa40dfc85ed28bd62218ca33eeb3291d4bc700f45de1bd2194239a208a1fed45a935ca1ebeecc3230d833c1f8e784b636d06e8f14dded045d68c2550dee3ba16d749032fd76a29f4b8e2b8ee83bc96fd8831b9104d3ac7f51e15b81e55724ddbb5e7ac983adc03b2fb8afb86c9163710e0fe635e7d9f199be306158d2a46d797a12bcf1b38df8a3cecf554b41cb2e232a924eb83dfe14f7c331b5059dbbdc935e68b42e647a8bb529c540c272398ce805f3656961d71f9a671c73a88854398014175af52c1ab38cfabb83859a9c55c767ae178fe53eec3cfd84bb5f42f5598cb5626033b5a473b3b36aa181ba935da091a1b891a1dd1fc65472a7d0d825aac3f2323a53a9db60a1eab0b024dd12a583cbc0a16a753d0424f23ab53a67a56b7601d2b5550e629f3c8166565a7540bbb65bb25df6ab1369752d95164f1af5b63aa5aeb158690a9ad2be4b0537446157d4bf5649058449c05f3a2589913d8f7cab390baaa927d3a292a16cd8963d2f851a98b9c3cd2c88ab5af7742aa66c17406d3f726244b2f85acc6e97b122067da377d6dfd0689074b11bc2b3e1d04646be3792ad76dd6095ec9d625f3db1e91cd5503d2a663bead4cc558d31e1b763d181cf3194b5ecb966d6dd8b855628e8994048d282893734ec54a995b5cd2e07005be154daeaa5575098816140d553f5dc119732dd31128659cda1c0e90e6d1e6bc8f49ae07bb064c9e38aa70e29074ec90e2c451ee25475ff0cfef7067507a80af995ffb6cc28302efc7e1785cde57dab461441dd695d151275b5f1a048d8c808ed4198dea90ee8c92a7de18baf5ac47eb909636743a512dbe11b65a3d8d945d6d2a27b46b74bcb8588f0ce7726ef5920cf8972ccd85433170e57bfed7f537bdf9fd0fbff5ee3be25d77de1eefb9e3f6f8d6db6e8f3ff3c683f1e76eb911dc107fe6e08df1edb7dd1cdff9c6030d6ebd3ebefde0eb01f2d69be2db6f3d10dffec637c6b7006bfbe65bef987cd32d373eff81bbaf7ff1ed97e9177ffd67ae767ff37d07f5cbef7f8bdeff4bf7eafd1f00f3966fd7affcca2fea431ffa457de083efd3fbdeff5fe8e7defbb37acbbd6fd15df7dca53befb953b79bbcfb0edd791adc816e36acde5d77d1d670f75dbaedce3b74db1db7eb203870f0565d7ff3015d76e38dbaf2fa1b75c50d37ebf29b0f265c76603879d5815b75f5815b74edeb6fd0be8b2f55b161a354b49a79b35d7a935270ac53a09f9522290362d94efaf7a1a7307e4c2ffee4477ae45b0fe97b5f7d403ffcca17f4c8d7eed70fbef2397df7febfd4771ef88cbe73ff67f4edbefcce039f467f9ffefa7ec39f23ff54dffbc29f2e89fcbed9fdc227f5bdcf7ff214fbdf359f1e7a5055d9d1e5afbe5ed7d85cbefa06bdf2baeb99df37ea5537dfa92b6e3aa82b6e3ca8cb0da42f074977d3ed94811bdea82bfab8f286034ab8f1265d7dc34dbaf6865bb46bcf5e2207419f3700def320c8443ad2444e05db096b651dce395c73ec4e6bf52627f48d2f7f51dffae2fdface173f3f8d2f7d41dffce217f4f0039fd7b7bfc8dcdabc26dca7ef3e60f84bfd35d2f0bdafdeaf471efcb2be8ffcde573fa7bf7ee84bfaab07bfa847befd751dfbf1635cc75c440ba1a08c8a45c5edd0c51681dd1e2c8a9e2e7bc5057ae73befd6fbdfff6ebdff7defd207def7b327e1977ee99d7a3f78df07dfcadaf316fd126bcf07de7faf3ef4be697ce097dec1daf24efdd287eed5affedacfe86fffcd9fd5dffcd0dd7adfdd578c5dd87de4a7b71db8fde85b0ebe31dc7bf0a6381c6ea0ddf5f16db7be0179437cd39d77c55bee7eef33d7bcf31ffcfa422859cd6d73405f82d91bd5d1e2bcf11f5cb5f3f03774fef18774feb16f826f6bcfb16f27b9f7d8c3da7bf49bda8b7ecf89ef68f789bfd28ef1ef82bfd2f609e4c477b46bfc3bda3dfe2d5d38f91ded1ba7ddc477db3b8e7d77ebd8d1ef6ddee20f959bd6458d746ad9d3f2283bf4319e8ce72d7992eeb482da6583918e579b5d35eff22405f9d2111bbd3c3adf2a910d5cbb91057a36efa94e597a19ac9ee907688db6d8bcb5558eb4e43bfdddb92b256fe820db0ac5c850906f4bd1ecb4a416695fb053ad255ed3ba649f3279add8c305c9de5ab4bd7cd553f7f861758fbda89a9d581c3f264d9e508bdd538bdd5cc1ebcd12c98716b5d9e5b5eb71246097dc0649bf04b2b47ece60b7c4a75eaf276fdc8f6d903aeba536c17784747b9da2cd7361f3c23c17c01b4624d331e7f29459daf4057338252d6d28d4d9d4dfa13be6d1035e6d3b1f6547e475b5c96505015cbc0d8a7c02303f9c7326b82e6bd5bdae3c0f959e8736cf2bf73487b61386b732c949a539357e1326795b339e50923784f14332f48ebfa8cadede704d84f1c30a93c7355616f4c535c4ef706750b0cf00dceb8eb77222b8cb55127d7746bc76efdcc2cebc008e75461ab59d3a180329cdee7ca4237546acdcf3b6d06b1dd7f20676fa63ac25a396ded851ab63b7e4a4ea30a1d1a2ab0b36456d9df851675ff791f5bb4ffcb5dbcdfa370c6ceddc37f12d5d30feb0ce67bddc899dad138f6edf583dbb63383e567f2bee90d53f889538829138aed170441b34ae313fa1364fc145291585074e253750028b5359d4b2326f0134954b6df41d1fe4f9dc54c4136abb49ad1b29a857ca5e4f8f97eb75cc8da8b68015a23424228b4b64c171584a3733df689d272812e43d019b6589dbbd3e0903ddb4649749fbd087e91362548f05ade6bb61eda26a16bbe00bc9b7d42cea6dc9b5e4e370b0b6e2b5ec942db36b7cd8e26f92bec511529e443a17b20026038bfb333e2efbe658c00dcf441a6995b285b0034d1d027ec182eb981fdf474a131c4af41624ecdbad7dc33cdba8b8de2ae6b5dd6eabe2b3413d7e42f56457b59cd4625ed1abec2832bfb128253f000f75e8822b659f48d21c5a19f9a60ed786cd63ba4ebcc4c7d9c04eb7eecf25579150caaed5a2705af683799301476274821639ef513915f0e3992b43c1835911269590d25d799b43e6d5314647da60ba826fd99e806fe830c6112e0c6e45b5b81e6c5d28b0e9b86fe946e2d6d7d087977705be16e20607dc1b7dde27c78febd08b2fc8e14702eb82482b7665f0f45fd8f8eaff9bbd3f8fb6ecc8cefbc06fc7b9f7bd1c804201285461a8226b206b66cd0307d9b2645bb42816455272b7fb0fdb4d499464bb6da9ed5edd6dbbdba2eca5b5dceee5e65a96d6f21f6d51c5e250648daa79661559408d000a40614661aac290404ec8440eefbd7b4f847f5f9c7bdebb2ff36522df7d2f27bc7b70beb377ec88d8b16347c48e38e766261aa531e3dc2e282a064a96b54991934e3c3f521e0f35587ca91a7e5a2b99721c0207470f696f7b5cecfb6a9a6636304f1ae64dc3fa5ec0078dfd1245e3ea18043bf04e3bb0cf17a4cb9eec43267ff0565558ac633e0f3a008e5804bc40ca019875ac8cdc709e6976446809546316170b7b21820f8c2c8ad131657e5f1b2f2dc96f45a371a81018d552963a010436454bab21c1c2bf99471a89ed17152bec2f2382f48a56569658ec4525d116078c52417bd8645984f34419d6f824cf32a20432cab91e41688ce6166430962ff495a402c4275418149499d0e2a7bc8276ff611c319d13c1c90b7ac006c21b4cb6cc4dae03be5d97be4809f7bf6e7ebcd57a53c356f604795e8cc7633135aa1f1b05398d127e6f980da9a643111707e28ae8da6e4727c519540daf6acdeec56ad3328794936085b9ef31f7a1836fd0ca6a954b81061cb4a0488947230550909754a7b4b8704641e6fa4d1312f34d94300a7397382ef33c2e89db76ae1a82b9097b99e51aa8d5807530c0f606bb2bcfe663b9cb046523424d2d1f8a58030e633de2374f06ad5d6eab4c0e396bd21938fcdef0a5a4e0eb76a574ee4c43ed5ad8ad2bf6ec251d00b9d71713330a3c7df01f7e33522e8a8a20a6054bb9052389d897c02eded22390abd10a1bfd52915a86dcbfabefe2b775713028c4b95990f1a1cd2ad82e626c580f5fba4e71d50c4eb97cabe0dacbd7f84bd572ffa3096339302d28fb2d1aacf026b9c226638c1a9672f2a7474eb64da3cc26145a50689752e9507964def81bca0c797b5f648fda3394ae48a14526ef02b399af5b048ba426a599e8d87f40878521af021004ce219fc68dc4669f75ea7fad720082546683ae7c4d6765642d32c3bc83ae6d37148d2a1214b49cac33658906924fff3321abe1937569708c3744a314d4a1d91b224079bd0b71a93297d2a3da843f4aa3257631a3cd033c91d4e29f60b3cff429a7a1ca04e67395352af8b478578356df9e075a98c7a7a26f8b339c16982f0d1bb7968f492bc7293dd622af93bb171a2d32671be656522b81c44690e8ddaa2c8a323ec8116ae9470729a3a5389da8c6bc6e868c2f6bc739f5c048bdb61dc9f38b1217f7f67c9bb2a0ac4b67893e47c9321afa9ee85d54dab2deb3c49815c6538c7737ae6cfbac0fc550198c2935b63f2853f879c2f3c2340d7753956080ff34f395b47cb295f84216833d6a80b428f112beb29ce5f342c3469c3454130b6aa0095baa2cf1648cbaf8c388f10532066ce4c36569b8a4c1e0b89ae638a54faae50be398cdddff54f5787141cbc346cb0b4547c7c71491e583cc997056b982353050b03606d833acf624ed62ce68875e6987f6fbfc76fbeaab99688d0a1b72e637de9680ed859e436af1b89199ea6d41d05b52128b9ee5024da5139a64ca051b96dfdc477caa6ad9801b0242b0f93295096a654b8808050d4684c4e2b29d4646bfdf122342116702554ecb2b9437422585469ceafdb9c73b404f0000100049444154348f5bce0c6cb4e2421ed195911cd46604aa6c6bd58fbd24bbdbba59d4a969e43e890b11cffe4e30b4c9f3e2de49a3b68801c46741101c68381cc2376af9f230e2c0969923c5504b318f754733d50cf7ff7c6223fff4ed39cf7fd5d14117e34504b7480c34f6aff0f245806715880dadcbb0dfcd6505e3ee4d4ee4d3150b3784e7a1db130783e2035a298a080ebe524a035df48bb1b10d1101c974c728508f5551a27faa9b7a376e14c21d2eeb225d19f7cf2b23a3ab520a4da6057d6cbafe329f116bcc7a1a919973a9bc68c1f259b1c8a1d1ed8ff9cad532dfc4c6a881e76052a3906827b03fb3be5c2e63631d4e970585cff0451cae3c3f414b0cc9419af1920b626f42cf904d3c06a1310bf1b8ffc4ffa0a1a906eff8409155cb523e909c2bdce77eed638a6c5fd01e53cb593b126947f6fa0274ba657266267244a38142bbf824b4c85b4542eee613b3ce10d49b4e83bc0313dc0b824fe06dd3aaf006b434ca126ff49116950643ad3069138ba36501f990601042340b15b61557848697b0172c0143343948836a9ef935d052ee8159bc590a509c225d800af2b19c0596151182d13092860e16040707b8ba09d00fd5cbd3701608d7150df051d5e7204240a9d15e2dedb695e5bc024d15ea03604854d6c5bdb286d86e7ff8b7d1182f49fca66a7863576f2b9e4df42df196d3549ae521f3c1d0f687f0f305843f131b516897f95d98332a8c5f6e781b038c75204f091953a5e6f116280db1923750f2137593c6f470ac60acaa2e721bca1b01353cae3efca9144593c443a2bd1443695cb4e623d88b70d7af430ad9fe24db93b10278aec345044fd1b3a4fac6cde7ed31b67b8935aea74c5dad42f6a3a1fe624db15bd95f0d9b6a5d47f8cf1bacdf4afb52b3d12c116b3cdfd22029f1159101947dedb37066b356ac28a25566503cdf58eacab41f118250df7d86f07bb94aa3117d1bf3969f196b79ccf32e35bcd4e4d112eb6f591ecf5dcda2ca4a46ce78d2d7a240013c0acd9f2bc4354845bc1f28ab511bcc2dd613ab839c73b95f7c65f0e28baf5397428f9866a5dac18465ce69c06264ca31752d369c9b79982ff240b85c10e48cc2222ae1a99998acce6d286b9ec90f5720066cbd3369339ba5ae23ac52bd264a2a7fe647d8e449765423ba7a1999fb00e1261075627829a89308e2f245bf547be51a166c0d6b6d5adf34b6a6f7c2d52e8c00c03f815ffa764b653cf6663273a450ae959d69b71724ba04ae5c6db09d4985a0acd3ec0a4a247ad695116bc27d900af24ce9098a08faeb41810dee891e6a6e9079c14439dc94fb05f59c069314027a577d61ef782d2415d2994dc75453b64f8f79ad38f5e87a5aaa5f02b90f0eb227f115c96db8333a0c611f6c6da44b8b766c5b8eae313f6dbb29254fbf19d742bfda84d56ce2628397782900f4becedd98546e281b156ef07455e72629e85c2be9b66b2ae54a76e223edc44e5fa03e13792f504bf366e61e987b60ee81b9072e290f5c0c63e61bfa79f27a04c7f5f3a47bae76ee81b907e61e987b60ee81533d30dfd04ff5c836a50bdfabc036699bab997b60ee81b907e61e987ba0f7c0c674bea16fec972d4bf965a8f096be653d7305730fcc3d30f7c0dc03e7e6814ce03db7922fce52f30dfdfc8d2b2fe89e5d76b171fe1a9a6b9e7b60ee81b90776a20708b2aa70a8dd890e38a5cfdbb5d39ca2769ecc9abb763e0be61e987b60ee81b9072e9c07e6bbcef9f27528fc0f1d6c55fd469fed7bbd3ddd6a1bf3fa730fcc3d70697ae06c6bfc6c7997666fce8f55bd1f4c8df3d3cae5a1f5f2d8d02f0f5f9e6a659c2a98a7e71e78517b20e6537ebbc73762eed373f569f1bf3073ae855fa4e5e61bfa791ad88868e613ec3c3977aef692f60073ff92b6ef52306e3b7cb41d3a2e055f6ca70d3bdd27f30d5ddacef9b4aaab48cdf4e42ab19ab52966a77f42da94b3e6852fba07a6e7fc4537e64564c0b45fa7f9175117e75dd9060fcc37f46d70e219542495a4edf86b14ded47b4cb7355fd8d3de98f3979207e673f3f4d138d527a7a64faf3197cc3db0390fcc37f4cdf96b13a543de84234211b363130dce8bce3d30f7c0dc03730fec600fcc37f4f33cf8ded4b78af36ce25cfddc035bf240446ca9fe4ea81cb1bd3e8ad85e7d97eb186cc717d0cbb5ef1bd93ddfd037f2ca166557ebb05472192b94f3187605b46045ca8665cba447a04f777cc9a62e4b9976acee7f3199d134024eb79d757cce57491dbf856712bff65748fe9dbfd0629efc5fa1fc7f867a218c63c0cf0a03b51aa8807182afb2466d34352f931e27a729e33854b660f08bad6ac9b54785d16d27fe6ad5689c16f09f7d99a0a9fad17297e9e80059a29ce97a780c722c903f98e477cb3c314206235ddbdcd647a10dd0e4501403edc5089aebf212e90ac4cafebf07aee589ba6784cb9f37d8ffb3c1ff532f5678fd3fa1c92a4aa1ef30191446a9d206af0fc96e94cb905ee00bd6180c77c77bdd085961ddad82b5549065e6420579f68ff35d3607d5c9f773e7223adf8b2956fd91e176f6ed19b5b33d701e7a7ff5e1c3dabd30543b58d46090341c142d0c3230355a2d0e7a847635458b4daeb2855ace3cb281f34243add4bc6133d6aec546448d2e40b0d8cb1616b5837bb0a1e431870ab128d0b50262f10a9d2062ac340bea3182af48bb34022bcd1ef2766979b00bba20e7b5a9a32b03d35d6a29b7c4c6d22eecd54902543b5cd03833e508f822f8b91f34bb73ef42d71b22d1b865d31ea8d97d958eb60b5a6af66a34d8ad515ad4b819e047fc567d6b5fefd1a8d93591edd2181faf901e936f74e345b9b48771d953f594e11e15da586c18710e9489d993125b91371c4c98f946075350cbcb2369390bc3944f6695a5561aa375649929584666ac9051611973c1536f853a35cfe571ca084c64d93a9893c573a6194af4616944252853142567bf4b41d7a945266fb785c3b652d2787999c93f29b702cf41ba1ebc5bf3a7604c5f7bb4e6dd1fec711b2378afa5d10929b78a11e3ca26bed40eb5dc32567951e39550a67f05e3476d51db32beb9510bc65370bacde4915fca8256a8b7443d542a3127969668131fb8d99d8c88a4009d0f983f1c9f1263daa577de33edbc2e773d7eeb7ff03ffee2fb7ffdbff8efdffb6bfff877dff3ebffe58cf8bfffeedb7eedbffedd77fcedfffa77dff39bffe877ff8ddffc07bffbeffc8dffe87f7cc5f8e17ff6fe9f7b65fce55f7aa7fef22fbc5dffe62fbc4d7fe917dea15ffcc577e9977ee15dfa05a8f18bbff06efde22fbc13bc9bfc77d5fcbf44becbfda59f77debbf56ff4e9097dd73bdea457bce25a0d9b604f9c04216ded4a7501241182b4b8fb0addf0ca9fd2ab7ff68d7ad5cfbc5137bee6672b6e7af5cfaac3cf407f4637bebac30daff919dd40995792efb25d999fa54c879f7acdebf5cad71aafd32b6e7c95aeb8f22a8937768c27e879016a675f6336812669cf4baed6cb5ff96abd0a5fddf4bad7eb267c7ad36b5ea757befa75f000ff9eeadb1bc9efc7e1553ffdb37a1565bb31e8c6e6c69f7ebd6efce9d7e9da1baed76071974adbfbdb3494eab86b4bd76834d2dd77dfadcf7ef2d3fae41ffda93ef9a71fd7273efca7fa38fc47fff823faf8873f0a3ea24ffcc947f5f13f414edec7907decc31fd147fee423fad8473ea68f7ee423fac49f7e8cba1fd3bf26ef9394fd2469e77df90b5fd4d28965a6cc4063daca1c4286433676ac8e5c786eed3efcf44fb4eff11fe9e9471ed0be1fddaba71e7b48fb1f7d48cf3ef2909e01cf3efa23adc743da4799672963fa0cf94fc21f78e4411d427ef8f18775f0b11fe939d20fffe8217dfb5bdfd3b7befd03ddfced3bc0edbae5dbb793be1df9ed957e8bf42ddfbe4db77c8bf4b76ed3b726f4e62abf5d7f71cb6dfa26f9dffdee5dfacef7d071f3adfafa9f7f5b77dc71af0e1d786e6b9d7f11d48eb2b685f9cc9738acbe08ba357317d6bc31b38acbb3623b3af64b0bcf3ffe5f5dffdcb7fff16b0f7c6926bcfae097fef1eb0e7ee11fbffed09ffde31bf77ff91fbfe2d09fffa3eb0e7fe7ff7aedb17bfe935f7adda2fed29b5fa6f7bcf1e57ae79b5ea9b7bdf9d57aeb5b5ea337bff5757af35b7e466f7cebcfe84df06f7dcbebaafc2de439ff54faa637bd466f7d3375def45abdfd6dafd79bdffc5abdecdabde2358817dcb1620b133853bb4452f8cd271ade12a4e1c22eed7dd9cb75d50dafd44bae7bb9ae7ec58d15575d7fa33adc04bd49575fdfe19a57dca46b26655cf6aaebaf271f20ebca5faf2bafbf41d7ddf02a5d7dddf5bc85627be3af0c211ad68ebe708178fb5433d0e21557e2e7eb75dd4d3fa56bae7fa5ae7af9f5357d95fd085e825f3bdca8974cc6c2febeba8ec30dba82fc2b2867d93513d9d5f8fd9a1b5fa96bafbb812616784b64c4d3802fb70d9f7f435bf57fb09f66de4a7f74ff03fab32f7f455ffac217f455e857bef4657df98b5fd29f7df56b356dd9d790ffd997be52cb7d0dfad5af7c45967de9f35fd0573eff4579e3fe22bca9d3e69df79d6f7f1b0f612b3e0adeb6fdc9be498dfcc561c3b76f9dfb15e83b7168bf9e7fe6491d7af211f0989e7bfac73af2cc8f2b3dfcd4e350cb8c4ef6dc3ecb40a58fe9e0be8775e8994774e0d947f5ecbec774e019e309ed7bea093df1c413baf7defb75f73d0fe89e7b1ed2ddf73e0c7d543fbce731648feb9ebb1f873eaa7bee4176efa395bf1bbe87e577dffd888c1f42efbdf731dd03eeb8e3413df8e0133a7e22d359d612cff93df7803d90fcd889586c57f6ec1a1fddf3d2f1d37ad9ca4f66c2cb971fd5f5e31febda930f52ff715db5f493b872fcecc2e2f89974f5e248bb07cb1a0edb8ac1306bc8e7746301d9229fe18d21f46c18f853fc8234a4fec2b068f7ae819ad4aa1d2f2b8517f4d6472fd8d47dbacd4a12c192c62402a8d210bab81e03d2468351a6674343593e058b4d440b8b6af8e4ae08d5334834aabc76f83520208781efedf3817d3e501d077eced099fc6bdf9e9a37a4aeeb572c48fcf4a1e12e69d76ef1b55663bfa133168571e66b2fc31032bf9511d8cd9bbf37f6f1ca48e27b70e2adb9b0c9d398f82549a63d72db2af3e9bff414de1bb4eb9bba7c608ce1b4e97879450b03fa056d2249066fe9d693127ed3d9af08b4181b15e3b3f880cfeec3bca266b4a4345e829e508c4e2a9d050d79b5ccf884523eae688fd177d0c2e725d22bcaed8a5a7ce22f1823fc3162005656a4a5919174623cd0c9958674d2f24ad2ca28b43c829fd09a463ee6b3fbcaa811ddd7d27270101b6a44faf8c9569118dba937d48dbaf862976df550f762f30f2be4c5d6a573ebcf1eff2e5d56086da192d26990df22c14679bd2c082e0336d54c30180e6817be24020801e864918e1335fdd3a2b1525a7e3f6e5558e841e088f131196a9758fc4b2a04820c5fda65d2cb945bae546559c1c770e591462b2791af901e63f798054d2384645a9ef9c6448d79b4ece8e1fe3674a4302d0ac192e04f235a0ffa17e4f9b3b94c4f81a86fe09b5acf8702ac55d8cf94cd52066e2fd3a676fa850f78515466284d3d9c3548d9c70d1b59ef47fbbb021f3aef34f47e37a54c3f06dec419cf3687da3aa6898ddc4e4f0c89cb999f1da3e565318134a01f8931ae1bb1fbd266d54d17be977136ad9b7c4f2df7269ee8bc11d01eb23348d7cd9c0933763bac53c11774372949c6b99a8e6da71565bd3625cb9bfa025e598ca2cf18047100001000494441542174c05a5d40bec860585e417ae03ce032ab403ed4588e030d878344dd26650d396c34d5c4811ad640902ecd824ac326ec835842fb6097022a10e1c3ef1afa74a27c33d8ad04140b4a6ce2cd708fc665a0ccb89ed6a71d28a8eb6507f67ba32e33e53612bff865032d6950464a6d5110ec7a241689716adab253612f45e1c9497fc8660827620d6160e09715c5705162f1066f534d1aaaa1cc20351aa4d0c204e65db721afd241d2b049b5ac694a89f249a68d3750896753d30e8824b7744744ad4f3cc66e89f8246216323a563714f26b99460aa00405d01c04954abd490c24f85a2602de654183bc2a0f36904075aa34905b4cc1f3735f265a7329d527059f15fb9779113e48257ca7a01750f2e4bc8a248561df1bf0c2c74159f233b465cec865ea7890cf0133c88b2631be8c418b8a084584b672b9f690715c004d4a6a68d3f37bd7c2821669b3417f933ab9f356816c40d92625790e370a2cede0f564586e38586736f1013a854f0a7c504f4d23f1a6af192feb75d5c2da2d6cc211a188b048ce3322ba7415f2b03d90d5db76362c181f661aec4af0f540c2d20946b52f685d12e380802c366272431cd34b5d738895499b16a8e1b431a68f19ddc1d865e6ca4a3b56ee6b21739d39e61ee83dd0cdb23eb58368f2699ac59c581ee1853881909d2b82c34062f50d394597dc109c866c8649f29b1027e886f3bea072c005c1e7b3202f21333a79a27c9c0e0700740bb4639670965210c4a85fb2ebd016bc14dacad5503fa2d3e1c0e3e0d1e9a30d82898487021e64784da8830da6615e52415e7a39bcebb85c4596722ea8b48e06aa1a30232cabc91dfff0b0266f527822e3bf1efe72621fe629dff679a6f6b9818ba9897fa9dba5cd4727f3e1002e93ac6d047389adc4cd65d600595bba5be688311e8fe5cfcbe6fd665e7296dfa47bf8a49b914dc3b2e4f987059e0e86d324eb9d22ea5ca9096fe8d48fa0234df224ea5033677c7078cf38a2e5603a56a3cc8121e3af0e8974c2534d07da6d41c15ea365d00c95215e1fa88905e85051127100a8e1bf80cf8ac066b48858a318ab47f0d399229306cedb00918ada421da8f9520f1f4598aaaa8fe7fc9ef200fe9f4aed3836edb81ef71da6e75e20411409f32cba9ea6269458e8a611a138257f3aed80e5b78d961fb99a08ed1a0c340c79fb96035be28010ded088a8a510a0a02d93ae47862f969f064eefc81201a6e5e0402c937929b1418a4017048a465bbd1c808340821bac54eeb3e883fc06544aa71e1b73c7513255ae282aed1e13597434636327e7d917c337c2a7814e1f1cec37119c287139dedb6673265857dfa3b14c7c13118ae850fd8eff990aea90a00615b8994ea4614eb92daf224f1c60dd1151456e2f29707fe659455b7ea4a691fff4b9d78ddb321a644aa108da9ad0882e1dd1519773e3a752cb32feb03ecf51716068fdd7d506dd9c6f59579af02e3b33a2e18379889fb8d938a51c49b944958d1535dd5a064c7b142519b85685c3bc2687ebc261bb50bf3fb854bbbc699b81a211adad52a13650dde8499b465bf304351232bbb0e5673afffb1441fdd414059ff4333fc165fff539ebdde108d6c70e77c16af7d32ab7c398ccc2cbf4995fb5955938258a0a0ba64033e98cd4d4e932916f449b10bf0b66d5dfd0da911a10fcd6bd4b232de4650d790b1a10b4fd690ed5b4e14030a08505c027d3901c7ccf045ece15fef49d06329f0924822f04a296c021a7e9c72c37877e35045a5b945435776ae883b05b1135dde539df1eeb102a727f3a64f80e9e5006d9ea9045139203307a830a0db0ce469dfedac80e7d0cd82882838d61bf048352981986f9de2db80c1f0b747e8e9285532780304765c0a2820d03c6b7370d2a07fe4f50ff81b441c2fb8c455307ca7a5c7006303f02255e43de900d6f641ef0701b7502489ea6eb30692a33fc55ee3493c4bca04e3aaf4245812e214fdec0e94fa6ef693890f2ecb647d03877f61c44b7fb51a25146e6b60cdb5330661d65bc4a8564795652b01edb4241ea2b352a3994cc8b3ccb73a195cc98940954d3a15c691db73a7659b2ac50166a79669c16860d626ff6595e3f2db26610b25b5c463bfc8af0a0d909c90fa645ae74273e3a0fecc09e4734a51031fb4599991375196d821616ac3fc3f9d49e23d505ee4d9fd58747b382737e22389b0a5e5ea4e414dae841923b9f195ee81b811a5b5ecc0478db64523708daa9d4ba2b0a4fdb06e96fca74ace51320f34432babc333cadae664dea4dfc51453bf6d1fba27380376375ec999ff8db9981ff5cde5405e7823a7e359f34f91edfaeacd84ccc819aef76e1b7e1ae2d8526f35f5daba4dd82f3fa26ea9c2751d71af9b01bde2eb75146d53755cf7a362ab73999b58ab50ac52f89cdd43db04f0dafb19e9a77de34bcde33f50cd52bcbfce97df0ea0805191d12bcd6214944141e933b705e8f89a8e65be671ef653b99da17a7f7df9e3c5dba13243bb6e7b9e1db55f1b2b00b82b1de3cb2865a4e8b3ac16fe8a6cb69a8154eeba326a9456d873181ae9582f798647e2cad6eee993ca34027e077b5b20e2395045c7f1a55174148062a67bc53ad8f0e8252ef8d2e604d2b247f52ce01cf75d6c141f0544cca4f6be978ebeab8f9b3f700917bca5f751c10558a7c9daf9dc6d7550615e376fa78f57a7b6a9fa3d0750dd8aadbf5fb2233526b7ea1aaec61ccefd34b6186bc291b7d19d39aa678cf3bcd8e8ba4bb2d37bad4569e19b5992f6c6336ca0e510fe0ada21e8e0af9f01359e24b8ab15a06b9f84dbcd4b5d8d217234b754c8a247834cbc0e0e0d37094818cd47fa62fbc7d3bdf209fc5cec12b5126517f03b88ccb02eb73790aceef290fa4fae9624ab08358cf981dd4ddb5ae961cac38c0024933c2da6ab081c92c62f3ac5ba7e4937b5dd0c8eba2afb495d89465de8bbd529bc1c2376fc81769e74fc379d310f52a5c7e8b402f9ed88412dbd7179ff0e8e8fad5cbcf40f1f51972e6e273f2c0c4df756e485132a1bda85e1e83caf0301fd0c9ddcdcb9ae81e9b1bf0aece0b3c2756d452a7b557a5ac88894dd3652759178584376e7c5969cf93ae072653fb771ac8620a620d96c99a2efcb6dda51923fcbf160fdc3587da4469286b20f3454f1a9091a88253eac60e953778a8d365033a9dcf7103053bfcc67fd5033dad891dfbd8b15e48755196d210591cdb6641c342f7efe40b3aa185b25c3180f27ece52f39b38ca995add1366f546c2825f6d93dff3c3b0b82211a8750a3269632257c76bcb5722a000b605abca7e4cf8caf2c835f8c0acbb5dd258275c4bb8ce69209b18c5737eaff3809dd28f41473363308d75c59d287e88b7b98e9efaccd45f93a1b3b00d793cd684dbc2a179433d9edb1b65f8cbc046f28d64d6e1f2063be16a11cb8d2a5f95cec6d87eebea619d469f0ed4ae4351f5b9cb9025791d4beacab31e48eb0c1755c5309c025b30056ff68c5d3118af32055aeed62a65cc5bdf199a9a8b77a8073c937664d7131ba23f1f0b3a2b820dbde133dc20673edb151675e97ce905c7a7b5c269bae5149e2b70b5e56cf5020e005d50088974453d95f7e5a02c6a9d0aebe8a1edbb0aaaf26a5b2402605726a09853cdebb8177cc6994a6cd4a73395dd21728fe529becd1b76ddbe23a396876e744ff2fafa1ecf3a7e8c4706ae629969dd552ab37d8fdac439a8f3bc3f5bd933e5db03fdba313d87a65eb048668e17fc5fea1face2d0c39a554d275c04cc4fa3ae075b02f077f8200eba8626b2428a3c9ef5ae4936fa0c1c6bfcf5ae4797166d65654a7765a49eba1c62ee4c994e5ea2a308e7371ef01fc684cc6f3cc00ce4b903efc4efd801b27f03233a9459e0c8c362ef36ec466d0cd56a51e35883d346e1f7762358fcfe3257bf0ce0f7c4c69ff202a7fec1040d14f01b9b7f673b0d6cfa690aa8d8d29da95d08521da442b01069d58094c8ed641979b6bc4a367ab82ca865a0d4cfd537496b54f0c64486ce8d34ed2859f501fe9af295e08dd2fbf25487e0db5e94037f829a8616a05a3faaa83e6af9a482bc8437ada48c6ea3e66ff3a3f6a688d6c47609e063024d5d31c59b3db58c97579539b3af0fa5235a85f366057ee97c3240dd02301d2897a1321b7b07f3d36858e3c690f243ec18ae5faf855eb1a63b9392eac61c19ea3f2303e5f7f66cf0993e830224e49429a72093765e2f37af89ace34bd7ccfc39e501fc3f95da69acd7de4eebf35a7fc3ab8fa5c122e902a317d6b9a7bd9c5caf386cb188ebe64b907003dd263f905b3044788b9a67971b2eb511fa3cd38dd0d7715ecfcf46f3ba6a5951d609ba846d36ba14cf33b4dbd7ed2925d7ee0c6b40b8ada1629d5e3266b9dd9e51ebaeb55193677db8ac71d6421720d39e60ceadb6649b0c311e1dd5ead595adc9a84f3613297912d664f0eccaacba04896f17f1dfc628ccc3c2a66e5987aebc90cf9616b33f533b4feccdd2a9e31a4562d3e241593f0dcb3ad48d5be62d177ab0662da9beae8ae0fbbbb7bb4fcf4eb1b8562e1c72685925a4428f0cb92fc07c0f392f6a95c92361f3608244ee445cfb9caaae2a096feaadca641357cd778e3b5bf0cd7a4885cc0e31c5d3d0449e256297b6e54257b5c7b4579860e88f1d02e79b2e9880a45895bb5f49fe43c06420f753eac6754cbfc65550f08cab1424fedb41a64ed7cc191f5dfd44ed4cbb59fe334aa9f6433bf2b2277664c7dbb416d5120b363133364bedb81c2c3b90786b6ed033282b32fcfb7a9d587c01088d98c22b60cca4732dea404a146516647762f76162f340cd36dc19db32cbcd748c714019bd00fb3013d94653a550c680f8365be1b2b9ea93f5a043f8c14842373f55585c515c7146acab6b5b27fea4bdea57e8aa66c6663526ba6177ca30bf0eab35cec0d0cea6ca9f41cdaab8d3e7b97236543fba5de61a83456d7c5cfb34a1bc518a74f80b9069ed6c26a85abfd4c640e3d44013394911051d59fe5c994bf056ba310aa3d8c3e57ade54e4a5fa73d358c11c57b4e8c4d2e850131e6f65f24b37f769abca632c81863a716a197557048a3a56182ad5f1b4fdc8adc71b7011579e0dd60712f6698242da3853ba97fbe7b6ca37ad3cd70abe108808fa3aae489ee7752c86f81cff62a5eb247c9f90377c850b64ce69e8473a055556f5496ecfe50a3ff15987b053db72d17b8c701fda1849d8a67a25c93ee645a510dbaa68f2086c3754297388fa238a8ffda7cbb1cbfd26890f0ab170c4cc5cc647638da3688cae361626b46b1b35e47bed6e1698689bf091b984fd03cf438d2ddd91b0df7764c7953d0514c9b389a9d7398199599973a799a286ab315fd1d4b2ac8117338d44619532c96b6ba45dce701d4c80f5f354207ec1db755eb0d00b16f09ab52daa7e38bd78e79f89bc96f194312632fa3fe120961bb078c14fd5be574e0a7ca1f377b91f85368cae95536ce96dea323778f6e537c8ea45d5077de27cd27e7c7bfa426d61bb37388ac564ee112e99769dcfed9becb9880f70114391e18a824444c89b4cc4e9d49b88b84c2342a624bbf2cc671f089c16bce1b4214ab6b4e7f9255f95c14619164885b9d195b5cc40469d2e773d2fca567948113cc4e5b198b0a4ce7c5ba7b14189b09c8345f146090d7cd7f771adcdc91860436d6e8a62255a27f970d5e72a12bafafa5d1fc5556b7336215fe693703ff204fadb72f3135afde6b4cb4c81beafe975fef940df5ea7bbf30b7da5ff9638d7d4281e576c72c85ab54b00001000494441547f6c7960b70f285d1e5ef2dc44169469b2289d277d7789e0e019123e499439678aae8cde0ea211bc4f5a6827b523efe931d9510ee0053d76548737ecac9768526101141642868a4522d349f90c755e07d5b08d88db5327a40248b116b50a9d7ed562f5e17ae4bb5a0f9233ddae6f5bb15da6557fa02a308b7ec1aeeb136951361b189b0185b96dd31a5c6743d4fa14775bab70fa22a1da93a51a60a11e1df32099efc12655836891fce5681a49052f64026ade3415579d17f24f4b46520ea604be2940bc9b89373cc1177c6e98cfc87977a3e040d9754967e65d81ba8c91a993832213283ca634488d0cf11b6507c9e3a95abe1bc3e97429b19adf2aa8898d50cb49c8be8b5290a095af0d9446213c1b7c2f9fa67efb74baa7ddc6dda2c7ffc644a6ad229a94af08da632c2acf231529e8a7263e113617fa2c5730b0c2b24cbd5cf36c4da820cf05b3001a24ca1697c1a72eaf2d5df659a72555fda72acb088c966629c01715c9fc98be66e64da24f8185626ea9a6eb4b00fdcc1aaa2276718819a267c01bfb58c3bca2c576a485ccdb7beeea04e55d6fb3b4d0b23fdfb7b4354a43decd776b9c76d1d6cebcd3ceecf6bcd7eb3d10cae138c18340d2e5313558641ddf3f91c1e6a932ae97cf21b044a122b7cb6bb5bcf51964cc74bbae03740755bb2c9b56465e4cd2f487f841475dc6b07c3dadf9166f04ea6f24be24647d1f31c69b8d444fd8a83a9af18c5108b85962834f10ff73bc615e454465ca9c4e3d54e994fcc66df5031a8d0a9ff333811546415af5722dfb3654e40af0f8afd08a8c12944256ebf2fb331bdb5a1e7272ebed72d493eb2070526c9211416aedaef38ae40b51b6224a497db99ae011f8ca5d2af883247701be3bdaf74614aad6559a9da4509e022c77acfa418aa8b6aabbbadfa4c37d32e857c1c94686b726553936928e705d5ae4e79282ce822c53de65025edb71b93de3345db94a4abfd3e377ad82438c4acd77b60f8cfd4131aa7840ee80ad7f41ed648c1b059b79ab8532d2b0fe3439e61040e1dc563d31f1fd3953650e08ad86d46f0a2a260725a42476e6cd4cd9991def7a5d574bc7eed067c105c58161c3052de7a85f601bbba89b42994c03b2eef6625f2720e1723960b6e1b69e82ae1e0e26415f3abad680cb19aa3d92baf28990d0a12fe9de74c8949c4657735a62beaf773169c6c9dddb6af5ec9429a46b902c750ced138ab2a9777d094abaaf1edf33a1dff4a7f37b19d509d1046e6f306c364ad628457454f5720b8031912c37480bf07baa2641584e1bd4f538797c843ef386ea459d4a79f41b0bec66ee8838a578c6aa2c4df4f11b5ce5bb5991d5533153a6617f68724584ec02e757bbfd707f412aaafa2bad69cada57f0e2225b326fd09a40419961becfcbc89d0eea06879f4ae1b5d5ab58ab14d0b00db65d1b5cf60f3ea83f934c7891ee4b7a33b74f3a74d2ac60336f80e78865995e8c35f09b393ac895bf7004bf7d07bf7d6f96361c0c16db652d8e57b480ce853c960f16fe731ddaa1d7d40ad9691ed8c15d3fc3507b51cb8bd49b8031e11334481bf69ad32a5692d91c26a04c95b350ab0ed27e1334ef37460734c3b57ae4e8b9d9683ea59aed771b5d7bb64b041028b6d8b61eaee6b2c6aa8cfe557b7b4a1ddb5e51a86139c4fd875c32f7997d68a34f3733e31139d03a7013c09d2e930d643334a3435c39ec21bc52c7bd20194bf57335259cc48ff6b356f32decf22c0ff2d523c64cab160b337ab20a6fcd0989c71441bd5dc78ca9e52f84063bd30495a779a7cd5b8f684df821bc49829e2f6c96d9796740c167b5ee243fd346b6acd0236897af7a2181164ae64abbdfebe1f149cd8376fe4136f145d4f9467a92972672fbaaa8450f795506eb7b2ba0ffebaad774204a12872a1e1e858a88504474793cb359a8edaa7d81c70594950a7ec8feb2a0ae90f31bfae3fc510c358a4565b24aad93b5596a9f051fd92b5c193d96256466772218b19dd8ed799f7b0f040bc170c0482ca924070a845e1404663978105cea26695985030a20e0127551e5f2ae0728ab5a668cdc6526b01eeb773e8b5ab51dca574ad12ddeb50f36c3edf476d9fe821d15b4e5b681177ced0ffc7a3b28e3fac6aa0e2ba50fb6d3e5817de485636cd1eceda9ee08295b634ca924588aa02a02aaffca5a1ba19c9246604ca0f69f4ac63baba375aebcf554a03757f0211bbf8837a6d08a82cfa9a609aa2a47336f502acb32127c624c0288df53837a4523f2286759add7f1ded8b09a3c7ae1a128894324fdacbc909b9f116ce0c16ff88a0566e6f034585eff4ebaff5efa46a0bef8ca50a0053d8531c8950e3abb487bf32eb54feedf0af2167070719f0d7b9f7c97b13fec37d17f5323579fb9de18bf8ea9dbd27f6f7e2df6661cb0f5bbfa779d9ade9fbc59aff6ad51f1a773fc50f8bd3a83e23ce658dd94a19e86dd3c4bea284a230bc315d10d18298dd9e48f0daed4f3832beaff0ba345ef185da6d3b0ec6c18319fc7983a6aa451135a615eb7d891d3583bf5c21d3bb5eb5dbf3d193b6ee73ebb059d150497b4ba09b61281a68379072428bf57551965d5c3e5aa9c7c8294aa0ef32c2ce71939a3cf28352089855eea0fb9b3fb3d799305c1a65179b75bdb996ad7b21ec226a34ff7749dedae4b00e5f39d6cb751fbe980e4fa997e60336d8ab6e12eea9dd8e0c4c6b16644bfa443721e414f6cea2dc12e4347bc798ed9c046fe9f08f90f11c13bbd198c08e62e3f2210b71c7c0a7e2cde90eb66bea428808d5a6c4c292f9306ce03c9322036aa306a3dca53472001915fcbb1f1073eeec6961e7a080c86a0f6cdfd737a336096cba875928a16d4f2b658e893f0450fa78d4c9e61fe34140e02659794013f1d38bf2bdba0b751c6dfc237e13541dfe5b944dfecab124b52952d4bf841821ae4bbeff681915c17595f26cc532fe1df709eec0c54cd72db07a7d567fe78ea7030c96cb2aa7d1c528abee22ba7337d0e2d22db251f780af3cf7d6d990f63fc6514ea16fa5fc8eb4d2bc168927f32edd5e1c12bf2c1e14deda1c14dede1c1f5e309cc9f8a4cdea928c8cae1e686bc7fe1867c60d8e139741e6d5e365ed6956ddfe64ea369a77578b5bf3bb7e7ab2e301325b3e48ad48e356021fb4c3e3e7c483a710c1c9de008f488ca898eea442f9fa6d3f953e58e51e6e47169e9b8960e1fa0c9b1d8d195d930b7e3ff8a94389d0b5d22bcb80f270fef97dcde49ec3f7a583aded9524e76f6b90fa74267e9573e467d749db4ed0d93c69bbfdbe24092c79746dc486c6cd3c0c1f8195b09a06a1675f2c449bdece5376878e5554abbf7aab9f24a0dae7ca9d2de9768f092976a78c5359bc660efd55ad87b95060b8bbafa9a97eae5d7bd54d75ebd47d75db357af78d915ba1e7afd3557ea65d7bea4c3cbf6e8655378f9352f9171ddb5bbf5f26baf007bf4f249fecbafdddbe940e7d557eed5938f3fae438fff44fb1e7b42fb9f785a079f7e564f3ef2b89e85dfffe3a7f48278fc49ed375cd6d47ae00f3ef18c9e7c629f8e1c59d2fe43c7b46fff111d387c5ccf1c38aa03a4f71f7cbed2ca1f3ea6fda7e1b80e1d3ea17dcf3c57e941ea3e4bdde78e2ee9c9a70f68b432d655575da9975f77b55e71dd55f8e10a5df7b22b2b5e469fafa5bf5ddfafa0ff1d5ef6b2bdf8692fe90ed7be7497aebfeeca895fa1d4bbea8aa16e7cc5352ca35675def3dcd2ed4307eb2871e8f3cf1ce2b0d7b645fb0f3ca7670f1cd641fa74f0e071d2c774e0c009eddf6f7a5c961d3c04359c7ff0a4f61f9a005f1cc27f070f1cd181670fe8107a9ec3cf4f1f3aa19f1c49f9c8de9ffde1fe97bce3bb4fef79c7779fd8fb9e6f81effe64cfbbbfff93ddefbe1dfa0370c74ff6bee7ce27ae78df9d4f5ef1debb9ebce27d7743ef05f7f7f8c995efb9fff197bcffdec7ae78cf3d8fed79ef3d4fed7de73d47ae78f32d47175ff5e096fc7119574e97b1ed73d3b7ec81a28653741382b2a7af2cebf0c1fd7afce187f4f00fefd07d3fb815dca67befb815dcae7ba077df09ff0364a7e20ef27f70bbee8676e56fad75efffe1edbaeff65b753f72eb3de9c3026fd134ab4220d96a174a29f2dfa116ba4e3c77408f3ff4a01ebcf3077a00dbef771fb0f95edabe87f4ddf0c63dd8398dda27f2eebde3fbbaafe236dd77e78447d73d77dea9471eba5f63f46b3cc2640e40bce5a5e125b07cd8cc791dc4a6e9db764d807f765d7195aeffe9d7e80d6f7d87def8eef7eb67dff37ebd16fa33c6dbdea39f79fbbb66c3dbdea537fdd22fe9affed57f4b1ff81bbfacdffccdbfa1bf6dfcc6afc0ffaafed66f7e40ff3e69e36fc3d7bc49bacafed6dfa865fe16b2bf0dffefffc6df9061bed6fd8d0fe8675ffb53fa5ffff9bfd07ff7dffcb7fafffe7ffe27fdbffe1fff8dfe87ffee9fea77ffa7ff59fffdfffb9fe87ff827ff7476fcceffa00fffc927f4e18f7c4a1ff9f867f5d14f7caee26313eaf4c73ef9796d844f7ce2f3aaf8e417f4f14f7c561ffdd8a7f531f0d18f7e4a1ff9c8bfd697befc67bae3ae1fea377ef3d7c1afd1afbfa9dffc8dce277ffb6f7d807eff8adccf559fd057fbe1df87da377fcbfec02f7feb377f051f7e407f1b9ffec607febafe83ffe3dfd47ff41ffe07fa6bffee5fd6ab5ef50a06dd731132eb3d6ca4284ceb658d7d586d92dad158f73df0a0bef0852fe9139ffc8c3efec9cf81cfc2e30b7cf3f14f7c411ffff817f4894f7c117c1eff7cb1e213d5571dff71fc637c12df7ceeb35fd1473ff2597cfdaff5a13ff9ac3efe95db4e3cde5cfd97bff3f9dffba56f7df90f7fe9962ffff15fbee5cb7ffc97c02fdcf2953f7e1ff4bde03ddffaf21fbffb962ffde1bb6efed21fbdf3e62ffde1db6ffed21ffd1c780b7873870fbfe5e62f7cf8e7bef5e53f7ddb77bffca1b7ddfac5ffed6db77efa77ffad073efc5f7e443bf4f2aadfa15d9f77db1e188fc7bc2d67a594b4b0b0a0410a16f4b246cb7c121cf3e9b95d518196f19262b4d2c1fc29a8f91399cb0775827462032c2b4b5a3ef1bc46274fa864ded0d98152e100d1b636614b28e817fa1c940a5f19c64b27b5425bc2fe813f4b6283ed508bfd13dee97570bfaabd53fd432664a2ff63be2e8c39ecd8375a1c4abcf916fc56b6c17e6dcbc532ae1bfb84a2331b218ddb8c774269b8a018ee9278fb92cb669725980f16a5c1ee19415dfce0b9b37bcf82f6ec1d6af7aea45d34b3672169cfa2d168d72240b66b92b70bb9f9ddd0bedcae45512f40d16e78d7dd45bd6baf7ea99e3b7450a3e5158d4e2c6b7c72a4e78f1cd573fb0fc2af30af3cb766c312fa9e3fb6a2934bad56467c0007cb2b45cbcb6b585acada082797b38c1327c75a5e099d5869b53c2a1ab549c74e8c741c3b17f0f722f36537fdd8d5f775a191fbecb4fdd4fb61b7f327306fb8cc1eeaeede459ddd03fc9834e4cbd05efcb87b21e8fbf3dad2852eb14ebc7e9aa6a9aa02da607756e8c8d1e3f4714cdfc65aa2bf4b4b5205bf0e9c84374e2c0d74f2e40079d212f4a4d34b4d4d2f9f948e3d3fd24a4d4b6d5ee4c7ab2b757069d778b0f05622406d72fed8460fa46dd4355775d9792088ef8dfc5b57442882741425150207017661a0815a0d620d0b4e4f61c89bb1cb54f95439cb8c05490becdebb06030d9b84ee402295141a20cb5db2ca66792474701a917251a3d0226dd4b668b359b573a4e184af143b17f8edd658eddb24df36afa1b07f270df884c1adda0e3e1257cf71257100001000494441544428d210ee12be4bd2603854e2b378340395a6916220d9ee21bbe6221b39bfa92b42c27b9ba7494a8da2492af8bbf09b6e5b96543804150e53460bdfc2b7ed3201fda4f284165350d3958ec85feaea52c7f2d28ef8e5e7a89a482074fcd831edd9b55bbb1776a38739497f9a441e18bacc2669c2f6a659501aec5233dc53698a45455a008b4afc5c11692d1dc813f9091ad08ab44bae2ffbb5196ab86baf5c6f342eca994d8c3ee4be3ff8a1e45177a8ad7e5aa61fcbf499be571f2ccb7eca13deb461ae8e968fe39b6525f32b27d92c4faac1df8b7b77336e34c2734b377e0ce0af5ded4a8b7d2d7d186a61173ec10709047d1648f657c5a202df28ed86eec6b64525e655c22f291694a0816f1616af5229ac13f24aeca2cc1e2d955d7bc77baf8f2dd97cee9577544956e48eeaef299ddde1ddc71b291aa984c6a39660d2128432c1c30106f0964aa8165b7e07028a834a8ac2822d553650475d66c0e7dd69ea72e39525b57ed3e5cdbc10e132a011f1d33dbf446fddff45c40536f34e67263802deda0bb6b7bc7dd83edb61bb2aa50fdeb09d36aacdc8ba7e65fa05aa5f0a7c8b5f96d1d9f201a0a8f8350e3f897e2ab131d234452fee6d1bfca63585dc5b846c657999df7257341ee317c6b9247a1d499dcb82ae044719287ea4978ce6b9a7294c4b833a8e2de35ac716496258694609a6a352a54d814e90f03353af93939f428348a2ca2a9a08bde48a2b95b08d29a721879396af2263c6e1ca3d7bc544e57764ea16313eb351dbece1f4d7e696af19a3b6688c0077555aec33f4f734634bf51dd4b2cc2a883414d5b4b432e60dbd2833371a36f7341c385781f10d736c90a4063ee13858fa25faacaebfcd340dca05f2d0804fe22d870216919a41686161a08115898baf233cb776fb40ecb1435746531a3452341ad1c99531f180fe934dff82712ecc1550007d68c963eb672e05f3a888d389582ca0d434c554f0cd12a7f634d8a39571d1c99515b57690aed6fcda7e0fa4ed57799968cc3bb7ebd3233466673572244584121175613054c389dd7c2e6395ba194309788580dac30bb810090399034ea1dc3415e51709400bcd80e0d5e9b65e91ce04843141445bb888130450ecb20e026883cd11a14641d01bf026b788ed6c53d85778330a02e3b4ed9dfdd4777e0521cd7da8209811c9d8feb4381cca9b899aa4ee8296a03a41ac135cc42736136a3b0372c7053203e1827f4619e07fc695a40a51b6607be0bc9600ab449edf2e5352da241575d5168d1967086c467f4b33a685b159d1181fb6cca1cc3cc9ab7cd6982f3b358d8c2c995fc3b84b53eff9e79f476791c776375f1a6c7fcb580ee853cb98054360d068ddd437435dd67dae4849e199e3f99386b2fe069a90a7848f36a0d1a46aa769c3170f53f641d52b1a25fc99e943f17c2a45955220e8bba0defcb2fb5f31e933cea832eab9ee6834526a4289f6dd5f232254d037e2b0a6ad5c7cc1b11dd69515b43150b08e82b692ed270e140e5a4ebb6fb64111dc2159de30675c36494d48fe6a30643086912b1fe48fe9e758a166715103d6d160d06890220eebb05e14d725d60986e212b3686ece05f6008bb22ee2016b3b446c2640173970ac709a6e22a9434083c598269058cbf0aae8824e209b8015de24028f4ff90671de8143be1c14683311309cdc0a1a822ed14342a7b8dc4605c1de7d4818c95d8b3449950e4c43f4474ad8d844a20f869025a5d4c172bfd93aa88e397c586f6d2735521a7410ca74f12ef665f5ff4a9ca908a652c6a009d8200278600be3c02b166fb54981df860b0b14a59c379c9940dda6c115bb341c2c68c0269b52923701fb2982bc34c09f03459314e4556af7e1c3443af9336e2d83b0494a55e63a946f92868b0bdabd7bb7ecff637c7277ff9c5ee170e643016713cd0a7131d365643650d384ef8ca89bae37d9f528ed987db847c6adb9da56d8601b7cc1a4d0686c59ab6536dc88a04f1244031efe0ae1791511c882bcbecfeb69d82731902f1f26d3b0e3bdd9f76d0df18bf3b70a8f8b6db7eee59565be34f820d6e28952d1e2a1ccfc1873f06891642691e183da989f59725961584e4e705c259f645e2d2b17d0c0a6d0097e505f99fc15c6e170a4f9fbf956476de3fa6963f10e90f2c98fa9b6033a7af62e6602914b44b0f9c23b582482aa83b30389d31b63529e1da51893ba2e1b133e13081cdc934fe504fb88a8c12ff3d651d870a3b8e5ad21023bfca6c9e1c3413f11401cfca206d722db5388f8d546db69385d9c4750add47c876af394cc6fb8f687ad8c08c9703ec14d97c4c5a65aed389556a18aedc4e684ff1bde9052b0e4796be2c426b1c13be9803e0bc43c11fabd11d8cfb0ca1e0b0e6f6ebdd0aefd6938df106d9712325fc7a4747e5f4b4ff22caf639575e2e431dc1e7563b75e8fb30f598bbcf5397d3e607bd60e8489ae6e8c5dbb76d5beb8ace432d2b019c8eb6761c02119a7f4feb15b5ad6449f761b8665a61d54f5757ca9edbabc0fd79659afe9ca68ac3a86b43973ff839a25f348406a145ae490bd6b7157b5dfed468422420d878b01e36da4b0aca8aeb524a5144a0d48249aa41884d4484e160e5ebb1616ab0edb2e7e7a188d97357f3fd7b95c9b2e93365de34552a1769ce092b66153b99c5d92bcabfa6d04b0166508be7022375deb5bc006e7f33588609259dced0439452d23027686ab2030d78085bec0df4103de5c86e427de1cb7e2ff5ad73a695f6ce04150c958d8f2b695fd16617368c7f648fe780e289b15881210a583125169767f5681983b6377c11f94965d85889b56d6bd0923ba48772aa9be719f894634ea3a9a253617d96e3bce30cff8b0836826e0631a97a2db5c068cfb5003d94fde74847effdbdfb2778b6ad1262719a4aa59ceeba0a9cbab333112a1c478351e5ba8374dbfe17a1e0dd340f2777e6dedeadc503adb148a085c81b1a875bbeec734b20abde9d1d63f63e1728d3a7b336ff08dfbcda72ed7439d923f094552c63ff6479b441b52d0871ce2ca20a1d91940a1a0aca0d661b8df2951c6e325c9bc22e0b67617ec2e893e636f12fa58932d6fe962a3b77adb417794388d340cb3a97de656bd2e027bb8f90965a01163bf120b1a9505b55154d03144a596475a288cd70819f3b1ebb335ccb1dd1e48dbadf072d2c7f2b89ccc3dcfb6e64debcf0e00d4f20275fcc9f0fd6287559579413b51e112308e1090e9b22467bc13c16fadaa5b70d0ec25051b6d9f4a4204a0b6ab1a874404b40e4e841fab70b9285ad3ef8426177d70fe24b573097eb083f0ac49dd187db8b043709dc93a4cbbb0cb60c4aca34bac3d192731765abd28276b744bc66ac64567fa3e793e1ba23fbdacfe0c8285750e4ed16eeeaccd37f78ceceeae7defd8f3fdecedaaed60b75d1c6cc4353df5707f7a74e222d7ed648ea4894d7ca0ccc1d907fcccba5acda782cb69329e966b7e9d170f6c6a659c170be64ae71e987b60ee81b907768c0722d60e323ba6d317a8a3f30dfd02397adeccdc03730fcc3d30f7c0dc03e7d30397d0867e3ebb39d73df7c0dc03730fcc3d30f7c08bdb03f30dfdc53dbef3decd3d30f7c0dc03730fec100fec980dfdf4f14c2ab183bb7fba43e692b907e61e987be0bc7a2062fefbf9f974f04edfd1caf974ee5cf7dc03730fcc3d30f7c07a0f44cc37f5f51ed9bed4ceddd0a3fb8b14dbe3cab9963379202214d1615d995254c03ad9362722625b34464ce9b1cd069acfabfd6ed3a09dcbe18e58f35144c747747416fb23baba11b13a7f222e3ffe6c7d3f97f9e33286f5f434229cdc16446cac2b6263f9561b751f8cadea99d7dfd8033b7643f7df6addd82573e9767ac08bb7c73abd048c0882c6161131a563d240df9ee944b425623d465532692f22b4fa8f7bc0b3eb6826e80c970f0dc619b22f25b17dd3c376f5bca9d3674344e0b6585724622ded7f4cc6c839cbe8f99e5a7629a0b7a7a7bd4deb3a46222256fb1b1148ce7e47442d1fd1d1b397de7caeedf438991a9cb2ab12cb2a337f5c561ed8b11b7aba8c7a7e31679417f656f082b67bd3da026cdbd9da70fe5660dd116709a65bb0bd0f9e6ee3c58acdfade7e98ae53ff15b6a6a987271fa09c9ea6e62f059cc9aee9beccc24774732fa2a3f64f0feb63b7d75610d1e98de8a87545747c44687e5d5e1e489797b9db6b6dc47cc2be9047238235be3d586d6bb209d680b42adc0233d1d76b88d81e7b23d6f454dda42b9d3cb6cdfe89be6962ddc6b4ec52e523d6fb29622d1d7176beef5344f4ec2a8d88fa56ee3747fbc2303f0dcb2e05d826db712a5dedcc19988838ebfaeaab59b7e1744fcdd743613fff67a01151d54444b5a326e68fcbd6033b7a436761ccff509cce3e7723ba851e311bc5c7c49c537e2f4717d1833bcedef81673dd7644d4762266a3d66154531c302bd33d22a263cec333e2fce93e0fe6d631eef5f6fe328d8873f6bfdfb423362edfeb8e589fdfcb2f368d886a42c47aea3e1911b1ce0f1bc922d6978988ea57fbd1a80d9cfa604e3a6f564cabb30ea74d0d1f4e9cde6e44c476ab9ceb9b7860476fe8131fccc9593ce045bd153830186ea2a7e6896eda0e44101c26888097ffc717dd01c2ed6dc576d7b58e1ea8eeee493b35617e0be875f7b4ea9c3c22bafe4c92972679810dc53e3c1bdcef53f32d332c9fee74c4a5e98f8833dbe53e18ee4f0fa70da74dcf069731ec879e9a5f05bf1dc65680ed11c152ec00c3ddf13e74acb6b3cdccfc7f9fbacd0e9da8dbb11b7ac9c1fa98bfa04fe6c17923115d7088e8e86a436c04bc7e78f7dd1218c4d5fa95a78188aeaded08481181c6a9db76e78ce9dda10166b5fd59f8dee6a916d6d853db5ecbb974386c8c88d54d20623dff42866ed4ff6999ff9099e14dcfd4e879d34b01b6c9b02d3d356f9cdaffe9be9d9ab7513ae205fce9f9b805d8c61ed536ebdac890b9ecb2f0c08eddd02f8bd1b900462695fa7fc8725370ca31d0388158d018e4e16e75d8bb211d0f27f266af045ad2461eee510bfafc7133a8ff3726952c8dc752bb2c8d96a431740b48a363aabaf248fe8b88391a8d9a458d077b341aecc686bdd8bd57e3855df0bb54e84f19ec85dfab31f615ca74fddb4d39630fb483f3c6ce479f52c3c61d6024b7d7607b333a51f9adf4219565455e519456217ce3813008e426aab2297927bc749ecc95c037b9192a0f7669847f4743fb7f574d5b96f161613c8cf1c21e7c4f1ee5dae12e8974613cba3170de1e65e65026af45cf60f75e2decdea3c1ee450df7ecd270f78206bb86d05d1a98070998bfd0d46d36bb87d8319cd8631b6ddfa29a3d0b6ab0b9e0939679e63eb5f4b9d0df6c4a9f0b7eb1dc28c86a3ed4bccb18e366b78c1173b04df83586aca306387483a593d212eb684634279794964e802535cbcbd2ca49c568b94263e63af1c193ad78ea4fe0b491367a1f9afa3fc5ade54fcddf8412251db68239b6dd03cc886dd7795928e42b95b6e30deeb2e8ec198c4c2a6a585f758db1c896c64569d7157aed9bdfa557839bdef84eddf886777478fd7a7a0372e3fa37be43a6af24dfb811eaf40d6f788f6e78fd7b74fd1bdeaeeb5eff36ddf8c69fd3ebdef2561d3dfc9c9eb8fb0eed7fe02e1d7cf04e3d73ffeddaf7c06c78e6fedbf5ec833fd0c187eed033f7dea5e79f3ba29f79ebdb69f7ed7a396d561b2676def0c6b7eba637fc9c6efad97754dcf08677a9e28d6fa37f6f056fd30df0c62be8d32bded8e5bf2de6cedf00001000494441548afaaf7a3db6bfe9e7f4e3c71fd7d30f3da87d0ffe10d0266defdba2fdfb1fb8534fddf7031d79e609a969e4b7a4cc58d421f30985315285d8dad32a3a51aec52ee6a3b44557bffc26fdd41bf01f7e7a39e37d83e70e78e59bf0b57d4e9ee7d10df8b2c78dc86e22ef869f7dbb6e64ce38dff09878cedc50656fd54fbde9adfaed7ff49feb3ffe4ffebe7eeb3ffd6dfd9dffcb6febb7feb3bfaffff01ffc1d39fd7ffecf7e5b17137ff73fff87fa8fb1ebb7b0e93ffe877f179bfe81fe1eb2bff78ffe13fd7bbff9eb7af55bdead1b7ff69daafd643d554adf6e7ac33b75fdebdfce1c7c07785bc54df8e4c637782e1aef90fde1f57523bebcf14defd42b5eff56bdfaadefd2aba1af7bc35bf4e77ff60d7de94ffe585ff9e30fe9ab1ffe8399f015d7fbe33fd0d73efc87fa92f5c07ff14fff48777df75b5a884c7c288a08b5ec146d4ce65f9c7dc6059bfa869b39d53cbf453eecfc3e0f1e6098ce83d6cb44251f4e2f134bcf9f99a56d95f3588526d260a8e1aebd1a5ef1522d5e7d9dae78d9f5e0c60ed74df809bd127ae57537aaa7579076f9bdc8ae0057beec46bd047ad5f5afd2d5afb8497baf7905ba776bb4bca263870eb1813da543fb7eace7f7efdb029ed2734f3faec3cf3ca9e3870fa9e5cd7fb8fb0a5d79ed2b74d52b5ea5bdaf78a5aa2dd8f612fa72e57537682fbc7105f6d9c62b5e7603653a5c59f99bf412f28c2ba17bafbf4957beec15bc48be44a3d148470fedd7e1676977df4f74a4daffd496ec3fb6ff499d387c40cbc79f97c62b1e05a93b61c1b3617b60e0fafbb47faef894fcbedc85a149b1b8886faed0deab5f869f6ed0958cf9de6b6fd49eab5faedd2fbd4ef6a971857dfbb29b74c52a6ea87957301e15f8fa8a6920bf9231bbe10d6fd41bdef636bdf37defd13b7ffe3d7afbfbdfa777fdfc7bf51ef0ce9f7f9fdef9fe77ebdde06250b7f90eb7fdbe77eb5def7f8fdef5bef7567bde8ead3ff7de77eacdef7d2f7dbc1edca8da47fa344dafc4575722ab14ff5c09ae608e564cf8bdd75e2fe30a7cf392eb6ed22eeaec653d35bce91f3e7848f7df75971ebaf30efde88e3b364d5de74777deae87efba533fbaeb07fad10f6ed37db7dda6877ef843ed7fe209ad9c38c19723895f27e54db87f4befe65640bac957d8f825a70d9de1622e4f72ac67c2cec9367b206db3beb9bacbcc0325421151df0c6d7a44c86f8a1a0ea58505c99f321aa6c9a9b0fc54f46526f280faf739eb4d4da3aa978465412c18047af9d4acdc6a16147eef4bb4814a0e25b9f62306030d00097466c9f9c0b6f4fc7a8a5d31908c34a05a2397356a397e2faf94238f0f0ca39515e5718b28d19d8636e8c816ec5f41df8883827d22ae88e0c94ddf8adb86bd94ef82edd53efbd873c6be9fc0638193747630079a0d803e9cacc267603cacd4e0ebea1ba78a4ad02a3e8a08c6ece281c6a5145a0566b19854e1f19bf44367e9a35ca6cf376f380d4df625f35286755b277e6ef0c7b163c714b9c86b49d0cdc2ebc7f3ce0874a7c43840451b83d468cfaedd4ead436d6b9d649eb8943c3019c14bc9a4b92d17d203116ce6e16990884145de9bd4ffcecd1b6fe559e05ee49b853724078dda1f070bdaf2bfb85b9b431811721099197d8cd7d485ce1a6409f63226b6db9675f6d3c7023405a75dae472dcf178caa8f009a08dcb6bf19448dcf446d11f734b3fd29716ee2abc82440bb9d82cd86b8221c66612ee13b62ca46fbdafe32e887fb537d68f98c08fc1ef847ded8ec07eb8106beabfae12ffa6d1f18bd4de67ba36cef59b036d78aaaaf38db564a9de24d9a934bb63fd159c41a5d1949f6ede2022e192089baa137e42785364b87cd0075ac7bda4be858180ce4cb07cd93274f56dd6b9fcf9d33c7a5ec8174291b37b7edfc7bc0a7f37e03292ce89242822ab1b0bd5bf9cdd5484c954d2228df1090d9f1542feb85717b6eb76d47c42e3ef7fb93ff2c68b3fa3f556c9d06d18916b8695b7ddbf0b6a5da01dfd335192783d4d06de0fc2669352ff007eafa3b22ea1f222cb43d26b89a96596ccf937e139c33c1d4e86d8fa0cd1ebac42fcf8d1e6ad86cd27af47967a2f6f73a78de01c64086d8e82687ae02ad9f7769c64dd581b8e8eef10e3c05864ed3701f8cba9ee8d7babe2605f2d5b9e6bc2649c8e4f998e02334ce747230947fdea8871b929e2ba58422420d489a8d0e392c35c14181f9ec39584a9175f90d7dc15fe8b4769dfa761e6b5973ee12f140ba44ecb8e066e40bdee2a5d7a07de0df644d9542c1c24e9320a2c05e83cd865d573d0ae969f4f28da8cb8d79cbf7eff4ecbc554744a861a31d0c5347276dbadd59e0cfeb86ebca17f6f9d378a1ddbe4ddb665b0a1b82f91ec4305954f35c8f440b6a60235dcb11e0aa9eaa2fd73dc42e1a0c1a2d0e1b25fce6b667456dcb6d880bdf44d8e9f0c86c17dc257dd7b1b5afb0b71a3a657ff59ff3ce008f07ee660cf21951fde3fae88f0845446dc6ba336fae05f9a582ceb0f54f8fe10b833a3e13f88d1c149ce23a6d411e0d5dcdcafcf450ff7648ed7e92cf39633ea705fd1775ec27d332499b1626b8e567a3e3e515b96c9dbfe26bdda40e2dcb3f89f9eddc4dd2a245155566db6a6afeb8943c303d4e97925d735b2e9007bc9023bc64a54c9430c4c99f558e80ad3e31451a600a62025966d4b709bf79f4585fd69bb7eba8a1436e87e0ecdfa0fb376b079cadc07a0ceb7060126dd436d970ab8dd8cbae2bf3d58e3e0d4d20b0bf47823782cf902e5fe1b7147f86c4fe984432dbef8dccedb9ddad202230b9030c4eea6eeb36bad4e69f17aa46f555c23946f51bf380b749f5fc596854ff335fd695717a0d3119c7fae5a8e14d9203940f5d636f7af0119def222e0eb55d3d72483ddfd33a87b07b8de29fe9fe32e756f3f087e76a44a3409e26691f5823bcd9b2eb7bc3b69c39e937e888907f06b2c8741a96bd10bcd9d39a1619b3a669683eb1544349e21c4b7bd0e9dbf2e9f49cbfb43c301f9f4b6b3c2e9a350e466e7c75132150b0ba117114771039052e67d48dff94bc2a5357cf9b6d9746955a58e4b011a12625829103d2ec70d08b08f98a80f6c0a6cc1b1c0d12650b847691c1d4340fd85e16f530e3fef840636a5040f5adc87a780b8a88fa9ba2f34a69097a217fee8c40be0588cb870222a84cad3ff04d6a1a722ef19b7edb42bf5166be62f8a04327706fefdbb3d158f5bbfb7c26f43e99cef7e6d3f8b0e5c62f214cdb78cebc175f9d9bb1eab77e1e8e462b8a8675321c4a89f9e0c3366fe61a65a64bcbe7784a52d73e32dca6e9b92231cf82211a8d46f2db7a9efc81cf889098f397906be7a69c8307d2399479911671d78d1769f7ceb15b0e00d3452358c8bd8040d1b3927d95e4d8634ca7d7ca9cce45c43a61c45abab64d34496cfeb3a2eaa08588895edb6c2073b0826cfdb66ed0b765bd11c17e4f2444fbacb6bb5eaf3302fb4104149d285785f94b0e53064d7c1d11eafda26dbe223a9ff4be723be6339bd0363775c9a9735f23f8ecce0fe911f8c1873cfb1c3e2214c13c0ccce66b8580f77bd3734504f5d197146ad0edf67c18b07f23ac585bbe223a3dd6d963cb4ae70a36f440da50ba8384dde6b4833a7c1eba5a7dd8add973d0ce677c19e750f41c8b9c6bd3ab7652c11638f8999e6333f362730f5c721ef01cbee48c7a01832258802f50669e3d9b0776fc863e9bdb766ead54928c550f909661c129ebf485374bde70894899b7835971ae1398666ce179c1acb6bbde7931e832577a76f333d9d3207951ef695bcc9f0f63acd7d858b70faab360636d67979ed98ab3d7eb73234e09127dc69c6e8b07ce351e6e4b637325979a07fac5156b9bf476ec7ca87de185cf6f7f94d305bc383e74ad6dd0aeffbc9b3363b59053a763cd3d7c3047cf0bf7f3741d73c9dc032fe4818de7e364b6bdc01c7d21dde79abf36d7d7d7f0e1e14c79eb4bae4f45b060d68be6a96df6c08eddd08b669992dbecfd4b4c9d37b3d52567f7d4376f4f1163bdb17dc0592f25152e6bc05f0a371d72003a9329a97efe9f04ca4921fba1f66f5de0a44ff6077ee1aeb526c57738b1ef6687bff6ac87385c6e848cdc589fb779e76f6f0dcf93f5b08dc67a3bd7ca745fb8fa3eafb7c67eec256b7c9d8f16173fd6a3e6215fd37fa6764f97afd7b43eb5d6ba84fa3adf3defa74b593e9d3e13efdfcd4fcfbbfa74d15cb2650f10a5b6ac63aee032f6401f10d675617aa54ef3eb0aad254e5de86b39970937e9a383e2b9593cbd6ce2dcaacc4bcd3d70260fd47f0b7d7a0bed0aa672ba4c756b25bfd6819ee7fb6c87e1f3dcf45cfd0c1e988e4c3354bfecabcca3f1b90ca137bc1e672cefa964ac2fe0cdfe920f0a35383a784e637d3fe6a93378a09f17b3d233a8bd5cc59bb5db5f88d61f247b479e4193b357b398afccdde01d7a56f4aabc4e7bfe6cd4e56cc256d674c43cec9ecdc75bc93b3d026f45db6555b72e252c8632bf3c41370b2af3195015e6eb640fced0405e689ef95024725a5cb58cfcd94d3c119c76bb528f2eb3d609a9a79d74ebcf2e90a018556b6fea6e1bc1f4ed223dea1b0281045adf20e85fc0ab477dab70fe44813f53bba7a6c6446ce2364d8dce16adfaf25cd22e631da6d6d1d9006721a4bffd79d3a2b00303a9edc0ee7e4ce4b4613b5741399785f4773f3ffab4289bd4f9abb761b3b4eac296b01a033f9a775beaedad85f0692d07753a78d86653d8f97db13ce010dae35c6cf0f88153d7495fd5e3093cfe469da38cfbfab94dfdbe3cb44e9b19285556efd0444b8ce5360b3f9d653512735cd0a2815406f2dc6c8a58a73cc80dfa91f2a4ffccc78ecbca41a66f2af89feb6d63a0161d055daa3a9d39c7767bc0fedf6e9d9787be682247a33698a7589c0bbfaa43cb26e049eb7f1e31da22fffdcd71196b25b74ce6acc2446f92b565a62f205d98dce3946833c90bc88b81e654b0c1d4962451162832a202872eeab98ca1c9df35b52e97a7108b2bcd04d78d5c142c449a401d3c69d1aa54b801b6d912f735db26178c96aa1d92ff8115fa267569d5ba59ee0785148102f49b57589a54fb510559a142d93213ad75b1b771fbd85680cc232bd54fb48d7637e5a063a824272ba2408c5ac67240d012c8041ff57274c9518cbe65c6d7ff4a59a66a7fd3a399ec773deb28ccbda431ec183d9de65c1a240d3223a085316eb1682cd1cf0c97f1a72ef665d3b6027cdacf998e9ea9438c0d7dd6693853f90b236f19a70e4183b61152efccd380acbb2d33d6d68bd755b7bea436a2a2a0cec86a55586386c4d8972226897c657c5140a64e41b8595aebe48c86c2365b94985789f6c498b4ccad9c8612fd53315d841f6a90055ab7c67ccc7559d4a5c19a21478e69c19a964bd0872056e4285a62435f8a5d6af32e8d5be6f4fc27749d8f2b9d0fa59783ce120d5336780613b903f36f954f2c921742236ab099078b2cd848fc0f3334c305a53450419e474cfc4c198332fe97971cbc33f5d87358a84c7d566d21bf9896329115459541c3434439d22d65d84f2853e47ffcc18808456c1de28a089edca6099ec347e9f968a4d4a8585e6545343c81743adf200ad9173eec902020a85e11f487bedafeea872ccd4431a169ba7664bbaa761e513a1fd5c0425af6a1e90431a1a792724a39e7134c65a713e42282fe24825fa8894497e807b617308bfd2df6479394f073848d421132710536073ecf50f92a7e906f020ac58ddce7239bdf3fbf316f000010004944415417da0369b5c10806643535c5587e1ac8b74cd481266830d611a138857a9ed5f9c11c61a2a8823252a3a8145d5bb9537866d7f5a2cc81c1739d39ef39dd32a923a2ce30ff93b28975c56b90129bb4f9885024e66462bd4512094584929057fb127a4917c9ffa222519163720b8aa4c3607e6fb707d2762bbc5cf4b9e34d2991465969dcaa697385f97385c67e7b0eb52179732ae88971e1d43ad050bbb4107b39cdee21bd4b034eb97cb0623287225844a951cbc6af189206d468c84d9c74035ac1a9b6498baa681635841f706a767a487a3018d676fd656016d8e6112bb7e5cb4256cbc2f6b365088b588995b6e4d325195eeb99ce1680f1520e15d0b2b3981602804a51c9e2249eb14d1c6c324027fe85d100c7372cfe868d3861bf1a9679b3a0321306b453c43028d3840f4b18cd9df06940cff5c6608100a62081da11ab09fc4196df448ce83a489bc8b7607fa405ecef7c35b64efc28fc1711d57e07f273edc1bcdcc5f00093827952373b37cf7430e99020491e564ffd3558162a1e6bd60ecb4e46fdd23d9636a27caa51071af0425c45aba45023f12c95a650a5a1c21b3408d5742f9fa611948a462deb31ab51108306941e6aa0217903f72d9fe4e5e238f61e572e27c11268ebbc1d933fd28a46fcb712ad1c4b1c530cf1e6af31d6e586fa45bbda65ed698f83135ac8c735bfce8f07d2f9517be96b4dac9086d5e69326538ec91f40608d5adeb064ce4423bc2012951a10f2e5cdcd8b377b89b1505a164c6681784ff0669098e86ed765a7c1219724ba78769a60b8c72b23558cc76a47a06dd948462a63a39583feac5093941a5a830628f427256ce0960d064eaf61a0141c4b260711998200e6d7287a93214114358aa0948417bbff7d77c37c2e856031231c106bdb8dcc66b98d900248b50b3ac3d5f99b4c6fe215f0ca7e484e9baf549c4a0037ee607e88561a25da307c88981599a06b6d39126d0074da76eb1373d314292df7f7fa542f9dd38be7818649913c5718af0dad60cea70ad60d873ff362ce061069b19e3a30b6c882b9e0bc4849a68a5005e95a8e328a464aa150a360fdc81017d473a64f471515e656b7be2ceff34d8d8c5ea375bba0c19e845ea15dbe68a710b8c26fe20d3396b4cb67ec2894b51d755104ad250915d42e4acc6dc7d688208dc6d26a889f06bc3c0cc8d3fc3a2f1e6008ce8bde4b5e69ca2b4cf491c4046d9ba49637c63c68940703d0d176223f132dd419f36ad8b290445951bf45b602bf92b256d8354683d078c082aa8b62a4418c352c5026b5277c8a5661a49e66d2921750b0a12416116b4e037435e81818e641223fd7f65bb52c98d95058664568c0220e0b2c3871e8109fdf4a3b96d01bb411bc7d3b00182a81bc83d33d729517f28ac2f5401ee36774091dea831e3e0f7c14f82a683d385ccd02e14b8f5f21307a2c941a494c69c6237291ed4270d6bb1e04f065b62f818ce91a8504fa844f7a7db4c0380e402296315e33da1ff687fdc05797c4dc91073a8206556df781a726e68f4bdc035975de9c3a77240573c7f3c6509d93c1d8062ce34c1e055ca883ea6423afaca24c64f25c61ad74d4d250cb44acb14792f51bb0ab7c9fb66c2378eebbbe37736fce99b5e32e04194c77deb8b19335d51a1cfc33eb76dc0c354efc0e0e5abe18468412879a600d993a9ea534662a8f15c4c06c1b6b57b1b9f6976d9ddfd2a5f98fe83a0f17ee3e0f5a2f0395a50ccb4a2cf21169a8253e872f954627f3002470ae34f1b16991703ed0726e74c28846633e1f6bd8a859487c0e1e6bc46636cabc69f376ddb623b56c707e432d7c3a1b57594b193e5c21f701c170bee13dd2eef4e22c6cbbdec033e5321baf91d8048c8676374b9b604362b19a0e82b76f740d90b1422516618044406956d1ca6991ae81089a28e4fc6e3117eaad87e50a025e0d46e489da2cec4cc71c4c0afc56b0c4cf1ccb7c1219b7055fa3df91089dc22efb83e666bc6d33559b24eb1257a6bf6374fb13fff2585a1eb5eb82e72cfde0a38b6cfb28633b37de917dc65088185a5b95d66c40506f6268a5c97eaddcfc71713c309927a736eeb1f49832675245abbad99967f03cc6827abc2bcc4fe0bc6083ac98c8d4af2153cb6a7e523403c96b16046bd97c4fcd9f1d0d53ab5162b219f2c5faf141b2d540b9d95563e1521910dfd670b2345a21d6ad70a2586e1728b3a02553ca2d11433b249d2846031de824efe74bda2d3eba6ba5ec714b739c070fa4f3a0f3b250797ce1eaa5938bd79e5c1a5e9557867b0b508fd1c21502c540e63c97315ad23df268b037975d57e5f1e025edcae025e3a5c155e3e585978e97d322fb36bf2d9d3822bf51378eccfebd78b0280d1624164a34bb15fc0e9e9025f2c294834000f19540d0a06cd1402512613b545844a588fda5911760c39b9dd8c80a60afd766a9eb6a54e483456663342fbf958fc712871032a4315f31da65a9c2bcd1a77b6a9941dae5a741e0a97a5aded4eb5b06aad380a692965ba9d087921ae82c184af82d8643a5854525fc885325058a8b22a03ae50a0760a393dbbc9483376d5568f54a1d571d0edf0c1443da18326e8bbb24da2ba4db6638a3ed8d72d3a073a84087823608803e14c86dd27a44f09cbe4f4d4fe7cdf98beb01c64f13308ef28264d58a83fc2aea1a628dac52d68cf30bb2bc1e4119a3ae9d5ac66bd2e599bbaca310f31bfd230eb3de5c476520d31e4e1b7d7a233ae6c091eb5a5d561e2fabf0b291c74bf20b436916731e5e395e195c395e06e3e68ad1b8d93b364adadb96b4d8e6666f5e6eae012fcfcb836b0a7c393ebca61c5fb846c6c9e14b7572e1ea7272d7b5e5c4aeeb746cf115e0069d185c7562bbc76aaeaff3806760c7edb0e7d15d37def3f4ee9ff9f4fe6bdef9d5a7aefdf9afefbbe6e7bff134307deaeaf77fe3a9ab7ffe1b4f5ef3feaf3f7df5fbffeca96bdef73528e5deffd5a7af79df579eba167ab5f1beaf3d79c5dbbffad44bdef99567af7edf170e5efbde2f1cbeeaed5fdcdfbcea6bfb8e283ff1c4213dfee83e3df6d8b37af4f167f5f08fc1e307f408fca38f3f850c3cf614e97d7af4b17d7ae4c7fbf4e8e35df9ca53eff127f6ebb19f3cabc7a9fbe39fecd34f7e72404f3cb95ffb9e3aac03cf1cd4a10387f5dcfe2333d14307a8f7ec411d7ef650c573fb0fea2858397840e383fbb50c560e3daba5430774f2b02938bc4f968d909b2e419d7712b9e992cb4de1e4b34f6b69ff335a39f29cb4bca4c1c22ebde4aaab75d5cbaed74bafbb417baeb90ebc624650175d575c758d765f799576edde2b7108628755f11700be7e74d39a20d831eb9edecca5349199a6d336f5925d37240e0e0d1bf9e2952fd1ae975cabdd575fab5d57bf4c7bae9ed5f657682f75f7be64caf621878694b0bd88a8aa76d5fe89891352ed8eaca0d84434279792070a03c32d36dd1387fbb5b38f75d4ad9fa5431deff552d70d6b68e9e0b33a09354eb07e7aba7478bf8c13ce3b7cb0aebdb165cf1dd2f12347b5bc92758243f9f109356f386d983f134eae149d5819eb18758f8fb29e47cf736da3e7626f393078f913cfec7ecd970ebef41d5f7ae6a5effb22f8c2b32f7dff179eb9fafd5f7ce6eaf77de999abdff39567ae7ef75788935f255e7eede997bef76bfbae7effd79fbce617889bbf48fcfca56f3c7df52f7c63df4bdfffe7cfd478fafe6f3c79ed7bbef1c44bdff98dfd57fcec9faeacec5dd1fcda760fa46dd7789928bcfb5ffebdcfddf9d9ffe5fff4e79ffae02f7fedd37ff26f7fe5337ff257be0a7afad5cf7cf8af5afed5cffee9bff3b5cf7ce4af4129f7a7ffde573ff391bffeb54f433ffba7bffc95cf7de4af7df10b1ffde52f7ff1637ffd8b9ff9f0af7ded337ffa6b7ff6e98f7ee0f91bfedaffe18fbef8c0f85f7ffe0e7df60bb7eaf39fff8e3ef3f9ef83efe9b35ffc16b8599ffbe29feb735ffaba3ef7c56f927f8bbef005f0f95bf439e8343ef3b96feab39fbf599fa7dee73e77b3be48f95bbe79876ebff501ddf6fd7b75fb77ef04b7cd8cbb6ebb53b77def36ddf1bddb75d7adb7ebceefdfa61f3ff0a01ebdef7e3d7affbd7ae4febbe1efd263f7de55e9a3f7dfa5871f00f7df49de9d7aecbe3b26a0cc7d2ee3f27793d7e1b107d1f1e07d7ae8bebb75cfdd77ebaaabafd14fbdf5edbae98d6f016fd34d6f7e3778ef8c78b75ef596b7ea956f7a935efba637ebe537bd4ae2ad4311dca126797a67d52b78b209f25c7f3bf0fa8dcaa89bbb37f5c4bb0fa04ef7f60ca3d04fbfe92d7af55bdf469b6fd18df0af7c33f6bfe59d33dafe5ebdf2cdefd44fbfe56d7a1d7db8e6861bc56f06d5b688905fd81b9b5f25d38f29e146fd992e3ae72f8007188f683884459d33f21cf2bce32dfae47307f53073ff61e6fea3e0f1fb7fa8c7593f8fb2761ebdff0ef83bf5937bee3e0577e9c7f7dc85ecae55fac4bd3f247db79ebaff1e3d7eefdd7aec9e1fea911fdea9231c949fdd7f584f1f784efb0e1ea9d4bce1b461fe4c78f2c0513d75e0849e3c74528f1f5cd223cf8df5e0d1a21f1c5d183fb0f0facf7fea2b5ffdd5cf7dfe53bffad5cf7ef4035ffdec47fee6573efb915ffbd2673ff6812f7eeea37fe34b9ffbc85fffd2e7fef4dffbcae7fff897bff6b93ff86bdffceceffdbb7ff199dffbb7bff1993ffaab5ffbcc87ffcad73ff34713fce15ff9b34f7fe8af7efd33bfff57befea97ff557fefc73ffeaafdcfba97ff6779ef8dd5f3c790106679b9ab87cd4301b2f1f632f174b0febb53ad15ea5f178a07634802e542cb78b7c66de05fc792c6944becb8c5bd2150b5aa9b4ab33821f8f87d405e6dba4d675468dc6956fbaaf796376257f8ddb24e5bb77ad6f5a38a9c7a895fcb91dc47845cdca8ad26845315eead09ee8e8f884d2f8e40427d48c962a56cb513e21ebd22b2ae8526995087911213543e09f1f76cb6fbe1d7a7e13b441877525f4a505293512c155fde537a59ea7ed55b667709bbc915720741ab27a23cf259423a9eae5a702b93d7e3291bf0498f2d389787bd7601376f7e55d37b03bb01fefa8bf6cc73adbfb8c39bd543d9037308c992331f763bc2c8d582f2bc75927272758822eb1be3a780da5d1899a1eac7432d35839a91ed611a365190dfaca68a4364223e6d02c68a9d7c64059438d9983cbaca393aca963cd55e5f0c22b3c0b37e8d55c74297b804875299b77f9da56f8153eb52c5eb12196311fdf1218a855c3025ae0440f3440d6809842a3964da92bd750760018a6129566027f01ec5e382740e23371f0f975f334d099d8b492293a53117aa486b78b0a8dd13dd600fb2b327c458bcc1841a7c06f7d83b2420f3b984f79191d23894fd7657593a23f040f35031a1caad0df59a0d448de1c1bf41891d45d50fad5f1e7faa40e3e90eb19f0b805dba402dfa2bbe5cd2bb3a99741a3c2c65e868c2136cc62bbeb88ba0ada3568437c0590affecd7bd55f52a68ce16c23314686f9392e0d0f148f511dc7ce9e608cea3ae230ebb530643d0dca48c3ba4e461ab09612322362859aac37a763a4d4c3e9756895d42a2673c37362ccfa990539025d00fbacb3619d37f0a1f160140d274dcdaf0be081ed6c8268b29deae6baec81c3575f2da5ac00ec8e8a4148fe7e0a129b42874689cdc1bcf34c8d9e8f26c9500aca2599469887651f4bde6642f29f4a6f6250cb6c9626da8f4027f5234211468116f4496e63401f06ecf41d421d95fce7fc3051c31026e79a363fc0dedcc57a5c0000100049444154217a8c06dac8792d6ec84a51b47a992d8d38d97017d082cd512aa02e496104147d82d7f4756a7a3a6f9acf240c48bfa1c2aebbbdd1d3bf427b15b4e5434a8759ec6fa5c066e6842ae883d62eeb5d4bcdb9cbc6031e46cf6f0ceed648669d14d648d18075dbb00ebcb6984addb03345a309a58aa23a1590555a6528649a086585b528f3d080525a752e061a3789ccfc15eb535c7e5d0815058707272306580037bf2f2b0fcc07ed3c0d57cb46386ec67c0e2b15634edc457e5be5245e96153e9db72d4b68ccbe045848c5e0545f2ac8e3b45c38d157b9f33462c1ad48aecf9b7f97d7b22467478b05233464a8f9c2c9bf835360353dbdd99a0739d416c200b44033d6613afd21af101cb0bf0b5e9269ff5621ca1a6e47f42bd1c75920de54a482f509042369406aa0821630b93151c624e96a1debcdbb87b21818c914c434d0451c965adae8910b2d8d358bedae53db419dd052e10303add71bdf05ed57de0fe701f7c1b0688e4bc10319230c293cf9b5fe2ac80a6bc110f3c5b430ff0d92628569ccc45a8d00e6a73082375aa8cb9a8e22648cbdde98bb6e771688baa51e02c42af256106a725253ac18687e5d6e1ef028aeb7799eda2e0f146f762dc7e8ccdae040cd42f14a692b752339fc540de71d075f3a2e3ab2fa643db37190240a58171c5a330181655e8aba40b179ea83476661671af0ffdcc4c8a4ab3e1a296c2aed44bffb535683119ba837986a055b0f76b706a1811856ede90358475bb44d6e029240c4a9bd9ce46f82b84dfb376357aef5b63aa53b2d0e7655dde461ad3da214b243a693ec2d10fc586700da634a8d7d634c89e6eca5e601cf9582518511ccd0fe9e1ecb1053938c54696103cd942e0ae5ca97ba5698521dcdb14a3da7a9c8cdc4f05aabe5d15382ba88b959b612eb9516374d1d478ab88851c29e441bd6d3203434bf2e3b0f78fc2e3ba32f07839b76509abcc8ef64bbd8c0776950862069c0c28908153e77b76981d4808dba433897455ba9862cfb0e0df25428832c4052435e435d507571c24eb30145aa5fbe9b5006a57e075ce30bf6886f7f6b948f860152a362c067c3bf89c750029647849442417048cad89a65aaa92b9b773041bfdbd82c0af5dae8b44604da70022da942a75f36e654a9ab0596f4c05681c4a9641a22dd41680f906bdfb405fb5dd75e119ed1f455a61373fe92f680c7cac048cf3ec8eacdbe2ba30a580b85b962c873b6ae9786919f46220d58903c891ba922d57443fce8506bd478909887227e14e662de34958a72486d92a8cdf40ea54c9b594498a2f975f97980a1bca046ef88c6f8055d1103f646363eaf68af1a1fc1a1c92faaa020f75b707d7b6539f993b7656d95879c67d861857a59c858ee25822a6ca65994096757f8b46d66b3d4750cb765c86d94b048268613ab94447119a0c2f431cc235f77d70a4911011a052142d3e54ac1fe425fe80fb9790614da6826fab57a3910190802e05b3f4f83f38cd58cb4ca9d95b16a037b45db74821666ec03f6f76de59eb13f6d97751b13796f9dc7d79888e7e4a27a8051a9632536544d2e8fa431495692f8698ab9ae50cb987687d06ece38dbe3d921a9a331a1627a31d90ac81dbc4603b6364b5c1097791bb0594a556e6af5f3d0875acf66f40b4ae6fcbecc3cc08cbccc2cbe4ccce5d45bc678d79fb44bb08363b7176b10b01b164c62cd0ff89db4e177f5e0f7f0cc2a1d517ecc5ba7ebf9d3770565fc0761fc1b5b1e345a6211b74d537f43f33ab44e83655983c0666983be34c1c06f02b68dc05375622b663956ac81851e13f8ddd8684ae64d2253ab83c8af15e873c148b29174b510490e1c3410616b85dd0e64b321266f14b6d3b654ddd66f28cb17dd3391b0c57c87ac8e0a8ae3eb61e36cb45371bafed9ec4ef8b6d3681b41b5174900db82adb6d7a90e1929e50aa90a6cad3aa0e420ddf8ae659d455d9d02e739abd6eff56c965605e7f1718acdd37dd816fb37dbdfe9f252e14b5bc67f1e2e319fbde166b1de1b61695194de359effc8a85ecb921b5e186467c6be9f8b42570732b85926ac0f7c1063d4178505c8a76fa49a0552a03bb176310a1b4a624d807103ad76687e5d661e60242f338bcf66eea595176291c88bbb522f4ac042ee1734cb9b2555583ae534cb83720d9b79a27edda84e29e17cd7b738fc009ba6d590541735d5ebdd0720d33409383563dd2353a713d80ec3b674e57397b1fab4559e6613d4362799f8c5d2496a26e2fa3d3a056ebf0756b9f92e638327e5bc291a35b7d7344d6bc67979b8953a47f0831b705037dd1005a90199df130f4cfc36495d7092bd72995fdd94aea3a93a9ee2c2b6280546ead692562f6fe0c1daead7cd6ac6468c2b1bce43a789d8be4d3d5fba169c9a0d3199fba9daca464e5b19889f0766d338af75313d30998517d3841767db7e6b556e59f26c1a1a4bbca567d072c23632b406021e911b4ec91207630d283ec8195a40d6107e889e0530e0b39bd3036403f801d46bafd4634168d33430abe81caea24243465f38d7e082b1bd00ea000359775bfdb4bce31365400d26e820b86956a0692b37563046e7a0015fe1669d8659ed763dd1776df5b20ee30c7a7abb6b2fe9ad7ddec3553c40b6655658c7790536f7b6577a4a635bb57fd67e53cf076d9645ddb04d852dfef2c2d2eef7dc7af0ad7998ed9e041b67a5a4d76e2ad6b9e00d55ead64897eb9135ba949f5dca352869c11c730fac7ac0736b353167ceea814d6676cbb27bca6b5d25920a3b42e1f7e49613b0c1b68dac936b12b0fa410965024207f3d34835a0a0373669d606c5c3ba8a6a6052bd727d760f323ae6b467a66de71ae64f2b705908a6fb7a810dc67135f85fe0665f34cdf96072c97626b1d25591a44a35b9bcc17bdc8d89e814b2f19c64baac95ab07eab5e49c9b7bc01ef05c339d639b3dd046042fdf75b3ce1ab0350f550ad0a272e950a0e3d468ccefe623d0b2411a5ece85056bb4fca6d5324a963b5dc26fcb3ec98389cd9983c02c10f5846513356724ee479fd9b55ffaa4ea29009b444f0de79b6a33177dd5acc07e7f2de8716ab30e9a1dba9f163a9e9ed305f35d797b7c3d7a7d3ea8ac033ecb13747579ce6abbeb51dd76f420b9f11d880dc8b9dd4c1aecd4a9e050a9554c34d98e59315171e1c854bf62d2eaacb66fb5dea479f96031419489b0a79364e2cddc0767e74fc3d9d3eb4bcc67cbba39b7a664bacc34efb273cc3dd07bc0aba3e7e7741b3dc0db34e1267332cff2669558a808d45f767c5db46cf6f54d1d5a1c686b0096bce85579d74c725e773068d0349026e5732d4372cb77911ce0d4b50a510e3f370f071c7abdf98a33d498d5c6199a3aad4a6d7b461f9da6ec020b3c3e97b7fda99b9f17d5ff78d11bf9398e5d5a2d37596b75bdc1afcaa7998de55e5bd3a5ce071f61a7ae597b3eda98eb3c3f1e988fdaf9f1abfc1bbaff14fbb08c342ccb6cbbcb7c683f095daa34e22474b9b61e65c05eda543444d9449048c5e981c45b7d8f22bfe14f50e5e45b8303c32c1001c9f567c04681e554d93aedf4698666b6bf8aed9846f5812dedb1fd4d6eab46c7da69bc80f2be57a7d217a876c9646756cc46b8140c64a972d066894e8dc7ea1ab0ac1a5978dafbaa338d454efaf4dbf58cd372fa752df4989f2ed09dfaa725737e877b60bea19fa70990587f9dea6e317b39fb33aea9a225ab55f779daf999b0d556388fb77bf20be86e2ff442ae912b15752507947e00fbf6ce40f92dbed3756a7e27ddf8d997dd38b7936688611b61377dbb0f5da5d59e7449fad9316793f7795dc98bfbec6dd90cedcb5e24cb7db0596dbab76533b42fbbaae42232bd2d1792d2d6ba4dd62ba177415681f5baf01c374876f7ba3a9de88ccf756374c652db9611b17a12d9369d734517ce03ccc80bd7d84e6a69ec8fed69a015dec38d116fd72d6fd5233eab8ff85c6e8ced901849b12ca509cc57aca8a415c542d138c61a0f5a2d87d359a3b2a29c464a8d356436eb426b65d3340839113c0bbfcb838850e2b7fcfa776973e637ff225fd111b3ab385d16e41990a93b22140126a7838e04250c08012b079f4fd9c0374fc50b8ffb2dfadec1b61bf2455f4cd621481990f5b79782b15eea947d1231f193ff1a612325e03c07eacddbddf7d71a3ad8e61e55427b38aeb25b7a308eee95fb50815ea783f136cd33f97dca7ef49d6adfba7e9c9ab9c974d4bfba89954c38b7eab4e1ffd14f52d443edecfeb7461060063fb82bee2b935025329322a02085304da75e05710fe1b7325580eec958135198c478cc1a678d2c2c2c4ad0cc7846d006e317d8ac6db86a1f267accbb0d89fe4c647372f978205d3ea65e5e96d6dfc5ebffd293cfe23160fd26163b940d3ea261291a01cd60ac5087e485e4e01045192cad2c6bd48e95bd8059c811d44962f18f94476ceaacfb842c22b4591ad105062a2a1cd4f870d0b6ad6c51d3341a0e870ae411a188332129ce98177270301c287a205485261781aa729ba5540aec94376e6cc048eece4eb7951d0c2973c63bce98b39a617f18d617116a1432af5c542fdb6c383103adbad01bf4a38748170277662cac762b488c61f58ff58d3908a2b3b04946d079c3ca67b0dbd544bd3173d0e36b9b6b3b8c4544909cf8a9169cfd11d1e9b13f50cadda55bc6b6fa071b6c476dc1bc990b45ddd63a7008e6c0c7caad526fde119d2fba3536e159ff3e0896e474aa7d8a307f2a920683813cff964f2e6984affb7957e78de6d7dc03eb3d90d627e7a9edf280b7e736e3def0a6d8c8ff793b1fb2ca17d80c16d9a01759d58932290fd44c10f5f7f481c46fe809ec1a5e2163d8ece66b7c23f67d356de177f9907fa777306d09d6b3229a246fde4644d4cdcac1c2f0db81f567ec2db4390de296d4728a07cecfd8d081704679f342d6a4a461a2f7913400212e361429732869e57ff96a6644c89b761e2d4357503946b95b088264228626d267b8a3977384c2ae3ed5537f49308604dd46456902617b1ead74ed71d09ad97694bbaefd9c471cd85638a0196c54debc02bf2582796fcf99a9fb689c5a22230063be0061a7fc5713299618ef68dc790e24f4c5366c05030e0ca969688b9bf12e1c18e0c400c87dd0562f6cb6cf2b9833c2765c23baa104bf15dbb75c37826e027c1bcc0fdf8d4209a85e6cf0ac738fb1d15280e5c2b258937b9d785de13ae4546a7b3076141ee2db4487bdb12f2c2c70c85ec405b4c0f051f2bcdc1181de04e6f7e5e681f9a89da7112b1a887d4d631634eb52ddc2659166361d10ed88183b5244232293140c458fc41682bcc4502be3566336d3d138cb1bac08ce9cd9b5983228f262575df4e8d9244db4b3bc3cd2f2a8a59d2cff5fd584ac6986d5a6c2e1c3f6458422364283bc11cf1ac422ba3249a166c2b704f8daf752f0c15885e0c74315e2b273e893ce4ce53e9f293f0d92121b9fa19450c84d5b55bf29c9b3dd9ca9ce962dd18f623d8eb8e2a28da6b6375422c076b631a633d99fd1b1081664fb53d3d05cd008b7db3460b774571dad1419a09b4d5c9934f32f83adda8fc1aa17ed789c2b8fcf2a4556e9cc0f6c4647a44433d86ebb39fc3079d0489abcadd93febb875f532ebb8f473179e09ae022d9e2bc82bc5d2d36f6c57429ce85737e611013f8d4e3e5a192be8a70fc382b6f4bf65ae15d6a6e765a0657ecf3dd07b20f5cc9c6eaf07060307e95d8a34901adceca0d4883d27949a168c1583ac6502ec320160a914f12387590000100049444154192b9c0256482f179197e5dfdcfdf7d0c37517a44153d4a4b1527b52917933a52ceb5becf775cfdb0c75d9e1e26ef9f49fb0af4744103bbc01677557ea08cf5412bf57270534b0111177aae864e649723b9f1751ca0a6425f4d6c0d484e88482cd38281e2914b3505722c089434fd7f956f226854fe58b3e994c032b78cf4bab10fd307af96ad90267400238588bc3c92ae5cdb72c2d75417856fbe9b3565654fc2995f117f60607aa5054fff370cbebe003c83a90db8d92951908ea6d29c0c76a9883419edbf0818ade0b9b53d32882d6e09d1d9ba692bf9078e3f2e6e2f913e814fdb009f5006ae62cc8eac6e2f422d86e21eba1eae310c52442525469481e8f88506cda6ed7d196eb35113212ed2bf06f087f26057d727a080dccf51a48f08d1a9e491151d18892353fd535e5b5d5ad21ad76b149e44553a7dd68a5a5cbad1adaf29a6d7cf0d6f65d11b17dcae69a2e8a07d24569f545dee8615dade3e34647c7431dcd7b74a45ca1437a898c03ba4a07c8df1fd7e860b946c7175f06aed3f185577458bc4ec7c0f185eb485fa7e787d7ea485ca523ba5227e24a1d4f7b74b2ecd652daad76b047250d15cd002c80cd533efef11b7de64040b0e0703026803a10fb6528a5c10b8c545210905cc841cbb483e55d7070e089e8786952d885bcb97823a34db9b159a837a7d448864222f855b83dc3ed4cc11be154b2634f7ba6d3246a68c31b8aa95137c950b8f33e3ccc6abffb3cb09e9037c51ab59155de566cd0078b3783bcbcacb2b22c7100116f8f121ba587a1da3d962ae52044bbda743fb212be087c13f68b0db31e8f2d7cd3cbe067bd5b7eded018fbf95945cc4d4ddb6fdb8d4ddb3d6b7f37a8e7f63d0fdd6f5cbb3ac58beadaf0baf03409db3e41f0335b30190b6fd9daf0f21c0425a9617d27e64144686130d070b828fbd5cd661f6637ac3fbb302266af3caf79d13d902eba052f42038665291f5bb8fa47c7775d9f8f5cf1d33a74c5eb75e0ca37e9d92b7f4efb5ef24e3d75e5bbc17bf5f495ef2a3f19be3e3f357cddf8a9e16b4760192c3d357c5d8fe583bb7e6679ffc26b4e1edcf5ba13cfed79dd89a37b5e7772ffe08676bf5e2e1f1c96f8cd7dc427f931afe99ba563d7e3353d138c22826031acc1c269bf7129a5fa46d0b6adcab85464a851c61c0090b7e8e8e1322ebb86ac110179bcb2a4316fa2edca48993af58d9a0dc67fb049d0fa563d0bad75d8943818d4b75c6c6297159d904a51e6f7e87e7a113f7b568ea33d242f811e7d11a73bbe38683a10a3afb039b6c79e9796d860f0b70a01be1d6966fb5d179bedefda1a6350ed275165b409bba53b5db157b1b0803f50639b6b5fb03be3b7f14a677bb563b67e9c3c764c19ffa3bdde1efbe231a62fab9b7ccd99edd1ecd9536dcfcb135bc5ae697b0d0f93a951e7027db8d0b4b51ff127e3a8ca3b8d1df8c07ec8c85729bc1803af01cb0dfbcb306f746ba99565c60aebe6e489653ee48c99d2455e77274e9c605d8dea7a9dcdab2f5c8ba5ffc285e6252e390f78495c72465dee063db0e7978ec76bffcd5f8db7fddabbc66ffc95779437fcf577b46ffcb5778cdff4abef68dff48177ac80d11b7ff51da337fecd77a6b7fcc6bbf496df7ccfe00d15ef4b6ff89bef4f6ff8f5f7c71b2bde575eff81f7b56ffdc0fbe3cdbff1f383377de0e74fbcea17de7f70f1673efdc489417efcd9e7b4efe0f37ae6c0113d7df0b94dd3a70f1ed1b387a97fe8a89e014fecdbaf071f7a58b7dd7ea76eb9e5dbbae52f6ed1f7befd3d7dff5bdfd37727d469e33bdff95ecd33ef7ce3bbdffe4e2d6bde72e3bbdffebebef79defebfbdfbd5577dc76bbeeb9f376fdf8ee1feae17befd423f7dda11fdd73871eb9fb4e3d72cf0fb4797a871ebceb363df8c33bf4d843f7e9c0be27b574fc18d387d723de661220b1fe8e5cdf9cd68419d6806c70d74d29a4f1f1137af6a99fe811da79089b1fbee7f6ce5edb6e6c6cbfced6af1fdd7d87eebbfdfb7af8febbb51fdb574e1e9737f4180e389334ea2edb6648d38712bff975f9fd93327e53ec93bcdd55968df0c4c1037af2d107f0d3ed7ae0ceefe9473ffc811ebbe76e3d7aef3daa3edf82fd4f3dfeb00eed7f864d7d593e0036fcd45452602cdf7ed8d4c450545463fc980e3999e35407e79c060e34270fecc7f61fe9a1fbefd28feebd4b8fdc73a71ebae3363d081eb3dd3d66f07fedfb56eb31f71ea9febc9d79fd033d7cf70fe4f4233fbc4bf731cfbfcf9af82e6ba703eb00deebe3fbac89eff53cebcbfc46b8957563f9f7bff59dba8ebe75f3b7f4ed9bbfadfbefb95ffb9f392095697f9ee6c19904118cdf4c35e7952eb607b67f365cec1e5d0aedff4ee45bffd7bffbc067fff9fff3ceaffff3ff0afc17e01f4ef077efbcf99fafe1ebffbc937fed7ffdedbb3afca7d0f5f88b7ff19ffff0abffe21ffcf053ffe2bffce1a73ef8bb3f7c7ad74f1d3abcd46a99cf90c7f85dede82869561c5a4e7a3e2feae872e8c428b4320eed7ff6b09e3f725cc70e1fd3f3079e9fe0988e1c348e40a77194b4714447395c7420ffc0711d01cf1d3caee79f5bd2f31c180e3dfd8c46478e68e9b97d1a1d7a5aed73cf687c789f560e3f331bd0938fec533ef68c4e1e7c4a4b470f69d7e250e28b83fcb6240253e927041b9eb2129b9e11457563f702e87ec5cd7573c96cf886abaabf78ab1a0c938eb0712d1f39a09523fbb1fb69faf294569e7b7a36dbe9b3fbae63cfe28ba7343e79540b8b0b2ab9ade6774ddbe6026b9860ad037885e80b32dfd84c453897a7fb01ab81c4d71bf763cf4bf6eae8bea794b15dcf77b69fc4ef4bf87f56df2f1fda57fbbd74e029352bc7f01d6de2276ef66f3c8a0df527097c2ec336532a4f506594ece8c4ee499ecba896977671ae79ee19fc73e4a046f86c74709fdaa307949f3fa8a583b3fb7ed67e9f5a6f8c4dedd167b572943978c4f3e129e6c5331ae1db9307f7ebe8a1837aceebe2d0093d7ff0445d1347491fe1307d943571a4f2cfebc841afa1a37aeed073c0f428b2e7f5dc81a33af1fc091d3d7c54879f3dc49a7c5e2749ef7b6a9f221a454405dedff2edaf723db6ac6caee0a27880087151da9d37ba050f1c6bae49e3f08faf599945bd158c63888ea1c6fc5edec680103bc0b2c46691d8f0929a1cf001359f2a9f4a48ead0e454f32c73d928e4108c9deed050a7415700c97fd56ec0e7de4159d1a02c03d3adc03a963464236cc4a74fd9273af355f78eccd6d1174150cc434dce884c8f5b0d382c0c6d7b1e69010c0ca767c4302f695046f8a5b35d5856dd6b3beccc62660d25d25a82beae266ab9fa90f07f27a72c6fb9a2dca08cb1774503db5b611e201fcc60fb50230db17bc0cf0e0de80e1452673bed7606f02ca0bb337deb389e5178642a98c24eee75fde3f015a0d198b65a6c1fd73e2c64db7d89c07319a4890f1b2dcbf01cf75cafdda46f51bc061ad642c8eb4493cbbce13f106704eba9a2b840a8817a8d25cb716e62168af14dc803687ecd3d30e58134c5cfd9cbc403259a985ce7dd62dad156d01b681dd37c9f36dd0a7a9d178b6ec576d7bd5876f7edda86cda2af7b31a96d76fba61713b6a1476f479f36dd4866798f3eff4c74ba5ccf9f2f6a1bce97eeb9de0be381f9867e61fc3c6f050fcc03064eb844ee73188b335aeaba3dce58e80264d8860bd0ccb63731abddb3d69ba5032962966af33a17d903f30dfd220fc04ccdd71f2af9dee63fb13c93820b5729621e182e9cb7b7bfa588f9f89dcdab119bf34fc4e6ca9fadedf3951771e9db78befa7eb9eb9d6fe897e10846d41f46d9d12f3fe323e6c1e2628f5a443706111d3d9b3dfe435267cb9f396f0b15235ed8ee2da8df72d588a83f539d4d51449c2dfb05f322b656ff4c0d449c1fbd676a6f2edf5e0fcc37f4edf5e705d1c6a07933372e487b5b6d24621e24b6eac34badbe377ae362d915b173e754c4ceedfbc59a6f974bbbec0d978ba9733b573d90a2be0144c4aae87c310eda5bc10bd9b515ddaefb42facf77be6dd80aceb77dd3fa23d6e64b44c7bf90edd3f5cdf7e5cd5f6c44847a7b4ea1174cbe151f44bcb0fd5bd1bfb5baf3ad616bfebb38b5e7a37671fcbeb556f9eddc016c6b4ad6d7b63e635a1a11ab078788d978ebb35ec3bc61de88984d67c45a3debbb988858b32562f3fcc5b2ddfe77db1167b7d965a611b1567e5a7e3ef988384dbded372262cb733462761da719768e02db6e449cbded53d545c4a9a22da523ba4345ceb91e82accc7649d9ec1c979907e61bfa65366036b784026a40e6f7dc03730f5c500fbc081b8b38359c5c36bfe8bd084763f62ecd37f4d97d77516b468422e2a2da306f7cee81b9075e5c1ee8dece5f5c7dda49bd996fe897e168a788ba93cf17df6538787393e71e38bb072e786e440d27ebdb9def0cebfd7199a4e6c376990cd4b4995e7e91f9f03e2d9cf3730fcc3d30f7c0dc033bda03f30dfd321e7ebfa1cfff3de7cb7800e7a6cf3d70a13d704a7b8e211645c4ea4f78bdccf2392e2f0fcc37f4cb6bbcaab549a92ebe88a8e9f963ee81b907e61ed80e0ff49b79a4796cd90e7f5e681de94237386f6feb1ec88c5a562395465bfff09eeb5f50291c12ac2c4875ff97285a28b91a1b2ae4b615512cc280d2a1f87fdd491d4b3148febf40195ddacfccc380d47b9aaf822d3d120e08dbb2aa25551b84b55514d8591924b63d2689de66cb7a91e93a5d086a7e6773d5d43900ed9d8c125bbe13b6847d4d5ba6932670e7c458e4026edff9a6c2026920ba4fb92485261776d53199246bb924aa2b5386927dc63653da5596ed33921bac2dd068a5c2920c076c5f351c6b02d1d4edba35e93295e1c198500b46721fccace977ea42029b6b73a6464dac3e827e19ab82098378c275751202a3303f8d49a6cc1ba2cf69d587cec551c8a8c650f7deb07c7604faa38c592fed94ce4e77ca646e5ef5bcc645f64037bb2eb211f3e637e7012fb511c17c253754f4105a320b0890d91b7a28a7058d3929443bd22e22c9a08c64deff6b4c6ff083fabf871c1394a9c3b36848f019d4005b522b0aabbf82a813450477d5abfb90509430b56d5b354da388506973cd17fa664122c00d63a0810f36b427d28217879d128d5aec700b3944d09a34d513ca276fa2a7b46d9d86accb65f3586a02ae68c05b4b1e8fd4d08fa0be2641af909805124a725bd50f6c4bbb82282b050de05fc590761b40fbceafc1971e15444aca6a2ae8a644110579e874bfdc6743f85ae3a29c1ae7c86f60030622a8695ef5727b1b23a25100d1de69b04e6caded335fc43c68a2c5d7a3da8ed6d5b36d192da6b5511e3181546d0df2807b8602f2482bcb7366301890962242cd2069cc3c1d24d72f9ac5f75d1d4daed3fb1ed89e92db3c25af4cd29576d523823ea78a8631196a41096a5e709a5cf6135345415dc3799d471232f7556a69d7a8655594472b5a68b0035b5ada61b9e29aa2e431acca32dacb4c08b5ac9d252d327603da8a427b508f63a4313ae7f7e5e68174b9193cb7576c2cad8604cf610d685ed0b37b65d80421a7c85710382258e66cba0e36444e39b8b4919c0dbab6d8efe1fbbbabdba7c291a84f401d8c6bb08677963791fa8f588c5b057a9d2ea52548cd06eb6fd9ecdc8675111285325a93327d937d040a107debd3eb78e711800bc1d4e54c6b39976f1a14d1eff198034256df8782edd1f47ea9cd6dfa615d6866cb2ae8ed3822bb447f46ed984d0bdf26da05090c130000100049444154b77db62568c2947421a067f22242055afb035feb9b7a902887622a7577f5133b42c6f7f65504755fc0f799038db1d118791cadd3ba6a0be812bd11b645602c1b44f5a3edb03d417f4012fdc5e6ce6efa47d988a00ba1a4d06a1f90898d4c5c6d5beac6eef1767b2e371e7300226ff61b3bb071e3be8db5bedf93b26ae5f6b1a6a3f4d9f5dd6f531f52ab5d1c565ddff2cebec9f87689d5a7dd92f059c227c1b8f719b8493e982d30c73287979635d94492a7b4cbb5cc8f16595f7e561ae1399035c6bc9609e939a514bc2eccaaf13cd69bab7e410fa4172c312f70c97960717458bb4647790f38a120401393082eda1072803c0358ca048d168ca9eb608ba4196a458d46b1a89566b796d3ee8ee70dbe0dde1424b4654ef6230df20a7555c391caa953a94b3bf8a5941411153d2f25356c9689e0312b44741b3745a549d22049c35035882859222b1a694c901ce3236f3c632c1d0b590fba3cd6988d7a1a9934701dcacb6f86d888b99376866ab17b14523de89097c89c0541808ee14063f48de135e48d9cf6323a0bfd8905f2b0dfb6dbcb057b0a69f769a4163b6d3739d8caee834174ac05a4bdb11482bed828304ff6b511114a096b419304eff4aca8da5552233409f3b001a77a4222c10c31b13ae4908c020505beb85c45a8a69165f2548102e74122023b1343b1a0884611013f803620d1bd3323d075664889f9637096550fa71363403332ed50e037c0a4beebb87ea4ac0e2dfaf0458c5578dbcd1cc08d122ddd6bbb328c61c4480d6fc889af2f0de941769abaf07c87605a67e5765903e6f310b85c70884811d8c300d6751792368f128956065a526d59390d2a5abe7261b5e6d7e5e70166c4e567f44eb738588639b2944246442862362465251545911c3f8345ed937a49a9be21b631d02835b4080800b48afb3375261ced4aa10c350a652a2861da346c52e47b5375802fe812797e23a8e9e2760b6d6f1e19bb4b486382a4df160d11ecf84ea9c261a3f0b9b2a163464428a24381167c57d8f8933a594cf884cea04e4410e642796545eabaaa52426d2e2407b28fda5268aeb09752a0d5e62975aa1eaa8ff1030aac84764a85b86c57440833b943b62d4decb3edb6b751903f05d20d750cf1130103896abc85bda20f70bced168d19046faa9b85fd6cb85e62bea468687f2015ac713fa0c27b89392425adbb9c8fa04a6bb9ca9d5a8a12bec96b4bb5d5a6371c7c2c1dadb0dda0a771bbf54d1807e24bdbc444ad7ded69e4a8bedc988acd123011fdb6ebfa86fb654cf34e6f041fae5cd7a8e5c3168ae64bb503775701e656da3257ad27bb43553279047d6066d163d662e65cea74679bcbdb97a66e4778cb5b7e0c1615f8202214b17988b53a4e8d5a1fd69b0595c12ee558d018fd059f4c2cdb29e445d14fcf9f174547765227c6b14bc7d25e1d8bbd1ae586c0e1853f030896deff128195b858037cc037455a6c081084a5285d60292cfe4290f65b691b03dedad9d4a0c58b7f0a19be82f2590345b3a8cc89bf82fac588a19a2a0f15ca9780ce0029b81b4534f215ca1222a55003e3a3442355be21ddd04643da2ff2bc00f3429f5c545e0415215195f21da58a2c97856948a0259583fc460d079544bfe06a3ad567a3cd5097a52545341aa646c26746031d94a286a06a8d89b4e51d4229a4217d1d46d130420d69ad96911408b8e5ab49127730ae660aed84c7458d848c567436ffcb9bf2047db95e56022bb21b7103e8c327819f94063465195050803cb7473fd583740ae701cb9c9e40d00ae7b38937c01b5929a106fda6b69d145d6b28ddcc4c23127ec03ec65220aa6f060ae446b58316ce445dbec58f46613d08fb042de869d1e73550b0aea0cf54d1a8a454914dc5acad7903b98ed78e289fab2c31ca03093fdbafe39c64aae16e2d95814eb68dea01334b4c954d83f31c5fb0861a61abb14c2c592ed803786a7e5d7e1e48979fc9738b9f1b5c77fcc0e24f2d3d3dfce9f2ecae576bffe219519e5da0ccc24f67a8d1425741bd76dfc24fb5cf2ebe6a7c70d74fb587176eca2786d7e623ed50e35894084cd901a784c60499317c4b706be147041c634c301823ebe1bc698c4bd13207878caec4263e6a43a371217835ca04a55cbc292caab48bca79717394ba85a05972c82f3809dd1ab5d2ca481a8dc509455a5a969679cbeee13c104eaf386f0264aa69cafaadbce6a3271774653056433f8c2012c64a51b49268db089783df0c0d7cc317597eba082574cab657bb57d48c513eb26dd8b33c9af46169422d072ba45741991165797b55a5e4bb3ebffd0bdd7e7bccf8673c6e487ad90fd81c1654f2b9f93f8f174e1b9f5212f593c6cbf8da36ba6d7c5456f8ac8ccc34c367fb76847d50f379b9554bbaad79ad32756b1a599e94a963483e27560dfdf6382a74ab5513016817df79930f7c3eabffc506a6b2a052783365eeb5ed025f03166a3f33e90e4e9f094349bb95d5d5efcb8fd1d9e6813207ef0cedd363cff74c1bccdb168c9da7e1ea86bac25a1a4de0b2237e541b37bbb4c25a5c663337dac11e8d9b3d3a86cdc716aecd07175ee975ed753e666d1b2dd4e8e5ce33847c1df62ffeb49e5d7c950eec7a8d9e5d78a59e6daed7a1c10d3ab678fd6869e1a527e9dcfcde2e0f5c203d5ed917a8a97933dbe581932f7beb574fbcf22fffff8fbee6573f78e0b5bffec1675ef79b67c2efef7bed6f7c701f65f6bdee37fed5d3affdf5d380fcf79e79f5affddee1d7fccaef9d78ddbffb7b47af7bc7a79f6aafd693c7a58327467aeef8b28e1c5fd29163e0f8491d0187493f776cacc3c7c7e42f01ca1ceb70f8f80af215d5f2d43984fcb9e74fea04c1f9b9e74fe891c79ed43df73fac7b1f7844f7def72878ace2befb364fefbff771dd77cf8ff4e0bd0feba17b7fa4fbeebc470f7fef763df4edefe9e16f7f5b8f7ce7fb7aec7bb7e9d1091e86fee8fbdfd743dffbbe1ef8fef72a7d98f4a3b77e9f32df97f9876fbd150a2abd0df9ad7ae4dbdfd163b7deae271e7c48079e7842fb1efb899e7ee4713d4d5f9e7afc493df9e327f504d82c75dd671f7f4afb1e7e5c8fddf3801ef9deadbaff965bf4e077beab07b1ebc1ef7e4f3ffafeadd8f37d551b6fbdadd26a27f93fa20f0fdcfa3d190fddf65d3d74dbf7f5d0ed80720fdc769b8cfbf1c3fdb7ff40f7a3ffbe071ed5fdf6fbfdf89d31b8ff81c7f4427ebff7de47750fd8a8dc7df73dae871f7a4c77ddf1437de7e66febbbdffc96be0dfdd6376fd12d7f71b3bef5cd9b91df02beadef7c7302f2bf733332ca7ec7306f9979f0ed9bbf55cb7f97f2b7a2e7bbb77c4b8f3ff2a89ed9b74f4f3efe63fde4f127f4d44f9eaad8acbf4f2dff13c6ecc1079fd0030ffc58f7dfcf5c620ede3781fbddf1966f8c7beeffb1eec607f7b9ee833f665e3fa67beec1b7f73e26eb7df4d1675807ed3a1c3edeb23e3ad9d1e35987481b074fb4ac37f258735e777dfa00dbea41b0ff44a9f9874e663d7d6ca483ed621e5ff7739f7aeea77ff9f7f6798dbfe6d74dff25fcef799db3aeffd53ed6fb3ef29e7eddafff3ef8e0a9d8475c78f6b51ff8e0a1d7feca079f7bcdaf7cf0f9d7fcb50f1e7fed2f7f70e9a77ee97f5b7ae95bfe6cbbe2d55ccf85f3c07c43bf70bedeb6961efc9f7ff95fffe083ffb7ffe29b1ffa9dbff3cddfffef7eeb6cb8f943ffe4efdcfca1dff9bb37fffe3ff97bb77ce8777e7b1adffcd03ffded3fff837ff6f7bff607ffec1f7cfd0ffed9dfffec1ffe2fbf7df2e56ff99d67db2bcb534796f5eca1e775f0c8311d7eee791d3e725407e09d3e70e4b89e3d7a5cfba1e62d3b445e87e775e8c8f33a70b483f983cf1dd3c1e78eeb897d0775c7dd0fe8966fddaa3fbfe57bfafa37bfa3bff8e6f72bbef1cd5b374dbff1cdefe99b7ff13dddfccdefeae6bff896fefcab5fd7573ef7057df15f7f4a5ffed4a7f5b54f7f4a5ffce4c7f5a54f7c5c5f045ffef8c7f525a3e73ff131e49f98e0e3d0d3f179ea7f9ef25fffc217749737d8bbefd583f7dcad07eeb9570fdd77bfeebde71edd7bf73d04f2cdd3fba8f7a37bd071c79dba8dcdefeb9ffb9cbef4c94f541bbff2c94fcaf8d2273eaaceee4f20ff04367e425ffe04703fc0973ff1117df1931fd3e7a957f1894fc27f5c5fc06ee3739ffc94bef2f92feb2fbef14ddd72f377f44dfcfe8dbff8b6befe17df05dfd6376e9ecdff5fff8befeb1b7ffe1d7df52bdfd0a73ff9697df80f3fac0ffedeefeb43fff283fa83dffba0fef05ffdbefee8837f00fd10f87dfd0169c3f23ff8571f42f607fad0077f1f6ade743d3ef4fbbf4ffe87f42974ffc007b1fb1ec2cff7ea871c1eee02f7fef05edd77f77d2fe8f7bbefbe5bf7fcf06e6d44efa6fe2ddfa2ffdfba4d7f7ef36dd5179e87f68969ed2373ccf36c0db7aae36fd55f30f7bef18defe0c7ef21b3fc56f8ef56dcfced3bf49defdfc5bc3fa903878fe9d073272b0ec21b070e9fd0fee74eb0a68e6bff91937a16ec674d3d7bf4046b07b0b62cdb77e8186beda40e7128de7ff4a49e3e74443f39f0bc0e2e0fc6e986d7ffce17fff8fff7db758dffc1effc03e83f047fdf6bdcebbdaefb0ffd93bf73cbefffce6f9d19fff4b7bef9c13eff9ffdd62d1ffc1f7febb6ffedbffd4feff99f7fe563db16b0e68aceb70756f5cf37f45557cc197be0f89e9b7434ae903fef157e0f2c08b3925a3eb1b77c36e7a327fc40e3d4681c43f805b5fe6c083faa58d028d6230f16b592f92c3ed8ade5716889afafa351a86d9b9ab66cb94d1dbf29da68a51d68692569cca7e44cdd137c0518f8b32f9f71c7274e2a96562ad2d292b4bca4b474a2a2a9f4a462f9a48ac1a7eb203f964f482b6b083e5b376dabe5e3c7f9185a543f09a33bd1c698cfc3fc88a9c2d7f159a0b1d4d26633ce8ad148e363c7346cc76af8f41f4bc7154b27659b6c7760a39190556067a20f0de506278fd3a793152e6fd4fef27343e293fb0a7ec8f8667985aee12ffb6ccce7e6157c567dcf982c3b7f13d4ff06c2983a854fc12b27c71a9d5c5159c9dde773bec6b46044fb2dfe6f19f096c62be0c7f046975ec1072b72da9fee8d5a7e695ce52b7c114a7c661f51a729e2678ea2e0537fb4a1322a2fe87bbe7baf2be3b4515aa91d97faf3c3c9a5cc1c92c6ccc79571124df1eb4753e1f43a306f6b1a6a9ff57e70dd5a8fcfea963d8ffd63af07fc9c590fe3e43531646d0c593b0b6ad300be91cbb431a1aca3568d0aa86b8df536660dbacc72d53364adb9ee828ee7411c1f5eadf935f7c0b407e61bfab437e6bc46da4b906922b38927e5ea911292834ef16fe809a93777b6b7d694609b09486b08e55559d4e0e4bc4290ea69a16e8f20b07568340b6dd322c17141193d228006b6448412360fdc3a33bc495943d2c3e8e84214f518c2f7792ed750ce7f456820c9b429055dad1acaa15651692812de88904aa2e4ec7744a0bfa05f4ad86b9b076ad56341c2f65cf33b3b9d2ec8a4c528da857d8bd43375d935e49a3f24af2981dd8d0a1b44d102941afc2e5bec2ffc368bdf83039deb35e8ec31c0f7e607cc8ba19286f4a24950d296194378a3f293fc6622ebea2435a9abe3fab8594d4e6893c294be34055e528a90f335f39524da2ef465631a881ba969d66833e8d2d098d4cbabb4d34761c9b214caf4c5c06c78a64b74e02cc438747c09467e02091deaae5a87b4d75927e99e05bf8d6371b8d42c4627993fe71ee83cb0367bbaf4b63ce74a2e5f0f0cb5a201af2f745f8b50000010004944415483fa77635b396214828a911d74e0d77a4720229dcf825a8f7c072d972bd12807816e8242d0f35f1f2bccc4cdd3d0b8496ce80382e51024102ae8ac91ded17e02ebc67c55446183a46f01c82fb56d7a0595778b0d6857066f54dd413b8d64ded54ad0dce621ae621d115ab52fb2a2a2400b6d1814c4a6b20ade4ce1234aedc7b01e000a615ec0b468c8466fb0fd5086724a0ab658b10117de18b31a15369b92bab64b12e94eaf6d3997747fa88908457468a009dda6c6c0be5128596ec03760d083fcca437d68721de727f22ba813450a0c4a1254135f6b72c524fdc2b4515a57565c115dffc992fbbd31a560b27f4c3b1fa188f2a7caba34a692d795f35f2f350a63da53f33da44c9fd69034a6e72d668cd5e44c83ff3b7b5f1a64d7719df79dbef7be370b962116829b244bb22402043791346580902dcb24254336135b22ad38114d5214ed1fb663cb12445112de80a00802a42882b2fc2795b22d4aae54fee44752952aab528945a5e24a25e558d4e238b65652a280990130db5beeedce77fabe37f366b0906f88d9cfc5fbdee93eddf7f4395ff7f4b9cb00f02c7bea58e7cfa6c4768fc09f23f0e28c1dec630ccc30c0653a53b68231801639e0decaeff213b89578ddf4e2b692964a7e970bc7c792f60fcc94b3a0bafdf1a205265a9e8f08d0625242ed32f1e8dfaf0dbc88e855725b43a04daf635362e608b1a41b68c16457b0572e019e6329749cf877c859d7b222da8a7596ba2478ae1a0bc212e1398ec61425cb602458f0c164421bb3776b1ee0c61f11c70d08c13382109153a7fe7b955153b0ab22d0b9007605838c10ad841c12817804fa1a980802c7144a30f384182bcf5d00ffb3e7320e0f049214bc407fd3bfd3d6f1a72355af65eda76545ac8780f952db846a75be2341dfb5de0b44e49cdd792d07b40deb5a018ff9b2509ec98dae21f5a76002ee96749a67e98704b04d4b25da8e73ae40f8384e80ca6e44b59ea005824cd2258f247808088ead7399d00fc73054ea855cc1350fbd40d3730dc6409b01d796268c81c8400b8328a40f391fc72af47d78ce3bba16ebbebd313a6e360913856e3ae0a6a327eaa63383a8f38026a776d9519640dc9275e1c50d15afed102625b5a39bac4237c1c04d50fd0a12bf3932375204c604141cceb321109e5b66116560327a75f0b4a3e77bda09815fafe1e3d53f72aa9bb35756184bc79c771e8a42c78b2863d1bafa5cca00a6ec123cd7339e12652ce20b08b970316a5a66c2508e201eca91b08ddad7f4094c2ca4708e0dcfb8e62838ee9c7a0f15b5dd819e262208c4596368638f10291dd575a95ca88ceb9276ce963a434480de9ccf827d353ced5f4a4fcdab05bb763e4162a96343e2e2523b511dbf843f770aad04f2ae17df5a7e2db073d71603ba0ed7564416cd6b67801b7eb9b9e986a2689b64d280261e56cb8d0750294c99d083e741d129b7a5dad2745442951e7a9e963419ab4dd7b6dd8b146e82ce0728523e9e4cb80926dcf414d064459d639213117eb79f0af071b0703314dea1ba76d931a612d22ea92c21dcc067413b1c532270510e9aa21d6983a2fd89bc90131181447f4b093e26076fd584be23bea74d00c6e259f64e5f3b644c7809f42e4e84e780c93d26744af2131ff552967342ee181fe0d00bef33fd83a37510024d301e80177ef1a365d6a867a5fd296345d479ae93b24f59d72edded5a9f03c6a2fd3b7de6b4bd8a8a48dbb173f40dd1286351a9313188d006589f03a89d2eb05db993b6d4be5a57e01578d5398e430ac726a015f58fb642f4d7c1d346d036d547b8f85de8fcdb23f7c8857dcd3250ae8ed9ba95d63903195ac87c03553f8d2cd489161fffe5dc56743b2dc9d10d46a19b0db831bb10627b945a9e076ef7dc064389e067650024244c26c98264e21dfd0bd0649ed26ec6049e70ec84e58432e548ba690afbe9e63a8390328b24116a43375f958917cc4a2dcf87a3af7381d770747c2bfd2b0d49e404e4c32161d90581b6cf0175aa07377ecfb7e6852674be1bcf99040a2230017802f38e98e441fec94f39278004614c0965eff3809854047a787ed1143a6075e653eab4c78caa2c70ed70e0b23cf35df62bcfe114511f7801e3398ceab45525a98182cd0bfa88d020cf14cfd8db705c17cac75cb09d6b5466e0e87237daed6a63a68fea84bc0afb9e5f82fc95f3a7cf5052149c431fe7b24ce405e7b0501dfb0505eb20a28e176fa8e83f6c83157c986b4bcd805bea016dbc95cd4086664cce80e78604c233b178a6460fe8068cf2d03b2ced53d6a414ec8519a07db45347601f856a29f9810875b1aecb90080447c7ab95da9770107eab2d0f61b2020f11adb3c03b7861728766044208b0ae8f9ecf067d8d6d1d196800b44dd027c7aacc80a3b2cc96d8e7b57ea9edb9367cac06c6237cda10a25fe55df6ec3b6ace00f5f1f13bf45b1fa57b7894fd5413c88d886076bea8716a5ba1433880b1c53816287d64486dcd85ea759e037d50fb81cd5af75dfde31303f128488097403f4b001e9e7a28a0be2a6820d629a34dd1424f10997f8e8788449486c8079f760813aba2d4cdfd0ef4bf03b04cb7d9c1a12359e147ebee82928dfcf8781e6788658d9aa03f05137960128f4ace6794411098d075cc8866d4da973130c380aeb8998a158c017d8ad7e246d24415fade5c370e6e234cea81c93d209022dd841d5a801000b7dbf28ec273739b4542bda26cd38d683e3cd432db05d1aeef51068ecd3d0e7a27a3e796d221f08e4edbd80cd18d99f124f44d21228877aa12a2f4dcbc03fba82c21f03c1f6da87d4f439a5c148e514530d13207b1051d4def5278bad0ba14f0f447df992bb7b3c821ae2072248e60df847010cc4084d101296da49c93947392a068f748e1914279e9b65996118f181ffd08acf905484f4fd086045726a740636d9da754047ae9231c1b3b007df328185b901ca55f9eed04eb0e1a474e9b0a2d7be8dfff47bc4873d43bf6758cf195a1bf77c0b3d12d79322005c1754c19380781fc7a42a54267b71baad3f68217452ab5de8deebeaf5416aea194176b15df8222f579644bfdf4c8103877499ccf064d15d0437f99938cf1e7b189ac42bf55b94e61619fcd80fe449cad35cdba6540b708cfbb805c12e49aec981a1004115aee62c6e9561aba141728728b666f9c0d6e9eaad5cdb157592620175df3f439d0cda8a3ec76a5bbca3d9b4de5b2d7fe3ae6ac542fd94c9fd48e82b5685fa5a2dd438b6df8b8093b46d63342db44e4955e32217ac6a100ad765a6724fd92998ac6a02815c23b756dd3f8f442c3d1169810a076f8285865198fe30984ea14ac29070be15fcf7b65c401c84e29cb6f6591e8f818f46fcfcfbe06515f11dbd44f8231c80c57a5058db12c79b62e0c209f3a672a4b5b8c46ca9272a588351dbc0355f03c1521f6651c5a9989b0538fca0b7fa9cdd8c333417bc611624ded7abdf8e15a1004ea73ae908099ee1ccb511f3bdb9731d0c580feb47455adb8de19c8788b5e70a3d2bbba6e046e2ee0d682c0f77684f88c1b0c376112e6e206e3d9baf4e0164c0f00bd4b02fd2811e0e35d9f675b078165b09f6e9109cb29fd77d16741de963e4a1718691bec183fbac976102d0aa04950ad2d183a864fe17ca58d8c77a0559633801ccf45425d82a05b7b9c8be816fb268c43e0e89c7847c91f69be0b06238126454dda5aa73d1d27ce9bce9dafd25e0a3d966ffe0029fa888112be1f42bf1cfd03fd4594eaa7dead2a2729741d3254783eb9d027440be61e649277c838d71179238f9d361db0533e87d4e6058173e9f984a5e0c5b3c2c77a7b00099c4bcf59f4609165eab520655de0a96812f6591c0656a7d5ae55bb3a0330af2f3e03293796240089ee19341f1749dce4d2b2c6041178f717d88f0a7ec232a1ed2047d74fb9a9aa4ea11a4a3e4a856e7e92535174816dd40b3776171fed16dc34bbe360d7f37c0a12a217103a5ed9c5f35c2df52af51c1a8b3c0a2b09c13af94537b8ad630ed86dce87e7c4f652291a57e89ce1699dd0e4c5640045ec1610f383eac9019605f491ebcab5a16e69242a853ab6b2488d72c1f8022f643c35ea6bc9bfd64ab8a00dbec779e0393a0e51cea5d034c7a33a7ea88fb2eb4b39d3b1542a3c4f51689785487a8c8271294a1f10e745c7c09c43e34419dfcc1ccee9601563803f25468231d0c540a5d944a5f0253c259116e546123730a68722de55300d8a267850b34c0800e2e6a69b5d070e811b24e2e159261c5f24f05d245c83814c139308c92425cbd28430a9394d821128e3a16d21d8090acf1f9508e19e4ff88880c0de21b609cba595575d9ff19343cc7c6878a6dc2ecc492c9e4ac6341337b8c93bc640c9168d058c43ef5ec1d8a0712b18bba0414f09694008c4768d001060e941de857e884c43e1a2acb35cce97f0c989c6231a8f72d0ce7825f7ca0322e7815179482cf724c9bfdac2bc23503f4f15f99dafebd4030b9e04f62ef567c8d16f3e79600c88a0b1f8d148081a95582fbf440422c29e023b562f038be5b95b2cc366779533c0841174c3e5bb59b0acd1b4f753e8e6e5b9a9a80edc5aa00dcb001d12f0409979117d89fef04e37ded5f18223cace3267dfd89f5728bc730ffad896f54eebcc5d5169b86d8fe2ac0f1339c7d46e5ed48324de6579bef7d43bad572fd5b0fa447fa008542828e8977e47b4f9d791621ddaa7f401b14d6db441bff8fc1aa55efbb5f56a2ff6c5dc4383582ed057d1b8f58283f311cbeaa722fa4adfd9273accbaa6ec58e697ce9567e2f55c87be67de3bf3a533df062f183ce792a6cffb9971254057d99c7e54c57aaf522d9d356e8c359aebfaa29f4110fbd25716f972acd2d56e4563405793b1600c7431d0e41ed14a039a4940ce67ee8a82892f480e4414484289ce0617b8b12e073acbb7dc4475c3d304aeef5aab08a10f3ef40394e0bb591faaf0c8880aa17d34e9274c8d29eb8e50a93a01e2764d7b2ab97982d01a1be247ca016339b0cfc263073cdff5232634bd2be5d30274e0c1ed1b6562f6604f22b07f41e411713e9810bdce0f11a5ce11a361e7f6473d27786113f85eda330d7872a1fc8012faea6499e62f30427d74de769473a1f3a173a0e05cd2b7b2cdb367c1624eb60b82759d13ef780eb150ff69159a1969f9ec8f3b5b458d20005c00fae4c0b57916402df50c741fe259f38c8df1e945346deb183aef415b38485c67ec514a70a5b0c13ec6401703e5aaed5258717d33d062aed324ae68390ffdeb398ac04d4c3717c78d4691c47ffa352fc9e2e68ae50047f7c2edeeac24c6066e7c88bf10a64b9cbb61ac3349449d4a5eb9044dee29f4ae3a703b8e1b259303b46f84da9985c6ede2660bf6d60d18affd900231316b0cb1acf500e57a16accef9684ca5c28b4a8f6ea9392a5a609b7a19e86d98898b4a8d8df315281560795940d703135960ec81654fd73c937820a04150173f6c071fbf3b148cc46b3e6dbf66109667b9887d7bf892765fe1e05ad6bbfeb66aaed00e5d9a4e5565e79c85483d5fe758d795266fd1f8f4a91863d5faec900e819107ce978fd09685c7ad671bd62603b62ad6e6bc2e38aa8c7770f57a1d954a05059376a11b2eadf9782759b054706b2966eed2014d26cb0709ade84fe02618f88e78e66e3734118a3a629d1ba56eb88e89cbf14ed5e96f4ffb2aefe0ab087c5cabf04c22e566a99b277f2cd817449a2408fa7b04fa57f80af6e0235efd876ba8438500001000494441545d141937d74437e085827e297f81ce258940ff7df5a228a087730e9ee30a7d5080638191225e90a87ffa442145a07e3e3c93b726c7c0fe4996a259b490a60e2ddf828f7f5a088ebcf1820d5ae71cfb654180e7458c3e012ab8be028020a00e51021e45d1409639465220a0854a922215c65d484cea648949ddbf221ccf96ae79d2ba5e9ca94eb91651fed5034446756c9c75f8b334c253387d1c9fe7b1dc539df13942b87693f8d42be76a2c18ab2f7d88c6f8b4c2d137ce691e5b249ea1f36bff50dc59d3b1ee156e0918b0215615034d6cec1b00daff7847c22dc671b353292210ee5ec28d4665480244002d2f0b387660060881ee72af0d2c979b3315bcabcb2a404ce8f1917693e51ce5e128b85172db0411b859f25428d8c00f8d31c1816836ebb1aec9b6b42d503e1c79f14cbe82c052b120904a26ac02ccdb9401cea54c5e193915ea7c94681fa49c2517931862524f102547f6226c93e809c0d8d81ea8d772b3156837434e4ad234459224b4cb0acf08bca058967963e0715cf59b172e22bc68920cc1d137faad7511019c20aba6c88b261acd697a0ce4791e21eca7f3ad0939611ce783e345e9b920bcb801936884cf015fe87010eaf4420a7a70fee7ac09d511b33a56f891924e9ecb0a3fafb6ceae10a6671742293983c28b0e47a96de0407a81e7e1b41782f6232fba0ec958ec625fc6403703fce9efae5a79dd33d002f2a926fc440b43d54d4858e7cd1c9500f73ae41e608ee0fb3b8f9c9b8fe786c96c84e54140960e204be827df973b3e4277bc03f7cc5ead5613859f86483d02d2003a899ddba37073645e41793028ead0013772f0ae4951e19d6d35e3f659e4dc56990295006eb48e778a8e89c89183e435a0920dc0257dc87d825601fa2c44604207d2b45226708eccec06303685c6c856ba9e52e766a1fdf89e5cfb805c80e554faa063b49a1e39e732e72005ef6e03e317118e936379e6aee0d81e3ecf883e801279025f2802db4078341a2d04c69566556cd8b009481c67492094092f4e12c6915c80ff94679f1f05120102e79664c2f1e24265e00582081b581111882812ca041007a13f222cbb0422daf65a00941737618eadc08b1944a4705c6bd0f1508ee378f111389919d738ec3006ba18705de5d55934af2f2a0315ded66e1edc80feb40f93a7c691b94a4442d941dc60d20c9226487453255242cb4b2d5bcd02ad568b776dcc8670f42763224ce3a3d90a5f1b70bb263fdc2c99069835003ee285e4941ea04e98b84537f0361c93bef0d16e99fc5b10267745bc53129ee2120471287817ec11150854eba757e9694713ad2f1cc4a5485c8698c49958f48940aba5172139a3a2bf33be7a0ee599e84b80b1688a83fa19d8143fb417e85b70684c3711f2c0664135ada25aadf2758a8ee578c75720653c09e76ea9e74dc7cb1c9f48a00f09aa482421387f7c0de09280080754faaac898cc9b2d8f3353754cf3824498e05a4ce253ad69c430511ea114e89622e48110395b0ac774ca359bf402c7f3e2a0e0d91c3db25d78f0420bbc800dc8d9a628685c2f68157a6dd722c75aeee87b917a7ee1053951da091c8be3b1ae7ad515f4314782726c3aca27679ec95c7c1395ac1db00963a0cd007f64da2513c60019d0abfeb1b131e6af027d039bd0e06ed5680af4662082f5bcc90d8e777c4583b2e1913773e40d62c9658b1ed7999878270e4a3e46cd1b4d34e9478b09a0590f4c7cbaeb25ece7c0ed10c244204cde4e133993b763f2163e6f7052e7b6c9bb79be8777bc9b77da46348a49d4f329b01110da48329e9df1bdb4609a3ce8bf77afc82543afb2a0d1e032a610c7bb51a0c50b93f2117f40567104d0b9b0509fcaa70c0dc4bf4f4fdf540a7d8da0df425d125a48f8d4c4d1aa302d6d1860c2a4df09d1e2eb83467d1a8dfa248a561d9e89216fb6966dfe8a468182ebc6d3074f7f8a7c820f0b4e136368e567d02aa6303e3e89062f482afd7a773e00c7273221e31ca48294b1b598f02ec47bc33b3478f1d5243ab24e9dd69b4cc6710e920abcda09c2b94de139272dae1632899c171d052a9cdb740605e7ba40869ce794e87dee3b3e37752ca9d096daab5256a13a452e55b49062bae0cf98779cf704220189787079c00e63603e035c25f35556ef6260dd153716ff18aedc3c1206fa5f44567d19034363e8bf64047d979c44ffd0496cd834828d9bc6b069e338366d9ac0c6cde318243610cb2107374f6170a88ea1ed39360c4d20a99e46a5d2c4c60d19fafbb37203d4e4c64d50142e675e6e42926924ae0ee79a488540ce7a936841a82bd18226d6948fddfb07fb30c98438cde4538883cbfa910d6c4653d28806377d2df7225b3c1749c2bb2f8f244b511da80069800f4cb644ab9868fb52a7ac23a1bf92d4e12823e87722f49b326d4be71ab19f731348dd24231f455ebc844d4353e8df308d818d1318dc34854d5bc6b179eb38391bc772cc9bae970d9b4f63e3a65142d7d4296cd83cc1b99ca63f39e1c1eb495c7a651feaad09265a5e7615820631950393bc539f62a257ce15e7e3bde5fad07219e7a83a23f3a412eb137c55f37d6c2f5e1c78cbf48b836f9bfe41dfcf4efe78f0ea899706af9efc41ff5ba9bbbace72e3c50d5737295b2f0deeca5f1ad855bc38b8d3531758c74b833bf1a30d3b415dcff2871b77e2871b76e1071baea1dc4db98b72176dedc68b03bbcb32db7ed4bf132f718c9f0cbe153fee7b337e3af866fca4f2fa977ed01c6caebb0dca02be2003ee82add6b82219f8c53ff8dca3efdc7ff78fdefbde3bc7f6ff4a895f6d977b91bf76e79d63bffaee5f1afb8d5fdb3ff60bef79f7c8bb6ebfe6474323ffeeaf8efcd175c9f127de8d4f1dbc169f18be091f3d7c0b712bfef8f0ad3870e8567cb2760b3e7df0463c72f07a3c5cbb29f639706879e4c7876fc1c73ef573f8fd037bf05b0fdc8277ddf946fcdcded7e1e677bc0937def866ecb9ed46e226dcb65771236ebbed7ae25aecd9b73b62df9e1bb16f0fdbbab077cfcd50ecd9732bf6edfb79dcf28e9bb0ebdadd28bcc74f4e9cc0f75ffc09fee9073fc2fffdee0ff1dd9746f14f3f5e18bef7d208fedff77e80975ffe31df0ff7d1dfebb0ef9db7e2b6889bb1873eefa1bf7bf732867d37d0df1b18c7f550dd9e7dd7b37c23fdbc85b815b7edb98571dcc8d8aec3dedb76d1efb761ef3bdf803defbc0cef7eefebf0fb7ffc4b78e4d02fe0e0e3bf88470ebf0307c8db1f3e721de54dcb367f07866fc5c387f6e29387f6103711d7e193c3bbe80ffdaad1c7cfdc897f7ef73bf8346414dffde177f1bdefbf88175f3e851327a77072740adf7b71e415f9ffee4fc6703e7ce3049fa3bfe3c31f4aee387279f53d9fbd7cf03d8f5d3970e7f05583b77fe64a7fc7c1cb37df59bb8ce51dc4a50377d4b60fdcf1996d03777e6aebe01d9fda3278c7939710432c0fe5b77f6a41b2f8e5a786f0fe2787c22f3f393470c76786faef38343470fba343cddb6b43cd3b8f0e15b71f19f2ef3f3624777c6e68f37b9e64fb2343d53b1f1dbae4ee4f0d25ef3db8f3abe93d7f0f3b8c812e065c57d98a4bcdc002c7db30fdf2959bc7be75c5e5a75e18da71f2ef86768cfcedd0f6d1bfed596e1ffbdba1cb4effddd0b693ff7be8aac96f5d7255eb1faed830fd8fdbafd8322259fff7b1e9aa695c72d9696cbdf434b6ec38dd96632c8f6113759b2e1dc710a5b65dc2f2924b8eb9edd2496cbb6c1adbae6861cbd63a2ad569f4550b3e4148b06153c23250ed03fa886a3f6595f52803db8470448afe3e87fe6a8a2ad1d7017559ea796eca3bdc8d68f011f554a3e0dda243482ac8930cb94b5108cb0b902d974068a7c117afde151818a41f55204b0bfa227cca50a16f0ea5dfeaabc261a0a2beaaded137d525ec27ecc77a9531f6a9cf9e31050c0c30ce7ee527c7d0b6716cdc324a9cc4d0f633d87ec534b62ce7fced18c390e25295a7e9cb3831c9753685addba771c9f616efd0fb31360e3ec5002a031bf88ed9f15d7a8349def131b9f25eb920ff4d389e9362bed447f51332307922db71eadf7fe2f6d3f3f1d573e8e6f6b999e7286e3fdde9dbbbbcf9f4571f223e51dae9d8573b5fa52e62a6bdabcf43b79ffe9bdf7fcb19d4f8c809761803b30cb8d9a295560b037c542b7d692a593e8d8c8f5b333e2e5e08f4316dc67791216f60206f49b5d914e60a69f8269851005f80bb2512269cac6821f10d38bea746a05e02a0e0435d613fa16ec925c70cea8ffacb77e8090af89620957ee86fba43fda24e229a10f22400c43b485000d03d5172f836a047d479f6e739428eb302cdc6145b1c92b41f2d9fa2ce9bbb2271f0a461e148f87e37836752f73e076b7ce2de4095af05f8921b0c06d13f004ab522e1783186184b930d2d808fd9a1bfec471dc453c74e8c4f7fcb3d14bc7ad17f11ced7e97b1dc14fa0c28b14e43c8fef66c138447922974b2dc1f7fd903afd25e807d4f5c2c171bdb9f83b015368f1bd3a298f097d8a73eb79e124598626fb0771083ce742fc43fb70264317b4bfd69324a98a4b13d8610cac1106dc1a89635d85912365bc1ee55fd7612208e704db5f59cfac01e1ae586142c902b8ed5113938283e766a80b449348c2c7cd09375107ed14629bb6b337cac397024b293defbf409f03a0c98c7021810b0230a1f11b602c423de897c61925ba0ff5b703ead99fdfb451ea8417038e509dda0c1cb190045e4499a08c2d0bfa0af4dc4b86203a9f60ad80480b8e17690e9e0a027a94d2054018974ac4f60288b1e594ec43df35c6b25dd897b92a64703e454cf8b42d8c45a086d81f7a2ca314ae233e99f0d161f5c3018c4fdd032fb03a88d389846a5782eb1251c94844635830325ae0a00b3edf4e3406561403b69857d474f4ee8c8830092c1cbd8f68671803c68031600cac44062ca1afc45979259f98c4b58b88a8581ed8a8c6c0aa67409f0ae8d38d551f8805600c44062ca1471a56db171f99ae3697cd5f63604532c0d7112bd22f73ca18e89d014be8bd7366672c3e03368231b0240c24c9920c638318034bc28025f425a1f9e20ea29326a277e9fac8f0e2da366bc6c0fa62c01eb9afaff95edbd16a6e58db115a74c6c07c06ac6e0c1803c6c01a64c012fa6a9c54e7a1ffc5a3c8c5f9a53891d24e5bac4646cc6763e09c0ce87fbad2c1fc0e22e5ba9fafb7ba31b05a19b084be5a67cefc5ea90c985fc68031600c2c0b0396d09785f68b30a8f0fd797c8f7e116c990963c01830068c8155cf8025f4553f8516c0ba62c082bd780cd805f1c5e3d22cad08062ca1af8869e8cd0967affe7a23cc7a1b03e763c0fedadaf99831fd2a64c012fa2a9cb48ecbfacb3e9db24963e0223060268c016360153360097d154f9eb96e0c1803c68031600c7418b084de616295c9f81f54b57df6ed47f00b956d3351e83f57037059884790029ed2b3c577fe872b96d9d0fe5fb1d84ffbaa6e99a0fe05fa187da62f9e3ed3394075f17feeeaf8a812e7383afa8ef4708111ebf9ec1d20f0b4cb620c3bdaa5066abbad7f6dbc732c1a0fb415e2ff2896d27df5c543021b742c1584ce4168fba56d0aaacb0ff5659de7063e470eb4439bb1916df06d5d90a80ada5616f1dafc8fe65eddd7fc5eea4b1b5ed797b6ab4fa26b8f34b0ee09fd04d5abcf0a72aff55006accd0b42a4774167da49c6c0ca64803ffd2bd331f3ea420c3838ce9cfe6b71f1afd2b2cc3d0eedbd6e8ef4dcf474e33b97ec8c902449d6f74f3700000f7649444154fc7bede00e9755817aa381c2e528a485200582e3064be31e29bc2638e1f84c1a2ee87ffd99b05d960ff4cf6b209e24b80a025af4bb8132265241629cfef7a131c169928b9df9c5fe8c898e3373a44ce2ec0b4f0dadd12695d0a4e1196748aac843405249280b68a6752e45910bcb0951c60f4e46d05f70e8929a2c03807349d539edef1c7226dc96cfc051d897be31a9254400b9e7d88504146ccd0995421d9be158a779bae49178308e14e23989a18a102a50f3452b67431f90a7bc6448a90f0829c7549b1c2a50ea7f61daabd47334868543074f01fa498750705d15cea370019d388b909301bacfae7009f22243c1b914fadff47578f5fd158044a0d0be053c5406da1311a5ce600cac1906b8acd74c2ceb28901c7993898b1bb5fe0333a1e026e53dce25e37b761fe2268e7952db42c104d53eb7e0be9f378134e5c69f384a80d901808710901c8e09530129a82f20a140b413ca3196ba2c22704c889014220ec2cd3d301d80fe6a197a68e65350a7fa596863072e168471c458635ff6a44d5f807605cd661d39090a244a18b7e358ca29788ec67d2e091e9db4315f82c9b8f02d78da144990649a80190712f22c345744292210e946a0beec43f3e024b08e788866aa5873b10ee582f306ae11300e70ae85eb2072a3bcb19710e0d54baf52cfd15315ccc12a784111c5ab97b1bbe73711e728b03cfba9542a50bf0a9d04fa1ed44f7215d82d4992c891722f3eb01ca0b19dafae56b55da5faabfdca45ae1a8331b0fa19e8fcd4affe48d651047ddca4d32c41b57f805bb743ca4d7c611054b8a957780753ad244879b3e9b8e9571c37ca062f181a4ddef579249abcd0809369c04d12e3c4198265263ec7f1970b458b0e17024d56212fa00999b7cef04593fe3611e877082d6ef60479d3643f83a83fc785086f3903130798f86222f439aa950c59e2d0978165902b8f94779309074e422047e7460af63d2f02aaa920a11db5e5e8ad6f5f608187445e191bcbdd1f4d46b37561f2d43e018809d153f2228b4f57bc63fc4903695600bc1003c7d13ec28b31614c89faceee8ef1c6f9eb5546ff1cf45cb4cbbd490ece35e5b8a69c34c8618bc899c03d2522c03955d749132a5ca719e725c9056805545d05292f7e12d007e295a4e3b9da53fb09cbe0485c12b0c318582b0cb8b512c87a8aa3ce8de80c1f539ef17da84b1f53d60221154ce6c0644b305538d4b9bfd62545eeb6d0e656b4e432caedc456621bb1054d28862887d09012d394cb853cd9813cd98ea66c4523d98666ba05cd6c33cb1b50cf3696a80c52b7118d6c03a152a1e5cda8a783c4464ca7443244b9996099f506ebad0a758e7d93414c850c934c21934c7ce32d8f097257a7ae44050b9113bc1899e4e3f64954318d2a26a40fd36e80fe6fa21f9b31e536a2ee36635a58a71f75622ad98829fa5367dbb4a35f2c4f2503513795f46332edc314319d56318e4ad4e71800924d28922d9cd74be82bedf94ded39dcb24059ce7f5c07ae5dee496e2ec745fb5caead06b6a111b6234ad69bd888560a4c737d2aef4d3e31692419d76bc2f920e7a8c69f01fd39381f9457c559ed214333ade0551dd6c91858050cb855e0a3b9388f81a974d3a953d5cb265e4eb7fb337d3bc244dfd60efc44df96a2c4d67ca26f6b6bbcbaa5d94683b2833acbd3e3952d5313fddb264e659bc64f67979c9ae8bbf4e444f575a3275a57e0147e1613c96e8cfa9d6decc268b13b8cf8dd7e06e16dc5087ea61891ab96029ee3ccc3ebfd08de1846f0268c84d76304af6f9eaebe61f474f567c646d32bce8c65578d8f66974f9ccc2e9f548ca4974f8da45728a647d22beb23d9e58d931522bbbcc976e2b22675c4958dd1f44aade7a7ab57f9b1e4d2f0e37c134e55b69f3a53d97aea74b6f5cc4475eb99a981ade3e47822a2ba75be9c54fd7865cbc47895a86c99a49c647db24b4e9ca96c39333578d9e878dff689d1cab63056b9bc18abead8f4cbed981ecbae9c1aa95c39355ab9627ab472d5f448f58afa48e5f2fa58e58ac648e5b2c648b6a3319a6daf8f663beaa3e9f6e91395edd3272bdb78ceb6c993954bcf8cf55d3572bafff5277fe277e0657f659ba7378651bcc99fe2dc8de2f5c528aecabb30bfdedd36a73cc2f3142738ffe781a7febc18c11bc248787318f56f0ba3c5d5f48df0bb30e6df46bc0563e10d38e977148d0d9b4e8eb80da323aeffcc78dfc6f1e90d9b272607364f9d4e06a7c965fd4c758bae6795babe9baceb9a6f51eafacfc7fbe2cf42477ad603cfc36475f36954061ab0c31858230c58425f8513d977e5d5ffe192eb7fb9b6f9a65fab55ae7fef7072c3fee1f4fa5fa911c3d90def63797f2dbd617f2db991ba1bf60f6737beaf460c27d75347a437bc8fedec473970cb3fabf5bffdae8395b7df55abdef8fe8353af7b4fed7f4ebda5f6d73f7d53edbfbcf8c6dad74f5e435cdbc1f0f327ae1bfeda89eb6b5f3b79434dcbcf9fb866f8f9934b821ac79983afff74d730fd1cfeeb936fae7dedc49b6b7f73e62db517fcb5b5efb8eb6bdf4cae3bf8ed6c77ed1be9aedab7e4dadab7926b6adf4c77d7bee9ae63f9dada0bb14c5db2b3f642b2abf6cd08b66bbfe49ae16f26d7b0dfeedafff16fad7d3bdb35fc0f03d7d68a9defad55defefe83fd37ff3a25f9bae9aec8b1f2cc3928cb37ec8f32bdf157a3ece8b5ae73d22d139d979b7e83fdeeaa9d7addbedadf57770e7f8bfea8af2fa4d7d4be5dbd963e5f57fb8efa9ab19cd1df8a62d7f00b94da27c611dbd85eb97e58637e8175d57f23bdaef6ed819b6bdf74b71cfc1fe33b6b5f1bbdbaf65f7f7a75ed6b3fdd59fbda895dc3cf8f5c3bfcf593bb39b7bb557630539fcff7fcbaae8de74fd2ce895d5c0bbb09cab96b61ce7c3d7ff29a58ff3acff9fa4f3926cffbba626427c7beb6f6df4f5ccb7685f6db597b7ef42db5ffd5786bcdbff5aedac04dbf5e1bf8b9bbb8c6ef381876bfbb56e1daaede4c8eaf7f5f2dbbee7d5ccffbdbebfe7db5ec86fd5cf3fbd9f75786d3b7c73a392eebfcf9a8a5d7ed8f7d375ef3ae83d2bfe53b2b600b30178c818bc28025f48b42e3d21af9ab8ffffa7ffb4f4f1d78ea2b9f3ff4e873c78f0c3f77fce8f0979e3d7648f117c78f3e4a79f84bc78f3ef6dc33c73efbdcb3c73ecbf2e38a2f7fe1d811c573cf1e7da2c493c7feedd3479ffaf32f3cfdf4735f78fa99bf78e68b5ffcfca7fff4d90fbeeb0f87efd97770f883bff0d9e10fec7b8478b88d4f0fdf7ddba387eeb9edf0a3f7dcf669e22071f8d10feef9ecb2e0376f7becd06fed3b327ccfde83c3f7bcfb91e17fb1ffe1c73ff22f0f3d7bff873e79fc81fb0e7cfebe7b3ff6b9077ffbc0531fbeffe34f7ef8b73ff1e483f73e7cecc1fb0e1c63f9e847ee3df0c483f77dfcc843c4efdcffd1c73f72ffc7223e7cff81c73b78f0fe8f3df6d0031f7df4a1fbfe60f8f71ef8bde12f1efbc2337ffeec9f1cfff3679e79fa4bcf90b3cf7fee735f7ee6e9a7229e7d6a8e7ceef8b127bbf55a7feef8e79eec96dafe15daf9b3a78e3f7be491c34ffdeebdbf37fc91fbfff5e1fbe9cf03f4ebfedffef8d107eefba3630fdcfb47c71efad01f1e557ce45f7df489073ff4f1230f28eefbc49107effbe4910fdffbc813251e7e42637be8de03c73ec2787ff7438f3cfdd0dd9ff9c2877fe3d12f7ee05d0739878739af4738874f1cfacddb1e3f74cf9ec38f7e60ef6387cf87bbf77ef6b157c23d7b1f3ffcc188c74af92ad6c26fee799ce33f76e86efaa0f8c05e5d679fa67f8f0cdfb3ef6142a5e2c0f0efdcf599c3ffe6892ffdc95ffee99f3dab9c7fe98b4f3dfd6572fddcb3cf1efbd2e78f1ffdcab34f3ef115aee72f1f3f76e42f892f1f3ffaf85774dd137f79fcc9c7befcf9a333a0fef073fcf9f8caf1a3f167e63f3ef58967fef3effefcf796f6a7d7463306168f014be88bc7ad5936068c016360f919300fd60d0396d0d7cd545ba0c68031600c18036b99014be86b79762d3663c0183006169701b3be8218b084be8226c35c31068c0163c018300616ca8025f4853267e71903c68031600c2c2e0366bd27062ca1f744977536068c0163c018300656260396d057e6bc9857c68031600c18038bcbc09ab36e097dcd4da905640c1803c68031b01e19b084be1e67dd6236068c0163c018585c0696c1ba25f46520dd8634068c0163c01830062e360396d02f36a366cf1830068c0163c018585c06ce69dd12fa396931a531600c1803c68031b0ba18b084bebae6cbbc35068c0163c0183006cec9c0454be8e7b46e4a63c01830068c0163c0185812062ca12f09cd368831600c1803c68031b0b80cac9284beb824987563c01830068c016360b53360097db5cfa0f96f0c1803c68031600c90014be800c8837d8c0163c01830068c8155cd8025f4553d7de6bc31600c1803c6803150326009bde46111bfcdb431600c1803c68031b0f80c58425f7c8e6d0463c01830068c016360d119b084bee8142fee0066dd1830068c0163c01850062ca12b0b0663c01830068c016360953360097d954fe0e2ba6fd68d0163c0183006560b0396d057cb4c999fc68031600c1803c6c00518b0847e0172ac69711930ebc68031600c1803178f014be8178f4bb3640c1803c68031600c2c1b0396d0978d7a1b78711930ebc68031600cac2f062ca1afaff9b6688d0163c0183006d6280396d0d7e8c45a588bcb805937068c016360a53160097da5cd88f9630c1803c68031600c2c80014be80b20cd4e3106169701b36e0c1803c640ef0c5842ef9d333bc31830068c0163c01858710c58425f7153620e19038bcb805937068c81b5c98025f4b539af169531600c1803c6c03a63c012fa3a9b700bd718585c06ccba31600c2c170396d0978b791bd71830068c0163c018b8880c5842bf88649a2963c018585c06ccba31600c9c9f014be8e7e7c65a8c0163c01830068c8155c38025f4553355e6a831600c2c2e0366dd1858dd0c58425fddf367de1b03c68031600c180391014be89106fb32068c016360711930ebc6c0623360097db11936fbc68031600c1803c6c0123060097d0948b6218c0163c018585c06ccba31005842b755600c1803c68031600cac01062ca1af8149b4108c0163c018584c06ccf6ea60c012faea9827f3d21830068c0163c018b8200396d02f488f351a03c68031600c2c2e0366fd62316009fd623169768c0163c01830068c816564c012fa32926f431b03c68031600c2c2e03ebc9ba25f4f534db16ab31600c1803c6c09a65c012fa9a9d5a0bcc1830068c01636071195859d62da1afacf9306f8c0163c01830068c81053160097d41b4d949c68031600c1803c6c0e232d0ab754be8bd3266fd8d0163c01830068c8115c88025f4153829e69231600c1803c68031d02b03bd25f45ead5b7f63c01830068c0163c0185812062ca12f09cd368831600c1803c68031b0b80caca484beb8919a7563c01830068c0163600d3360097d0d4fae85660c1803c68031b07e18583f097dfdcca9456a0c1803c68031b00e19f8ff000000ffff44f6e8bf0000000649444154030070217b278d13f2730000000049454e44ae426082);

-- --------------------------------------------------------

--
-- Table structure for table `business_table`
--

CREATE TABLE `business_table` (
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `business_name` varchar(999) NOT NULL,
  `owner_id` bigint(12) UNSIGNED NOT NULL,
  `business_code` varchar(10) DEFAULT NULL,
  `business_cat_id` bigint(12) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) DEFAULT NULL,
  `last_receipt_no` int(10) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_table`
--

INSERT INTO `business_table` (`business_id`, `business_name`, `owner_id`, `business_code`, `business_cat_id`, `created_at`, `createdBy`, `last_receipt_no`) VALUES
(1, 'Minji\'s Cafe', 1, 'MINJ', 4, '2025-11-30 05:01:41', NULL, 1),
(2, 'Hyein\'s donut', 5, 'HYEI', 13, '2025-11-30 22:11:31', NULL, 0),
(3, 'Hanni Palm 5 Tiger strikes', 6, 'HANN', 12, '2025-12-01 03:45:48', NULL, 0),
(4, 'Haerin dang', 7, 'HAER', 8, '2025-12-01 04:38:57', NULL, 0),
(5, 'Danielle ', 8, 'DANI', 3, '2025-12-01 04:42:27', NULL, 0),
(7, 'LoL of LEgendss', 13, 'LOL ', 15, '2025-12-02 07:49:37', NULL, 1),
(8, 'MaybeIs', 16, 'MAYB', 4, '2025-12-03 09:40:16', NULL, 0),
(10, 'Kahitano', 22, 'KAHI', 6, '2025-12-04 10:26:26', NULL, 0),
(11, 'lastna', 23, 'LAST', 16, '2025-12-04 10:33:13', NULL, 0),
(12, 'testete', 24, 'TEST', 3, '2025-12-04 10:36:53', NULL, 0),
(13, 'gjgjjgg', 25, 'GJGJ', 2, '2025-12-04 10:39:41', NULL, 0),
(14, 'testing', 26, 'TEST2', 11, '2025-12-04 10:46:53', NULL, 0),
(15, 'try', 27, 'TRY', 13, '2025-12-04 10:49:38', NULL, 0),
(16, 'gkdjkgfd', 28, 'GKDJ', 10, '2025-12-04 10:52:19', NULL, 0),
(20, 'Restu Bowl', 29, 'REST', 2, '2026-01-19 21:46:34', NULL, 0);

--
-- Triggers `business_table`
--
DELIMITER $$
CREATE TRIGGER `before_insert_business` BEFORE INSERT ON `business_table` FOR EACH ROW BEGIN
    DECLARE base_code VARCHAR(10);
    DECLARE final_code VARCHAR(10);
    DECLARE count_code INT;

    -- Take first 3 letters of name as base code
    SET base_code = UPPER(LEFT(NEW.business_name, 4));

    -- Count existing businesses with same base code
    SELECT COUNT(*) INTO count_code
    FROM business_table
    WHERE business_code LIKE CONCAT(base_code, '%');

    -- If duplicate exists, append number
    IF count_code > 0 THEN
        SET final_code = CONCAT(base_code, count_code + 1);
    ELSE
        SET final_code = base_code;
    END IF;

    SET NEW.business_code = final_code;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `business_user_position_table`
--

CREATE TABLE `business_user_position_table` (
  `bus_user_pos_id` bigint(12) NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `bus_pos_id` bigint(12) UNSIGNED DEFAULT NULL,
  `date_joined` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_user_position_table`
--

INSERT INTO `business_user_position_table` (`bus_user_pos_id`, `user_id`, `business_id`, `bus_pos_id`, `date_joined`, `updated_at`, `updated_by`) VALUES
(1, 1, 1, 1, '2025-11-30 05:01:41', '2025-11-30 05:01:41', NULL),
(2, 3, 1, 7, '2025-11-30 21:39:02', '2025-11-30 21:41:41', NULL),
(3, 4, 1, 6, '2025-11-30 21:46:25', '2025-12-04 06:34:23', NULL),
(4, 5, 2, 1, '2025-11-30 22:11:32', '2025-11-30 22:11:32', NULL),
(5, 6, 3, 1, '2025-12-01 03:45:49', '2025-12-01 03:45:49', NULL),
(6, 7, 4, 1, '2025-12-01 04:38:57', '2025-12-01 04:38:57', NULL),
(7, 8, 5, 1, '2025-12-01 04:42:27', '2025-12-01 04:42:27', NULL),
(9, 13, 7, 1, '2025-12-02 07:49:37', '2025-12-02 07:49:37', NULL),
(10, 15, 7, 2, '2025-12-02 11:56:42', '2025-12-04 10:17:18', NULL),
(11, 16, 8, 1, '2025-12-03 09:40:16', '2025-12-03 09:40:16', NULL),
(12, 18, 1, 3, '2025-12-03 11:50:31', '2025-12-03 11:51:57', NULL),
(13, 20, 7, 9, '2025-12-04 04:44:31', '2025-12-04 10:22:29', NULL),
(15, 21, 1, 5, '2025-12-04 06:06:12', '2025-12-04 06:34:54', NULL),
(16, 22, 10, 1, '2025-12-04 10:26:26', '2025-12-04 10:26:26', NULL),
(17, 23, 11, 1, '2025-12-04 10:33:13', '2025-12-04 10:33:13', NULL),
(18, 24, 12, 1, '2025-12-04 10:36:53', '2025-12-04 10:36:53', NULL),
(19, 25, 13, 1, '2025-12-04 10:39:41', '2025-12-04 10:39:41', NULL),
(20, 26, 14, 1, '2025-12-04 10:46:53', '2025-12-04 10:46:53', NULL),
(21, 27, 15, 1, '2025-12-04 10:49:38', '2025-12-04 10:49:38', NULL),
(22, 28, 16, 1, '2025-12-04 10:52:19', '2025-12-04 10:52:19', NULL),
(26, 29, 20, 1, '2026-01-19 21:46:34', '2026-01-19 21:46:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `combo_items_table`
--

CREATE TABLE `combo_items_table` (
  `component_id` bigint(12) NOT NULL,
  `parent_product_id` bigint(12) UNSIGNED NOT NULL,
  `component_product_id` bigint(12) UNSIGNED NOT NULL,
  `quantity` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `combo_items_table`
--

INSERT INTO `combo_items_table` (`component_id`, `parent_product_id`, `component_product_id`, `quantity`) VALUES
(1, 31, 30, 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `features_table`
--

CREATE TABLE `features_table` (
  `feature_id` bigint(12) UNSIGNED NOT NULL,
  `feature_name` varchar(99) NOT NULL,
  `module_id` bigint(12) UNSIGNED NOT NULL,
  `description` varchar(999) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `features_table`
--

INSERT INTO `features_table` (`feature_id`, `feature_name`, `module_id`, `description`) VALUES
(1, 'dashboard', 1, 'Main dashboard overview'),
(2, 'product', 2, 'Product management'),
(3, 'category', 2, 'Category management'),
(4, 'supplier', 2, 'Supplier management'),
(5, 'unit', 2, 'Unit of measurement management'),
(6, 'stock_adjustment', 2, 'Stock adjustment operations'),
(7, 'combo', 2, 'Combo/bundle products'),
(8, 'recipe', 2, 'Recipe management'),
(9, 'stockin', 2, 'Stock-in operations'),
(10, 'production', 2, 'Production management'),
(11, 'order', 3, 'Order management'),
(12, 'sales', 3, 'Sales transactions'),
(13, 'report', 4, 'Reports and analytics'),
(14, 'user_management', 5, 'User management'),
(15, 'role_permission', 5, 'Role and permission management'),
(16, 'business_settings', 5, 'Business configuration'),
(17, 'audit_logs', 5, 'Audit log viewing');

-- --------------------------------------------------------

--
-- Table structure for table `feature_action_table`
--

CREATE TABLE `feature_action_table` (
  `feature_action_id` bigint(12) UNSIGNED NOT NULL,
  `feature_id` bigint(12) UNSIGNED NOT NULL,
  `action_id` bigint(12) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feature_action_table`
--

INSERT INTO `feature_action_table` (`feature_action_id`, `feature_id`, `action_id`) VALUES
(1, 1, 2),
(2, 1, 7),
(3, 2, 1),
(4, 2, 2),
(5, 2, 3),
(6, 2, 4),
(7, 2, 6),
(8, 2, 7),
(9, 3, 1),
(10, 3, 2),
(11, 3, 3),
(12, 3, 4),
(13, 3, 6),
(14, 3, 7),
(15, 4, 1),
(16, 4, 2),
(17, 4, 3),
(18, 4, 4),
(19, 4, 6),
(20, 4, 7),
(21, 5, 1),
(22, 5, 2),
(23, 5, 3),
(24, 5, 4),
(25, 6, 1),
(26, 6, 2),
(27, 6, 3),
(28, 6, 4),
(29, 6, 5),
(30, 6, 6),
(31, 6, 7),
(32, 7, 1),
(33, 7, 2),
(34, 7, 3),
(35, 7, 4),
(36, 7, 6),
(37, 7, 7),
(38, 8, 1),
(39, 8, 2),
(40, 8, 3),
(41, 8, 4),
(42, 8, 6),
(43, 8, 7),
(44, 9, 1),
(45, 9, 2),
(46, 9, 3),
(47, 9, 4),
(48, 9, 5),
(49, 9, 6),
(50, 9, 7),
(51, 10, 1),
(52, 10, 2),
(53, 10, 3),
(54, 10, 4),
(55, 10, 5),
(56, 10, 6),
(57, 10, 7),
(58, 11, 1),
(59, 11, 2),
(60, 11, 3),
(61, 11, 4),
(62, 11, 5),
(63, 11, 6),
(64, 11, 7),
(65, 12, 1),
(66, 12, 2),
(67, 12, 3),
(68, 12, 4),
(69, 12, 5),
(70, 12, 6),
(71, 12, 7),
(72, 13, 2),
(73, 13, 7),
(74, 14, 1),
(75, 14, 2),
(76, 14, 3),
(77, 14, 4),
(78, 14, 6),
(79, 14, 7),
(80, 15, 1),
(81, 15, 2),
(82, 15, 3),
(83, 15, 4),
(84, 15, 7),
(85, 16, 2),
(86, 16, 3),
(87, 16, 7),
(88, 17, 2),
(89, 17, 6),
(90, 17, 7);

-- --------------------------------------------------------

--
-- Table structure for table `group_table`
--

CREATE TABLE `group_table` (
  `group_id` bigint(12) UNSIGNED NOT NULL,
  `group_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_table`
--

INSERT INTO `group_table` (`group_id`, `group_name`) VALUES
(1, 'GR1'),
(2, 'GR2'),
(3, 'GR3'),
(4, 'GR4'),
(5, 'GR5'),
(6, 'GR6'),
(7, 'GR7'),
(8, 'GR8'),
(9, 'GR9'),
(10, 'GR10');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_table`
--

CREATE TABLE `inventory_table` (
  `inventory_id` bigint(12) UNSIGNED NOT NULL,
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `unit_id` bigint(12) UNSIGNED DEFAULT NULL,
  `quantity` bigint(12) DEFAULT 0,
  `unit_multiplier` bigint(12) NOT NULL,
  `total_quantity` bigint(12) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_table`
--

INSERT INTO `inventory_table` (`inventory_id`, `product_id`, `unit_id`, `quantity`, `unit_multiplier`, `total_quantity`, `updated_at`) VALUES
(1, 1, 1, 56, 1, 10, '2026-03-05 09:25:10'),
(2, 2, 1, 0, 1, 0, '2025-11-30 05:28:41'),
(3, 3, 1, 0, 1, 0, '2025-11-30 07:16:37'),
(4, 4, 1, 40, 1, 1, '2026-02-15 14:19:39'),
(5, 5, 5, 10, 1, 3, '2026-01-18 14:12:15'),
(6, 6, 1, 10, 1, 7, '2026-01-14 14:07:55'),
(7, 7, 5, 49, 1, 49, '2025-12-03 16:59:35'),
(8, 8, 1, 10, 1, 7, '2026-02-15 14:19:39'),
(9, 9, 2, 4, 1, 4947, '2026-01-20 09:30:26'),
(10, 10, 1, 11, 1, 10, '2026-01-20 08:02:48'),
(11, 11, 1, 0, 1, 0, '2025-11-30 08:16:54'),
(12, 12, 1, 1, 1, 0, '2025-11-30 08:25:43'),
(13, 13, 1, 92, 1, 92, '2025-11-30 13:37:27'),
(14, 14, 1, 4, 1, 4, '2025-11-30 13:37:27'),
(15, 15, 2, 100, 1, 100397, '2025-11-30 18:47:13'),
(17, 17, 1, 0, 1, 0, '2025-11-30 13:24:48'),
(18, 18, 1, 0, 1, 0, '2025-11-30 15:30:25'),
(19, 19, 1, 0, 1, 0, '2025-11-30 17:52:48'),
(20, 20, 1, 0, 1, 0, '2025-11-30 22:12:32'),
(21, 21, 17, 1, 5, 0, '2025-12-03 00:07:20'),
(22, 22, 17, 1, 12, 6, '2025-12-03 00:07:21'),
(23, 23, 13, 102, 1, 102, '2025-12-02 23:33:57'),
(24, 24, 13, 83, 1, 82, '2026-01-20 01:10:45'),
(25, 25, 1, 82, 1, 82, '2025-12-02 23:33:57'),
(26, 26, 1, 720, 1, 720, '2025-12-02 23:33:57'),
(27, 27, 2, 5, 1, 5860, '2025-12-02 23:33:57'),
(28, 28, 1, 5280, 1, 5280, '2025-12-02 23:33:45'),
(29, 29, 13, 7, 1, 7, '2025-12-02 23:33:57'),
(30, 30, 25, 5, 1, 1, '2025-12-03 00:07:11'),
(31, 31, 25, 1, 1, 0, '2025-12-02 23:41:35');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `transaction_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `transaction_type` enum('purchase','sale','waste','spoilage','correction','production') NOT NULL,
  `reference` varchar(999) DEFAULT NULL,
  `user_id` bigint(12) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`transaction_id`, `business_id`, `transaction_type`, `reference`, `user_id`, `created_at`) VALUES
(1, 1, 'purchase', 'stockin:1', 1, '2025-11-30 05:04:18'),
(2, 1, 'waste', NULL, 1, '2025-11-30 05:06:06'),
(3, 1, 'correction', NULL, 1, '2025-11-30 05:06:19'),
(4, 1, 'purchase', 'stockin:2', 1, '2025-11-30 06:52:04'),
(5, 1, 'purchase', 'stockin:3', 1, '2025-11-30 07:25:09'),
(6, 1, 'purchase', 'stockin:4', 1, '2025-11-30 07:27:39'),
(7, 1, 'production', 'production:6', 1, '2025-11-30 07:30:28'),
(8, 1, 'purchase', 'stockin:5', 1, '2025-11-30 07:43:46'),
(9, 1, 'production', 'production:8', 1, '2025-11-30 07:45:42'),
(10, 1, 'purchase', 'stockin:6', 1, '2025-11-30 08:01:06'),
(11, 1, 'correction', NULL, 1, '2025-11-30 08:01:43'),
(12, 1, 'purchase', 'stockin:7', 1, '2025-11-30 08:05:10'),
(13, 1, 'production', 'production:10', 1, '2025-11-30 08:07:12'),
(14, 1, 'purchase', 'stockin:8', 1, '2025-11-30 08:15:08'),
(15, 1, 'production', 'production:12', 1, '2025-11-30 08:16:54'),
(16, 1, 'purchase', 'stockin:9', 1, '2025-11-30 08:38:43'),
(17, 1, 'purchase', 'stockin:10', 1, '2025-11-30 08:39:02'),
(18, 1, 'purchase', 'stockin:11', 1, '2025-11-30 08:49:04'),
(19, 1, 'purchase', 'stockin:12', 1, '2025-11-30 08:49:33'),
(20, 1, 'purchase', 'stockin:13', 1, '2025-11-30 08:51:36'),
(21, 1, 'production', 'production:14', 1, '2025-11-30 08:55:27'),
(22, 1, 'production', 'production:14', 1, '2025-11-30 09:35:49'),
(23, 1, 'production', 'production:14', 1, '2025-11-30 09:36:26'),
(24, 1, 'purchase', 'stockin:15', 1, '2025-11-30 09:39:56'),
(25, 1, 'purchase', 'stockin:16', 1, '2025-11-30 09:40:11'),
(26, 1, 'production', 'production:16', 1, '2025-11-30 09:40:27'),
(27, 1, 'purchase', 'stockin:17', 1, '2025-11-30 09:46:06'),
(28, 1, 'purchase', 'stockin:18', 1, '2025-11-30 09:46:14'),
(29, 1, 'purchase', 'stockin:19', 1, '2025-11-30 09:46:32'),
(30, 1, 'waste', NULL, 1, '2025-11-30 09:46:51'),
(31, 1, 'production', 'production:16', 1, '2025-11-30 09:47:09'),
(32, 1, 'production', 'production:16', 1, '2025-11-30 09:47:12'),
(36, 1, 'production', 'production:14', 1, '2025-11-30 13:37:27'),
(38, 1, 'correction', NULL, 1, '2025-11-30 13:48:01'),
(39, 1, 'correction', NULL, 1, '2025-11-30 13:48:07'),
(40, 1, 'purchase', 'stockin:20', 1, '2025-11-30 16:19:13'),
(41, 1, 'waste', NULL, 1, '2025-11-30 16:20:07'),
(42, 1, 'waste', NULL, 1, '2025-11-30 16:23:26'),
(43, 1, 'purchase', 'stockin:21', 1, '2025-11-30 17:34:40'),
(44, 1, 'purchase', 'stockin:22', 1, '2025-11-30 17:34:46'),
(45, 1, 'purchase', 'stockin:23', 1, '2025-11-30 18:47:37'),
(46, 1, 'purchase', 'stockin:24', 1, '2025-11-30 18:47:47'),
(47, 1, 'purchase', 'stockin:25', 1, '2025-11-30 18:47:52'),
(48, 1, 'correction', NULL, 1, '2025-11-30 20:37:41'),
(49, 1, 'purchase', 'stockin:26', 1, '2025-11-30 22:09:43'),
(50, 1, 'purchase', 'stockin:27', 1, '2025-11-30 22:31:00'),
(51, 7, 'purchase', 'stockin:28', 13, '2025-12-02 17:45:04'),
(52, 7, 'purchase', 'stockin:29', 13, '2025-12-02 18:05:27'),
(53, 7, 'purchase', 'stockin:30', 13, '2025-12-02 18:11:49'),
(54, 7, 'purchase', 'stockin:31', 13, '2025-12-02 18:12:37'),
(55, 7, 'purchase', 'stockin:32', 13, '2025-12-02 18:13:01'),
(56, 7, 'production', 'production:30', 13, '2025-12-02 18:13:18'),
(57, 7, 'production', 'production:30', 13, '2025-12-02 18:22:21'),
(58, 7, 'production', 'production:31', 13, '2025-12-02 18:22:27'),
(59, 7, 'purchase', 'stockin:33', 13, '2025-12-02 22:49:00'),
(60, 7, 'purchase', 'stockin:34', 13, '2025-12-02 23:28:22'),
(61, 7, 'purchase', 'stockin:35', 13, '2025-12-02 23:28:25'),
(62, 7, 'production', 'production:31', 13, '2025-12-02 23:31:23'),
(68, 7, 'purchase', 'stockin:36', 13, '2025-12-02 23:31:50'),
(76, 7, 'purchase', 'stockin:37', 13, '2025-12-02 23:33:45'),
(77, 7, 'production', 'production:30', 13, '2025-12-02 23:33:57'),
(78, 1, 'purchase', 'stockin:38', 4, '2025-12-03 16:58:48'),
(79, 1, 'waste', NULL, 4, '2025-12-03 16:58:54'),
(80, 1, 'waste', NULL, 4, '2025-12-03 16:58:57'),
(81, 1, 'correction', NULL, 4, '2025-12-03 16:59:12'),
(82, 1, 'correction', NULL, 4, '2025-12-03 16:59:14'),
(85, 1, 'production', 'production:10', 4, '2025-12-03 16:59:28'),
(86, 1, 'production', 'production:10', 4, '2025-12-03 16:59:35'),
(87, 1, 'purchase', 'stockin:39', 1, '2025-12-04 10:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transaction_details`
--

CREATE TABLE `inventory_transaction_details` (
  `detail_id` bigint(12) UNSIGNED NOT NULL,
  `invent_transact_id` bigint(12) UNSIGNED NOT NULL,
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `qty_before` bigint(12) NOT NULL,
  `qty_after` bigint(12) NOT NULL,
  `qty_change` bigint(12) NOT NULL,
  `unit_id` bigint(12) UNSIGNED NOT NULL,
  `unit_cost` bigint(12) NOT NULL,
  `total_cost` decimal(10,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_transaction_details`
--

INSERT INTO `inventory_transaction_details` (`detail_id`, `invent_transact_id`, `product_id`, `qty_before`, `qty_after`, `qty_change`, `unit_id`, `unit_cost`, `total_cost`) VALUES
(1, 1, 1, 0, 50, 50, 1, 0, 0.0000),
(2, 2, 1, 50, 49, -1, 1, 0, 0.0000),
(3, 3, 1, 49, 48, -1, 1, 0, 0.0000),
(4, 4, 1, 48, 50, 2, 1, 20, 40.0000),
(5, 5, 4, 0, 50, 50, 1, 3, 150.0000),
(6, 6, 5, 0, 20, 20, 5, 15, 300.0000),
(7, 7, 4, 50, 40, -10, 1, 0, 0.0000),
(8, 7, 5, 20, 10, -10, 5, 0, 0.0000),
(9, 7, 6, 0, 10, 10, 1, 0, 0.0000),
(10, 8, 7, 0, 10, 10, 5, 10, 100.0000),
(11, 9, 5, 10, -100, -110, 5, 0, 0.0000),
(12, 9, 7, 10, -90, -100, 5, 0, 0.0000),
(13, 9, 8, 0, 10, 10, 1, 0, 0.0000),
(14, 10, 7, -90, 60, 150, 5, 10, 1500.0000),
(15, 10, 5, -100, 50, 150, 5, 15, 2250.0000),
(16, 11, 1, 49, 39, -10, 1, 0, 0.0000),
(17, 12, 9, 0, 20, 20, 2, 200, 4000.0000),
(18, 13, 9, 20, 10, -10, 2, 0, 0.0000),
(19, 13, 7, 60, -40, -100, 5, 0, 0.0000),
(20, 13, 10, 0, 10, 10, 1, 0, 0.0000),
(21, 14, 11, 0, 10, 10, 13, 15, 150.0000),
(22, 15, 11, 10, 0, -10, 1, 0, 0.0000),
(23, 15, 9, 10, 10, 0, 2, 0, 0.0000),
(24, 15, 12, 0, 1, 1, 1, 0, 0.0000),
(25, 16, 9, 9, 10, 1, 2, 200, 200.0000),
(26, 17, 9, 10, 11, 1, 2, 220, 220.0000),
(27, 18, 13, 0, 100, 100, 1, 0, 0.0000),
(28, 19, 13, 100, 101, 1, 1, 10, 10.0000),
(29, 20, 13, 101, 102, 1, 1, 0, 0.0000),
(30, 21, 9, 11, 9, -2, 2, 0, 0.0000),
(31, 21, 13, 102, 98, -4, 1, 0, 0.0000),
(32, 21, 14, 0, 2, 2, 1, 0, 0.0000),
(33, 22, 9, 9, 8, -1, 2, 220, 220.0000),
(34, 22, 13, 98, 96, -2, 1, 10, 20.0000),
(35, 22, 14, 2, 3, 1, 1, 240, 240.0000),
(36, 23, 9, 8, 7, -1, 2, 220, 220.0000),
(37, 23, 13, 96, 94, -2, 1, 10, 20.0000),
(38, 23, 14, 2, 3, 1, 1, 240, 240.0000),
(39, 24, 15, 0, 100, 100, 2, 200, 20000.0000),
(40, 25, 5, 50, 60, 10, 5, 15, 150.0000),
(41, 26, 15, 100, 100, 0, 2, 200, 100.0000),
(42, 26, 5, 60, -40, -100, 5, 15, 1500.0000),
(44, 27, 7, -40, 60, 100, 5, 10, 1000.0000),
(45, 28, 7, 60, 70, 10, 5, 50, 500.0000),
(46, 29, 15, 99, 100, 1, 2, 300, 300.0000),
(48, 31, 15, 100, 100, 0, 2, 200, 10.0000),
(49, 31, 5, -40, -50, -10, 5, 15, 150.0000),
(51, 32, 15, 100, 100, 0, 2, 200, 10.0000),
(52, 32, 5, -50, -60, -10, 5, 15, 150.0000),
(57, 36, 9, 7, 6, -1, 2, 220, 220.0000),
(58, 36, 13, 94, 92, -2, 1, 10, 20.0000),
(59, 36, 14, 3, 4, 1, 1, 240, 240.0000),
(60, 38, 1, 38, 35, -3, 1, 0, 0.0000),
(61, 39, 1, 32, 29, -3, 1, 0, 0.0000),
(62, 40, 1, 29, 41, 12, 1, 10, 120.0000),
(63, 41, 1, 41, 36, -5, 1, 0, 0.0000),
(64, 42, 1, 36, 30, -6, 1, 0, 0.0000),
(65, 43, 1, 30, 50, 20, 1, 10, 200.0000),
(66, 44, 1, 45, 65, 20, 1, 10, 200.0000),
(67, 45, 1, 65, 70, 5, 1, 10, 50.0000),
(68, 46, 1, 58, 63, 5, 1, 10, 50.0000),
(69, 47, 1, 63, 68, 5, 1, 10, 50.0000),
(70, 48, 1, 68, 50, -18, 1, 0, 0.0000),
(71, 49, 1, 48, 50, 2, 1, 10, 20.0000),
(72, 50, 1, 50, 60, 10, 1, 10, 100.0000),
(73, 51, 21, 0, 3, 3, 17, 15, 45.0000),
(74, 52, 22, 0, 3, 3, 17, 10, 30.0000),
(75, 52, 23, 0, 30, 30, 13, 5, 150.0000),
(76, 52, 24, 0, 25, 25, 13, 12, 300.0000),
(77, 52, 25, 0, 80, 80, 1, 6, 480.0000),
(78, 52, 26, 0, 1000, 1000, 1, 1, 1000.0000),
(79, 53, 27, 0, 4, 4, 2, 60, 240.0000),
(80, 54, 28, 0, 480, 480, 1, 1, 480.0000),
(81, 55, 29, 0, 10, 10, 13, 120, 1200.0000),
(82, 56, 29, 10, 5, -5, 13, 120, 600.0000),
(83, 56, 27, 4, 4, 0, 2, 60, 3.0000),
(84, 56, 26, 1000, 900, -100, 1, 1, 100.0000),
(85, 56, 25, 80, 45, -35, 1, 6, 210.0000),
(86, 56, 24, 25, 10, -15, 13, 12, 180.0000),
(87, 56, 23, 30, 20, -10, 13, 5, 50.0000),
(88, 56, 30, 0, 5, 5, 25, 229, 1143.0000),
(89, 57, 29, 5, 3, -2, 13, 120, 240.0000),
(90, 57, 27, 3, 3, 0, 2, 60, 1.2000),
(91, 57, 26, 900, 860, -40, 1, 1, 40.0000),
(92, 57, 25, 45, 31, -14, 1, 6, 84.0000),
(93, 57, 24, 10, 4, -6, 13, 12, 72.0000),
(94, 57, 23, 20, 16, -4, 13, 5, 20.0000),
(95, 57, 30, 5, 7, 2, 25, 229, 457.2000),
(96, 58, 30, 7, 3, -4, 25, 229, 914.4000),
(97, 58, 31, 0, 2, 2, 25, 457, 914.4000),
(98, 59, 21, 3, 5, 2, 17, 15, 30.0000),
(99, 60, 22, 3, 4, 1, 17, 10, 10.0000),
(100, 61, 21, 4, 5, 1, 17, 15, 15.0000),
(101, 62, 30, 3, 1, -2, 25, 229, 457.2000),
(102, 62, 31, 2, 3, 1, 25, 457, 457.2000),
(123, 68, 29, 3, 13, 10, 13, 120, 1200.0000),
(164, 76, 23, 16, 116, 100, 13, 5, 500.0000),
(165, 76, 24, 4, 104, 100, 13, 12, 1200.0000),
(166, 76, 25, 31, 131, 100, 1, 6, 600.0000),
(167, 76, 27, 3, 5, 2, 2, 60, 120.0000),
(168, 76, 28, 480, 5280, 4800, 1, 1, 4800.0000),
(169, 76, 29, 13, 14, 1, 13, 120, 120.0000),
(170, 77, 29, 14, 7, -7, 13, 120, 840.0000),
(171, 77, 27, 5, 5, 0, 2, 60, 4.2000),
(172, 77, 26, 860, 720, -140, 1, 1, 140.0000),
(173, 77, 25, 131, 82, -49, 1, 6, 294.0000),
(174, 77, 24, 104, 83, -21, 13, 12, 252.0000),
(175, 77, 23, 116, 102, -14, 13, 5, 70.0000),
(176, 77, 30, -2, 5, 7, 25, 229, 1600.2000),
(177, 78, 1, 60, 61, 1, 1, 10, 10.0000),
(178, 79, 1, 61, 60, -1, 1, 0, 0.0000),
(179, 80, 1, 60, 59, -1, 1, 0, 0.0000),
(180, 81, 1, 59, 55, -4, 1, 0, 0.0000),
(181, 82, 1, 55, 56, 1, 1, 0, 0.0000),
(183, 85, 9, 6, 5, -1, 2, 220, 220.0000),
(184, 85, 7, 70, 60, -10, 5, 50, 500.0000),
(185, 85, 10, 10, 11, 1, 1, 720, 720.0000),
(186, 86, 9, 5, 4, -1, 2, 220, 220.0000),
(187, 86, 7, 59, 49, -10, 5, 50, 500.0000),
(188, 86, 10, 10, 11, 1, 1, 720, 720.0000),
(189, 87, 5, -60, 10, 70, 5, 15, 1050.0000);

-- --------------------------------------------------------

--
-- Table structure for table `module_table`
--

CREATE TABLE `module_table` (
  `module_id` bigint(12) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module_table`
--

INSERT INTO `module_table` (`module_id`, `name`, `description`) VALUES
(1, 'dashboard', 'Dashboard and analytics overview'),
(2, 'inventory', 'Inventory and stock management'),
(3, 'sales', 'Sales and order management'),
(4, 'reports', 'Reports and data export'),
(5, 'settings', 'System and business settings');

-- --------------------------------------------------------

--
-- Table structure for table `production_table`
--

CREATE TABLE `production_table` (
  `production_id` bigint(12) UNSIGNED NOT NULL,
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `quantity_produced` decimal(10,2) NOT NULL,
  `user_id` bigint(12) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `production_table`
--

INSERT INTO `production_table` (`production_id`, `product_id`, `quantity_produced`, `user_id`, `created_at`) VALUES
(1, 6, 10.00, 1, '2025-11-30 07:30:29'),
(2, 8, 10.00, 1, '2025-11-30 07:45:42'),
(3, 10, 10.00, 1, '2025-11-30 08:07:12'),
(4, 12, 1.00, 1, '2025-11-30 08:16:54'),
(5, 14, 2.00, 1, '2025-11-30 08:55:27'),
(6, 14, 1.00, 1, '2025-11-30 09:35:49'),
(7, 14, 1.00, 1, '2025-11-30 09:36:26'),
(11, 14, 1.00, 1, '2025-11-30 13:37:27'),
(12, 30, 5.00, 13, '2025-12-02 18:13:18'),
(13, 30, 2.00, 13, '2025-12-02 18:22:21'),
(14, 31, 2.00, 13, '2025-12-02 18:22:27'),
(15, 31, 1.00, 13, '2025-12-02 23:31:23'),
(16, 30, 7.00, 13, '2025-12-02 23:33:57'),
(17, 10, 1.00, 4, '2025-12-03 16:59:28'),
(18, 10, 1.00, 4, '2025-12-03 16:59:35');

-- --------------------------------------------------------

--
-- Table structure for table `product_category_table`
--

CREATE TABLE `product_category_table` (
  `category_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_category_table`
--

INSERT INTO `product_category_table` (`category_id`, `business_id`, `name`, `description`) VALUES
(1, 1, 'Donut', 'hole in the middle'),
(2, 1, 'Beverage', ''),
(3, 1, 'Meal', ''),
(4, 1, 'ingredients', ''),
(5, 1, 'test', ''),
(6, 1, 'testing', ''),
(7, 2, 'Produce', 'green and roots'),
(8, 7, 'Processed', 'Can sold as raw'),
(9, 7, 'Food', 'Cooked'),
(10, 7, 'Ingredients', 'Raw cooking items'),
(11, 7, 'Poultry', 'Egg'),
(12, 1, 'Ready meal', 'dwdw');

-- --------------------------------------------------------

--
-- Table structure for table `product_cost_table`
--

CREATE TABLE `product_cost_table` (
  `cost_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `valid_from` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_cost_table`
--

INSERT INTO `product_cost_table` (`cost_id`, `product_id`, `cost`, `valid_from`) VALUES
(1, 1, 10.00, '0000-00-00'),
(2, 4, 3.00, '2025-11-30'),
(3, 5, 15.00, '2025-11-30'),
(4, 7, 10.00, '2025-11-30'),
(5, 7, 10.00, '2025-11-30'),
(6, 5, 15.00, '2025-11-30'),
(7, 9, 200.00, '2025-11-30'),
(8, 11, 15.00, '2025-11-30'),
(9, 9, 200.00, '2025-11-30'),
(10, 9, 220.00, '2025-11-30'),
(11, 13, 10.00, '2025-11-30'),
(12, 14, 240.00, '2025-11-30'),
(13, 14, 240.00, '2025-11-30'),
(14, 15, 200.00, '2025-11-30'),
(15, 5, 15.00, '2025-11-30'),
(17, 7, 10.00, '2025-11-30'),
(18, 7, 50.00, '2025-11-30'),
(19, 15, 300.00, '2025-11-30'),
(22, 14, 240.00, '2025-11-30'),
(23, 1, 10.00, '2025-12-01'),
(24, 1, 10.00, '2025-12-01'),
(25, 1, 10.00, '2025-12-01'),
(26, 1, 10.00, '2025-12-01'),
(27, 1, 10.00, '2025-12-01'),
(28, 1, 10.00, '2025-12-01'),
(29, 1, 10.00, '2025-12-01'),
(30, 1, 10.00, '2025-12-01'),
(31, 21, 15.00, '2025-12-03'),
(32, 22, 10.00, '2025-12-03'),
(33, 23, 5.00, '2025-12-03'),
(34, 24, 12.00, '2025-12-03'),
(35, 25, 6.00, '2025-12-03'),
(36, 26, 1.00, '2025-12-03'),
(37, 27, 60.00, '2025-12-03'),
(38, 28, 1.00, '2025-12-03'),
(39, 29, 120.00, '2025-12-03'),
(40, 30, 228.60, '2025-12-03'),
(41, 30, 228.60, '2025-12-03'),
(42, 31, 457.20, '2025-12-03'),
(43, 21, 15.00, '2025-12-03'),
(44, 22, 10.00, '2025-12-03'),
(45, 21, 15.00, '2025-12-03'),
(46, 31, 457.20, '2025-12-03'),
(47, 29, 120.00, '2025-12-03'),
(48, 23, 5.00, '2025-12-03'),
(49, 24, 12.00, '2025-12-03'),
(50, 25, 6.00, '2025-12-03'),
(51, 27, 60.00, '2025-12-03'),
(52, 28, 1.00, '2025-12-03'),
(53, 29, 120.00, '2025-12-03'),
(54, 30, 228.60, '2025-12-03'),
(55, 1, 10.00, '2025-12-04'),
(56, 10, 720.00, '2025-12-04'),
(57, 10, 720.00, '2025-12-04'),
(58, 5, 15.00, '2025-12-04');

-- --------------------------------------------------------

--
-- Table structure for table `product_table`
--

CREATE TABLE `product_table` (
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `product_type` enum('simple','recipe','composite') NOT NULL,
  `category_id` bigint(12) UNSIGNED DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `picture` varchar(999) DEFAULT NULL,
  `localpath` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_table`
--

INSERT INTO `product_table` (`product_id`, `business_id`, `name`, `product_type`, `category_id`, `price`, `sku`, `picture`, `localpath`, `is_active`, `created_at`) VALUES
(1, 1, 'Classic Glazed', 'simple', 1, 35.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764479038/products/sujxval4qzsx3jckp5ty.jpg', 'uploads\\1764479035320-offline-image.jpg', 1, '2025-11-30 05:03:57'),
(2, 1, 'Barbarian', 'simple', 1, 20.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764480523/products/snqkdtim2nscswcezhwc.jpg', 'uploads\\1764480519450-offline-image.jpg', 1, '2025-11-30 05:28:41'),
(3, 1, 'strawberry glazed', 'simple', 1, 25.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764486999/products/pjdwx0fqi8vz1d7t9hcl.jpg', 'uploads\\1764486994848-offline-image.jpg', 1, '2025-11-30 07:16:36'),
(4, 1, 'Onion', 'simple', 4, 5.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487480/products/zsegd5wiurryam7zjg2g.jpg', 'uploads\\1764487476164-offline-image.jpg', 1, '2025-11-30 07:24:38'),
(5, 1, 'toyo', 'simple', 4, 20.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487632/products/xditlegru20b6f8ea8pm.webp', 'uploads\\1764487628595-offline-image.jpg', 1, '2025-11-30 07:27:10'),
(6, 1, 'beef stik', 'recipe', 3, 210.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764487721/products/ihnqzwibiqh0b31puokx.jpg', 'uploads\\1764487717524-offline-image.jpg', 1, '2025-11-30 07:28:39'),
(7, 1, 'vinegar', 'simple', 4, 20.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488554/products/hlaaagppphwgnp4bynea.webp', 'uploads\\1764488550113-offline-image.jpg', 1, '2025-11-30 07:42:32'),
(8, 1, 'Adobo', 'recipe', 3, 200.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764488708/products/afqr8hyp2yosg7vm5t25.jpg', 'uploads\\1764488703724-offline-image.jpg', 1, '2025-11-30 07:45:06'),
(9, 1, 'Pork Meat', 'simple', 4, 220.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489852/products/lz86xq1uybhv6ypahlsf.webp', 'uploads\\1764489847625-offline-image.jpg', 1, '2025-11-30 08:04:10'),
(10, 1, 'Sinigang', 'recipe', 3, 250.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764489975/products/kyekfez4lxguyfawy7it.webp', 'uploads\\1764489971658-offline-image.jpg', 1, '2025-11-30 08:06:14'),
(11, 1, 'egg', 'simple', 2, 5.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490405/products/dtfpulhom95segosmdp6.jpg', 'uploads\\1764490400693-offline-image.jpg', 1, '2025-11-30 08:13:23'),
(12, 1, 'pancit malabon', 'recipe', 3, 200.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764490472/products/wjekoi2xtdbabfhszwny.jpg', 'uploads\\1764490468597-offline-image.jpg', 1, '2025-11-30 08:14:30'),
(13, 1, 'pepper', 'simple', 4, 30.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492492/products/yfkenfprgnbp0keejkxa.jpg', 'uploads\\1764492487429-offline-image.jpg', 1, '2025-11-30 08:48:10'),
(14, 1, 'Kaldereta', 'recipe', 3, 200.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764492533/products/xtufwxeotw4p17ropdum.jpg', 'uploads\\1764492529270-offline-image.jpg', 1, '2025-11-30 08:48:51'),
(15, 1, 'beef', 'simple', 4, 250.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764495504/products/uaib3ojtptcmvx7bamti.jpg', 'uploads\\1764495502713-offline-image.jpg', 1, '2025-11-30 09:38:25'),
(17, 1, 'garlic', 'simple', 4, 5.00, NULL, NULL, NULL, 0, '2025-11-30 13:24:47'),
(18, 1, 'black pepper', 'simple', 4, 30.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764516625/products/zrebrw6zqr84lk7qjrb0.jpg', 'uploads\\1764516622386-offline-image.jpg', 1, '2025-11-30 15:30:25'),
(19, 1, 'hysi', 'simple', 3, 89.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764525168/products/s7y9mex8kvl4xjxtyxin.jpg', 'uploads\\1764525165232-offline-image.jpg', 0, '2025-11-30 17:52:48'),
(20, 2, 'Red bell Pepper', 'simple', 7, 30.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764540753/products/kydtr1bubziy4mipp4tj.jpg', 'uploads\\1764540749939-offline-image.jpg', 1, '2025-11-30 22:12:32'),
(21, 7, 'Longganisa', 'simple', 8, 120.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696825/products/u98u5xpeugfxruoswvd1.webp', 'uploads\\1764696823539-offline-image.jpg', 0, '2025-12-02 17:33:46'),
(22, 7, 'Hotdog', 'simple', 8, 20.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696867/products/ktjutyxtdjqkebzzrcds.webp', 'uploads\\1764696865532-offline-image.jpg', 0, '2025-12-02 17:34:27'),
(23, 7, 'Onion', 'simple', 10, 7.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696915/products/sc2lbny5odimv2dlrrue.jpg', 'uploads\\1764696914470-offline-image.jpg', 1, '2025-12-02 17:35:16'),
(24, 7, 'Lemon', 'simple', 10, 12.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764696947/products/p6palpor3lybdoaquefl.jpg', 'uploads\\1764696946620-offline-image.jpg', 1, '2025-12-02 17:35:48'),
(25, 7, 'Thyme Leaves', 'simple', 10, 30.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697130/products/lzvv12itfruxo9gfgm1d.jpg', 'uploads\\1764697128950-offline-image.jpg', 1, '2025-12-02 17:38:51'),
(26, 7, 'Black Pepper', 'simple', 10, 15.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697179/products/ifkcp7eqwrlbbbsgrcir.jpg', 'uploads\\1764697177624-offline-image.jpg', 1, '2025-12-02 17:39:40'),
(27, 7, 'Salt', 'simple', 10, 60.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697198/products/y7mao7khkxk9peid0ajr.webp', 'uploads\\1764697197318-offline-image.jpg', 1, '2025-12-02 17:39:58'),
(28, 7, 'buttah', 'simple', 8, 70.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697242/products/ubkdpykwf1tyebgaxd3g.jpg', 'uploads\\1764697242275-offline-image.jpg', 1, '2025-12-02 17:40:43'),
(29, 7, 'Chicken.', 'simple', 10, 120.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697280/products/jur2kqx4lasmecs0d3oq.jpg', 'uploads\\1764697279189-offline-image.jpg', 1, '2025-12-02 17:41:21'),
(30, 7, 'Roasted Chicken ...', 'recipe', 9, 250.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697419/products/txjxthhckczv743oypto.jpg', 'uploads\\1764697417888-offline-image.jpg', 0, '2025-12-02 17:43:40'),
(31, 7, 'Roasted Chiken B1T1', 'composite', 9, 450.00, NULL, 'https://res.cloudinary.com/dkqybq1rz/image/upload/v1764697470/products/aufmkryjkww5mp8kimnf.jpg', 'uploads\\1764697469440-offline-image.jpg', 0, '2025-12-02 17:44:31');

-- --------------------------------------------------------

--
-- Table structure for table `product_type_table`
--

CREATE TABLE `product_type_table` (
  `product_type_id` bigint(12) UNSIGNED NOT NULL,
  `type` varchar(99) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_type_table`
--

INSERT INTO `product_type_table` (`product_type_id`, `type`) VALUES
(1, 'simple'),
(2, 'recipe'),
(3, 'composite');

-- --------------------------------------------------------

--
-- Table structure for table `purchases_table`
--

CREATE TABLE `purchases_table` (
  `purchase_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status_id` bigint(12) UNSIGNED NOT NULL DEFAULT 2,
  `finished_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases_table`
--

INSERT INTO `purchases_table` (`purchase_id`, `user_id`, `total_amount`, `purchase_date`, `status_id`, `finished_at`) VALUES
(1, 1, 35.00, '2025-11-29 13:07:58', 1, '2025-11-29 13:07:43'),
(2, 1, 35.00, '2025-11-30 15:17:35', 1, '2025-11-30 15:17:24'),
(3, 1, 420.00, '2025-12-01 15:37:12', 3, '2025-12-01 15:30:45'),
(4, 1, 210.00, '2025-12-02 15:55:31', 3, '2025-12-02 15:37:41'),
(5, 1, 150.00, '2025-12-03 16:25:56', 1, '2025-12-03 16:25:43'),
(6, 1, 200.00, '2025-12-04 16:56:11', 1, '2025-12-04 16:56:03'),
(7, 1, 250.00, '2025-12-05 17:44:51', 1, '2025-12-05 17:44:43'),
(8, 1, 100.00, '2025-12-06 17:47:30', 1, '2025-12-06 17:47:21'),
(9, 1, 70.00, '2025-12-07 21:18:04', 1, '2025-12-07 21:18:00'),
(10, 1, 35.00, '2025-12-08 21:18:27', 1, '2025-12-08 21:18:14'),
(11, 1, 200.00, '2025-12-09 21:21:33', 3, '2025-12-09 21:19:09'),
(12, 1, 5.00, '2025-12-11 00:18:51', 1, '2025-12-11 00:09:26'),
(13, 1, 250.00, '2025-12-12 00:18:53', 1, '2025-12-12 00:17:21'),
(17, 1, 255.00, '2025-12-13 00:54:05', 1, '2025-12-13 00:53:58'),
(18, 1, 35.00, '2025-12-14 01:03:24', 1, '2025-12-14 00:54:08'),
(19, 1, 35.00, '2025-12-15 01:03:25', 1, '2025-12-15 01:03:20'),
(20, 1, 35.00, '2025-12-16 01:23:56', 1, '2025-12-16 01:14:22'),
(21, 1, 35.00, '2025-11-30 01:23:57', 1, '2025-11-30 01:23:52'),
(22, 1, 35.00, '2025-11-30 01:47:20', 1, '2025-11-30 01:47:17'),
(23, 1, 70.00, '2025-11-30 01:55:52', 1, '2025-11-30 01:55:46'),
(24, 1, 70.00, '2025-11-30 02:03:40', 1, '2025-11-30 02:03:37'),
(25, 1, 40.00, '2025-11-30 02:07:23', 1, '2025-11-30 02:07:13'),
(26, 1, 70.00, '2025-11-30 02:10:11', 1, '2025-11-30 02:10:04'),
(27, 1, 35.00, '2025-11-30 02:13:10', 1, '2025-11-30 02:13:03'),
(28, 1, 35.00, '2025-11-30 02:14:43', 1, '2025-11-30 02:14:37'),
(29, 1, 35.00, '2025-11-30 02:16:21', 1, '2025-11-30 02:16:16'),
(30, 1, 35.00, '2025-11-30 02:46:41', 1, '2025-11-30 02:46:38'),
(31, 1, 500.00, '2025-11-30 02:47:17', 1, '2025-11-30 02:47:13'),
(32, 1, 35.00, '2025-11-30 02:49:39', 1, '2025-11-30 02:49:37'),
(33, 1, 35.00, '2025-11-30 03:28:59', 1, '2025-11-30 03:28:55'),
(34, 13, 720.00, '2025-12-02 02:58:45', 1, '2025-12-02 02:58:40'),
(35, 13, 700.00, '2025-12-02 02:59:06', 1, '2025-12-02 02:58:52'),
(36, 13, 450.00, '2025-12-02 02:59:08', 1, '2025-12-02 02:58:54'),
(37, 13, 500.00, '2025-12-02 03:37:28', 1, '2025-12-02 03:37:24'),
(38, 13, 120.00, '2025-12-02 04:00:10', 1, '2025-12-02 04:00:05'),
(39, 13, 360.00, '2025-12-02 06:38:32', 3, '2025-12-02 06:38:30'),
(40, 13, 2880.00, '2025-12-02 06:53:01', 1, '2025-12-02 06:52:57'),
(41, 13, 840.00, '2025-12-02 07:34:26', 3, '2025-12-02 07:34:10'),
(42, 13, 840.00, '2025-12-02 07:35:13', 3, '2025-12-02 07:35:08'),
(43, 13, 840.00, '2025-12-02 07:37:59', 3, '2025-12-02 07:37:52'),
(44, 13, 840.00, '2025-12-02 07:40:33', 3, '2025-12-02 07:39:40'),
(45, 13, 840.00, '2025-12-02 07:41:40', 1, '2025-12-02 07:41:35'),
(46, 13, 390.00, '2025-12-02 07:45:01', 2, '2025-12-02 07:45:01'),
(47, 13, 250.00, '2025-12-02 08:07:06', 2, '2025-12-02 08:07:06'),
(48, 13, 290.00, '2025-12-02 08:07:11', 2, '2025-12-02 08:07:11'),
(49, 13, 260.00, '2025-12-02 08:07:14', 2, '2025-12-02 08:07:14'),
(50, 13, 120.00, '2025-12-02 08:07:20', 2, '2025-12-02 08:07:20'),
(51, 13, 20.00, '2025-12-02 08:07:21', 2, '2025-12-02 08:07:21'),
(52, 1, 5.00, '2025-12-03 00:14:24', 1, '2025-12-02 19:38:18'),
(53, 4, 225.00, '2025-12-03 00:14:23', 1, '2025-12-03 00:14:17'),
(54, 4, 10.00, '2025-12-03 00:25:57', 1, '2025-12-03 00:25:13'),
(55, 4, 210.00, '2025-12-03 00:38:52', 3, '2025-12-03 00:26:09'),
(56, 1, 35.00, '2025-12-03 02:27:44', 1, '2025-12-03 02:27:16'),
(57, 4, 630.00, '2025-12-03 04:10:53', 1, '2025-12-03 04:10:39'),
(58, 4, 420.00, '2025-12-03 04:35:31', 1, '2025-12-03 04:20:48'),
(59, 4, 200.00, '2025-12-03 04:35:22', 1, '2026-01-20 01:28:51'),
(1001, 1, 120.00, '2020-12-31 18:00:00', 1, '2020-12-31 18:05:00'),
(1002, 1, 130.00, '2021-01-31 18:00:00', 1, '2021-01-31 18:05:00'),
(1003, 1, 125.00, '2021-02-28 18:00:00', 1, '2021-02-28 18:05:00'),
(1004, 1, 140.00, '2021-03-31 18:00:00', 1, '2021-03-31 18:05:00'),
(1005, 1, 135.00, '2021-04-30 18:00:00', 1, '2021-04-30 18:05:00'),
(1006, 1, 150.00, '2021-05-31 18:00:00', 1, '2021-05-31 18:05:00'),
(1007, 1, 145.00, '2021-06-30 18:00:00', 1, '2021-06-30 18:05:00'),
(1008, 1, 160.00, '2021-07-31 18:00:00', 1, '2021-07-31 18:05:00'),
(1009, 1, 155.00, '2021-08-31 18:00:00', 1, '2021-08-31 18:05:00'),
(1010, 1, 170.00, '2021-09-30 18:00:00', 1, '2021-09-30 18:05:00'),
(1011, 1, 165.00, '2021-10-31 18:00:00', 1, '2021-10-31 18:05:00'),
(1012, 1, 180.00, '2021-11-30 18:00:00', 1, '2021-11-30 18:05:00'),
(1013, 1, 185.00, '2021-12-31 18:00:00', 1, '2021-12-31 18:05:00'),
(1014, 1, 190.00, '2022-01-31 18:00:00', 1, '2022-01-31 18:05:00'),
(1015, 1, 195.00, '2022-02-28 18:00:00', 1, '2022-02-28 18:05:00'),
(1016, 1, 200.00, '2022-03-31 18:00:00', 1, '2022-03-31 18:05:00'),
(1017, 1, 205.00, '2022-04-30 18:00:00', 1, '2022-04-30 18:05:00'),
(1018, 1, 210.00, '2022-05-31 18:00:00', 1, '2022-05-31 18:05:00'),
(1019, 1, 215.00, '2022-06-30 18:00:00', 1, '2022-06-30 18:05:00'),
(1020, 1, 220.00, '2022-07-31 18:00:00', 1, '2022-07-31 18:05:00'),
(1021, 1, 225.00, '2022-08-31 18:00:00', 1, '2022-08-31 18:05:00'),
(1022, 1, 230.00, '2022-09-30 18:00:00', 1, '2022-09-30 18:05:00'),
(1023, 1, 235.00, '2022-10-31 18:00:00', 1, '2022-10-31 18:05:00'),
(1024, 1, 240.00, '2022-11-30 18:00:00', 1, '2022-11-30 18:05:00'),
(1025, 1, 245.00, '2022-12-31 18:00:00', 1, '2022-12-31 18:05:00'),
(1026, 1, 250.00, '2023-01-31 18:00:00', 1, '2023-01-31 18:05:00'),
(1027, 1, 255.00, '2023-02-28 18:00:00', 1, '2023-02-28 18:05:00'),
(1028, 1, 260.00, '2023-03-31 18:00:00', 1, '2023-03-31 18:05:00'),
(1029, 1, 265.00, '2023-04-30 18:00:00', 1, '2023-04-30 18:05:00'),
(1030, 1, 270.00, '2023-05-31 18:00:00', 1, '2023-05-31 18:05:00'),
(1031, 1, 275.00, '2023-06-30 18:00:00', 1, '2023-06-30 18:05:00'),
(1032, 1, 280.00, '2023-07-31 18:00:00', 1, '2023-07-31 18:05:00'),
(1033, 1, 285.00, '2023-08-31 18:00:00', 1, '2023-08-31 18:05:00'),
(1034, 1, 290.00, '2023-09-30 18:00:00', 1, '2023-09-30 18:05:00'),
(1035, 1, 295.00, '2023-10-31 18:00:00', 1, '2023-10-31 18:05:00'),
(1036, 1, 300.00, '2023-11-30 18:00:00', 1, '2023-11-30 18:05:00'),
(1037, 1, 305.00, '2023-12-31 18:00:00', 1, '2023-12-31 18:05:00'),
(1038, 1, 310.00, '2024-01-31 18:00:00', 1, '2024-01-31 18:05:00'),
(1039, 1, 315.00, '2024-02-29 18:00:00', 1, '2024-02-29 18:05:00'),
(1040, 1, 320.00, '2024-03-31 18:00:00', 1, '2024-03-31 18:05:00'),
(1041, 1, 325.00, '2024-04-30 18:00:00', 1, '2024-04-30 18:05:00'),
(1042, 1, 330.00, '2024-05-31 18:00:00', 1, '2024-05-31 18:05:00'),
(1043, 1, 335.00, '2024-06-30 18:00:00', 1, '2024-06-30 18:05:00'),
(1044, 1, 340.00, '2024-07-31 18:00:00', 1, '2024-07-31 18:05:00'),
(1045, 1, 345.00, '2024-08-31 18:00:00', 1, '2024-08-31 18:05:00'),
(1046, 1, 350.00, '2024-09-30 18:00:00', 1, '2024-09-30 18:05:00'),
(1047, 1, 355.00, '2024-10-31 18:00:00', 1, '2024-10-31 18:05:00'),
(1048, 1, 360.00, '2024-11-30 18:00:00', 1, '2024-11-30 18:05:00'),
(1049, 1, 365.00, '2024-12-31 18:00:00', 1, '2024-12-31 18:05:00'),
(1050, 1, 370.00, '2025-01-31 18:00:00', 1, '2025-01-31 18:05:00'),
(1051, 1, 375.00, '2025-02-28 18:00:00', 1, '2025-02-28 18:05:00'),
(1052, 1, 380.00, '2025-03-31 18:00:00', 1, '2025-03-31 18:05:00'),
(1053, 1, 385.00, '2025-04-30 18:00:00', 1, '2025-04-30 18:05:00'),
(1054, 1, 390.00, '2025-05-31 18:00:00', 1, '2025-05-31 18:05:00'),
(1055, 1, 395.00, '2025-06-30 18:00:00', 1, '2025-06-30 18:05:00'),
(1056, 1, 400.00, '2025-07-31 18:00:00', 1, '2025-07-31 18:05:00'),
(1057, 1, 405.00, '2025-08-31 18:00:00', 1, '2025-08-31 18:05:00'),
(1058, 1, 410.00, '2025-09-30 18:00:00', 1, '2025-09-30 18:05:00'),
(1059, 1, 415.00, '2025-10-31 18:00:00', 1, '2025-10-31 18:05:00'),
(1060, 1, 420.00, '2025-11-30 18:00:00', 1, '2025-11-30 18:05:00'),
(1061, 1, 35.00, '2026-01-01 01:28:46', 1, '2026-01-20 01:28:55'),
(1062, 1, 5.00, '2026-01-02 01:29:23', 1, '2026-01-20 01:29:31'),
(1063, 1, 5.00, '2026-01-03 01:29:37', 1, '2026-01-20 01:29:54'),
(1064, 1, 35.00, '2026-01-04 01:30:00', 1, '2026-01-20 01:30:11'),
(1065, 1, 220.00, '2026-01-05 01:30:26', 1, '2026-01-20 01:31:15'),
(1066, 1, 35.00, '2026-01-06 01:30:57', 1, '2026-01-20 01:31:11'),
(1067, 1, 35.00, '2026-01-07 01:30:57', 1, '2026-01-07 01:30:57'),
(1068, 1, 35.00, '2026-01-08 01:30:57', 1, '2026-01-08 01:30:57'),
(1069, 1, 35.00, '2026-01-09 01:30:57', 1, '2026-01-09 01:30:57'),
(1070, 1, 35.00, '2026-01-10 01:30:57', 1, '2026-01-10 01:30:57'),
(1071, 1, 35.00, '2026-01-11 01:30:57', 1, '2026-01-11 01:30:57'),
(1072, 1, 35.00, '2026-01-12 01:30:57', 1, '2026-01-12 01:30:57'),
(1073, 1, 35.00, '2026-01-13 01:30:57', 1, '2026-01-13 01:30:57'),
(1074, 1, 35.00, '2026-01-14 01:30:57', 1, '2026-01-14 01:30:57'),
(1075, 1, 35.00, '2026-01-15 01:30:57', 1, '2026-01-15 01:30:57'),
(1076, 1, 35.00, '2026-01-16 01:30:57', 1, '2026-01-16 01:30:57'),
(1077, 1, 35.00, '2026-01-17 01:30:57', 1, '2026-01-17 01:30:57'),
(1078, 1, 35.00, '2026-01-18 01:30:57', 1, '2026-01-18 01:30:57'),
(1079, 1, 35.00, '2026-01-19 01:30:57', 1, '2026-01-19 01:30:57'),
(1080, 1, 35.00, '2026-01-20 01:30:57', 1, '2026-01-20 01:30:57'),
(1081, 1, 70.00, '2026-01-11 13:59:46', 1, '2026-01-11 13:59:52'),
(1082, 1, 5.00, '2026-01-11 14:03:45', 1, '2026-01-11 14:03:50'),
(1083, 1, 20.00, '2026-01-11 14:03:54', 1, '2026-01-11 14:04:03'),
(1084, 1, 35.00, '2026-01-11 14:04:08', 1, '2026-01-11 14:04:31'),
(1085, 1, 35.00, '2026-01-12 14:05:57', 1, '2026-01-12 14:06:46'),
(1086, 1, 220.00, '2026-01-12 14:06:11', 1, '2026-01-12 14:06:49'),
(1087, 1, 40.00, '2026-01-13 14:07:16', 1, '2026-01-13 14:07:30'),
(1088, 1, 5.00, '2026-01-13 14:07:18', 1, '2026-01-13 14:07:34'),
(1089, 1, 140.00, '2026-01-13 14:07:23', 1, '2026-01-13 14:07:32'),
(1090, 1, 235.00, '2026-01-14 14:07:55', 1, '2026-01-14 14:08:03'),
(1091, 1, 35.00, '2026-01-14 14:07:58', 1, '2026-01-14 14:08:27'),
(1092, 1, 40.00, '2026-01-15 14:09:48', 1, '2026-01-15 14:10:04'),
(1093, 1, 40.00, '2026-01-15 14:09:51', 1, '2026-01-15 14:10:06'),
(1094, 1, 35.00, '2026-01-16 14:10:26', 1, '2026-01-16 14:10:37'),
(1095, 1, 5.00, '2026-01-16 14:10:27', 1, '2026-01-16 14:10:39'),
(1096, 1, 35.00, '2026-01-16 14:11:03', 1, '2026-01-16 14:11:11'),
(1097, 1, 350.00, '2026-01-16 14:11:07', 1, '2026-01-16 14:11:13'),
(1098, 1, 105.00, '2026-01-17 14:11:37', 1, '2026-01-17 14:11:45'),
(1099, 1, 5.00, '2026-01-17 14:11:39', 1, '2026-01-17 14:11:49'),
(1100, 1, 30.00, '2026-01-17 14:11:41', 1, '2026-01-17 14:11:47'),
(1101, 1, 105.00, '2026-01-18 14:12:10', 1, '2026-01-18 14:12:22'),
(1102, 1, 15.00, '2026-01-18 14:12:12', 1, '2026-01-18 14:12:47'),
(1103, 1, 60.00, '2026-01-18 14:12:15', 1, '2026-01-18 14:12:48'),
(1104, 1, 155.00, '2026-01-19 14:13:38', 1, '2026-01-19 14:13:53'),
(1105, 1, 240.00, '2026-02-15 14:19:39', 1, '2026-02-15 14:19:53'),
(1106, 1, 35.00, '2026-03-05 09:25:10', 1, '2026-03-05 09:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items_table`
--

CREATE TABLE `purchase_items_table` (
  `purchase_item_id` bigint(12) UNSIGNED NOT NULL,
  `purchase_id` bigint(12) UNSIGNED NOT NULL,
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_items_table`
--

INSERT INTO `purchase_items_table` (`purchase_item_id`, `purchase_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1.00, 35.00),
(2, 2, 1, 1.00, 35.00),
(3, 3, 6, 2.00, 210.00),
(4, 4, 6, 1.00, 210.00),
(5, 5, 12, 1.00, 150.00),
(6, 6, 14, 1.00, 200.00),
(7, 7, 15, 1.00, 250.00),
(9, 9, 1, 2.00, 35.00),
(10, 10, 1, 1.00, 35.00),
(11, 11, 8, 1.00, 200.00),
(12, 12, 4, 1.00, 5.00),
(13, 13, 10, 1.00, 250.00),
(17, 17, 1, 1.00, 35.00),
(18, 17, 9, 1.00, 220.00),
(19, 18, 1, 1.00, 35.00),
(20, 19, 1, 1.00, 35.00),
(21, 20, 1, 1.00, 35.00),
(22, 21, 1, 1.00, 35.00),
(23, 22, 1, 1.00, 35.00),
(24, 23, 1, 2.00, 35.00),
(25, 24, 1, 2.00, 35.00),
(26, 25, 1, 1.00, 35.00),
(27, 25, 4, 1.00, 5.00),
(28, 26, 1, 2.00, 35.00),
(29, 27, 1, 1.00, 35.00),
(30, 28, 1, 1.00, 35.00),
(31, 29, 1, 1.00, 35.00),
(32, 30, 1, 1.00, 35.00),
(33, 31, 15, 2.00, 250.00),
(34, 32, 1, 1.00, 35.00),
(35, 33, 1, 1.00, 35.00),
(36, 34, 22, 36.00, 20.00),
(37, 35, 30, 1.00, 250.00),
(38, 35, 31, 1.00, 450.00),
(39, 36, 31, 1.00, 450.00),
(40, 37, 30, 2.00, 250.00),
(41, 38, 21, 1.00, 120.00),
(42, 39, 21, 3.00, 120.00),
(43, 40, 21, 24.00, 120.00),
(44, 41, 21, 1.00, 120.00),
(45, 41, 22, 1.00, 20.00),
(46, 41, 30, 1.00, 250.00),
(47, 41, 31, 1.00, 450.00),
(48, 42, 21, 1.00, 120.00),
(49, 42, 22, 1.00, 20.00),
(50, 42, 30, 1.00, 250.00),
(51, 42, 31, 1.00, 450.00),
(52, 43, 21, 1.00, 120.00),
(53, 43, 22, 1.00, 20.00),
(54, 43, 30, 1.00, 250.00),
(55, 43, 31, 1.00, 450.00),
(56, 44, 21, 1.00, 120.00),
(57, 44, 22, 1.00, 20.00),
(58, 44, 30, 1.00, 250.00),
(59, 44, 31, 1.00, 450.00),
(60, 45, 21, 1.00, 120.00),
(61, 45, 22, 1.00, 20.00),
(62, 45, 30, 1.00, 250.00),
(63, 45, 31, 1.00, 450.00),
(64, 46, 21, 1.00, 120.00),
(65, 46, 22, 1.00, 20.00),
(66, 46, 30, 1.00, 250.00),
(67, 47, 30, 1.00, 250.00),
(68, 48, 22, 2.00, 20.00),
(69, 48, 30, 1.00, 250.00),
(70, 49, 21, 2.00, 120.00),
(71, 49, 22, 1.00, 20.00),
(72, 50, 21, 1.00, 120.00),
(73, 51, 22, 1.00, 20.00),
(74, 52, 4, 1.00, 5.00),
(75, 53, 4, 1.00, 5.00),
(76, 53, 7, 1.00, 20.00),
(77, 53, 8, 1.00, 200.00),
(78, 54, 4, 2.00, 5.00),
(79, 55, 6, 1.00, 210.00),
(80, 56, 1, 2.00, 35.00),
(81, 57, 1, 2.00, 35.00),
(82, 58, 4, 2.00, 5.00),
(83, 59, 1, 1.00, 35.00),
(84, 59, 4, 1.00, 5.00),
(85, 60, 4, 1.00, 5.00),
(86, 61, 4, 2.00, 5.00),
(87, 62, 6, 1.00, 210.00),
(88, 63, 24, 1.00, 12.00),
(89, 1061, 1, 1.00, 35.00),
(90, 1061, 4, 1.00, 5.00),
(91, 1062, 1, 1.00, 35.00),
(92, 1062, 4, 1.00, 5.00),
(93, 1063, 1, 1.00, 35.00),
(94, 1063, 4, 1.00, 5.00),
(95, 1064, 1, 1.00, 35.00),
(96, 1064, 4, 1.00, 5.00),
(97, 1065, 5, 1.00, 20.00),
(98, 1065, 6, 1.00, 210.00),
(99, 1066, 9, 1.00, 220.00),
(100, 1066, 10, 1.00, 250.00),
(101, 1061, 1, 1.00, 35.00),
(102, 1062, 4, 1.00, 5.00),
(103, 1063, 4, 1.00, 5.00),
(104, 1064, 1, 1.00, 35.00),
(105, 1065, 9, 1.00, 220.00),
(106, 1066, 1, 1.00, 35.00),
(107, 1081, 1, 2.00, 35.00),
(108, 1082, 4, 1.00, 5.00),
(109, 1083, 5, 1.00, 20.00),
(110, 1084, 1, 1.00, 35.00),
(111, 1085, 1, 1.00, 35.00),
(112, 1086, 5, 1.00, 20.00),
(113, 1086, 8, 1.00, 200.00),
(114, 1087, 1, 1.00, 35.00),
(115, 1087, 4, 1.00, 5.00),
(116, 1088, 4, 1.00, 5.00),
(117, 1089, 1, 4.00, 35.00),
(118, 1090, 4, 1.00, 5.00),
(119, 1090, 5, 1.00, 20.00),
(120, 1090, 6, 1.00, 210.00),
(121, 1091, 1, 1.00, 35.00),
(122, 1092, 1, 1.00, 35.00),
(123, 1092, 4, 1.00, 5.00),
(124, 1093, 1, 1.00, 35.00),
(125, 1093, 4, 1.00, 5.00),
(126, 1094, 1, 1.00, 35.00),
(127, 1095, 4, 1.00, 5.00),
(128, 1096, 1, 1.00, 35.00),
(129, 1097, 1, 10.00, 35.00),
(130, 1098, 1, 3.00, 35.00),
(131, 1099, 4, 1.00, 5.00),
(132, 1100, 4, 6.00, 5.00),
(133, 1101, 1, 3.00, 35.00),
(134, 1102, 4, 3.00, 5.00),
(135, 1103, 5, 3.00, 20.00),
(136, 1104, 1, 4.00, 35.00),
(137, 1104, 4, 3.00, 5.00),
(138, 1001, 3, 7.00, 25.00),
(139, 1002, 8, 2.00, 200.00),
(140, 1003, 1, 4.00, 35.00),
(141, 1004, 6, 9.00, 210.00),
(142, 1005, 2, 1.00, 20.00),
(143, 1006, 4, 8.00, 5.00),
(144, 1007, 5, 3.00, 20.00),
(145, 1008, 9, 6.00, 220.00),
(146, 1009, 10, 2.00, 250.00),
(147, 1010, 11, 5.00, 5.00),
(148, 1011, 12, 7.00, 200.00),
(149, 1012, 13, 1.00, 30.00),
(150, 1013, 14, 10.00, 200.00),
(151, 1014, 15, 2.00, 250.00),
(152, 1015, 17, 8.00, 5.00),
(153, 1016, 18, 4.00, 30.00),
(154, 1017, 20, 6.00, 30.00),
(155, 1018, 21, 3.00, 120.00),
(156, 1019, 22, 9.00, 20.00),
(157, 1020, 23, 1.00, 7.00),
(158, 1021, 24, 2.00, 12.00),
(159, 1022, 25, 5.00, 30.00),
(160, 1023, 26, 7.00, 15.00),
(161, 1024, 27, 10.00, 60.00),
(162, 1025, 28, 1.00, 70.00),
(163, 1026, 29, 2.00, 120.00),
(164, 1027, 30, 6.00, 250.00),
(165, 1028, 31, 4.00, 450.00),
(166, 1029, 1, 3.00, 35.00),
(167, 1030, 2, 8.00, 20.00),
(168, 1031, 3, 1.00, 25.00),
(169, 1032, 4, 7.00, 5.00),
(170, 1033, 5, 2.00, 20.00),
(171, 1034, 6, 9.00, 210.00),
(172, 1035, 7, 5.00, 20.00),
(173, 1036, 8, 4.00, 200.00),
(174, 1037, 9, 6.00, 220.00),
(175, 1038, 10, 1.00, 250.00),
(176, 1039, 11, 2.00, 5.00),
(177, 1040, 12, 8.00, 200.00),
(178, 1041, 13, 3.00, 30.00),
(179, 1042, 14, 10.00, 200.00),
(180, 1043, 15, 7.00, 250.00),
(181, 1044, 17, 4.00, 5.00),
(182, 1045, 18, 1.00, 30.00),
(183, 1046, 20, 6.00, 30.00),
(184, 1047, 21, 9.00, 120.00),
(185, 1048, 22, 2.00, 20.00),
(186, 1049, 23, 5.00, 7.00),
(187, 1050, 24, 8.00, 12.00),
(188, 1051, 25, 4.00, 30.00),
(189, 1052, 26, 7.00, 15.00),
(190, 1053, 27, 10.00, 60.00),
(191, 1054, 28, 1.00, 70.00),
(192, 1055, 29, 2.00, 120.00),
(193, 1056, 30, 6.00, 250.00),
(194, 1057, 31, 4.00, 450.00),
(195, 1058, 1, 3.00, 35.00),
(196, 1059, 2, 8.00, 20.00),
(197, 1060, 3, 1.00, 25.00),
(198, 1105, 1, 1.00, 35.00),
(199, 1105, 4, 1.00, 5.00),
(200, 1105, 8, 1.00, 200.00),
(201, 1106, 1, 1.00, 35.00);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredients_table`
--

CREATE TABLE `recipe_ingredients_table` (
  `recipe_id` bigint(12) NOT NULL,
  `product_id` bigint(12) UNSIGNED NOT NULL,
  `ingredient_product_id` bigint(12) UNSIGNED NOT NULL,
  `consumption_amount` decimal(10,2) NOT NULL,
  `ingredient_unit_id` bigint(12) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipe_ingredients_table`
--

INSERT INTO `recipe_ingredients_table` (`recipe_id`, `product_id`, `ingredient_product_id`, `consumption_amount`, `ingredient_unit_id`) VALUES
(1, 6, 4, 1.00, 1),
(2, 6, 5, 1.00, 5),
(3, 8, 5, 11.00, 5),
(4, 8, 7, 10.00, 5),
(5, 10, 9, 1.00, 2),
(6, 10, 7, 10.00, 5),
(7, 12, 11, 10.00, 1),
(8, 12, 9, 50.00, 1),
(9, 14, 9, 1.00, 2),
(10, 14, 13, 2.00, 1),
(13, 30, 29, 1.00, 13),
(14, 30, 27, 10.00, 1),
(15, 30, 26, 20.00, 1),
(16, 30, 25, 7.00, 1),
(17, 30, 24, 3.00, 13),
(18, 30, 23, 2.00, 13);

-- --------------------------------------------------------

--
-- Table structure for table `section_table`
--

CREATE TABLE `section_table` (
  `sec_id` bigint(12) UNSIGNED NOT NULL,
  `sec_name` varchar(999) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_table`
--

INSERT INTO `section_table` (`sec_id`, `sec_name`) VALUES
(1, '4A'),
(2, '4B'),
(3, '4C'),
(4, '4D'),
(5, '4E');

-- --------------------------------------------------------

--
-- Table structure for table `status_table`
--

CREATE TABLE `status_table` (
  `stat_id` bigint(12) UNSIGNED NOT NULL,
  `stat_name` varchar(999) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_table`
--

INSERT INTO `status_table` (`stat_id`, `stat_name`) VALUES
(1, 'successful'),
(2, 'pending'),
(3, 'cancelled'),
(4, 'claimed');

-- --------------------------------------------------------

--
-- Table structure for table `stockin_table`
--

CREATE TABLE `stockin_table` (
  `stockin_id` bigint(12) UNSIGNED NOT NULL,
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockin_table`
--

INSERT INTO `stockin_table` (`stockin_id`, `business_id`, `user_id`, `total_amount`, `created_at`) VALUES
(1, 1, 1, 0.00, '2025-11-30 05:04:18'),
(2, 1, 1, 40.00, '2025-11-30 06:52:04'),
(3, 1, 1, 150.00, '2025-11-30 07:25:09'),
(4, 1, 1, 300.00, '2025-11-30 07:27:39'),
(5, 1, 1, 100.00, '2025-11-30 07:43:46'),
(6, 1, 1, 3750.00, '2025-11-30 08:01:06'),
(7, 1, 1, 4000.00, '2025-11-30 08:05:10'),
(8, 1, 1, 150.00, '2025-11-30 08:15:08'),
(9, 1, 1, 200.00, '2025-11-30 08:38:43'),
(10, 1, 1, 220.00, '2025-11-30 08:39:02'),
(11, 1, 1, 0.00, '2025-11-30 08:49:04'),
(12, 1, 1, 10.00, '2025-11-30 08:49:33'),
(13, 1, 1, 0.00, '2025-11-30 08:51:36'),
(14, 1, 1, 150.00, '2025-11-30 08:54:14'),
(15, 1, 1, 20000.00, '2025-11-30 09:39:55'),
(16, 1, 1, 150.00, '2025-11-30 09:40:11'),
(17, 1, 1, 1000.00, '2025-11-30 09:46:06'),
(18, 1, 1, 500.00, '2025-11-30 09:46:14'),
(19, 1, 1, 300.00, '2025-11-30 09:46:32'),
(20, 1, 1, 120.00, '2025-11-30 16:19:13'),
(21, 1, 1, 200.00, '2025-11-30 17:34:40'),
(22, 1, 1, 200.00, '2025-11-30 17:34:46'),
(23, 1, 1, 50.00, '2025-11-30 18:47:37'),
(24, 1, 1, 50.00, '2025-11-30 18:47:47'),
(25, 1, 1, 50.00, '2025-11-30 18:47:52'),
(26, 1, 1, 20.00, '2025-11-30 22:09:43'),
(27, 1, 1, 100.00, '2025-11-30 22:31:00'),
(28, 7, 13, 45.00, '2025-12-02 17:45:04'),
(29, 7, 13, 1960.00, '2025-12-02 18:05:27'),
(30, 7, 13, 240.00, '2025-12-02 18:11:49'),
(31, 7, 13, 480.00, '2025-12-02 18:12:37'),
(32, 7, 13, 1200.00, '2025-12-02 18:13:01'),
(33, 7, 13, 30.00, '2025-12-02 22:49:00'),
(34, 7, 13, 10.00, '2025-12-02 23:28:22'),
(35, 7, 13, 15.00, '2025-12-02 23:28:25'),
(36, 7, 13, 1200.00, '2025-12-02 23:31:50'),
(37, 7, 13, 7340.00, '2025-12-02 23:33:45'),
(38, 1, 4, 10.00, '2025-12-03 16:58:48'),
(39, 1, 1, 1050.00, '2025-12-04 10:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `stock_adjustments`
--

CREATE TABLE `stock_adjustments` (
  `adjustment_id` bigint(12) UNSIGNED NOT NULL,
  `transaction_id` bigint(12) UNSIGNED DEFAULT NULL,
  `user_id` bigint(12) UNSIGNED DEFAULT NULL,
  `adjustment_type` enum('spoilage','wastage','correction') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_adjustments`
--

INSERT INTO `stock_adjustments` (`adjustment_id`, `transaction_id`, `user_id`, `adjustment_type`, `notes`, `created_at`) VALUES
(1, 40, 1, '', 'stockin:20', '2025-11-30 16:19:13'),
(2, 41, 1, '', NULL, '2025-11-30 16:20:07'),
(3, 42, 1, '', NULL, '2025-11-30 16:23:26'),
(4, 43, 1, '', 'stockin:21', '2025-11-30 17:34:40'),
(5, 44, 1, '', 'stockin:22', '2025-11-30 17:34:46'),
(6, 45, 1, '', 'stockin:23', '2025-11-30 18:47:37'),
(7, 46, 1, '', 'stockin:24', '2025-11-30 18:47:47'),
(8, 47, 1, '', 'stockin:25', '2025-11-30 18:47:52'),
(9, 48, 1, 'correction', NULL, '2025-11-30 20:37:41'),
(10, 49, 1, '', 'stockin:26', '2025-11-30 22:09:43'),
(11, 50, 1, '', 'stockin:27', '2025-11-30 22:31:00'),
(12, 51, 13, '', 'stockin:28', '2025-12-02 17:45:04'),
(13, 52, 13, '', 'stockin:29', '2025-12-02 18:05:27'),
(14, 53, 13, '', 'stockin:30', '2025-12-02 18:11:49'),
(15, 54, 13, '', 'stockin:31', '2025-12-02 18:12:37'),
(16, 55, 13, '', 'stockin:32', '2025-12-02 18:13:01'),
(17, 56, 13, '', 'production:30', '2025-12-02 18:13:18'),
(18, 57, 13, '', 'production:30', '2025-12-02 18:22:21'),
(19, 58, 13, '', 'production:31', '2025-12-02 18:22:27'),
(20, 59, 13, '', 'stockin:33', '2025-12-02 22:49:00'),
(21, 60, 13, '', 'stockin:34', '2025-12-02 23:28:22'),
(22, 61, 13, '', 'stockin:35', '2025-12-02 23:28:25'),
(23, 62, 13, '', 'production:31', '2025-12-02 23:31:23'),
(29, 68, 13, '', 'stockin:36', '2025-12-02 23:31:50'),
(37, 76, 13, '', 'stockin:37', '2025-12-02 23:33:45'),
(38, 77, 13, '', 'production:30', '2025-12-02 23:33:57'),
(39, 78, 4, '', 'stockin:38', '2025-12-03 16:58:48'),
(40, 79, 4, '', NULL, '2025-12-03 16:58:54'),
(41, 80, 4, '', NULL, '2025-12-03 16:58:57'),
(42, 81, 4, 'correction', NULL, '2025-12-03 16:59:12'),
(43, 82, 4, 'correction', NULL, '2025-12-03 16:59:14'),
(46, 85, 4, '', 'production:10', '2025-12-03 16:59:28'),
(47, 86, 4, '', 'production:10', '2025-12-03 16:59:35'),
(48, 87, 1, '', 'stockin:39', '2025-12-04 10:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `system_permissions_table`
--

CREATE TABLE `system_permissions_table` (
  `system_permission_id` bigint(12) UNSIGNED NOT NULL,
  `permission_name` varchar(999) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_permissions_table`
--

INSERT INTO `system_permissions_table` (`system_permission_id`, `permission_name`, `description`) VALUES
(1, 'manage_system_roles', 'Create/edit system roles'),
(2, 'manage_system_permissions', 'Create/edit system permissions'),
(3, 'view_system_users', 'View all system users'),
(4, 'manage_system_users', 'Add/edit system users'),
(5, 'manage_sections', 'Manage student sections'),
(6, 'manage_years', 'Manage school years'),
(7, 'manage_access_codes', 'Enable/disable business access codes'),
(8, 'view_audit_logs', 'View audit logs'),
(9, 'manage_audit_logs', 'Archive or delete audit entries'),
(10, 'manage_businesses', 'View/create/edit businesses'),
(11, 'manage_business_categories', 'Manage business categories'),
(12, 'view_business_overview', 'View all business dashboards'),
(13, 'system_backup_restore', 'Manage database backups'),
(14, 'system_settings', 'Configure platform-wide settings'),
(15, 'view_analytics_dashboard', 'View overall statistics and performance reports');

-- --------------------------------------------------------

--
-- Table structure for table `system_role_permission_table`
--

CREATE TABLE `system_role_permission_table` (
  `system_role_permission_id` bigint(12) UNSIGNED NOT NULL,
  `sys_role_id` bigint(12) UNSIGNED NOT NULL,
  `sys_permission_id` bigint(12) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_role_permission_table`
--

INSERT INTO `system_role_permission_table` (`system_role_permission_id`, `sys_role_id`, `sys_permission_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 1, 2),
(6, 1, 3),
(7, 1, 4),
(8, 1, 5),
(9, 1, 6),
(10, 1, 7),
(11, 1, 8),
(12, 1, 9),
(13, 1, 10),
(14, 1, 11),
(15, 1, 12),
(16, 1, 13),
(17, 1, 14),
(18, 1, 15),
(19, 2, 3),
(20, 2, 1),
(21, 2, 4),
(22, 2, 15),
(23, 2, 14),
(24, 2, 12),
(25, 2, 8),
(26, 2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `system_role_table`
--

CREATE TABLE `system_role_table` (
  `system_role_id` bigint(12) UNSIGNED NOT NULL,
  `role` varchar(99) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_role_table`
--

INSERT INTO `system_role_table` (`system_role_id`, `role`, `description`) VALUES
(1, 'superadmin', ''),
(2, 'admin', ''),
(3, 'superuser', ''),
(4, 'user', '');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_table`
--

CREATE TABLE `transaction_table` (
  `transaction_id` bigint(12) UNSIGNED NOT NULL,
  `purchase_id` bigint(12) UNSIGNED NOT NULL,
  `custom_receipt_no` varchar(999) NOT NULL,
  `payment_method` enum('Gcash','Maya','Cash','Debit/Credit card') NOT NULL DEFAULT 'Cash',
  `business_id` bigint(12) UNSIGNED NOT NULL,
  `stat_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_table`
--

INSERT INTO `transaction_table` (`transaction_id`, `purchase_id`, `custom_receipt_no`, `payment_method`, `business_id`, `stat_id`, `user_id`, `created_at`) VALUES
(1, 1, 'MINJ-11301', 'Cash', 1, 1, 1, '2025-11-30 05:07:58'),
(2, 2, 'MINJ-11302', 'Cash', 1, 1, 1, '2025-11-30 07:17:35'),
(3, 3, 'MINJ-11303', 'Cash', 1, 3, 1, '2025-11-30 07:37:12'),
(4, 4, 'MINJ-11304', 'Cash', 1, 3, 1, '2025-11-30 07:55:31'),
(5, 5, 'MINJ-11305', 'Cash', 1, 1, 1, '2025-11-30 08:25:56'),
(6, 6, 'MINJ-11306', 'Cash', 1, 1, 1, '2025-11-30 08:56:11'),
(7, 7, 'MINJ-11307', 'Cash', 1, 1, 1, '2025-11-30 09:44:51'),
(8, 8, 'MINJ-11308', 'Cash', 1, 1, 1, '2025-11-30 09:47:30'),
(9, 9, 'MINJ-11309', 'Cash', 1, 1, 1, '2025-11-30 13:18:04'),
(10, 10, 'MINJ-113010', 'Cash', 1, 1, 1, '2025-11-30 13:18:27'),
(11, 11, 'MINJ-113011', 'Cash', 1, 3, 1, '2025-11-30 13:21:33'),
(12, 12, 'MINJ-12011', 'Cash', 1, 1, 1, '2025-11-30 16:18:51'),
(13, 13, 'MINJ-12012', 'Cash', 1, 1, 1, '2025-11-30 16:18:53'),
(17, 17, 'MINJ-12013', 'Cash', 1, 1, 1, '2025-11-30 16:54:05'),
(18, 18, 'MINJ-12014', 'Cash', 1, 1, 1, '2025-11-30 17:03:24'),
(19, 19, 'MINJ-12015', 'Cash', 1, 1, 1, '2025-11-30 17:03:25'),
(20, 20, 'MINJ-12016', 'Cash', 1, 1, 1, '2025-11-30 17:23:56'),
(21, 21, 'MINJ-12017', 'Cash', 1, 1, 1, '2025-11-30 17:23:57'),
(22, 22, 'MINJ-12018', 'Cash', 1, 1, 1, '2025-11-30 17:47:20'),
(23, 23, 'MINJ-12019', 'Cash', 1, 1, 1, '2025-11-30 17:55:52'),
(24, 24, 'MINJ-120110', 'Cash', 1, 1, 1, '2025-11-30 18:03:40'),
(25, 25, 'MINJ-120111', 'Cash', 1, 1, 1, '2025-11-30 18:07:23'),
(26, 26, 'MINJ-120112', 'Cash', 1, 1, 1, '2025-11-30 18:10:11'),
(27, 27, 'MINJ-120113', 'Cash', 1, 1, 1, '2025-11-30 18:13:10'),
(28, 28, 'MINJ-120114', 'Cash', 1, 1, 1, '2025-11-30 18:14:43'),
(29, 29, 'MINJ-120115', 'Cash', 1, 1, 1, '2025-11-30 18:16:21'),
(30, 30, 'MINJ-120116', 'Cash', 1, 1, 1, '2025-11-30 18:46:41'),
(31, 31, 'MINJ-120117', 'Cash', 1, 1, 1, '2025-11-30 18:47:17'),
(32, 32, 'MINJ-120118', 'Cash', 1, 1, 1, '2025-11-30 18:49:39'),
(33, 33, 'MINJ-120119', 'Cash', 1, 1, 1, '2025-11-30 19:28:59'),
(34, 34, 'LOL -12031', 'Cash', 7, 1, 13, '2025-12-02 18:58:45'),
(35, 35, 'LOL -12032', 'Cash', 7, 1, 13, '2025-12-02 18:59:06'),
(36, 36, 'LOL -12033', 'Cash', 7, 1, 13, '2025-12-02 18:59:08'),
(37, 37, 'LOL -12034', 'Cash', 7, 1, 13, '2025-12-02 19:37:28'),
(38, 38, 'LOL -12035', 'Cash', 7, 1, 13, '2025-12-02 20:00:10'),
(39, 39, 'LOL -12036', 'Cash', 7, 3, 13, '2025-12-02 22:38:32'),
(40, 40, 'LOL -12037', 'Cash', 7, 1, 13, '2025-12-02 22:53:01'),
(41, 41, 'LOL -12038', 'Cash', 7, 3, 13, '2025-12-02 23:34:26'),
(42, 42, 'LOL -12039', 'Cash', 7, 3, 13, '2025-12-02 23:35:13'),
(43, 43, 'LOL -120310', 'Cash', 7, 3, 13, '2025-12-02 23:37:59'),
(44, 44, 'LOL -120311', 'Cash', 7, 3, 13, '2025-12-02 23:40:33'),
(45, 45, 'LOL -120312', 'Cash', 7, 1, 13, '2025-12-02 23:41:40'),
(46, 46, 'LOL -120313', 'Cash', 7, 2, 13, '2025-12-02 23:45:01'),
(47, 47, 'LOL -120314', 'Cash', 7, 2, 13, '2025-12-03 00:07:06'),
(48, 48, 'LOL -120315', 'Cash', 7, 2, 13, '2025-12-03 00:07:11'),
(49, 49, 'LOL -120316', 'Cash', 7, 2, 13, '2025-12-03 00:07:14'),
(50, 50, 'LOL -120317', 'Cash', 7, 2, 13, '2025-12-03 00:07:20'),
(51, 51, 'LOL -120318', 'Cash', 7, 2, 13, '2025-12-03 00:07:21'),
(52, 52, 'MINJ-12031', 'Cash', 1, 1, 1, '2025-12-03 16:14:25'),
(53, 53, 'MINJ-12041', 'Cash', 1, 1, 4, '2025-12-03 16:14:23'),
(54, 54, 'MINJ-12043', 'Cash', 1, 1, 4, '2025-12-03 16:25:57'),
(55, 55, 'MINJ-12044', 'Cash', 1, 3, 4, '2025-12-03 16:38:52'),
(56, 56, 'MINJ-12045', 'Cash', 1, 1, 1, '2025-12-04 07:32:15'),
(57, 57, 'MINJ-12046', 'Cash', 1, 3, 21, '2025-12-04 07:09:06'),
(58, 58, 'MINJ-12047', 'Cash', 1, 1, 1, '2025-12-04 07:09:03'),
(59, 59, 'MINJ-12048', 'Cash', 1, 1, 21, '2026-01-20 09:28:51'),
(60, 60, 'MINJ-12049', 'Cash', 1, 1, 1, '2025-12-04 07:21:00'),
(61, 61, 'MINJ-120410', 'Cash', 1, 2, 21, '2025-12-04 09:57:43'),
(62, 62, 'MINJ-120411', 'Cash', 1, 1, 21, '2025-12-04 09:57:59'),
(63, 63, 'LOL -01201', 'Cash', 7, 1, 13, '2026-01-20 01:10:54'),
(64, 1061, 'MINJ-01201', 'Cash', 1, 1, 1, '2026-01-20 09:28:55'),
(65, 1062, 'MINJ-01202', 'Cash', 1, 1, 1, '2026-01-20 09:29:31'),
(66, 1063, 'MINJ-01203', 'Cash', 1, 1, 1, '2026-01-20 09:29:54'),
(67, 1064, 'MINJ-01204', 'Cash', 1, 1, 1, '2026-01-20 09:30:11'),
(68, 1065, 'MINJ-01205', 'Cash', 1, 1, 1, '2026-01-20 09:31:15'),
(69, 1066, 'MINJ-01206', 'Cash', 1, 1, 1, '2026-01-20 09:31:11'),
(70, 1061, 'MINJ-01208', 'Cash', 1, 1, 1, '2026-01-20 09:28:55'),
(71, 1062, 'MINJ-01209', 'Cash', 1, 1, 1, '2026-01-20 09:29:31'),
(72, 1063, 'MINJ-012010', 'Cash', 1, 1, 1, '2026-01-20 09:29:54'),
(73, 1064, 'MINJ-012011', 'Cash', 1, 1, 1, '2026-01-20 09:30:11'),
(74, 1065, 'MINJ-012012', 'Cash', 1, 1, 1, '2026-01-20 09:31:15'),
(75, 1066, 'MINJ-012013', 'Cash', 1, 1, 1, '2026-01-20 09:31:11'),
(76, 1081, 'MINJ-01111', 'Cash', 1, 1, 1, '2026-01-11 13:59:52'),
(77, 1082, 'MINJ-01112', 'Cash', 1, 1, 1, '2026-01-11 14:03:50'),
(78, 1083, 'MINJ-01113', 'Cash', 1, 1, 1, '2026-01-11 14:04:03'),
(79, 1084, 'MINJ-01114', 'Cash', 1, 1, 1, '2026-01-11 14:04:31'),
(80, 1085, 'MINJ-01111', 'Cash', 1, 1, 1, '2026-01-12 14:06:46'),
(81, 1086, 'MINJ-01112', 'Cash', 1, 1, 1, '2026-01-12 14:06:49'),
(82, 1087, 'MINJ-01131', 'Cash', 1, 1, 1, '2026-01-13 14:07:30'),
(83, 1088, 'MINJ-01132', 'Cash', 1, 1, 1, '2026-01-13 14:07:34'),
(84, 1089, 'MINJ-01133', 'Cash', 1, 1, 1, '2026-01-13 14:07:32'),
(85, 1090, 'MINJ-01131', 'Cash', 1, 1, 1, '2026-01-14 14:08:03'),
(86, 1091, 'MINJ-01132', 'Cash', 1, 1, 1, '2026-01-14 14:08:27'),
(87, 1092, 'MINJ-01151', 'Cash', 1, 1, 1, '2026-01-15 14:10:04'),
(88, 1093, 'MINJ-01152', 'Cash', 1, 1, 1, '2026-01-15 14:10:06'),
(89, 1094, 'MINJ-01161', 'Cash', 1, 1, 1, '2026-01-16 14:10:37'),
(90, 1095, 'MINJ-01162', 'Cash', 1, 1, 1, '2026-01-16 14:10:39'),
(91, 1096, 'MINJ-01163', 'Cash', 1, 1, 1, '2026-01-16 14:11:11'),
(92, 1097, 'MINJ-01164', 'Cash', 1, 1, 1, '2026-01-16 14:11:13'),
(93, 1098, 'MINJ-01171', 'Cash', 1, 1, 1, '2026-01-17 14:11:45'),
(94, 1099, 'MINJ-01172', 'Cash', 1, 1, 1, '2026-01-17 14:11:49'),
(95, 1100, 'MINJ-01173', 'Cash', 1, 1, 1, '2026-01-17 14:11:47'),
(96, 1101, 'MINJ-01171', 'Cash', 1, 1, 1, '2026-01-18 14:12:22'),
(97, 1102, 'MINJ-01172', 'Cash', 1, 1, 1, '2026-01-18 14:12:47'),
(98, 1103, 'MINJ-01173', 'Cash', 1, 1, 1, '2026-01-18 14:12:48'),
(99, 1104, 'MINJ-01191', 'Cash', 1, 1, 1, '2026-01-19 14:13:53'),
(100, 1105, 'MINJ-02151', 'Cash', 1, 1, 1, '2026-02-15 14:19:53'),
(101, 1106, 'MINJ-03051', 'Cash', 1, 1, 1, '2026-03-05 09:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `unit_table`
--

CREATE TABLE `unit_table` (
  `unit_id` bigint(12) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `abbreviation` varchar(10) NOT NULL,
  `base_unit` varchar(20) DEFAULT NULL,
  `conversion_factor` bigint(12) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit_table`
--

INSERT INTO `unit_table` (`unit_id`, `name`, `abbreviation`, `base_unit`, `conversion_factor`) VALUES
(1, 'Gram', 'g', 'g', 1),
(2, 'Kilogram', 'kg', 'g', 1000),
(3, 'Ounce', 'oz', 'g', 28),
(4, 'Pound', 'lb', 'g', 454),
(5, 'Milliliter', 'mL', 'ml', 1),
(6, 'Liter', 'L', 'ml', 1000),
(13, 'Piece', 'pc', 'count', 1),
(17, 'Pack', 'pack', 'container', 1),
(18, 'Stick', 'stick', 'count', 1),
(25, 'Serving', 'serving', 'portion', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_details_table`
--

CREATE TABLE `user_details_table` (
  `user_det_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `first_name` varchar(99) NOT NULL,
  `middle_name` varchar(99) NOT NULL,
  `last_name` varchar(99) NOT NULL,
  `year_id` bigint(12) UNSIGNED DEFAULT NULL,
  `section_id` bigint(12) UNSIGNED DEFAULT NULL,
  `group_id` bigint(12) UNSIGNED DEFAULT NULL,
  `contact_no` varchar(11) NOT NULL,
  `birthdate` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_details_table`
--

INSERT INTO `user_details_table` (`user_det_id`, `user_id`, `first_name`, `middle_name`, `last_name`, `year_id`, `section_id`, `group_id`, `contact_no`, `birthdate`, `created_at`) VALUES
(1, 1, 'chrowmell', 'ice', 'tipura', 1, 2, 1, '09665263746', '2025-02-04', '2025-11-30 05:01:25'),
(2, 2, 'super', 'admin', 'chrom', 1, 2, 2, '09662738472', '2025-10-07', '2025-11-30 20:19:49'),
(3, 3, 'my', 'employe', 'eee', 1, 1, 1, '09887283847', '2025-11-19', '2025-11-30 21:38:45'),
(4, 4, 'test', 'case', '4', 1, 1, 1, '09662738471', '2025-11-18', '2025-11-30 21:46:19'),
(5, 5, 'test', 'me', 'five', 1, 2, 2, '09552637471', '2025-11-04', '2025-11-30 22:11:16'),
(6, 6, 'test', 'case', 'six', 1, 1, 3, '09552635172', '2025-11-25', '2025-12-01 03:45:26'),
(7, 7, 'chromium', 'iceum', 'tipaursm', 1, 1, 4, '09553872738', '2025-12-09', '2025-12-01 04:38:42'),
(8, 8, 'chromium', 'test', 'eight', 1, 1, 5, '09662736517', '2025-11-30', '2025-12-01 04:42:09'),
(9, 11, 'test', 'case', 'eleven', 1, 1, 1, '09663806718', '2025-10-14', '2025-12-01 04:52:26'),
(10, 13, 'Bien', 'Parale', 'LEONOR', 1, 1, 10, '09123456789', '2003-01-04', '2025-12-02 07:49:25'),
(11, 14, 'Bien', 'Parale', 'Leonor', NULL, NULL, NULL, '09212552598', '2003-01-04', '2025-12-02 07:52:39'),
(12, 15, 'andrey', 'parale', 'leonor', 1, 1, 10, '09123456789', '2003-01-04', '2025-12-02 11:56:35'),
(13, 16, 'Bien', 'Parale', 'Leonor', 1, 1, 6, '09123456789', '2003-01-04', '2025-12-03 09:40:03'),
(14, 18, 'test', 'twisdting', 'tester', 1, 2, 1, '09123456789', '2006-12-03', '2025-12-03 11:50:28'),
(15, 19, 'superadmin', 'super', 'admin', 1, 5, 10, '09123456789', '2005-01-04', '2025-12-03 15:31:45'),
(16, 20, 'Blackie', 'Parale', 'Leonor', 1, 2, 9, '09123456789', '2018-05-23', '2025-12-04 04:14:52'),
(17, 21, 'toffee', 'parale', 'leonor', 1, 2, 1, '09123456789', '2019-12-03', '2025-12-04 06:03:00'),
(18, 22, 'Lester', 'B', 'Bacsain', 1, 3, 10, '09123456789', '2003-12-14', '2025-12-04 10:26:15'),
(19, 23, 'test', 'testing', 'testes', 1, 3, 10, '09123456789', '2005-05-02', '2025-12-04 10:33:03'),
(20, 24, 'test', 'case', 'thirtyeight', 1, 3, 1, '09662546368', '2025-12-02', '2025-12-04 10:36:44'),
(21, 25, 'test', 'forty', 'killd', 1, 5, 2, '09663789762', '2025-11-04', '2025-12-04 10:39:32'),
(22, 26, 'test', 'test', 'test', 1, 5, 1, '09123456789', '2025-12-02', '2025-12-04 10:46:45'),
(23, 27, 'test', 'tesy', 'test', 1, 5, 4, '09123456789', '2025-12-02', '2025-12-04 10:49:31'),
(24, 28, 'test', 'test', 'test', 1, 4, 1, '09123456789', '2025-12-09', '2025-12-04 10:52:11'),
(25, 29, 'test', 'test', 'test', 1, 2, 3, '09123456789', '2021-02-02', '2026-01-19 21:34:46');

-- --------------------------------------------------------

--
-- Table structure for table `user_sys_role_table`
--

CREATE TABLE `user_sys_role_table` (
  `user_role_id` bigint(12) UNSIGNED NOT NULL,
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `system_role_id` bigint(12) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sys_role_table`
--

INSERT INTO `user_sys_role_table` (`user_role_id`, `user_id`, `system_role_id`) VALUES
(1, 1, 3),
(2, 2, 1),
(3, 3, 4),
(4, 4, 4),
(5, 5, 3),
(6, 6, 3),
(7, 7, 3),
(8, 8, 3),
(9, 9, 4),
(10, 10, 4),
(11, 11, 3),
(12, 12, 4),
(13, 13, 3),
(14, 14, 1),
(15, 15, 4),
(16, 16, 3),
(17, 17, 4),
(18, 18, 4),
(19, 19, 1),
(20, 20, 4),
(21, 21, 4),
(22, 22, 3),
(23, 23, 3),
(24, 24, 3),
(25, 25, 3),
(26, 26, 3),
(27, 27, 3),
(28, 28, 3),
(29, 29, 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `user_id` bigint(12) UNSIGNED NOT NULL,
  `username` varchar(999) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`user_id`, `username`, `email`, `password`, `active`, `created_at`, `updated_at`) VALUES
(1, 'testcase1', 'testcase1@gmail.com', '$2b$10$l0DPyZdARrcMmHYOQ89TXeqTNZ4hT1g2779OeH4lFt57C/iK7UwaS', 1, '2025-11-30 05:00:55', '2025-12-03 11:33:30'),
(2, 'testcase2', 'testcase2@gmail.com', '$2b$10$UgQeuCeSDCT1Otz.dr7yfudDD8Xq26qqULqKuVSrpOYRf4wsET0oi', 1, '2025-11-30 20:19:20', '2025-12-03 11:33:31'),
(3, 'testcase3', 'testcase3@gmail.com', '$2b$10$mburAoFWlJBHtq5Kp8KBz.aoKBMmZuzw9tVScr6lrFwOamLodMlCy', 1, '2025-11-30 21:38:24', '2025-12-03 11:33:32'),
(4, 'testcase4', 'testcase4@gmail.com', '$2b$10$bwJw3IpFxlK/bKdLRsD/QO47t0ddWPM1s6ByF4N32VToSWv17xwBa', 1, '2025-11-30 21:45:52', '2025-12-03 11:33:33'),
(5, 'testcase5', 'testcase5@gmail.com', '$2b$10$HC4TQL4woLSqSDV9NXK0Z.P5ohPu/WQP6mNsYvqj.vIsjHeG4henu', 1, '2025-11-30 22:10:47', '2025-12-03 11:33:34'),
(6, 'testcase6', 'testcase6@gmail.com', '$2b$10$ZA90OPlLvejygbWf13EntOuoDXXimkFVboaOuMaQo0WYpD0MGWCie', 1, '2025-12-01 03:44:16', '2025-12-03 11:33:36'),
(7, 'testcase7', 'testcase7@gmail.com', '$2b$10$pL.JuQAiyf7E65GcKs1nVOE69AqYMxrlhLZaRYNft0v7JYcpUcqZ2', 1, '2025-12-01 04:37:43', '2025-12-03 11:33:37'),
(8, 'testcase8', 'testcase7@gmail.com', '$2b$10$Tio2ypi9mo9vi3oA4SSsN.Kt.JKGVsr0NrD5ZHLM901fJjVDMWLYS', 1, '2025-12-01 04:41:27', '2025-12-03 11:33:38'),
(9, 'testcase9', 'testcase9@gmail.com', '$2b$10$Ahp/bMTiFlH4DZ/43olaie8lC8D8p44ANiFtoyQgaC7OMq7yCVoTm', 1, '2025-12-01 04:44:11', '2025-12-03 11:33:39'),
(10, 'testcase10', 'testcase10@gmail.com', '$2b$10$6kG7L88MWWSnm2nGwJk.IuVedew8H7dM79SVWlrDitLbiKRTQuWCS', 1, '2025-12-01 04:46:14', '2025-12-03 11:33:40'),
(11, 'testcase11', 'testcase11@gmail.com', '$2b$10$NK1IqF9K92rgMSlqjJ/ZmOcSE90qd51Hh0Xh0PFsGiAeQYu3QIfdG', 1, '2025-12-01 04:51:23', '2025-12-03 11:33:40'),
(12, 'testcase12', 'testcase12@gmail.com', '$2b$10$sodLOg4WCq1QoxRa3zVrsO/6vGfY7JV5YVt8lprnBJ8PSgzHVPDde', 1, '2025-12-01 04:54:38', '2025-12-03 11:33:41'),
(13, 'bien', 'leonor123bien@gmail.com', '$2b$10$lKjVNwx/efM2fd5H6mAAOuyLfz3Z4IXBL2CuMD.rhZH723.xix2vq', 1, '2025-12-02 07:48:58', '2025-12-03 11:33:43'),
(14, 'xadian', 'bien@gmail.com', '$2b$10$S5F0AZw2uo20/aRVv48Aq.x8TGmUbhor/6dMctIMcaSX7YIwGBq2q', 1, '2025-12-02 07:52:08', '2025-12-03 11:33:42'),
(15, 'andrey', 'leonor123bien@gmail.com', '$2b$10$tlyvWLnXbZ3s9k445ELOeO0uIrg5nCraBvJ15QDHPqs4EQcbtVyk6', 1, '2025-12-02 11:55:50', '2025-12-03 11:33:44'),
(16, 'game', 'bienandreyleonor@gmail.com', '$2b$10$Ub4ycLDZjGSn3pQdSe0zUeyfTvRm8c3izx9ToIA.yNE6ly5ntvUFq', 1, '2025-12-03 09:17:10', '2025-12-03 11:33:47'),
(17, 'testing', 'bien@gmail.com', '$2b$10$.aorvFLU8I7x7pQOm6t.B.PuLnKFOsjW9fYwTNtSM81TJdMD4BsJq', 0, '2025-12-03 11:49:20', '2025-12-03 11:49:20'),
(18, 'testing2', 'kapitbahay@gmail.com', '$2b$10$vUVh54Oy0UXfSVpYynaKlOl.HErIZXyJY3.503WAT2ovnbP/FycIu', 0, '2025-12-03 11:49:46', '2025-12-03 11:49:46'),
(19, 'superadmin', 'super@gmail.com', '$2b$10$dMZ2TNos24.0AaAy2oyXbuXBtM8mpwsXjZA279AcG7rLEsMH4e1zu', 0, '2025-12-03 15:31:06', '2025-12-03 15:31:06'),
(20, 'blackie', 'blackie@gmail.com', '$2b$10$KFny4Y8t21TfmwjoKpJHguLA7mJ3GGZpWmHLE1GtEniUS6qrRkf3W', 0, '2025-12-04 04:14:18', '2025-12-04 04:14:18'),
(21, 'toffee', 'toffeeleonor@gmail.com', '$2b$10$t.MioW8Ho3DXJtvL9tQulOw8ukhMsLXbY4k0d4r1SOyFGToGMbq1q', 0, '2025-12-04 06:02:06', '2025-12-04 06:02:06'),
(22, 'lester', 'lester@gmail.com', '$2b$10$nJK4E1/6yqVVm0scbtlLz.iJMomKS77ozL7t9rmkjWKo0nDHE.BFq', 0, '2025-12-04 10:25:10', '2025-12-04 10:25:10'),
(23, 'testcase38', 'testcase38@gmail.com', '$2b$10$hj.AEgF.WOvrTw0rBg.dw.4GstSJ88wkmeH9yT1.rLQZQtrCHBUpO', 0, '2025-12-04 10:32:16', '2025-12-04 10:32:16'),
(24, 'test38', 'test38@gmail.com', '$2b$10$RZ.C.NepHtHEFFiS8ZkmReNtp2bagHQR47wES56vXrhcIitn7zeGK', 0, '2025-12-04 10:36:09', '2025-12-04 10:36:09'),
(25, 'test40', 'test40@gmail.com', '$2b$10$a1aKuZ3w5yLnAcD79ll0IO5gthzo2esY08zfTPiKSbyONzfRoAkxe', 0, '2025-12-04 10:38:51', '2025-12-04 10:38:51'),
(26, 'testcase42', 'testcase42@gmail.com', '$2b$10$Qi0l5sF5L7eBuEUV5wDFFu24hul4OrIPAJBayXgt51k9klLM.UeQ2', 0, '2025-12-04 10:45:38', '2025-12-04 10:45:38'),
(27, 'testcase44', 'testcase44@gmail.com', '$2b$10$mMPWY5hNi13B46WulF6uee8lMYgE7zrB4txWJ4/NyxrL3flJTu.12', 0, '2025-12-04 10:48:59', '2025-12-04 10:48:59'),
(28, 'testcase45', 'testcase45@gmail.com', '$2b$10$n0DMFqAzb/lXVs/Qr9QEVucG.W534XZqHpwShD6ugoVJ9SWzF/2ju', 0, '2025-12-04 10:51:40', '2025-12-04 10:51:40'),
(29, 'testcase46', 'testcase46@gmail.com', '$2b$10$VhbFlvodZg2Unm6cJ45BfO3BeTVTVf.3WRdCP12/J6c2/FawBRj/W', 0, '2026-01-19 21:32:31', '2026-01-19 21:32:31');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_business_summary`
-- (See below for the actual view)
--
CREATE TABLE `v_business_summary` (
`business_id` bigint(12) unsigned
,`total_transactions` bigint(21)
,`total_revenue` decimal(42,4)
,`total_cost` decimal(42,4)
,`total_profit` decimal(43,4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_ingredient_consumption`
-- (See below for the actual view)
--
CREATE TABLE `v_ingredient_consumption` (
`business_id` bigint(12) unsigned
,`ingredient_id` bigint(12) unsigned
,`ingredient_name` varchar(100)
,`total_consumed` decimal(42,4)
,`unit_id` bigint(12) unsigned
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_profit_by_category`
-- (See below for the actual view)
--
CREATE TABLE `v_profit_by_category` (
`business_id` bigint(12) unsigned
,`category_id` bigint(12) unsigned
,`category_name` varchar(100)
,`total_revenue` decimal(42,4)
,`total_cost` decimal(42,4)
,`total_profit` decimal(43,4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_sales_trend_by_category`
-- (See below for the actual view)
--
CREATE TABLE `v_sales_trend_by_category` (
`business_id` bigint(12) unsigned
,`category_id` bigint(12) unsigned
,`category_name` varchar(100)
,`month` varchar(7)
,`total_revenue` decimal(42,4)
);

-- --------------------------------------------------------

--
-- Table structure for table `year_table`
--

CREATE TABLE `year_table` (
  `year_id` bigint(12) UNSIGNED NOT NULL,
  `school_year` varchar(99) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_table`
--

INSERT INTO `year_table` (`year_id`, `school_year`) VALUES
(1, '2025-2026');

-- --------------------------------------------------------

--
-- Structure for view `v_business_summary`
--
DROP TABLE IF EXISTS `v_business_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_business_summary`  AS SELECT `t`.`business_id` AS `business_id`, count(distinct `t`.`transaction_id`) AS `total_transactions`, coalesce(sum(`pit`.`quantity` * `pit`.`price`),0) AS `total_revenue`, coalesce(sum(`pit`.`quantity` * coalesce((select `pct`.`cost` from `product_cost_table` `pct` where `pct`.`product_id` = `pit`.`product_id` order by `pct`.`valid_from` desc limit 1),0)),0) AS `total_cost`, coalesce(sum(`pit`.`quantity` * `pit`.`price`),0) - coalesce(sum(`pit`.`quantity` * coalesce((select `pct`.`cost` from `product_cost_table` `pct` where `pct`.`product_id` = `pit`.`product_id` order by `pct`.`valid_from` desc limit 1),0)),0) AS `total_profit` FROM (`transaction_table` `t` left join `purchase_items_table` `pit` on(`pit`.`purchase_id` = `t`.`purchase_id`)) WHERE `t`.`stat_id` = 1 GROUP BY `t`.`business_id` ;

-- --------------------------------------------------------

--
-- Structure for view `v_ingredient_consumption`
--
DROP TABLE IF EXISTS `v_ingredient_consumption`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_ingredient_consumption`  AS SELECT `t`.`business_id` AS `business_id`, `ri`.`ingredient_product_id` AS `ingredient_id`, `ing`.`name` AS `ingredient_name`, sum(`pit`.`quantity` * `ri`.`consumption_amount`) AS `total_consumed`, `ri`.`ingredient_unit_id` AS `unit_id` FROM (((`transaction_table` `t` join `purchase_items_table` `pit` on(`pit`.`purchase_id` = `t`.`purchase_id`)) join `recipe_ingredients_table` `ri` on(`ri`.`product_id` = `pit`.`product_id`)) join `product_table` `ing` on(`ing`.`product_id` = `ri`.`ingredient_product_id`)) WHERE `t`.`stat_id` = 1 GROUP BY `t`.`business_id`, `ri`.`ingredient_product_id`, `ing`.`name`, `ri`.`ingredient_unit_id` ;

-- --------------------------------------------------------

--
-- Structure for view `v_profit_by_category`
--
DROP TABLE IF EXISTS `v_profit_by_category`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_profit_by_category`  AS SELECT `t`.`business_id` AS `business_id`, `pc`.`category_id` AS `category_id`, `pc`.`name` AS `category_name`, sum(`pit`.`quantity` * `pit`.`price`) AS `total_revenue`, sum(`pit`.`quantity` * coalesce((select `pct`.`cost` from `product_cost_table` `pct` where `pct`.`product_id` = `pit`.`product_id` order by `pct`.`valid_from` desc limit 1),0)) AS `total_cost`, sum(`pit`.`quantity` * `pit`.`price`) - sum(`pit`.`quantity` * coalesce((select `pct`.`cost` from `product_cost_table` `pct` where `pct`.`product_id` = `pit`.`product_id` order by `pct`.`valid_from` desc limit 1),0)) AS `total_profit` FROM (((`transaction_table` `t` join `purchase_items_table` `pit` on(`pit`.`purchase_id` = `t`.`purchase_id`)) join `product_table` `p` on(`p`.`product_id` = `pit`.`product_id`)) join `product_category_table` `pc` on(`pc`.`category_id` = `p`.`category_id`)) WHERE `t`.`stat_id` = 1 GROUP BY `t`.`business_id`, `pc`.`category_id`, `pc`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `v_sales_trend_by_category`
--
DROP TABLE IF EXISTS `v_sales_trend_by_category`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_sales_trend_by_category`  AS SELECT `t`.`business_id` AS `business_id`, `pc`.`category_id` AS `category_id`, `pc`.`name` AS `category_name`, date_format(`t`.`created_at`,'%Y-%m') AS `month`, sum(`pit`.`quantity` * `pit`.`price`) AS `total_revenue` FROM (((`transaction_table` `t` join `purchase_items_table` `pit` on(`pit`.`purchase_id` = `t`.`purchase_id`)) join `product_table` `p` on(`p`.`product_id` = `pit`.`product_id`)) join `product_category_table` `pc` on(`pc`.`category_id` = `p`.`category_id`)) WHERE `t`.`stat_id` = 1 GROUP BY `t`.`business_id`, `pc`.`category_id`, `pc`.`name`, date_format(`t`.`created_at`,'%Y-%m') ORDER BY date_format(`t`.`created_at`,'%Y-%m') ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_codes_table`
--
ALTER TABLE `access_codes_table`
  ADD PRIMARY KEY (`access_id`),
  ADD KEY `fk_accesstbl_businesstbl` (`business_id`);

--
-- Indexes for table `action_table`
--
ALTER TABLE `action_table`
  ADD PRIMARY KEY (`action_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_business` (`business_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `business_category_table`
--
ALTER TABLE `business_category_table`
  ADD PRIMARY KEY (`business_cat_id`);

--
-- Indexes for table `business_logs`
--
ALTER TABLE `business_logs`
  ADD PRIMARY KEY (`business_logs_id`),
  ADD KEY `fk_buid_businesstbl` (`business_id`),
  ADD KEY `fk_actionid_actiontbl` (`action_id`),
  ADD KEY `fk2_moduleid_moduletbl` (`module_id`),
  ADD KEY `fk4_userid_usertbl` (`user_id`);

--
-- Indexes for table `business_permission_override_table`
--
ALTER TABLE `business_permission_override_table`
  ADD PRIMARY KEY (`override_id`),
  ADD UNIQUE KEY `unique_business_position_permission_override` (`business_id`,`bus_pos_id`,`feature_action_id`),
  ADD KEY `idx_override_business_position` (`business_id`,`bus_pos_id`),
  ADD KEY `idx_override_type` (`override_type`),
  ADD KEY `fk_busPosId_buPerIOverTbl` (`bus_pos_id`),
  ADD KEY `fk_featureActionId_buPerIOverTbl` (`feature_action_id`);

--
-- Indexes for table `business_permission_table`
--
ALTER TABLE `business_permission_table`
  ADD PRIMARY KEY (`bus_permission_id`),
  ADD KEY `fk_buspost_busper_tbl` (`bus_pos_id`),
  ADD KEY `fk_featureActionId_busPerTbl` (`feature_action_id`);

--
-- Indexes for table `business_position_table`
--
ALTER TABLE `business_position_table`
  ADD PRIMARY KEY (`business_pos_id`);

--
-- Indexes for table `business_setting_table`
--
ALTER TABLE `business_setting_table`
  ADD PRIMARY KEY (`bus_set_id`);

--
-- Indexes for table `business_table`
--
ALTER TABLE `business_table`
  ADD PRIMARY KEY (`business_id`),
  ADD UNIQUE KEY `business_code` (`business_code`),
  ADD KEY `fk_categoryID` (`business_cat_id`),
  ADD KEY `fk_uid_bustable` (`owner_id`);

--
-- Indexes for table `business_user_position_table`
--
ALTER TABLE `business_user_position_table`
  ADD PRIMARY KEY (`bus_user_pos_id`),
  ADD KEY `fk_userID_userroles_tbl` (`user_id`),
  ADD KEY `fk_roleID_userroles_tbl` (`bus_pos_id`),
  ADD KEY `fk_businessID_userroles_tbl` (`business_id`);

--
-- Indexes for table `combo_items_table`
--
ALTER TABLE `combo_items_table`
  ADD PRIMARY KEY (`component_id`),
  ADD KEY `fk_compoproid_producttbl` (`component_product_id`),
  ADD KEY `fk_parproid_producttbl` (`parent_product_id`);

--
-- Indexes for table `features_table`
--
ALTER TABLE `features_table`
  ADD PRIMARY KEY (`feature_id`),
  ADD KEY `fk_moduleid_moduletbl` (`module_id`);

--
-- Indexes for table `feature_action_table`
--
ALTER TABLE `feature_action_table`
  ADD PRIMARY KEY (`feature_action_id`),
  ADD KEY `fk_featureId_featureActionTbl` (`feature_id`),
  ADD KEY `fk_actionId_featureActionTbl` (`action_id`);

--
-- Indexes for table `group_table`
--
ALTER TABLE `group_table`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `inventory_table`
--
ALTER TABLE `inventory_table`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `fk_inventory_table_ibfk_1` (`product_id`),
  ADD KEY `fk_unitId_inventoryTbl` (`unit_id`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `fk_businessId_inventtrans` (`business_id`),
  ADD KEY `fk_userid_inventtrans` (`user_id`);

--
-- Indexes for table `inventory_transaction_details`
--
ALTER TABLE `inventory_transaction_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `fk_productId_inventTransactDetailTbl` (`product_id`),
  ADD KEY `fk_inventTransactId_inventTransactDetailTbl` (`invent_transact_id`),
  ADD KEY `fk_unitId_inventTransactDetailTbl` (`unit_id`);

--
-- Indexes for table `module_table`
--
ALTER TABLE `module_table`
  ADD PRIMARY KEY (`module_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `production_table`
--
ALTER TABLE `production_table`
  ADD PRIMARY KEY (`production_id`),
  ADD KEY `fk_prodId_prodtable` (`product_id`),
  ADD KEY `fk_userid_prodtable` (`user_id`);

--
-- Indexes for table `product_category_table`
--
ALTER TABLE `product_category_table`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `fk_businessid_productCategory` (`business_id`);

--
-- Indexes for table `product_cost_table`
--
ALTER TABLE `product_cost_table`
  ADD PRIMARY KEY (`cost_id`),
  ADD KEY `fk_prodid_prodcostbl` (`product_id`);

--
-- Indexes for table `product_table`
--
ALTER TABLE `product_table`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `fk_busid_busstbl` (`business_id`),
  ADD KEY `fk_categoryId_prodtbl` (`category_id`);

--
-- Indexes for table `product_type_table`
--
ALTER TABLE `product_type_table`
  ADD PRIMARY KEY (`product_type_id`);

--
-- Indexes for table `purchases_table`
--
ALTER TABLE `purchases_table`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `fk5_userid_usertbl` (`user_id`),
  ADD KEY `fk_statID_purchasestbl` (`status_id`);

--
-- Indexes for table `purchase_items_table`
--
ALTER TABLE `purchase_items_table`
  ADD PRIMARY KEY (`purchase_item_id`),
  ADD KEY `fk_productid_producttbl` (`product_id`),
  ADD KEY `fk_purchaseid_purchasetbl` (`purchase_id`);

--
-- Indexes for table `recipe_ingredients_table`
--
ALTER TABLE `recipe_ingredients_table`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `fk_prodid_productbl` (`product_id`),
  ADD KEY `fk_ingredientprodid_prodtbl` (`ingredient_product_id`),
  ADD KEY `fk_unitsid_recipeIngretbl` (`ingredient_unit_id`);

--
-- Indexes for table `section_table`
--
ALTER TABLE `section_table`
  ADD PRIMARY KEY (`sec_id`);

--
-- Indexes for table `status_table`
--
ALTER TABLE `status_table`
  ADD PRIMARY KEY (`stat_id`);

--
-- Indexes for table `stockin_table`
--
ALTER TABLE `stockin_table`
  ADD PRIMARY KEY (`stockin_id`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD PRIMARY KEY (`adjustment_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `fk_userid_stockadjustment` (`user_id`);

--
-- Indexes for table `system_permissions_table`
--
ALTER TABLE `system_permissions_table`
  ADD PRIMARY KEY (`system_permission_id`);

--
-- Indexes for table `system_role_permission_table`
--
ALTER TABLE `system_role_permission_table`
  ADD PRIMARY KEY (`system_role_permission_id`),
  ADD KEY `fk_sysperid_syspertbl` (`sys_permission_id`),
  ADD KEY `fk_sysroleid_sysroletbl` (`sys_role_id`);

--
-- Indexes for table `system_role_table`
--
ALTER TABLE `system_role_table`
  ADD PRIMARY KEY (`system_role_id`);

--
-- Indexes for table `transaction_table`
--
ALTER TABLE `transaction_table`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `fk_businessID` (`business_id`),
  ADD KEY `fk_statID_transact_tbl` (`stat_id`),
  ADD KEY `fk_saleid_salestbl` (`purchase_id`),
  ADD KEY `fk_userid_transaction_table` (`user_id`);

--
-- Indexes for table `unit_table`
--
ALTER TABLE `unit_table`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `user_details_table`
--
ALTER TABLE `user_details_table`
  ADD PRIMARY KEY (`user_det_id`),
  ADD KEY `fk3_userid_usertbl` (`user_id`),
  ADD KEY `fk_yearid_userDetstbl` (`year_id`),
  ADD KEY `fk_sectionid_userDetstbl` (`section_id`),
  ADD KEY `fk_groupid_userDetstbl` (`group_id`);

--
-- Indexes for table `user_sys_role_table`
--
ALTER TABLE `user_sys_role_table`
  ADD PRIMARY KEY (`user_role_id`),
  ADD KEY `fk_userid_usertbl` (`user_id`),
  ADD KEY `fk_sysroleid_systemroletbl` (`system_role_id`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `year_table`
--
ALTER TABLE `year_table`
  ADD PRIMARY KEY (`year_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_codes_table`
--
ALTER TABLE `access_codes_table`
  MODIFY `access_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `action_table`
--
ALTER TABLE `action_table`
  MODIFY `action_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=589;

--
-- AUTO_INCREMENT for table `business_category_table`
--
ALTER TABLE `business_category_table`
  MODIFY `business_cat_id` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `business_logs`
--
ALTER TABLE `business_logs`
  MODIFY `business_logs_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=644;

--
-- AUTO_INCREMENT for table `business_permission_override_table`
--
ALTER TABLE `business_permission_override_table`
  MODIFY `override_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `business_permission_table`
--
ALTER TABLE `business_permission_table`
  MODIFY `bus_permission_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `business_position_table`
--
ALTER TABLE `business_position_table`
  MODIFY `business_pos_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `business_setting_table`
--
ALTER TABLE `business_setting_table`
  MODIFY `bus_set_id` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `business_table`
--
ALTER TABLE `business_table`
  MODIFY `business_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `business_user_position_table`
--
ALTER TABLE `business_user_position_table`
  MODIFY `bus_user_pos_id` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `combo_items_table`
--
ALTER TABLE `combo_items_table`
  MODIFY `component_id` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `features_table`
--
ALTER TABLE `features_table`
  MODIFY `feature_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `feature_action_table`
--
ALTER TABLE `feature_action_table`
  MODIFY `feature_action_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `group_table`
--
ALTER TABLE `group_table`
  MODIFY `group_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `inventory_table`
--
ALTER TABLE `inventory_table`
  MODIFY `inventory_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `transaction_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `inventory_transaction_details`
--
ALTER TABLE `inventory_transaction_details`
  MODIFY `detail_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT for table `module_table`
--
ALTER TABLE `module_table`
  MODIFY `module_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `production_table`
--
ALTER TABLE `production_table`
  MODIFY `production_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `product_category_table`
--
ALTER TABLE `product_category_table`
  MODIFY `category_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_cost_table`
--
ALTER TABLE `product_cost_table`
  MODIFY `cost_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `product_table`
--
ALTER TABLE `product_table`
  MODIFY `product_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `product_type_table`
--
ALTER TABLE `product_type_table`
  MODIFY `product_type_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchases_table`
--
ALTER TABLE `purchases_table`
  MODIFY `purchase_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1107;

--
-- AUTO_INCREMENT for table `purchase_items_table`
--
ALTER TABLE `purchase_items_table`
  MODIFY `purchase_item_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT for table `recipe_ingredients_table`
--
ALTER TABLE `recipe_ingredients_table`
  MODIFY `recipe_id` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `section_table`
--
ALTER TABLE `section_table`
  MODIFY `sec_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `status_table`
--
ALTER TABLE `status_table`
  MODIFY `stat_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stockin_table`
--
ALTER TABLE `stockin_table`
  MODIFY `stockin_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  MODIFY `adjustment_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `system_permissions_table`
--
ALTER TABLE `system_permissions_table`
  MODIFY `system_permission_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `system_role_permission_table`
--
ALTER TABLE `system_role_permission_table`
  MODIFY `system_role_permission_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `system_role_table`
--
ALTER TABLE `system_role_table`
  MODIFY `system_role_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transaction_table`
--
ALTER TABLE `transaction_table`
  MODIFY `transaction_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `unit_table`
--
ALTER TABLE `unit_table`
  MODIFY `unit_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user_details_table`
--
ALTER TABLE `user_details_table`
  MODIFY `user_det_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user_sys_role_table`
--
ALTER TABLE `user_sys_role_table`
  MODIFY `user_role_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `user_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `year_table`
--
ALTER TABLE `year_table`
  MODIFY `year_id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_codes_table`
--
ALTER TABLE `access_codes_table`
  ADD CONSTRAINT `fk_accesstbl_businesstbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`);

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_buid_bussinesstbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_uid_bussinesstbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `business_logs`
--
ALTER TABLE `business_logs`
  ADD CONSTRAINT `fk2_moduleid_moduletbl` FOREIGN KEY (`module_id`) REFERENCES `module_table` (`module_id`),
  ADD CONSTRAINT `fk4_userid_usertbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`),
  ADD CONSTRAINT `fk_actionid_actiontbl` FOREIGN KEY (`action_id`) REFERENCES `action_table` (`action_id`),
  ADD CONSTRAINT `fk_buid_businesstbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`);

--
-- Constraints for table `business_permission_override_table`
--
ALTER TABLE `business_permission_override_table`
  ADD CONSTRAINT `fk_busPosId_buPerIOverTbl` FOREIGN KEY (`bus_pos_id`) REFERENCES `business_position_table` (`business_pos_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_busiId_busPerOverTbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_featureActionId_buPerIOverTbl` FOREIGN KEY (`feature_action_id`) REFERENCES `feature_action_table` (`feature_action_id`) ON DELETE CASCADE;

--
-- Constraints for table `business_permission_table`
--
ALTER TABLE `business_permission_table`
  ADD CONSTRAINT `fk_buspost_busper_tbl` FOREIGN KEY (`bus_pos_id`) REFERENCES `business_position_table` (`business_pos_id`),
  ADD CONSTRAINT `fk_featureActionId_busPerTbl` FOREIGN KEY (`feature_action_id`) REFERENCES `feature_action_table` (`feature_action_id`);

--
-- Constraints for table `business_table`
--
ALTER TABLE `business_table`
  ADD CONSTRAINT `fk_buscatid_bus_tbl` FOREIGN KEY (`business_cat_id`) REFERENCES `business_category_table` (`business_cat_id`),
  ADD CONSTRAINT `fk_owner_businesstbl` FOREIGN KEY (`owner_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `business_user_position_table`
--
ALTER TABLE `business_user_position_table`
  ADD CONSTRAINT `fk_busnessid_businesstbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`),
  ADD CONSTRAINT `fk_busposid_businessposbl` FOREIGN KEY (`bus_pos_id`) REFERENCES `business_position_table` (`business_pos_id`),
  ADD CONSTRAINT `fk_userid_bususerpostbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `combo_items_table`
--
ALTER TABLE `combo_items_table`
  ADD CONSTRAINT `fk_compro_comboitemtbl` FOREIGN KEY (`component_product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_parproid_comboitemtbl` FOREIGN KEY (`parent_product_id`) REFERENCES `product_table` (`product_id`);

--
-- Constraints for table `features_table`
--
ALTER TABLE `features_table`
  ADD CONSTRAINT `fk_moduleid_moduletbl` FOREIGN KEY (`module_id`) REFERENCES `module_table` (`module_id`);

--
-- Constraints for table `feature_action_table`
--
ALTER TABLE `feature_action_table`
  ADD CONSTRAINT `fk_actionId_featureActionTbl` FOREIGN KEY (`action_id`) REFERENCES `action_table` (`action_id`),
  ADD CONSTRAINT `fk_featureId_featureActionTbl` FOREIGN KEY (`feature_id`) REFERENCES `features_table` (`feature_id`);

--
-- Constraints for table `inventory_table`
--
ALTER TABLE `inventory_table`
  ADD CONSTRAINT `fk_productid_productbl` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_unitId_inventoryTbl` FOREIGN KEY (`unit_id`) REFERENCES `unit_table` (`unit_id`);

--
-- Constraints for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `fk_businessId_inventtrans` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`),
  ADD CONSTRAINT `fk_userid_inventtrans` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `inventory_transaction_details`
--
ALTER TABLE `inventory_transaction_details`
  ADD CONSTRAINT `fk_inventTransactId_inventTransactDetailTbl` FOREIGN KEY (`invent_transact_id`) REFERENCES `inventory_transactions` (`transaction_id`),
  ADD CONSTRAINT `fk_productId_inventTransactDetailTbl` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_unitId_inventTransactDetailTbl` FOREIGN KEY (`unit_id`) REFERENCES `unit_table` (`unit_id`);

--
-- Constraints for table `production_table`
--
ALTER TABLE `production_table`
  ADD CONSTRAINT `fk_prodId_prodtable` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_userid_prodtable` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `product_category_table`
--
ALTER TABLE `product_category_table`
  ADD CONSTRAINT `fk_businessid_productCategory` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`);

--
-- Constraints for table `product_cost_table`
--
ALTER TABLE `product_cost_table`
  ADD CONSTRAINT `fk_prodid_prodcostbl` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`);

--
-- Constraints for table `product_table`
--
ALTER TABLE `product_table`
  ADD CONSTRAINT `fk_busid_busstbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`),
  ADD CONSTRAINT `fk_categoryId_prodtbl` FOREIGN KEY (`category_id`) REFERENCES `product_category_table` (`category_id`);

--
-- Constraints for table `purchases_table`
--
ALTER TABLE `purchases_table`
  ADD CONSTRAINT `fk5_userid_usertbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`),
  ADD CONSTRAINT `fk_statID_purchasestbl` FOREIGN KEY (`status_id`) REFERENCES `status_table` (`stat_id`);

--
-- Constraints for table `purchase_items_table`
--
ALTER TABLE `purchase_items_table`
  ADD CONSTRAINT `fk_productid_producttbl` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_purchaseid_purcitemstbl` FOREIGN KEY (`purchase_id`) REFERENCES `purchases_table` (`purchase_id`);

--
-- Constraints for table `recipe_ingredients_table`
--
ALTER TABLE `recipe_ingredients_table`
  ADD CONSTRAINT `fk_ingredientprodid_prodtbl` FOREIGN KEY (`ingredient_product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_prodid_productbl` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  ADD CONSTRAINT `fk_unitsid_recipeIngretbl` FOREIGN KEY (`ingredient_unit_id`) REFERENCES `unit_table` (`unit_id`);

--
-- Constraints for table `stockin_table`
--
ALTER TABLE `stockin_table`
  ADD CONSTRAINT `stockin_table_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`),
  ADD CONSTRAINT `stockin_table_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD CONSTRAINT `fk_userid_stockadjustment` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `inventory_transactions` (`transaction_id`);

--
-- Constraints for table `system_role_permission_table`
--
ALTER TABLE `system_role_permission_table`
  ADD CONSTRAINT `fk_sysperid_syspertbl` FOREIGN KEY (`sys_permission_id`) REFERENCES `system_permissions_table` (`system_permission_id`),
  ADD CONSTRAINT `fk_sysroleid_sysroletbl` FOREIGN KEY (`sys_role_id`) REFERENCES `system_role_table` (`system_role_id`);

--
-- Constraints for table `transaction_table`
--
ALTER TABLE `transaction_table`
  ADD CONSTRAINT `fk_businessid_transactiontbl` FOREIGN KEY (`business_id`) REFERENCES `business_table` (`business_id`),
  ADD CONSTRAINT `fk_purchaseid_transaction` FOREIGN KEY (`purchase_id`) REFERENCES `purchases_table` (`purchase_id`),
  ADD CONSTRAINT `fk_statID_transacttbl` FOREIGN KEY (`stat_id`) REFERENCES `status_table` (`stat_id`),
  ADD CONSTRAINT `fk_userid_transaction_table` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

--
-- Constraints for table `user_details_table`
--
ALTER TABLE `user_details_table`
  ADD CONSTRAINT `fk3_userid_usertbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`),
  ADD CONSTRAINT `fk_groupid_userDetstbl` FOREIGN KEY (`group_id`) REFERENCES `group_table` (`group_id`),
  ADD CONSTRAINT `fk_sectionid_userDetstbl` FOREIGN KEY (`section_id`) REFERENCES `section_table` (`sec_id`),
  ADD CONSTRAINT `fk_yearid_userDetstbl` FOREIGN KEY (`year_id`) REFERENCES `year_table` (`year_id`);

--
-- Constraints for table `user_sys_role_table`
--
ALTER TABLE `user_sys_role_table`
  ADD CONSTRAINT `fk_sysroleid_systemroletbl` FOREIGN KEY (`system_role_id`) REFERENCES `system_role_table` (`system_role_id`),
  ADD CONSTRAINT `fk_userid_usertbl` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
