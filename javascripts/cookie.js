function readSelectedStateCookie() {
    let selectedCountries = [];

    let selectedStatesCookie = document.cookie
        .split("; ")
        .find(singleCookie => singleCookie.startsWith("selected_states="));

    if (selectedStatesCookie) {
        try {
            selectedCountries = JSON.parse(selectedStatesCookie.split("=")[1]);
        } catch (exception) {
            console.log("exception occured during JSON parsing of cookie", exception);
        }
    }
    return selectedCountries;
}

function readSelectedDatasetCookie() {
    let datasetCookie = document.cookie
        .split("; ")
        .find(singleCookie => singleCookie.startsWith("selected_dataset="));
    if (datasetCookie) {
        return datasetCookie.split("=")[1];
    }
    return undefined;
}