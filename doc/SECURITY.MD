# Security Process

Since Mnemosync is still essentially a password manager, it should have robust security.

### Potential Threats

##### Man-in-the-Middle Attack between client and server

**Solution:** Encrypt both the server and client data with rotating RSA. 

**Technology Used:** RSA

##### Man-in-the-Middle impersonates client in login

**Solution:** Submit login data using encrypted JWT with short lifetime.

**Technology Used:** JWT, AES-GCM

##### Central Database is compromised

**Solution:** 

- Hash the main login password using Argon2.

- Add pepper and re-encrypt the password entries.

- Use rotating pepper.

- Use PBKDF2 to generate keys for entries using an unsaved masterkey.

**Technology Used:** Peppering, AES-GCM, Argon2

##### Oracle Padding Attack

**Solution:** Use AES-GCM for all encryption.

**Technology Used:** AES-GCM

### Workflow

##### Initiating Client-Server connection

1. Client disables all communication.

2. Client generates public/private key.

3. Client gives server public key and wait for reply.

4. Server saves public key in session and replies with its own public key.

5. Perform PING-PONG between the client and server.

6. All future data in the communication will now be encrypted.

##### Signing Up

1. Client validates if the username and password follow basic constraints.

2. Client requests validation that the username is unique.

3. Server sends one-time use JWT for signup using that username.

4. Client hashes password, generates response using JWT, and requests signup.

5. Server validates request.

6. Server peppers hash and saves in database. 

7. Server prompt client to redirect to login.

##### Logging In

1. Client validates login form for basic constrants.

2. Client requests validation that username exists.

3. Server sends one-time use JWT for login using that username.

4. Client hashes password, generates response using JWT, and requests signup.

5. Server validates request.

6. Server peppers hash and compares with the database.

7. Session is updated and server prompts client to redirect.

##### Logging Out

1. Client validates that session is currently logged in.

2. Client requests logout.

3. Server validates request.

4. Server destroys session amd prompts client to redirect.

##### Adding New Entries

1. Client encrypts the password.

2. Client requests new entries insertion.

3. Server peppers the password.

4. Server stores the data and prompts a success.

##### Modifying Entries

1. Client encrypts the password.

2. Client requests entry modification.

3. Server peppers the password.

4. Server stores the data and prompts a success.

##### Requesting Entries

1. Client request entries.

2. Server finds valid entries.

3. Server unpeppers the data.

4. Server sends the data back.