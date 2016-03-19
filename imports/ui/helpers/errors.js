
export const displayError = (error) => {
    if (error) {
        if(error.message) {
            console.error("error: " + error.message);
        } else if(error.reason) {
            console.error("error: " + error.reason);
        } else {
            console.error("error: " + JSON.stringify(error));
        }        
    }
};
