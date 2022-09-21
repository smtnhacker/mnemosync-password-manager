CREATE TABLE salts (
    salt_id UUID NOT NULL PRIMARY KEY,
    salt CHAR(32) NOT NULL,
    UNIQUE(salt)
);

CREATE TABLE user_info (
    user_id UUID NOT NULL PRIMARY KEY,
    email VARCHAR(50),
    phone VARCHAR(30)
);

CREATE TABLE users (
    user_id UUID NOT NULL PRIMARY KEY 
        REFERENCES user_info(user_id),
    username VARCHAR(50) NOT NULL,
    passhash VARCHAR(50) NOT NULL,
    salt_id UUID NOT NULL 
        REFERENCES salts(salt_id),
    UNIQUE(salt_id),
    UNIQUE(username)
);

CREATE TABLE entry_detail (
    entry_detail_id UUID NOT NULL PRIMARY KEY,
    ease INTEGER NOT NULL,
    interval INTEGER NOT NULL,
    due DATE NOT NULL
);

CREATE TABLE entries (
    entry_id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL 
        REFERENCES users(user_id),
    sitename VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    passhash VARCHAR(65) NOT NULL,
    salt_id UUID NOT NULL 
        REFERENCES salts(salt_id),
    entry_detail_id UUID 
        REFERENCES entry_detail(entry_detail_id),
    UNIQUE (sitename, username)
);