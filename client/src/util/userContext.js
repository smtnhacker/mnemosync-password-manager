import React from "react";

const userContext = React.createContext({
    userID: null,
    getUser: null,
    deleteUser: () => console.log("User is not logged in")
})

export default userContext