CREATE TABLE BookInfo(
	BCode VARCHAR(6),
    BName VARCHAR(50),
    AName VARCHAR(50),
    BDate YEAR,
    
    PRIMARY KEY(BCode)
);
CREATE TABLE BookChapter(
	BCode VARCHAR(6),
    CNum INT,
    CTitle VARCHAR(50),
    CContent TEXT,
    
    PRIMARY KEY(CNum)
);
CREATE TABLE FootNote(
	BCode VARCHAR(6),
	FCode INT,
    FContent TEXT,
    PRIMARY KEY(FCode)
    
);

