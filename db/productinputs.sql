USE DanfossDrives;

INSERT INTO Products (ProductName, MinVoltage, MaxVoltage, MinPower, MaxPower, ProductDetails, ProductFeatures)
VALUES 
('VLT Compact Starter MCD 200', 200, 480, 7.5, 110, 'Two series of soft starters that provide a total motor starting solution for motors up to 110 kW. The MCD 201 compact starter offers efficient motor-starting features, while the extended MCD 202 version of the compact starter provides enhanced soft-start functionality and additional motor-protection features. The series of soft starters offer easy DIN rail mounting for sizes up to 30 kW, 2-wire or 3-wire start/stop control and excellent starting duty (4 x le for 6 seconds; heavy starting ratings at 4 x le for 20 seconds). They are compatible with grounded delta power systems.', 'Easy connectivity for the soft starter to Ethernet/IP-based networks, such as Rockwell PLC systems Panel space can be saved due to the compact size Installation costs are minimized and power loss eliminated thanks to the built-in bypass More starts per hour and a higher load is possible as a result of advanced SCR Control Algorithms that balance output waveform Overall project investment is reduced due to essential motor protections No external cooling or oversizing is necessary thanks to the maximum ambient temperature of 50-C without derating'),
('VLT Soft Starter MCD 600', 200, 690, 20, 1250, 'Superior soft start performance for fixed-speed applications The VLT- Soft Starter MCD 600 combines the latest in advanced controls and protections with an increased level of intelligence for superior performance in fixed-speed applications. The MCD 600 is more flexible than ever to install, thanks to a wide variety of Ethernet and serial-based communication option cards, application-dedicated smart cards and support for eight languages. An integrated bypass ensures both extremely high efficiency and harmonic-free operation at full speed, reducing energy consumed and required cooling capacity. Ease of use is in focus with features such as the pump-clean function, PowerThrough operation, and calendar or run time-based scheduling. More extensive motor and starter protections ensure more uptime.', 'Inbuilt impeller cleaning assistance with Pump clean functionality Easy application analysis with up to 348 events logged, as well as QR code scan for serial number and event data Easy data access and reduced startup and upgrade time thanks to integrated USB port More reliability, more uptime with expanded motor and controller protections Flexibility for low speed applications, with Jog function Improved uptime with PowerThrough function which uses 2-phase control if one phase is damaged by shorted SCR Easy connectivity for the soft starter to Ethernet-based networks, such as PROFINET and EtherNet/IP Programming is quick and easy thanks to three menu systems (Quick Menu, Application Setup and Main Menu), a four-line graphical display and a logic keypad The best starting and stopping profile for the application is chosen using Adaptive Acceleration Control (AAC) Installation costs are lower and there is less stress on the motor thanks to DC injection braking distributed evenly over three phases Save space and reduce installation costs, thanks to the internal bypass contactors Good asset protection thanks to Emergency mode, which keeps the fan or pump running for as long as possible in an emergency'),
('VLT AQUA DRIVE FC 202', 200, 690, 0.25, 1400, 'Maximum energy efficiency for water and wastewater applications The VLT- AQUA Drive is designed to provide the highest level of performance of AC-motor-driven water and wastewater applications. Featuring a wide range of powerful standard features, which can be expanded with performance-improving options, the drive is equally suited to both new and retrofit projects. The considerable daily load variation in water or wastewater treatment plants makes it economically feasible to introduce motor control on rotating equipment such as pumps and blowers. VLT AQUA Drive can offer first-year cost savings of between 10-30% compared to traditional variable speed drive solutions. Its high lifetime availability and low energy consumption and maintenance costs provide you with the lowest cost of ownership. The quick and user-friendly setup of water and pump settings reduces installation time ensuring a fast route to maximum energy efficiency and motor control. By collecting the most important parameters in one place, the risk of incorrect configuration is reduced significantly.', 'Protect your assets well with specially designed software which prevents damage by water hammering and more Maximize energy efficiency thanks to control algorithms and design which focus on reducing heat loss Save energy on air conditioning with the unique back-channel-cooling concept that transfers 90% of heat away from the room Reduce electromagnetic interference and harmonic distortion thanks to the built-in, scalable RFI filter and integrated DC link chokes Integrate perfectly into your system and adapt precisely to the application using freely programmable warnings and alerts Win 3-8% more energy savings as a result of Automatic Energy Optimization Use condition-based monitoring to optimize uptime in your pumping applications');


INSERT INTO Industries (IndustryName)
VALUES 
('Food, Beverage & Packing'),
('Mining and Cement'),
('Chemical'),
('Cranes & Hoists'),
('Elevators & Escalators');


INSERT INTO Applications (ApplicationName)
VALUES 
('Centrifuges & Decanters'),
('Charging'),
('Compressors'),
('Conveyors'),
('Cranes, Hoists'),
('Cranes & Hoists'),
('Drilling'),
('Elevators'),
('Escalators'),
('Energy Storage'),
('Fans & Dryers'),
('Mills, Drums, Kilns'),
('Power Conversion System PCS'),
('Positioning, Sync'),
('Process & Material Treatment'),
('Pumps'),
('Winches, Tensioners'),
('Grinder & Roller'),
('Mixer'),
('Dosing systems'),
('Kneader'),
('Crusher'),
('Material Handling');


INSERT INTO Product_Industry (ProductID, IndustryID)
VALUES 
(1, 2),
(1, 3),
(2, 2),
(2, 3), 
(3, 2); 


-- For Food & Beverage, Packing Industry
INSERT INTO Product_Application (ProductID, IndustryID, ApplicationID)
VALUES 
(1, 2, 4),
(1, 2, 11),
(1, 2, 16),
(1, 3, 4),
(1, 3, 11),
(1, 3, 16),
(2, 2, 3),
(2, 2, 4),
(2, 2, 11),
(2, 2, 16),
(2, 3, 3),
(2, 3, 4),
(2, 3, 11),
(2, 3, 16),
(2, 3, 19),
(3, 3, 16);
