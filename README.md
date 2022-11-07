# mnemosync
A Password manager that uses spaced repetition to help users remember their passwords even after D-Day.

_Note: Might not help for systems that uses stuff like 2FA._

## Demo

![Demo](https://github.com/smtnhacker/mnemosync-password-manager/blob/main/doc/sample_usage.gif)

### Images

![Landing Page](https://github.com/smtnhacker/mnemosync-password-manager/blob/main/doc/landing_page.PNG?raw=true)

![Practice Sample](https://github.com/smtnhacker/mnemosync-password-manager/blob/main/doc/practice_page.PNG?raw=true)

## Introduction

This was made for a PERN workshop, at work. I tried to practice the entire stack, with heavy emphasis on the backend and security. However, due to the subtle nature of security, I wouldn't consider this app production-ready. Although, I did try to incorporate the necessary security to ensure that even if there is a middle-man or if the database is compromised, decrypting the passwords will still take a lifetime, by then you should have already changed passwords. Furthermore, the app also tries to protect itself against oracle attacks by delegating the decryption to the client, for the price of performance. This is in line with the goal of SRS since its ultimate goal is the non-use of the app in the first place (due to memorization)! Of course, the app uses CSRF and has mechanisms against XSS.

### How the project is structured

The project has 2 parts: the client side which is built using React, and the server side which is built using ExpressJS. Both contain code on security (primarily found in their respective `util/security.js` file).

### Possible Improvements

Currently, the app relies on TLS in order to _completely_ defend itself against man-in-the-middle attacks, but it can be improved by creating a secure channel using the key exchanged in the Diffie Hellman Key Exchange algorithm (found in `hooks/useHandshake.js` for the client side and `routs\api\security.js` in the server side). Encryption can be further strengthened by adding an additional 4-digit pin to generate a local pepper for **each** user. It should also be used as a password to confirm entry modification (in case the user hardware was compromised by a snooping person!)

## Testing

1. Using the terminal, go to the root directory.

2. Run `npm install` to install the dependencies.

3. Install and setup PostgreSQL (this is a PERN practice application afterall). Make sure to take note of your credentials!

4. Create a database named `mnemosync` (or whatever you want to call it).

5. Go to the `server` directoy and create a `.env` and `database.json` files. There are samples provided. They contain mostly just PostgreSQL configurations.

6. To be able to run the necesssary SQL files, run `npm install --location=global db-migrate` to install the needed commands.

7. While still in the `server` directory, create the necessary tables by running `db-migrate up init`.

8. Go back to the root directory and start the servers by running `npm run dev`.

9. The React App should open automatically, but you can access it through `http://localhost:3000/`.

## TO-DO

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

## Contribution

Since this is a practice project, I _might_ accept criticisms. But since this is **just** a practice project, I might not continue working on this so to save you the trouble, I won't be accepting contributions.

## Support

If you enjoyed this and want to support it financially (so that I can finally deploy it using a non-free tier plan, give it a proper database, and make it available to the non-tech savvy public), you can donate through the links below (once I set them up)!

_Insert donation links here_