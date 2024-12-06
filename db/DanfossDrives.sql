-- Create the database
CREATE DATABASE DanfossDrives;

-- Use the database
USE DanfossDrives;

-- Step 2: Create the Products table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique identifier for each product
    ProductName VARCHAR(255) NOT NULL,          -- Name of the product
    MinVoltage DECIMAL(10, 2),                 -- Minimum voltage requirement
    MaxVoltage DECIMAL(10, 2),                 -- Maximum voltage requirement
    MinPower DECIMAL(10, 2),                   -- Minimum power requirement
    MaxPower DECIMAL(10, 2),                   -- Maximum power requirement
    ProductDetails TEXT,                       -- Detailed description of the product
    ProductFeatures TEXT                       -- Features of the product
);

-- Step 3: Create the Industries table
CREATE TABLE Industries (
    IndustryID INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each industry
    IndustryName VARCHAR(255) NOT NULL UNIQUE  -- Name of the industry (e.g., "Mining", "Food & Beverage")
);

-- Step 4: Create the Applications table
CREATE TABLE Applications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each application
    ApplicationName VARCHAR(255) NOT NULL UNIQUE  -- Name of the application (e.g., "Compressors", "Pumps")
);

-- Step 5: Create the Product_Industry join table
CREATE TABLE Product_Industry (
    ProductID INT,
    IndustryID INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE, 
    FOREIGN KEY (IndustryID) REFERENCES Industries(IndustryID) ON DELETE CASCADE,
    PRIMARY KEY (ProductID, IndustryID)
);

-- Step 6: Create the Product_Application table with an Industry-Specific Association
CREATE TABLE Product_Application (
    ProductID INT,
    IndustryID INT,                        -- Industry-specific association
    ApplicationID INT,                     -- Application ID (foreign key)
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE, 
    FOREIGN KEY (IndustryID) REFERENCES Industries(IndustryID) ON DELETE CASCADE,
    FOREIGN KEY (ApplicationID) REFERENCES Applications(ApplicationID) ON DELETE CASCADE,
    PRIMARY KEY (ProductID, IndustryID, ApplicationID)
);
