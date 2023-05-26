import { useState } from "react";

const useForceUpdate = (): (() => void) => {
    const [value, setValue] = useState(false);
    return () => setValue(!value);
};

export default useForceUpdate;
