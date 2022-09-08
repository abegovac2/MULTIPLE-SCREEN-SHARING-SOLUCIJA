import { useState, useMemo } from "react";

export const useNavbarShowState = () => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({});

    const toggleNavBar = useMemo(() => () => setShow(!show), [setShow]);

    const setCurrentUser = useMemo(
        () => (newUsr) => setUser(newUsr),
        [setUser]
    );

    return {
        show,
        toggleNavBar,
        user,
        setCurrentUser,
    };
};
