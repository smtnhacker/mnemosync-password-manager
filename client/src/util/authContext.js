import React from "react";

const authContext = React.createContext({
    key: "sikretongmalupethshshshs",
    setKey: () => console.log("no key yet")
})

export default authContext