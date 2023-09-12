DROP database IF EXISTS db;

CREATE database db;

use db;

CREATE TABLE greetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    is_sent TINYINT(1) NOT NULL DEFAULT 0,
    sent_time DATETIME DEFAULT NULL,
    is_received TINYINT(1) NOT NULL DEFAULT 0,
    received_time DATETIME DEFAULT NULL
);

INSERT INTO greetings (content) values ('hello.');
INSERT INTO greetings (content) values ('goodbye.');
INSERT INTO greetings (content) values ('good afternoon.');
INSERT INTO greetings (content) values ('see you later.');
