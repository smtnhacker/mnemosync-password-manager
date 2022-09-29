# mnemosync
A Password manager that uses spaced repetition to help users remember their passwords even after D-Day.

_Note: Might not help for systems that uses stuff like  2FA._

### Introduction

This was made for a PERN workshop, at work. It is currently working, but since it needs a database to work and free databases often have limiting restrictions, it currently cannot be used on the long run. Also, I haven't set-up TLS or a handshake protocol yet so avoid sending sensitive data over an unsecured network.

### Live Page

[You can visit the live page here](https://mnemosync.onrender.com/)

### Images

![Landing Page](https://github.com/smtnhacker/mnemosync-password-manager/blob/main/doc/landing_page.PNG?raw=true)

![Practice Sample](https://github.com/smtnhacker/mnemosync-password-manager/blob/main/doc/practice_page.PNG?raw=true)

### Testing

1. Using the terminal, go to the root directory.

2. Run `npm install` to install the dependencies.

3. Install and setup PostgreSQL (this is a PERN practice application afterall). Make sure to take note of your credentials!

4. Create a database named `mnemosync` (or whatever you want to call it).

5. Go to the `server` directoy and create a `.env` and `database.json` files. There are samples provided. They contain mostly just PostgreSQL configurations.

6. To be able to run the necesssary SQL files, run `npm install --location=global db-migrate` to install the needed commands.

7. While still in the `server` directory, create the necessary tables by running `db-migrate up init`.

8. Go back to the root directory and start the servers by running `npm run dev`.

9. The React App should open automatically, but you can access it through `http://localhost:3000/`.

### TO-DO

Here are some pretty _urgent_ to-do's that I still plan to work on (before putting the project back to the closet). Yeah, this thing is in its very early phases.

- [X] Encrypt the passwords client-side

- [X] ~~Use (or remove) the handshake~~ _Just use HTTPS_

- [X] Perform bare minimum input validations

- [X] Make the UI responsive

- [X] Make the site look legit

- [X] Actually add the SRS algorithm

- [ ] Add some tests (maybe?)

- [X] ~~Offload encryption/decryption to Web Workers~~ Async suffices _for now_

- [x] Protect the routes and add CSRF tokens

- [ ] Fix the schema (breaking change)

- [ ] Fix the key-generation and give each user their own salt (breaking change)

- [ ] Use a local PIN to generate salts and validate edits / deletion.

- [ ] Improve logging

### Contribution

Since this is a practice project, I _might_ accept criticisms. But since this is **just** a practice project, I might not continue working on this so to save you the trouble, I won't be accepting contributions.

### Support

If you enjoyed this and want to support it financially (so that I can finally move it to a non-free tier plan and give it a proper database), you can donate through the links below (once I set them up)!

_Insert donation links here_