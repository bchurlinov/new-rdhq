/* eslint-disable no-restricted-syntax */

/**
 *
 * @param location ( from useLocation hook )
 * @param parameter
 * @returns url parameters
 */

export const getUrlParam = (location: any, parameter: string) => {
    const urlParameters = new URLSearchParams(location.search) as any;
    let urlParam = "";

    if (!location) throw new Error("Please provide the location object");
    if (!parameter) throw new Error("Please provide URL parameter");

    if (urlParameters && urlParameters.has(parameter)) {
        for (const p of urlParameters) {
            // eslint-disable-next-line prefer-destructuring
            urlParam = p[1];
        }
    }
    return urlParam;
};
