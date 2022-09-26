import React from "react";

const authContext = React.createContext({
    key: "sikretongmalupethshshshs",
    setKey: () => console.log("no key yet"),
    token: null,
    setToken: () => console.log("no token yet")
})

export default authContext