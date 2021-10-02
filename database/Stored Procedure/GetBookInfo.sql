CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookInfo`()
BEGIN
	SELECT *
    FROM bookinfo;
END