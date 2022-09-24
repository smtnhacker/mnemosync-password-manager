# mnemosync
A Password manager that uses spaced repetition to help users remember their passwords even after D-Day.

_Note: Might not help for systems that uses stuff like  2FA._

### Some Introduction

This was made for a PERN workshop, at work. It is ~~still far from~~ currently somewhat working, but to be honest, I'm not sure if its being done right. In particular, for a password manager, its security ~~is _still_~~ _might_ horrible ~~(does not even encrypt passwords yet)~~.

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

- [ ] Make the UI responsive

- [X] Actually add the SRS algorithm

- [ ] Add some tests (maybe?)

### Contribution

Since this is a practice project, I _might_ accept criticisms. But since this is **just** a practice project, I might not continue working on this so to save you the trouble, I won't be accepting contributions.