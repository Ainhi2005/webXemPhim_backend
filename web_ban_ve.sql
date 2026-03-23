-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 19, 2026 lúc 09:01 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `web_ban_ve`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_TaoSuatChieuVoiGhe` (IN `p_ma_phim` INT, IN `p_ma_phong` INT, IN `p_ngay_chieu` DATE, IN `p_gio_bat_dau` TIME, IN `p_gio_ket_thuc` TIME, IN `p_gia_ve_co_ban` DECIMAL(10,2))   BEGIN
    DECLARE v_ma_suat_chieu INT;
    
    -- Insert suất chiếu
    INSERT INTO suat_chieu (ma_phim, ma_phong, ngay_chieu, gio_bat_dau, gio_ket_thuc, gia_ve_co_ban)
    VALUES (p_ma_phim, p_ma_phong, p_ngay_chieu, p_gio_bat_dau, p_gio_ket_thuc, p_gia_ve_co_ban);
    
    -- Lấy mã suất chiếu vừa tạo
    SET v_ma_suat_chieu = LAST_INSERT_ID();
    
    -- Insert tất cả ghế của phòng vào ghe_suat_chieu với trạng thái 0 (chưa đặt)
    INSERT INTO ghe_suat_chieu (ma_ghe, ma_suat_chieu, trang_thai)
    SELECT ma_ghe, v_ma_suat_chieu, 0
    FROM ghe
    WHERE ma_phong = p_ma_phong;
    
    SELECT v_ma_suat_chieu AS ma_suat_chieu_moi;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `combo`
--

CREATE TABLE `combo` (
  `ma_combo` int(11) NOT NULL,
  `ten_combo` varchar(100) NOT NULL,
  `mo_ta` varchar(200) DEFAULT NULL,
  `anh_minh_hoa` varchar(255) DEFAULT NULL,
  `gia_tien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `combo`
--

INSERT INTO `combo` (`ma_combo`, `ten_combo`, `mo_ta`, `anh_minh_hoa`, `gia_tien`) VALUES
(1, 'Combo Gia Đình', '2 bắp lớn + 4 nước lớn', 'publics/img/combo/combo_gia_dinh.jpg', 150000.00),
(2, 'Combo Đôi Lãng Mạn', '1 bắp vừa + 2 nước vừa + 1 snack', 'publics/img/combo/combo_doi_lang_man.jpg', 95000.00),
(3, 'Combo Cá Nhân', '1 bắp nhỏ + 1 nước nhỏ', 'publics/img/combo/combo_ca_nhan.jpg', 55000.00),
(4, 'Combo Bạn Thân', '2 bắp vừa + 2 nước vừa + 2 snack', 'publics/img/combo/combo_ban_than.jpg', 120000.00),
(5, 'Combo VIP', '1 bắp lớn + 1 nước lớn + 2 snack cao cấp', 'publics/img/combo/combo_vip.jpg', 180000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia_rap`
--

CREATE TABLE `danh_gia_rap` (
  `ma_danh_gia` int(11) NOT NULL,
  `ma_rap` int(11) NOT NULL,
  `ma_kh` int(11) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `ngay_danh_gia` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_gia_rap`
--

INSERT INTO `danh_gia_rap` (`ma_danh_gia`, `ma_rap`, `ma_kh`, `noi_dung`, `ngay_danh_gia`) VALUES
(1, 1, 1, 'Rạp rất đẹp, ghế ngồi thoải mái, âm thanh sống động!', '2026-01-01 12:30:00'),
(2, 1, 2, 'Dịch vụ tốt, nhân viên nhiệt tình, sẽ quay lại!', '2026-01-01 14:20:00'),
(3, 2, 3, 'Rạp sạch sẽ, giá cả hợp lý, phù hợp cho gia đình', '2026-01-02 16:45:00'),
(4, 2, 4, 'Màn hình rõ nét, âm thanh tuyệt vời', '2026-01-02 18:30:00'),
(5, 3, 5, 'Không gian thoáng mát, chỗ để xe rộng rãi', '2026-01-03 20:15:00'),
(6, 3, 6, 'Combo giá hợp lý, bắp nước ngon', '2026-01-03 21:00:00'),
(7, 1, 7, 'Ghế VIP rất êm, trải nghiệm tuyệt vời', '2026-01-04 17:45:00'),
(8, 2, 8, 'Phòng chiếu 3D sống động như thật', '2026-01-04 19:20:00'),
(9, 3, 9, 'Phù hợp cho các buổi xem phim gia đình', '2026-01-05 15:30:00'),
(10, 1, 10, 'Địa điểm thuận tiện, dễ tìm chỗ đỗ xe', '2026-01-05 22:10:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ghe`
--

CREATE TABLE `ghe` (
  `ma_ghe` int(11) NOT NULL,
  `ma_phong` int(11) NOT NULL,
  `ma_phong_ghe` varchar(10) DEFAULT NULL,
  `loai_ghe` varchar(20) DEFAULT NULL,
  `tinh_trang` varchar(50) DEFAULT 'hoạt động',
  `vi_tri` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ghe`
--

INSERT INTO `ghe` (`ma_ghe`, `ma_phong`, `ma_phong_ghe`, `loai_ghe`, `tinh_trang`, `vi_tri`) VALUES
(1, 1, 'A1', 'VIP', 'hoạt động', 'A1'),
(2, 1, 'A2', 'VIP', 'hoạt động', 'A2'),
(3, 1, 'A3', 'VIP', 'hoạt động', 'A3'),
(4, 1, 'A4', 'VIP', 'hoạt động', 'A4'),
(5, 1, 'B1', 'Đôi', 'hoạt động', 'B1'),
(6, 1, 'B2', 'Đôi', 'hoạt động', 'B2'),
(7, 1, 'B3', 'Đôi', 'hoạt động', 'B3'),
(8, 1, 'B4', 'Đôi', 'hoạt động', 'B4'),
(9, 1, 'C1', 'Thường', 'hoạt động', 'C1'),
(10, 1, 'C2', 'Thường', 'hoạt động', 'C2'),
(11, 1, 'C3', 'Thường', 'hoạt động', 'C3'),
(12, 1, 'C4', 'Thường', 'hoạt động', 'C4'),
(13, 1, 'D1', 'Thường', 'hoạt động', 'D1'),
(14, 1, 'D2', 'Thường', 'hoạt động', 'D2'),
(15, 1, 'D3', 'Thường', 'hoạt động', 'D3'),
(16, 1, 'D4', 'Thường', 'hoạt động', 'D4'),
(17, 1, 'E1', 'Thường', 'hoạt động', 'E1'),
(18, 1, 'E2', 'Thường', 'hoạt động', 'E2'),
(19, 1, 'E3', 'Thường', 'hoạt động', 'E3'),
(20, 1, 'E4', 'Thường', 'hoạt động', 'E4'),
(21, 2, 'A1', 'VIP', 'hoạt động', 'A1'),
(22, 2, 'A2', 'VIP', 'hoạt động', 'A2'),
(23, 2, 'B1', 'Đôi', 'hoạt động', 'B1'),
(24, 2, 'B2', 'Đôi', 'hoạt động', 'B2'),
(25, 2, 'C1', 'Thường', 'hoạt động', 'C1'),
(26, 2, 'C2', 'Thường', 'hoạt động', 'C2'),
(27, 2, 'C3', 'Thường', 'hoạt động', 'C3'),
(28, 2, 'C4', 'Thường', 'hoạt động', 'C4'),
(29, 2, 'D1', 'Thường', 'hoạt động', 'D1'),
(30, 2, 'D2', 'Thường', 'hoạt động', 'D2'),
(31, 2, 'D3', 'Thường', 'hoạt động', 'D3'),
(32, 2, 'D4', 'Thường', 'hoạt động', 'D4'),
(33, 2, 'E1', 'Thường', 'hoạt động', 'E1'),
(34, 2, 'E2', 'Thường', 'hoạt động', 'E2'),
(35, 2, 'E3', 'Thường', 'hoạt động', 'E3'),
(36, 2, 'E4', 'Thường', 'hoạt động', 'E4'),
(37, 2, 'F1', 'Thường', 'hoạt động', 'F1'),
(38, 2, 'F2', 'Thường', 'hoạt động', 'F2'),
(39, 2, 'F3', 'Thường', 'hoạt động', 'F3'),
(40, 2, 'F4', 'Thường', 'hoạt động', 'F4'),
(41, 3, 'A1', 'VIP', 'hoạt động', 'A1'),
(42, 3, 'A2', 'VIP', 'hoạt động', 'A2'),
(43, 3, 'B1', 'Đôi', 'hoạt động', 'B1'),
(44, 3, 'B2', 'Đôi', 'hoạt động', 'B2'),
(45, 3, 'C1', 'Thường', 'hoạt động', 'C1'),
(46, 3, 'C2', 'Thường', 'hoạt động', 'C2'),
(47, 3, 'C3', 'Thường', 'hoạt động', 'C3'),
(48, 3, 'C4', 'Thường', 'hoạt động', 'C4'),
(49, 3, 'D1', 'Thường', 'hoạt động', 'D1'),
(50, 3, 'D2', 'Thường', 'hoạt động', 'D2'),
(51, 3, 'D3', 'Thường', 'hoạt động', 'D3'),
(52, 3, 'D4', 'Thường', 'hoạt động', 'D4'),
(53, 3, 'E1', 'Thường', 'hoạt động', 'E1'),
(54, 3, 'E2', 'Thường', 'hoạt động', 'E2'),
(55, 3, 'E3', 'Thường', 'hoạt động', 'E3'),
(56, 3, 'E4', 'Thường', 'hoạt động', 'E4'),
(57, 3, 'F1', 'Thường', 'hoạt động', 'F1'),
(58, 3, 'F2', 'Thường', 'hoạt động', 'F2'),
(59, 3, 'F3', 'Thường', 'hoạt động', 'F3'),
(60, 3, 'F4', 'Thường', 'hoạt động', 'F4');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ghe_suat_chieu`
--

CREATE TABLE `ghe_suat_chieu` (
  `ma_ghe` int(11) NOT NULL,
  `ma_suat_chieu` int(11) NOT NULL,
  `trang_thai` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ghe_suat_chieu`
--

INSERT INTO `ghe_suat_chieu` (`ma_ghe`, `ma_suat_chieu`, `trang_thai`) VALUES
(1, 1, b'1'),
(1, 6, b'0'),
(1, 11, b'0'),
(1, 16, b'0'),
(1, 21, b'0'),
(1, 26, b'0'),
(2, 1, b'1'),
(2, 6, b'0'),
(2, 11, b'0'),
(2, 16, b'0'),
(2, 21, b'0'),
(2, 26, b'0'),
(3, 1, b'0'),
(3, 6, b'1'),
(3, 11, b'0'),
(3, 16, b'0'),
(3, 21, b'0'),
(3, 26, b'0'),
(4, 1, b'0'),
(4, 6, b'1'),
(4, 11, b'0'),
(4, 16, b'0'),
(4, 21, b'0'),
(4, 26, b'0'),
(5, 1, b'0'),
(5, 6, b'1'),
(5, 11, b'0'),
(5, 16, b'0'),
(5, 21, b'0'),
(5, 26, b'0'),
(6, 1, b'0'),
(6, 6, b'0'),
(6, 11, b'0'),
(6, 16, b'1'),
(6, 21, b'0'),
(6, 26, b'0'),
(7, 1, b'0'),
(7, 6, b'0'),
(7, 11, b'0'),
(7, 16, b'1'),
(7, 21, b'0'),
(7, 26, b'0'),
(8, 1, b'0'),
(8, 6, b'0'),
(8, 11, b'0'),
(8, 16, b'0'),
(8, 21, b'0'),
(8, 26, b'0'),
(9, 1, b'0'),
(9, 6, b'0'),
(9, 11, b'0'),
(9, 16, b'0'),
(9, 21, b'0'),
(9, 26, b'0'),
(10, 1, b'0'),
(10, 6, b'0'),
(10, 11, b'0'),
(10, 16, b'0'),
(10, 21, b'0'),
(10, 26, b'0'),
(11, 1, b'0'),
(11, 6, b'0'),
(11, 11, b'0'),
(11, 16, b'0'),
(11, 21, b'0'),
(11, 26, b'0'),
(12, 1, b'1'),
(12, 6, b'0'),
(12, 11, b'0'),
(12, 16, b'0'),
(12, 21, b'0'),
(12, 26, b'0'),
(13, 1, b'0'),
(13, 6, b'0'),
(13, 11, b'0'),
(13, 16, b'0'),
(13, 21, b'0'),
(13, 26, b'0'),
(14, 1, b'0'),
(14, 6, b'0'),
(14, 11, b'0'),
(14, 16, b'0'),
(14, 21, b'0'),
(14, 26, b'0'),
(15, 1, b'0'),
(15, 6, b'0'),
(15, 11, b'0'),
(15, 16, b'0'),
(15, 21, b'0'),
(15, 26, b'0'),
(16, 1, b'0'),
(16, 6, b'0'),
(16, 11, b'0'),
(16, 16, b'0'),
(16, 21, b'0'),
(16, 26, b'0'),
(17, 1, b'0'),
(17, 6, b'0'),
(17, 11, b'0'),
(17, 16, b'0'),
(17, 21, b'0'),
(17, 26, b'0'),
(18, 1, b'0'),
(18, 6, b'0'),
(18, 11, b'0'),
(18, 16, b'0'),
(18, 21, b'0'),
(18, 26, b'0'),
(19, 1, b'0'),
(19, 6, b'0'),
(19, 11, b'0'),
(19, 16, b'0'),
(19, 21, b'0'),
(19, 26, b'0'),
(20, 1, b'0'),
(20, 6, b'0'),
(20, 11, b'0'),
(20, 16, b'0'),
(20, 21, b'0'),
(20, 26, b'0'),
(21, 2, b'0'),
(21, 7, b'0'),
(21, 12, b'0'),
(21, 17, b'0'),
(21, 22, b'0'),
(21, 27, b'0'),
(22, 2, b'0'),
(22, 7, b'0'),
(22, 12, b'0'),
(22, 17, b'0'),
(22, 22, b'0'),
(22, 27, b'0'),
(23, 2, b'0'),
(23, 7, b'0'),
(23, 12, b'0'),
(23, 17, b'0'),
(23, 22, b'0'),
(23, 27, b'0'),
(24, 2, b'0'),
(24, 7, b'0'),
(24, 12, b'0'),
(24, 17, b'0'),
(24, 22, b'0'),
(24, 27, b'0'),
(25, 2, b'1'),
(25, 7, b'0'),
(25, 12, b'0'),
(25, 17, b'0'),
(25, 22, b'0'),
(25, 27, b'0'),
(26, 2, b'1'),
(26, 7, b'0'),
(26, 12, b'0'),
(26, 17, b'0'),
(26, 22, b'0'),
(26, 27, b'0'),
(27, 2, b'0'),
(27, 7, b'1'),
(27, 12, b'0'),
(27, 17, b'0'),
(27, 22, b'0'),
(27, 27, b'0'),
(28, 2, b'0'),
(28, 7, b'1'),
(28, 12, b'0'),
(28, 17, b'0'),
(28, 22, b'0'),
(28, 27, b'0'),
(29, 2, b'0'),
(29, 7, b'0'),
(29, 12, b'0'),
(29, 17, b'0'),
(29, 22, b'0'),
(29, 27, b'0'),
(30, 2, b'1'),
(30, 7, b'0'),
(30, 12, b'0'),
(30, 17, b'0'),
(30, 22, b'0'),
(30, 27, b'0'),
(31, 2, b'1'),
(31, 7, b'0'),
(31, 12, b'0'),
(31, 17, b'0'),
(31, 22, b'0'),
(31, 27, b'0'),
(32, 2, b'1'),
(32, 7, b'0'),
(32, 12, b'0'),
(32, 17, b'0'),
(32, 22, b'0'),
(32, 27, b'0'),
(33, 2, b'0'),
(33, 7, b'0'),
(33, 12, b'0'),
(33, 17, b'0'),
(33, 22, b'0'),
(33, 27, b'0'),
(34, 2, b'0'),
(34, 7, b'0'),
(34, 12, b'0'),
(34, 17, b'0'),
(34, 22, b'0'),
(34, 27, b'0'),
(35, 2, b'0'),
(35, 7, b'0'),
(35, 12, b'0'),
(35, 17, b'0'),
(35, 22, b'0'),
(35, 27, b'0'),
(36, 2, b'0'),
(36, 7, b'0'),
(36, 12, b'0'),
(36, 17, b'0'),
(36, 22, b'0'),
(36, 27, b'0'),
(37, 2, b'0'),
(37, 7, b'0'),
(37, 12, b'0'),
(37, 17, b'0'),
(37, 22, b'0'),
(37, 27, b'0'),
(38, 2, b'0'),
(38, 7, b'0'),
(38, 12, b'0'),
(38, 17, b'0'),
(38, 22, b'0'),
(38, 27, b'0'),
(39, 2, b'0'),
(39, 7, b'0'),
(39, 12, b'0'),
(39, 17, b'0'),
(39, 22, b'0'),
(39, 27, b'0'),
(40, 2, b'0'),
(40, 7, b'0'),
(40, 12, b'0'),
(40, 17, b'0'),
(40, 22, b'0'),
(40, 27, b'0'),
(41, 3, b'0'),
(41, 8, b'0'),
(41, 13, b'0'),
(41, 18, b'0'),
(41, 23, b'1'),
(41, 28, b'0'),
(42, 3, b'0'),
(42, 8, b'0'),
(42, 13, b'0'),
(42, 18, b'0'),
(42, 23, b'1'),
(42, 28, b'0'),
(43, 3, b'0'),
(43, 8, b'0'),
(43, 13, b'0'),
(43, 18, b'0'),
(43, 23, b'0'),
(43, 28, b'0'),
(44, 3, b'0'),
(44, 8, b'0'),
(44, 13, b'0'),
(44, 18, b'0'),
(44, 23, b'0'),
(44, 28, b'0'),
(45, 3, b'1'),
(45, 8, b'0'),
(45, 13, b'0'),
(45, 18, b'0'),
(45, 23, b'0'),
(45, 28, b'0'),
(46, 3, b'0'),
(46, 8, b'0'),
(46, 13, b'0'),
(46, 18, b'0'),
(46, 23, b'0'),
(46, 28, b'0'),
(47, 3, b'0'),
(47, 8, b'0'),
(47, 13, b'0'),
(47, 18, b'0'),
(47, 23, b'0'),
(47, 28, b'0'),
(48, 3, b'0'),
(48, 8, b'0'),
(48, 13, b'0'),
(48, 18, b'0'),
(48, 23, b'0'),
(48, 28, b'0'),
(49, 3, b'0'),
(49, 8, b'0'),
(49, 13, b'0'),
(49, 18, b'0'),
(49, 23, b'0'),
(49, 28, b'0'),
(50, 3, b'0'),
(50, 8, b'0'),
(50, 13, b'0'),
(50, 18, b'0'),
(50, 23, b'0'),
(50, 28, b'0'),
(51, 3, b'0'),
(51, 8, b'0'),
(51, 13, b'0'),
(51, 18, b'0'),
(51, 23, b'0'),
(51, 28, b'0'),
(52, 3, b'0'),
(52, 8, b'0'),
(52, 13, b'0'),
(52, 18, b'0'),
(52, 23, b'0'),
(52, 28, b'0'),
(53, 3, b'0'),
(53, 8, b'0'),
(53, 13, b'0'),
(53, 18, b'0'),
(53, 23, b'0'),
(53, 28, b'0'),
(54, 3, b'0'),
(54, 8, b'0'),
(54, 13, b'0'),
(54, 18, b'0'),
(54, 23, b'0'),
(54, 28, b'0'),
(55, 3, b'0'),
(55, 8, b'0'),
(55, 13, b'0'),
(55, 18, b'0'),
(55, 23, b'0'),
(55, 28, b'0'),
(56, 3, b'0'),
(56, 8, b'0'),
(56, 13, b'0'),
(56, 18, b'0'),
(56, 23, b'0'),
(56, 28, b'0'),
(57, 3, b'0'),
(57, 8, b'0'),
(57, 13, b'1'),
(57, 18, b'0'),
(57, 23, b'0'),
(57, 28, b'0'),
(58, 3, b'0'),
(58, 8, b'0'),
(58, 13, b'1'),
(58, 18, b'0'),
(58, 23, b'0'),
(58, 28, b'0'),
(59, 3, b'0'),
(59, 8, b'0'),
(59, 13, b'0'),
(59, 18, b'0'),
(59, 23, b'0'),
(59, 28, b'0'),
(60, 3, b'0'),
(60, 8, b'0'),
(60, 13, b'0'),
(60, 18, b'0'),
(60, 23, b'0'),
(60, 28, b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don`
--

CREATE TABLE `hoa_don` (
  `ma_hoa_don` int(11) NOT NULL,
  `ma_kh` int(11) NOT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `tong_tien` decimal(10,2) NOT NULL,
  `phuong_thuc_thanh_toan` varchar(50) DEFAULT NULL,
  `QR` varchar(100) DEFAULT NULL,
  `trang_thai` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoa_don`
--

INSERT INTO `hoa_don` (`ma_hoa_don`, `ma_kh`, `ngay_tao`, `tong_tien`, `phuong_thuc_thanh_toan`, `QR`, `trang_thai`) VALUES
(1, 1, '2026-01-01 08:45:00', 275000.00, 'Thẻ tín dụng', 'QR001', 'Đã thanh toán'),
(2, 2, '2026-01-01 10:20:00', 190000.00, 'Ví điện tử', 'QR002', 'Đã thanh toán'),
(3, 3, '2026-01-01 12:15:00', 110000.00, 'Tiền mặt', 'QR003', 'Đã thanh toán'),
(4, 4, '2026-01-02 09:30:00', 320000.00, 'Chuyển khoản', 'QR004', 'Đã thanh toán'),
(5, 5, '2026-01-02 14:45:00', 140000.00, 'Thẻ tín dụng', 'QR005', 'Đã thanh toán'),
(6, 6, '2026-01-03 11:20:00', 205000.00, 'Ví điện tử', 'QR006', 'Đã thanh toán'),
(7, 7, '2026-01-03 16:30:00', 175000.00, 'Tiền mặt', 'QR007', 'Đã thanh toán'),
(8, 8, '2026-01-04 13:15:00', 240000.00, 'Thẻ tín dụng', 'QR008', 'Đã thanh toán'),
(9, 9, '2026-01-04 18:45:00', 130000.00, 'Ví điện tử', 'QR009', 'Đã thanh toán'),
(10, 10, '2026-01-05 10:00:00', 195000.00, 'Tiền mặt', 'QR010', 'Đã thanh toán'),
(11, 9, '2026-01-04 21:34:52', 220000.00, 'Ví ZaloPay', NULL, 'Hủy'),
(12, 10, '2026-01-05 09:59:41', 120000.00, 'Ví ZaloPay', NULL, 'Đã thanh toán'),
(13, 9, '2026-01-05 10:00:56', 285000.00, 'Ví ZaloPay', NULL, 'Đã thanh toán');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don_combo`
--

CREATE TABLE `hoa_don_combo` (
  `ma_hoa_don` int(11) NOT NULL,
  `ma_combo` int(11) NOT NULL,
  `so_luong` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoa_don_combo`
--

INSERT INTO `hoa_don_combo` (`ma_hoa_don`, `ma_combo`, `so_luong`) VALUES
(1, 2, 1),
(2, 3, 1),
(3, 3, 1),
(6, 4, 1),
(8, 1, 1),
(9, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khach_hang`
--

CREATE TABLE `khach_hang` (
  `ma_kh` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `tai_khoan` varchar(50) DEFAULT NULL,
  `mat_khau` varchar(50) DEFAULT NULL,
  `vai_tro` varchar(50) DEFAULT 'khách hàng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `khach_hang`
--

INSERT INTO `khach_hang` (`ma_kh`, `ho_ten`, `email`, `SDT`, `avatar`, `tai_khoan`, `mat_khau`, `vai_tro`) VALUES
(1, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0901112223', 'publics/img/avatar/avatar1.jpg', 'nguyenvanan', '123456', 'khách hàng'),
(2, 'Trần Thị Bình', 'tranthibinh@gmail.com', '0902223334', 'publics/img/avatar/avatar2.jpg', 'tranthibinh', '123456', 'khách hàng'),
(3, 'Lê Văn Cao', 'levancao@gmail.com', '0903334445', 'publics/img/avatar/avatar3.jpg', 'levancao', '123456', 'khách hàng'),
(4, 'Phạm Thị Dung', 'phamthidung@gmail.com', '0904445556', 'publics/img/avatar/avatar4.jpg', 'phamthidung', '123456', 'khách hàng'),
(5, 'Hoàng Minh Đức', 'hoangminhduc@gmail.com', '0905556667', 'publics/img/avatar/avatar5.jpg', 'hoangminhduc', '123456', 'khách hàng'),
(6, 'Vũ Thị Lan', 'vuthilan@gmail.com', '0906667778', 'publics/img/avatar/avatar6.jpg', 'vuthilan', '123456', 'khách hàng'),
(7, 'Đặng Quốc Bảo', 'dangquocbao@gmail.com', '0907778889', 'publics/img/avatar/avatar7.jpg', 'dangquocbao', '123456', 'khách hàng'),
(8, 'Ngô Thị Hương', 'ngothihuong@gmail.com', '0908889990', 'publics/img/avatar/avatar8.jpg', 'ngothihuong', '123456', 'khách hàng'),
(9, 'Bùi Văn Tùng', 'buivantung@gmail.com', '0909990001', 'publics/img/avatar/avatar9.jpg', 'buivantung', '123456', 'quản lý'),
(10, 'Lý Thị Mai', 'lythimai@gmail.com', '0910001112', 'publics/img/avatar/avatar10.jpg', 'lythimai', '123456', 'khách hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim`
--

CREATE TABLE `phim` (
  `ma_phim` int(11) NOT NULL,
  `ten_phim` varchar(200) NOT NULL,
  `the_loai` varchar(50) DEFAULT NULL,
  `thoi_luong` int(11) NOT NULL,
  `dao_dien` varchar(100) DEFAULT NULL,
  `dien_vien` varchar(500) DEFAULT NULL,
  `mo_ta` varchar(1000) DEFAULT NULL,
  `gioi_han_do_tuoi` int(11) NOT NULL DEFAULT 0,
  `ngay_khoi_chieu` date DEFAULT NULL,
  `anh_trailer` varchar(200) DEFAULT NULL,
  `anh_banner` varchar(200) DEFAULT NULL COMMENT 'Đường dẫn ảnh banner của phim',
  `hot` bit(1) DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phim`
--

INSERT INTO `phim` (`ma_phim`, `ten_phim`, `the_loai`, `thoi_luong`, `dao_dien`, `dien_vien`, `mo_ta`, `gioi_han_do_tuoi`, `ngay_khoi_chieu`, `anh_trailer`, `anh_banner`, `hot`) VALUES
(1, 'Đảo Tàng Thư', 'Hành động, Phiêu lưu', 135, 'Christopher Nolan', 'John David Washington, Robert Pattinson', 'Cuộc phiêu lưu xuyên thời gian đầy kịch tính', 13, '2025-12-15', 'publics/img/phim/dao_tang_thu_trailer.jpg', 'publics/img/phim/dao_tang_thu_banner.jpg', b'1'),
(2, 'Trái Tim Mùa Đông', 'Lãng mạn, Tâm lý', 122, 'Trần Anh Hùng', 'Phạm Tuấn Hưng, Ninh Dương Lan Ngọc', 'Câu chuyện tình yêu cảm động giữa mùa đông lạnh giá', 16, '2025-12-20', 'publics/img/phim/trai_tim_mua_dong_trailer.jpg', 'publics/img/phim/trai_tim_mua_dong_banner.jpg', b'1'),
(3, 'Quái Vật Hồ Loch Ness', 'Kinh dị, Giật gân', 98, 'James Wan', 'Patrick Wilson, Vera Farmiga', 'Khám phá bí ẩn về quái vật huyền thoại', 18, '2025-12-10', 'publics/img/phim/quai_vat_loch_ness_trailer.jpg', 'publics/img/phim/quai_vat_loch_ness_banner.jpg', b'0'),
(4, 'Cuộc Đua Vô Cực', 'Hoạt hình, Gia đình', 105, 'Pete Docter', 'Tom Hanks, Tim Allen', 'Chuyến phiêu lưu đầy màu sắc dành cho cả gia đình', 0, '2025-12-18', 'publics/img/phim/cuoc_dua_vo_cuc_trailer.jpg', 'publics/img/phim/cuoc_dua_vo_cuc_banner.jpg', b'1'),
(5, 'Bí Mật Sau Cánh Cửa', 'Kinh dị, Bí ẩn', 115, 'M. Night Shyamalan', 'James McAvoy, Anya Taylor-Joy', 'Bí ẩn kinh hoàng trong ngôi nhà cũ', 16, '2025-12-05', 'publics/img/phim/bi_mat_sau_canh_cua_trailer.jpg', 'publics/img/phim/bi_mat_sau_canh_cua_banner.jpg', b'0'),
(6, 'Tình Yêu Thời Số Hóa', 'Lãng mạn, Hài', 128, 'Nancy Meyers', 'Anne Hathaway, Robert De Niro', 'Câu chuyện tình yêu trong thời đại công nghệ', 13, '2025-12-22', 'publics/img/phim/tinh_yeu_thoi_so_hoa_trailer.jpg', 'publics/img/phim/tinh_yeu_thoi_so_hoa_banner.jpg', b'1'),
(7, 'Chiến Binh Samurai Cuối Cùng', 'Hành động, Lịch sử', 142, 'Akira Kurosawa', 'Ken Watanabe, Hiroyuki Sanada', 'Bi kịch của những chiến binh samurai cuối cùng', 16, '2025-12-12', 'publics/img/phim/chien_binh_samurai_trailer.jpg', 'publics/img/phim/chien_binh_samurai_banner.jpg', b'0'),
(8, 'Hành Tinh Xanh', 'Tài liệu, Thiên nhiên', 96, 'David Attenborough', 'David Attenborough', 'Khám phá vẻ đẹp của hành tinh chúng ta', 0, '2025-12-08', 'publics/img/phim/hanh_tinh_xanh_trailer.jpg', 'publics/img/phim/hanh_tinh_xanh_banner.jpg', b'0'),
(9, 'Án Mạng Trên Tàu Tốc Hành', 'Trinh thám, Tội phạm', 130, 'Kenneth Branagh', 'Kenneth Branagh, Michelle Pfeiffer', 'Vụ án bí ẩn trên chuyến tàu tốc hành xuyên châu Âu', 13, '2025-12-25', 'publics/img/phim/an_mang_tren_tau_trailer.jpg', 'publics/img/phim/an_mang_tren_tau_banner.jpg', b'0'),
(10, 'Những Kẻ Mộng Mơ', 'Chính kịch, Tâm lý', 118, 'Damien Chazelle', 'Ryan Gosling, Emma Stone', 'Hành trình theo đuổi giấc mơ của những người trẻ', 16, '2025-12-28', 'publics/img/phim/nhung_ke_mong_mo_trailer.jpg', 'publics/img/phim/nhung_ke_mong_mo_banner.jpg', b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `ma_phong` int(11) NOT NULL,
  `ma_rap` int(11) NOT NULL,
  `ten_phong` varchar(50) NOT NULL,
  `loai_man_hinh` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`ma_phong`, `ma_rap`, `ten_phong`, `loai_man_hinh`) VALUES
(1, 1, 'Phòng 1 - IMAX', 'IMAX 4K'),
(2, 1, 'Phòng 2 - Premium', '2D Laser'),
(3, 2, 'Phòng 1 - 3D', '3D Digital'),
(4, 2, 'Phòng 2 - Standard', '2D Digital'),
(5, 3, 'Phòng 1 - Family', '2D Digital'),
(6, 3, 'Phòng 2 - VIP', '2D Laser');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rap`
--

CREATE TABLE `rap` (
  `ma_rap` int(11) NOT NULL,
  `ten_rap` varchar(100) NOT NULL,
  `dia_chi` varchar(200) DEFAULT NULL,
  `thanh_pho` varchar(50) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `anh_rap` varchar(255) DEFAULT NULL,
  `mo_ta_rap` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rap`
--

INSERT INTO `rap` (`ma_rap`, `ten_rap`, `dia_chi`, `thanh_pho`, `SDT`, `anh_rap`, `mo_ta_rap`) VALUES
(1, 'Beta Nguyễn Du', '116 Nguyễn Du, P. Bến Thành, Q.1', 'Hồ Chí Minh', '02838227899', 'publics/img/rap/beta_nguyen_du.jpg', 'Rạp cao cấp tại trung tâm Quận 1, trang bị hệ thống âm thanh Dolby Atmos và màn hình IMAX'),
(2, 'Beta Giải Phóng', 'Tòa nhà Hoàng Gia Plaza, Giải Phóng, Hà Nội', 'Hà Nội', '02438654321', 'publics/img/rap/beta_giai_phong.jpg', 'Rạp hiện đại với 8 phòng chiếu, phục vụ đa dạng thể loại phim'),
(3, 'Beta Linh Đàm', 'HH4A Linh Đàm, Hoàng Mai', 'Hà Nội', '02439876543', 'publics/img/rap/beta_linh_dam.jpg', 'Rạp phim gia đình với không gian rộng rãi và dịch vụ tiện ích đa dạng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `suat_chieu`
--

CREATE TABLE `suat_chieu` (
  `ma_suat_chieu` int(11) NOT NULL,
  `ma_phim` int(11) NOT NULL,
  `ma_phong` int(11) NOT NULL,
  `ngay_chieu` date NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `gia_ve_co_ban` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `suat_chieu`
--

INSERT INTO `suat_chieu` (`ma_suat_chieu`, `ma_phim`, `ma_phong`, `ngay_chieu`, `gio_bat_dau`, `gio_ket_thuc`, `gia_ve_co_ban`) VALUES
(1, 1, 1, '2026-01-01', '09:00:00', '11:15:00', 120000.00),
(2, 2, 2, '2026-01-01', '10:30:00', '12:32:00', 95000.00),
(3, 4, 3, '2026-01-01', '12:00:00', '13:45:00', 85000.00),
(4, 3, 4, '2026-01-01', '14:30:00', '16:08:00', 90000.00),
(5, 6, 5, '2026-01-01', '16:00:00', '18:08:00', 80000.00),
(6, 1, 1, '2026-01-02', '10:00:00', '12:15:00', 120000.00),
(7, 5, 2, '2026-01-02', '13:00:00', '14:55:00', 95000.00),
(8, 7, 3, '2026-01-02', '15:30:00', '17:52:00', 100000.00),
(9, 8, 4, '2026-01-02', '18:00:00', '19:36:00', 75000.00),
(10, 9, 5, '2026-01-02', '20:00:00', '22:10:00', 85000.00),
(11, 2, 1, '2026-01-03', '09:30:00', '11:32:00', 110000.00),
(12, 4, 2, '2026-01-03', '12:00:00', '13:45:00', 95000.00),
(13, 6, 3, '2026-01-03', '14:30:00', '16:38:00', 80000.00),
(14, 10, 4, '2026-01-03', '17:00:00', '18:58:00', 85000.00),
(15, 1, 5, '2026-01-03', '19:30:00', '21:45:00', 120000.00),
(16, 3, 1, '2026-01-04', '10:00:00', '11:38:00', 90000.00),
(17, 5, 2, '2026-01-04', '13:00:00', '14:55:00', 95000.00),
(18, 7, 3, '2026-01-04', '15:30:00', '17:52:00', 100000.00),
(19, 8, 4, '2026-01-04', '18:30:00', '20:06:00', 75000.00),
(20, 9, 5, '2026-01-04', '21:00:00', '23:10:00', 85000.00),
(21, 4, 1, '2026-01-05', '09:00:00', '10:45:00', 110000.00),
(22, 6, 2, '2026-01-05', '11:30:00', '13:38:00', 95000.00),
(23, 1, 3, '2026-01-05', '14:00:00', '16:15:00', 100000.00),
(24, 2, 4, '2026-01-05', '16:30:00', '18:32:00', 85000.00),
(25, 10, 5, '2026-01-05', '19:00:00', '20:58:00', 80000.00),
(26, 1, 1, '2026-01-06', '20:00:00', '22:15:00', 120000.00),
(27, 2, 2, '2026-01-07', '18:30:00', '20:32:00', 110000.00),
(28, 4, 3, '2026-01-08', '15:00:00', '16:45:00', 95000.00),
(29, 6, 4, '2026-01-09', '14:00:00', '16:08:00', 85000.00),
(30, 1, 5, '2026-01-10', '19:00:00', '21:15:00', 120000.00);

--
-- Bẫy `suat_chieu`
--
DELIMITER $$
CREATE TRIGGER `trg_ThemGheSauKhiTaoSuatChieu` AFTER INSERT ON `suat_chieu` FOR EACH ROW BEGIN
    -- Insert tất cả ghế của phòng vào ghe_suat_chieu với trạng thái 0 (chưa đặt)
    INSERT INTO ghe_suat_chieu (ma_ghe, ma_suat_chieu, trang_thai)
    SELECT ma_ghe, NEW.ma_suat_chieu, 0
    FROM ghe
    WHERE ma_phong = NEW.ma_phong;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ve`
--

CREATE TABLE `ve` (
  `ma_ve` int(11) NOT NULL,
  `ma_hoa_don` int(11) NOT NULL,
  `ma_suat_chieu` int(11) NOT NULL,
  `ma_ghe` int(11) NOT NULL,
  `gia` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ve`
--

INSERT INTO `ve` (`ma_ve`, `ma_hoa_don`, `ma_suat_chieu`, `ma_ghe`, `gia`) VALUES
(1, 1, 1, 1, 120000.00),
(2, 1, 1, 2, 120000.00),
(3, 2, 2, 25, 95000.00),
(4, 2, 2, 26, 95000.00),
(5, 3, 3, 45, 85000.00),
(6, 4, 6, 3, 120000.00),
(7, 4, 6, 4, 120000.00),
(8, 4, 6, 5, 120000.00),
(9, 5, 7, 27, 95000.00),
(10, 5, 7, 28, 95000.00),
(11, 6, 11, 21, 110000.00),
(12, 6, 11, 22, 110000.00),
(13, 7, 13, 57, 80000.00),
(14, 7, 13, 58, 80000.00),
(15, 8, 16, 6, 90000.00),
(16, 8, 16, 7, 90000.00),
(17, 9, 19, 49, 75000.00),
(18, 10, 23, 41, 100000.00),
(19, 10, 23, 42, 100000.00),
(20, 11, 21, 7, 110000.00),
(21, 11, 21, 16, 110000.00),
(22, 12, 1, 12, 120000.00),
(23, 13, 2, 30, 95000.00),
(24, 13, 2, 31, 95000.00),
(25, 13, 2, 32, 95000.00);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `combo`
--
ALTER TABLE `combo`
  ADD PRIMARY KEY (`ma_combo`);

--
-- Chỉ mục cho bảng `danh_gia_rap`
--
ALTER TABLE `danh_gia_rap`
  ADD PRIMARY KEY (`ma_danh_gia`),
  ADD KEY `danh_gia_rap_ibfk_1` (`ma_rap`),
  ADD KEY `danh_gia_rap_ibfk_2` (`ma_kh`);

--
-- Chỉ mục cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD PRIMARY KEY (`ma_ghe`),
  ADD KEY `ghe_ibfk_1` (`ma_phong`);

--
-- Chỉ mục cho bảng `ghe_suat_chieu`
--
ALTER TABLE `ghe_suat_chieu`
  ADD PRIMARY KEY (`ma_ghe`,`ma_suat_chieu`),
  ADD KEY `ghe_suat_chieu_ibfk_2` (`ma_suat_chieu`);

--
-- Chỉ mục cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD PRIMARY KEY (`ma_hoa_don`),
  ADD KEY `hoa_don_ibfk_1` (`ma_kh`);

--
-- Chỉ mục cho bảng `hoa_don_combo`
--
ALTER TABLE `hoa_don_combo`
  ADD PRIMARY KEY (`ma_hoa_don`,`ma_combo`),
  ADD KEY `hoa_don_combo_ibfk_2` (`ma_combo`);

--
-- Chỉ mục cho bảng `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD PRIMARY KEY (`ma_kh`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `tai_khoan` (`tai_khoan`);

--
-- Chỉ mục cho bảng `phim`
--
ALTER TABLE `phim`
  ADD PRIMARY KEY (`ma_phim`);

--
-- Chỉ mục cho bảng `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`ma_phong`),
  ADD KEY `phong_ibfk_1` (`ma_rap`);

--
-- Chỉ mục cho bảng `rap`
--
ALTER TABLE `rap`
  ADD PRIMARY KEY (`ma_rap`);

--
-- Chỉ mục cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  ADD PRIMARY KEY (`ma_suat_chieu`),
  ADD KEY `suat_chieu_ibfk_1` (`ma_phim`),
  ADD KEY `suat_chieu_ibfk_2` (`ma_phong`);

--
-- Chỉ mục cho bảng `ve`
--
ALTER TABLE `ve`
  ADD PRIMARY KEY (`ma_ve`),
  ADD KEY `ve_ibfk_1` (`ma_hoa_don`),
  ADD KEY `ve_ibfk_2` (`ma_suat_chieu`),
  ADD KEY `ve_ibfk_3` (`ma_ghe`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `combo`
--
ALTER TABLE `combo`
  MODIFY `ma_combo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `danh_gia_rap`
--
ALTER TABLE `danh_gia_rap`
  MODIFY `ma_danh_gia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `ghe`
--
ALTER TABLE `ghe`
  MODIFY `ma_ghe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  MODIFY `ma_hoa_don` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `khach_hang`
--
ALTER TABLE `khach_hang`
  MODIFY `ma_kh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phim`
--
ALTER TABLE `phim`
  MODIFY `ma_phim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phong`
--
ALTER TABLE `phong`
  MODIFY `ma_phong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `rap`
--
ALTER TABLE `rap`
  MODIFY `ma_rap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  MODIFY `ma_suat_chieu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `ve`
--
ALTER TABLE `ve`
  MODIFY `ma_ve` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `danh_gia_rap`
--
ALTER TABLE `danh_gia_rap`
  ADD CONSTRAINT `danh_gia_rap_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `rap` (`ma_rap`),
  ADD CONSTRAINT `danh_gia_rap_ibfk_2` FOREIGN KEY (`ma_kh`) REFERENCES `khach_hang` (`ma_kh`);

--
-- Các ràng buộc cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD CONSTRAINT `ghe_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `phong` (`ma_phong`);

--
-- Các ràng buộc cho bảng `ghe_suat_chieu`
--
ALTER TABLE `ghe_suat_chieu`
  ADD CONSTRAINT `ghe_suat_chieu_ibfk_1` FOREIGN KEY (`ma_ghe`) REFERENCES `ghe` (`ma_ghe`),
  ADD CONSTRAINT `ghe_suat_chieu_ibfk_2` FOREIGN KEY (`ma_suat_chieu`) REFERENCES `suat_chieu` (`ma_suat_chieu`);

--
-- Các ràng buộc cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`ma_kh`) REFERENCES `khach_hang` (`ma_kh`);

--
-- Các ràng buộc cho bảng `hoa_don_combo`
--
ALTER TABLE `hoa_don_combo`
  ADD CONSTRAINT `hoa_don_combo_ibfk_1` FOREIGN KEY (`ma_hoa_don`) REFERENCES `hoa_don` (`ma_hoa_don`),
  ADD CONSTRAINT `hoa_don_combo_ibfk_2` FOREIGN KEY (`ma_combo`) REFERENCES `combo` (`ma_combo`);

--
-- Các ràng buộc cho bảng `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`ma_rap`) REFERENCES `rap` (`ma_rap`);

--
-- Các ràng buộc cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  ADD CONSTRAINT `suat_chieu_ibfk_1` FOREIGN KEY (`ma_phim`) REFERENCES `phim` (`ma_phim`),
  ADD CONSTRAINT `suat_chieu_ibfk_2` FOREIGN KEY (`ma_phong`) REFERENCES `phong` (`ma_phong`);

--
-- Các ràng buộc cho bảng `ve`
--
ALTER TABLE `ve`
  ADD CONSTRAINT `ve_ibfk_1` FOREIGN KEY (`ma_hoa_don`) REFERENCES `hoa_don` (`ma_hoa_don`),
  ADD CONSTRAINT `ve_ibfk_2` FOREIGN KEY (`ma_suat_chieu`) REFERENCES `suat_chieu` (`ma_suat_chieu`),
  ADD CONSTRAINT `ve_ibfk_3` FOREIGN KEY (`ma_ghe`) REFERENCES `ghe` (`ma_ghe`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
