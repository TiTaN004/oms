-- SQL script to create the database and tables for the OMS (Order Management System)
CREATE DATABASE IF NOT EXISTS oms_site;
USE oms_site;

-- Table: operation_type
CREATE TABLE operation_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: weight_type
CREATE TABLE weight_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

-- Table: user
CREATE TABLE `user` (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    userName VARCHAR(50) NOT NULL,
    emailID VARCHAR(100) NOT NULL UNIQUE,
    mobileNo VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(455),
    operationTypeID INT,
    isAdmin BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (operationTypeID) REFERENCES operation_type(id)
);

-- Table: product
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50),
    product_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: client_master
CREATE TABLE client_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: casting_order
CREATE TABLE casting_order (
    CastingOrderId INT AUTO_INCREMENT PRIMARY KEY,
    fClientID INT,
    fProductID INT,
    fAssignUserID INT,
    fOperationID INT,
    quantity INT NOT NULL,
    size FLOAT NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Processing', 'Completed')),
    FOREIGN KEY (fClientID) REFERENCES client_master(id),
    FOREIGN KEY (fProductID) REFERENCES product(id),
    FOREIGN KEY (fAssignUserID) REFERENCES `user`(userID),
    FOREIGN KEY (fOperationID) REFERENCES operation_type(id)
);

-- Table: order
CREATE TABLE `order` (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    fAssignUserID INT,
    fClientID INT,
    fProductID INT,
    fOperationID INT,
    remark VARCHAR(255),
    orderNo VARCHAR(50),
    orderOn DATETIME,
    pricePerQty DECIMAL(10,2),
    productQty INT,
    productWeight DECIMAL(10,2),
    productWeightTypeID INT,
    totalPrice DECIMAL(10,2),
    totalWeight DECIMAL(10,2),
    weight DECIMAL(10,2),
    WeightTypeID INT,
    status VARCHAR(20) CHECK (status IN ('Processing', 'Completed')),
    FOREIGN KEY (fAssignUserID) REFERENCES `user`(userID),
    FOREIGN KEY (fClientID) REFERENCES client_master(id),
    FOREIGN KEY (fProductID) REFERENCES product(id),
    FOREIGN KEY (fOperationID) REFERENCES operation_type(id),
    FOREIGN KEY (productWeightTypeID) REFERENCES weight_type(id),
    FOREIGN KEY (WeightTypeID) REFERENCES weight_type(id)
);

-- Table: user_devices
CREATE TABLE user_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    device_token VARCHAR(255) NOT NULL,
    platform ENUM('android', 'ios') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES `user`(userID)
);


-- Table: password_reset_tokens
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES `user`(userID)
);
