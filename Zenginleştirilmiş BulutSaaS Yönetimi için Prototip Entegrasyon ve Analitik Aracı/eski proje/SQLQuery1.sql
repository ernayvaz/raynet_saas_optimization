-- Adım 1.1: Tabloların Birleştirilmesi

--- Yazılım bilgileri ile güvenlik açıklarını birleştiren sorgu
SELECT
	s.SoftwareId AS Software_ID,
	s.Name AS Software_Name,
	s.Vendor AS Software_Vendor,
	s.Version AS Software_Version,
	s.ReleaseDate AS Release_Date,
	s.EndOfLifeDate AS End_of_Life_Date,
	v.CveId AS Vulnerability_ID,
	v.Score AS Risk_Score,
	v.Published AS Vulnerability_Published_Date,
	v.Summary AS Vulnerability_Summary
INTO Combined_Table
FROM
	[Catalog_v2-Software] s
JOIN
	[Catalog_v2-SoftwareVulnerabilityMatching] vm
	ON s.SoftwareId = vm.SoftwareId
JOIN
	[Catalog_v2-SoftwareVulnerability] v
	ON vm.CveId = v.CveId ;

-- Adım 1.2: Eksik Veri Kontrolü

--- Eksik değerleri kontrol eden sorgu
SELECT
	COUNT(*) AS Total_Records,
	SUM(CASE WHEN Software_Name IS NULL THEN 1 ELSE 0 END) AS Missing_Software_Name,
	SUM(CASE WHEN Software_Vendor IS NULL THEN 1 ELSE 0 END) AS Missing_Software_Vendor,
	SUM(CASE WHEN Risk_Score IS NULL THEN 1 ELSE 0 END) AS Missing_Risk_Score,
	SUM(CASE WHEN Vulnerability_Published_Date IS NULL THEN 1 ELSE 0 END) AS Missing_Vulnerability_Published_Date
FROM 
    ( -- Alt sorguda birleştirme sonucu elde edilen veri seti kullanılır
		SELECT
			s.SoftwareId AS Software_ID,
			s.Name AS Software_Name,
			s.Vendor AS Software_Vendor,
			s.Version AS Software_Version,
			s.ReleaseDate AS Release_Date,
			s.EndOfLifeDate AS End_of_Life_Date,
			v.CveId AS Vulnerability_ID,
			v.Score AS Risk_Score,
			v.Published AS Vulnerability_Published_Date,
			v.Summary AS Vulnerability_Summary
		FROM
			[Catalog_v2-Software] s
		JOIN
			[Catalog_v2-SoftwareVulnerabilityMatching] vm
			ON s.SoftwareId = vm.SoftwareId
		JOIN
			[Catalog_v2-SoftwareVulnerability] v
			ON vm.CveId = v.CveId 
    ) AS Combined_Table;

-- Adım 1.3: Veri Dönüştürme ve Temizleme

--- 1.3.1: Tarih Formatlarının Uyarlanması
-- Tarih sütunlarının uyarlanması ve aynı formatta kontrol edilmesi
SELECT 
    Software_ID,
    Software_Name,
    Software_Vendor,
    Software_Version,
    -- Release Date sütununu standart tarih formatına dönüştür
    FORMAT(Release_Date, 'yyyy-MM-dd') AS Formatted_Release_Date,
    -- End of Life Date sütununu standart tarih formatına dönüştür
    FORMAT(End_of_Life_Date, 'yyyy-MM-dd') AS Formatted_End_of_Life_Date,
    -- Vulnerability Published Date sütununu standart tarih formatına dönüştür
    FORMAT(Vulnerability_Published_Date, 'yyyy-MM-dd') AS Formatted_Vulnerability_Published_Date,
    Vulnerability_ID,
    Risk_Score,
    Vulnerability_Summary
FROM 
    Combined_Table;


-- Combined_Table tablosuna yeni sütunlar ekleyelim
ALTER TABLE Combined_Table
ADD Formatted_Release_Date DATE,
    Formatted_End_of_Life_Date DATE,
    Formatted_Vulnerability_Published_Date DATE;

-- Yeni sütunları dolduralım
UPDATE Combined_Table
SET Formatted_Release_Date = TRY_CAST(Release_Date AS DATE),
    Formatted_End_of_Life_Date = TRY_CAST(End_of_Life_Date AS DATE),
    Formatted_Vulnerability_Published_Date = TRY_CAST(Vulnerability_Published_Date AS DATE);


SELECT 
    Software_ID,
    Software_Name,
    Software_Vendor,
    Software_Version,
    Formatted_Release_Date,
    Formatted_End_of_Life_Date,
    Formatted_Vulnerability_Published_Date,
    Vulnerability_ID,
    Risk_Score,
    Vulnerability_Summary
FROM Combined_Table;


--- Adım 1.3.2: Tarih Aralıklarının ve Kapsamlarının Belirlenmesi

-- Minimum ve Maksimum Tarihlerin Belirlenmesi
SELECT
    MIN(Formatted_Release_Date) AS Min_Release_Date,
    MAX(Formatted_Release_Date) AS Max_Release_Date,
    MIN(Formatted_End_of_Life_Date) AS Min_End_of_Life_Date,
    MAX(Formatted_End_of_Life_Date) AS Max_End_of_Life_Date,
    MIN(Formatted_Vulnerability_Published_Date) AS Min_Vulnerability_Published_Date,
    MAX(Formatted_Vulnerability_Published_Date) AS Max_Vulnerability_Published_Date
FROM Combined_Table;

-- Tarih Kapsamının Hesaplanması
SELECT
    DATEDIFF(YEAR, MIN(Formatted_Release_Date), MAX(Formatted_Release_Date)) AS Release_Date_Years_Covered,
    DATEDIFF(YEAR, MIN(Formatted_End_of_Life_Date), MAX(Formatted_End_of_Life_Date)) AS End_of_Life_Date_Years_Covered,
    DATEDIFF(YEAR, MIN(Formatted_Vulnerability_Published_Date), MAX(Formatted_Vulnerability_Published_Date)) AS Vulnerability_Published_Years_Covered
FROM Combined_Table;

-- Yıllara Göre Dağılım
SELECT
    YEAR(Formatted_Release_Date) AS Release_Year,
    COUNT(*) AS Release_Count
FROM Combined_Table
WHERE Formatted_Release_Date IS NOT NULL
GROUP BY YEAR(Formatted_Release_Date)
ORDER BY Release_Year;

SELECT
    YEAR(Formatted_End_of_Life_Date) AS End_Of_Life_Year,
    COUNT(*) AS End_Of_Life_Count
FROM Combined_Table
WHERE Formatted_End_of_Life_Date IS NOT NULL
GROUP BY YEAR(Formatted_End_of_Life_Date)
ORDER BY End_Of_Life_Year;

SELECT
    YEAR(Formatted_Vulnerability_Published_Date) AS Vulnerability_Year,
    COUNT(*) AS Vulnerability_Count
FROM Combined_Table
WHERE Formatted_Vulnerability_Published_Date IS NOT NULL
GROUP BY YEAR(Formatted_Vulnerability_Published_Date)
ORDER BY Vulnerability_Year;

-- 1.4: Verilerin Gruplanması ve Özetlenmesi
--- 1.4.1: Güvenlik Açıklarının Yıllara Göre Gruplandırılması 

-- Güvenlik Açıklarının Yıllara Göre Gruplandırılması
SELECT
    YEAR(Formatted_Vulnerability_Published_Date) AS Vulnerability_Year,
    COUNT(*) AS Vulnerability_Count
FROM
    combined_table
GROUP BY
    YEAR(Formatted_Vulnerability_Published_Date)
ORDER BY
    Vulnerability_Year ASC;

--- 1.4.2: Yazılımların Yayın ve Ömrün Sonu Tarihlerine Göre Gruplandırılması
-- Yayınlanan Yazılımların Yıllara Göre Gruplandırılması
SELECT
    YEAR(Formatted_Release_Date) AS Release_Year,
    COUNT(*) AS Release_Count
FROM
    combined_table
WHERE
    Formatted_Release_Date IS NOT NULL
GROUP BY
    YEAR(Formatted_Release_Date)
ORDER BY
    Release_Year ASC;

-- Ömrü Sona Eren Yazılımların Yıllara Göre Gruplandırılması
SELECT
    YEAR(Formatted_End_Of_Life_Date) AS End_Of_Life_Year,
    COUNT(*) AS End_Of_Life_Count
FROM
    combined_table
WHERE
    Formatted_End_Of_Life_Date IS NOT NULL
GROUP BY
    YEAR(Formatted_End_Of_Life_Date)
ORDER BY
    End_Of_Life_Year ASC;

--- 1.4.3: Yazılımların ve Güvenlik Açıklarının Yayın Yılları ile Karşılaştırılması
-- Yazılımların yayın yılları ve toplam yazılım sayısı
SELECT
    YEAR(Formatted_Release_Date) AS Release_Year,
    COUNT(*) AS Software_Count
FROM combined_table
WHERE Formatted_Release_Date IS NOT NULL
GROUP BY YEAR(Formatted_Release_Date)
ORDER BY Release_Year;

-- Güvenlik açıklarının yayın yılları ve toplam güvenlik açığı sayısı
SELECT
    YEAR(Formatted_Vulnerability_Published_Date) AS Vulnerability_Year,
    COUNT(*) AS Vulnerability_Count
FROM combined_table
WHERE Formatted_Vulnerability_Published_Date IS NOT NULL
GROUP BY YEAR(Formatted_Vulnerability_Published_Date)
ORDER BY Vulnerability_Year;

-- Yazılım ve güvenlik açıklarını yıllara göre karşılaştırma
SELECT
    COALESCE(s.Release_Year, v.Vulnerability_Year) AS Year,
    COALESCE(s.Software_Count, 0) AS Software_Count,
    COALESCE(v.Vulnerability_Count, 0) AS Vulnerability_Count
FROM (
    SELECT
        YEAR(Formatted_Release_Date) AS Release_Year,
        COUNT(*) AS Software_Count
    FROM combined_table
    WHERE Formatted_Release_Date IS NOT NULL
    GROUP BY YEAR(Formatted_Release_Date)
) s
FULL OUTER JOIN (
    SELECT
        YEAR(Formatted_Vulnerability_Published_Date) AS Vulnerability_Year,
        COUNT(*) AS Vulnerability_Count
    FROM combined_table
    WHERE Formatted_Vulnerability_Published_Date IS NOT NULL
    GROUP BY YEAR(Formatted_Vulnerability_Published_Date)
) v
ON s.Release_Year = v.Vulnerability_Year
ORDER BY Year;

-- 1.5: Risk Skorlarının Analizi ve Dağılımı

--- 1.5.1: Risk Skorlarının Gruplandırılması
SELECT
    CASE
        WHEN Risk_Score BETWEEN 0 AND 2 THEN '0-2'
        WHEN Risk_Score BETWEEN 2.1 AND 4 THEN '2.1-4'
        WHEN Risk_Score BETWEEN 4.1 AND 6 THEN '4.1-6'
        WHEN Risk_Score BETWEEN 6.1 AND 8 THEN '6.1-8'
        WHEN Risk_Score BETWEEN 8.1 AND 10 THEN '8.1-10'
        ELSE 'Unknown'
    END AS Risk_Score_Range,
    COUNT(*) AS Vulnerability_Count
FROM combined_table
GROUP BY
    CASE
        WHEN Risk_Score BETWEEN 0 AND 2 THEN '0-2'
        WHEN Risk_Score BETWEEN 2.1 AND 4 THEN '2.1-4'
        WHEN Risk_Score BETWEEN 4.1 AND 6 THEN '4.1-6'
        WHEN Risk_Score BETWEEN 6.1 AND 8 THEN '6.1-8'
        WHEN Risk_Score BETWEEN 8.1 AND 10 THEN '8.1-10'
        ELSE 'Unknown'
    END
ORDER BY Risk_Score_Range;

--- 1.5.2: Risk Skoru Özet İstatistikleri
-- Minimum, maksimum ve ortalama risk skorları
SELECT
    MIN(Risk_Score) AS Min_Risk_Score,
    MAX(Risk_Score) AS Max_Risk_Score,
    AVG(Risk_Score) AS Avg_Risk_Score
FROM combined_table;

-- Medyan risk skoru
WITH RankedScores AS (
    SELECT
        Risk_Score,
        ROW_NUMBER() OVER (ORDER BY Risk_Score ASC) AS RowNumber,
        COUNT(*) OVER () AS TotalCount
    FROM combined_table
)
SELECT
    AVG(Risk_Score) AS Median_Risk_Score
FROM RankedScores
WHERE RowNumber IN ((TotalCount + 1) / 2, (TotalCount + 2) / 2);

--- 1.5.3: Yüksek Riskli Güvenlik Açıkları
SELECT
    Vulnerability_ID,
    Vulnerability_Summary,
    Risk_Score,
    Software_Name,
    Software_Vendor,
    Vulnerability_Published_Date
FROM combined_table
WHERE Risk_Score >= 7.0
ORDER BY Risk_Score DESC;


-------------------------------------------------------------
--Adım 2.1: Veri Hazırlığı ve Özellik Mühendisliği

-- Yayın yılı sütunu ekleme
ALTER TABLE Combined_Table
ADD Release_Year AS YEAR(Release_Date);

-- Ömrün sonu yılı sütunu ekleme
ALTER TABLE Combined_Table
ADD End_Of_Life_Year AS YEAR(End_of_Life_Date);

-- Güvenlik açığının yılı sütunu ekleme
ALTER TABLE Combined_Table
ADD Vulnerability_Year AS YEAR(Vulnerability_Published_Date);

--- Adım 2.1.1: Gereksiz Sütunların Temizlenmesi
--- Gereksiz sütunları temizlemek için yeni bir tablo oluşturalım
SELECT 
    Software_ID,
    Software_Name,
    Software_Vendor,
    Software_Version,
    Release_Year,
    End_Of_Life_Year,
    Vulnerability_ID,
    Risk_Score,
    Vulnerability_Summary,
    Vulnerability_Year,
    Vulnerability_Published_Date
INTO Cleaned_Combined_Table
FROM Combined_Table;

-- Yeni tabloyu kontrol edelim
SELECT * 
FROM Cleaned_Combined_Table;

--- 2.1.2: Eksik Verilerin Analizi ve Düzeltilmesi
-- Eksik veri analizi
SELECT 
    COUNT(*) AS Total_Records,
    SUM(CASE WHEN End_Of_Life_Year IS NULL THEN 1 ELSE 0 END) AS Missing_End_Of_Life_Year,
    SUM(CASE WHEN Vulnerability_Summary IS NULL THEN 1 ELSE 0 END) AS Missing_Vulnerability_Summary,
    SUM(CASE WHEN Vulnerability_Year IS NULL THEN 1 ELSE 0 END) AS Missing_Vulnerability_Year
FROM Cleaned_Combined_Table;

--- 2.1.3: Eksik Verilerin Düzeltilmesi
-- Mevcut verilerde End_Of_Life_Year ile Release_Year farkını hesaplayalayacak analizi yapalim
SELECT 
    AVG(End_Of_Life_Year - Release_Year) AS Avg_Life_Cycle_Years,
    MIN(End_Of_Life_Year - Release_Year) AS Min_Life_Cycle_Years,
    MAX(End_Of_Life_Year - Release_Year) AS Max_Life_Cycle_Years
FROM Cleaned_Combined_Table
WHERE End_Of_Life_Year IS NOT NULL;

/*
Raynet Projesi İçin Önerilen Yöntem
Tahmin Yöntemini kullanmak, bu projenin amacına daha uygun olabilir. Çünkü:

Proje Hedefleri:
Güvenlik açıklarının proaktif yönetimi ve yazılımların yaşam döngüsü analizine dayalı tahminler içerir. Bu nedenle eksik End_Of_Life_Year tahmini yapmak, analiz için faydalı olabilir.
Yeterli Veri Var:
Release_Year gibi sütunlar, tahmin için yeterli bilgi sağlayabilir.
Eksik Verinin Önemi:
End_Of_Life_Year sütunundaki eksik veriler, analiz sonuçlarını doğrudan etkileyebilir. Bu nedenle çıkarılması yerine tahmini daha etkili bir yol olabilir.

End_Of_Life_Year için Release_Year + 5 neden seçildi?
"+5" varsayımı, yazılım endüstrisinde yaygın bir yaşam döngüsüne dayalıdır ancak veri setinizin spesifik yapısına göre test edilmelidir. 
Eğer mevcut verilerden bir ortalama hesaplanırsa, bu ortalamayı kullanmak daha doğru olabilir. 
Eğer emin değilseniz, önce yukarıdaki analizi yapabiliriz ve ardından uygun bir yöntem belirleyebiliriz.

Peki neden Vulnerability_Year - 2 kullandık?
Bu tür tahminlerde mantıklı bir varsayım yapmamız gerekiyor. Örneğin:

Vulnerability_Year - 2: Çoğu durumda, bir yazılımın güvenlik açıkları yayınlanmadan önce bir süre kullanılıyor. 
Varsayımsal olarak, yazılımın güvenlik açıklarının ilk olarak bildirilmesinden yaklaşık 2 yıl önce piyasaya sürüldüğünü düşünebiliriz. 
Bu nedenle Vulnerability_Year - 2 seçildi.*/

--- 2.1.3.1 Eksik Veriyi Tahmin Etmek
-- Release_Year için tahmini bir değer atama
UPDATE Cleaned_Combined_Table
SET Release_Year = Vulnerability_Year - 2
WHERE Release_Year IS NULL;

-- End_Of_Life_Year için tahmini bir değer atama
UPDATE Cleaned_Combined_Table
SET End_Of_Life_Year = Release_Year + 5
WHERE End_Of_Life_Year IS NULL;

-- Güncellemeleri kontrol edelim
SELECT *
FROM Cleaned_Combined_Table
WHERE Release_Year IS NULL OR End_Of_Life_Year IS NULL;

--- Adım 2.1.3: Veri Kalitesini Kontrol Etme

--- Tekil ID Kontrolü
-- Software_ID için mükerrer kontrolü
SELECT Software_ID, COUNT(*) AS Duplicate_Count
FROM Cleaned_Combined_Table
GROUP BY Software_ID
HAVING COUNT(*) > 1;

-- Vulnerability_ID için mükerrer kontrolü
SELECT Vulnerability_ID, COUNT(*) AS Duplicate_Count
FROM Cleaned_Combined_Table
GROUP BY Vulnerability_ID
HAVING COUNT(*) > 1;

-- Duplicate Kayıtların Çözümü
-- Duplicate kayıtları kaldırmak için ROW_NUMBER kullanarak en güncel kaydı seçelim.
WITH RankedTable AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Software_ID ORDER BY Vulnerability_Published_Date DESC) AS RowNum
    FROM Cleaned_Combined_Table
)
-- Sadece birinci sıradaki kayıtları tabloya aktaralım
DELETE FROM Cleaned_Combined_Table
WHERE Software_ID IN (
    SELECT Software_ID
    FROM RankedTable
    WHERE RowNum > 1
);


--- Geçersiz Değer Kontrolü
-- Risk_Score için kontrol (0-10 aralığında olmalı)
SELECT *
FROM Cleaned_Combined_Table
WHERE Risk_Score < 0 OR Risk_Score > 10;

-- Release_Year ve End_Of_Life_Year için kontrol
SELECT *
FROM Cleaned_Combined_Table
WHERE Release_Year < 1980 OR Release_Year > YEAR(GETDATE())
   OR End_Of_Life_Year < Release_Year OR End_Of_Life_Year > YEAR(GETDATE());

---- Mantıksal Tutarlılık Kontrolü
-- Vulnerability_Published_Date kontrolü
SELECT *
FROM Cleaned_Combined_Table
WHERE Vulnerability_Published_Date < DATEFROMPARTS(Release_Year, 1, 1);

--Tutarsız Kayıtları Ayrı Bir Tabloya Taşıyın:
/*Tutarsız kayıtları başka bir tabloya taşıyın ve temel analizlerinizden hariç tutun*/
SELECT *
INTO Suspicious_Records
FROM Cleaned_Combined_Table
WHERE Vulnerability_Published_Date < DATEFROMPARTS(Release_Year, 1, 1);

--- Temiz Veri ile Devam Edin:
/*Tutarlı verileri ana tablo olarak kullanmaya devam edin.*/
DELETE FROM Cleaned_Combined_Table
WHERE Vulnerability_Published_Date < DATEFROMPARTS(Release_Year, 1, 1);

SELECT COUNT(*) AS Total_Records
FROM Cleaned_Combined_Table;

SELECT *
FROM Cleaned_Combined_Table
WHERE Vulnerability_Published_Date < DATEFROMPARTS(Release_Year, 1, 1);

--  Adım 2.2: Veri Zenginleştirme
--- 2.2.1: Risk Seviyesi Kategorisi Eklemek
ALTER TABLE Cleaned_Combined_Table
ADD Risk_Category NVARCHAR(50);


UPDATE Cleaned_Combined_Table
SET Risk_Category = CASE
    WHEN Risk_Score BETWEEN 0 AND 2 THEN 'Low'
    WHEN Risk_Score BETWEEN 2.1 AND 4 THEN 'Moderate'
    WHEN Risk_Score BETWEEN 4.1 AND 6 THEN 'High'
    WHEN Risk_Score BETWEEN 6.1 AND 8 THEN 'Critical'
    WHEN Risk_Score BETWEEN 8.1 AND 10 THEN 'Severe'
END;

--- 2.2.2: Yaşam Döngüsü Durumu Eklemek
/*Yazılımın yayın tarihi ve ömrünün sonu tarihine göre yaşam döngüsü durumunu belirleyin*/
ALTER TABLE Cleaned_Combined_Table
ADD Lifecycle_Status NVARCHAR(50);


UPDATE Cleaned_Combined_Table
SET Lifecycle_Status = CASE
    WHEN End_Of_Life_Year IS NULL THEN 'Active'
    WHEN End_Of_Life_Year < YEAR(GETDATE()) THEN 'End-of-Life'
    WHEN End_Of_Life_Year >= YEAR(GETDATE()) THEN 'Supported'
END;

--- 2.2.3: Yeni Hesaplamalar Eklemek
/*Güvenlik açığı sayısını yazılımlara göre özetleyin ve tabloya bir 'Total_Vulnerabilities' sütunu ekleyin.*/

ALTER TABLE Cleaned_Combined_Table
ADD Total_Vulnerabilities INT;


UPDATE Cleaned_Combined_Table
SET Total_Vulnerabilities = (
    SELECT COUNT(*)
    FROM Cleaned_Combined_Table AS C
    WHERE C.Software_ID = Cleaned_Combined_Table.Software_ID
);


--- Adım 2.3: Veri Görselleştirme ve Raporlama İçin Hazırlık
---- 2.3.1: Veri Gruplama ve Toplama
-- Yazılım başına toplam güvenlik açığı sayısı:
SELECT 
    Software_Name,
    Software_Vendor,
    COUNT(Vulnerability_ID) AS Total_Vulnerabilities,
    AVG(Risk_Score) AS Avg_Risk_Score,
    MAX(Risk_Score) AS Max_Risk_Score
FROM Cleaned_Combined_Table
GROUP BY Software_Name, Software_Vendor
ORDER BY Total_Vulnerabilities DESC;

-- Yıllara göre güvenlik açıklarının toplamı:
SELECT 
    Vulnerability_Year,
    COUNT(Vulnerability_ID) AS Vulnerability_Count,
    AVG(Risk_Score) AS Avg_Risk_Score
FROM Cleaned_Combined_Table
GROUP BY Vulnerability_Year
ORDER BY Vulnerability_Year;


-- 2.3.2: Zenginleştirilmiş Veriyi Export Edilebilir Hale Getirme
SELECT *
FROM Cleaned_Combined_Table
INTO Exportable_Table;

