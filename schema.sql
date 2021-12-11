CREATE TABLE cab (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    model TEXT, 
    color TEXT);

CREATE TABLE cab_point (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    cab_id INTEGER NOT NULL, 
    latitude REAL NOT NULL, 
    longitude REAL NOT NULL, 
    is_available BOOLEAN DEFAULT true);

CREATE TABLE ride (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    cab_id INTEGER, 
    passenger TEXT, 
    start_time TEXT, 
    end_time TEXT,
    start_latitude REAL, 
    start_longitude REAL, 
    end_latitude REAL, 
    end_longitude REAL, 
    is_cancelled BOOLEAN DEFAULT false, 
    cost REAL);


INSERT INTO cab (model, color) VALUES ('CAR-I', 'PINK');
INSERT INTO cab (model, color) VALUES ('CAR-I', 'RED');
INSERT INTO cab (model, color) VALUES ('CAR-II', 'PINK');
INSERT INTO cab (model, color) VALUES ('CAR-II', 'RED');

INSERT INTO cab_point (cab_id, latitude, longitude)
    VALUES (1, 13.0827, 80.2707);
INSERT INTO cab_point (cab_id, latitude, longitude)
    VALUES (2, 13.1027, 80.2507);
INSERT INTO cab_point (cab_id, latitude, longitude)
    VALUES (3, 11.4070, 79.6912);
INSERT INTO cab_point (cab_id, latitude, longitude)
    VALUES (4, 11.5070, 79.6512);
