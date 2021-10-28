declare module "*.scss"; 

declare module "*.png" {
    const value: any;
    export default value;
};

declare var process: any;
declare var isDevMode: boolean;
