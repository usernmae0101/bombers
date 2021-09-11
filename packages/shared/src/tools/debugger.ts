export const debug = (note: string, ...values: any) => {
    if (process.env.NODE_ENV !== "development")
        return;
    
    console.log(`[${(new Date).toLocaleTimeString()} | ${note}]`, ...values);
};

export const assert = (value: any) => {
    if (!value) throw new Error("Assertion.");
};
