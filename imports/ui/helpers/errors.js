
export const displayError = (error) => {
    if (error) {
        if(error.reason) {
            console.error("error: " + error.reason);
        } else {
            console.error("error: " + JSON.stringify(error));
        }
        // It would be better to not alert the error here but inform the user in some
        // more subtle way
        alert(error.error); // eslint-disable-line no-alert
    }
};
