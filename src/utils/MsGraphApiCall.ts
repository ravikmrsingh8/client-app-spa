import { loginRequest, graphConfig } from "../authConfig";
import { msalInstance } from "../index";
import { PopupRequest } from "@azure/msal-browser";
export async function callMsGraph() {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const graphTokenRequest : PopupRequest = {
        scopes: ["User.Read"]
    };

    const response = await msalInstance.acquireTokenSilent({
        ...graphTokenRequest,
        account: account
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;
    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}