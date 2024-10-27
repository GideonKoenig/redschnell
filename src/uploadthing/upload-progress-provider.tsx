"use client";

import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useState,
} from "react";

type uploadProgressContextValue = {
    progressList: Record<string, { progress: number; stopUpload: () => void }>;
    setProgressList: Dispatch<
        SetStateAction<
            Record<string, { progress: number; stopUpload: () => void }>
        >
    >;
};

const UploadProgressContext = createContext<uploadProgressContextValue>({
    progressList: {},
    setProgressList: () => {
        console.log(
            "Context is not properly initialized - Missing UploadProgressProvider?",
        );
    },
});

const UploadProgressProvider = (props: { children: ReactNode }) => {
    const [progressList, setProgressList] = useState<
        Record<string, { progress: number; stopUpload: () => void }>
    >({});

    return (
        <UploadProgressContext.Provider
            value={{
                progressList,
                setProgressList,
            }}
        >
            {props.children}
        </UploadProgressContext.Provider>
    );
};

export { UploadProgressProvider, UploadProgressContext };
