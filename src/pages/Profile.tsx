import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType, InteractionRequiredAuthError, AccountInfo, PopupRequest } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

// Sample app imports
import { ProfileData, GraphData } from "../ui-components/ProfileData";
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph } from "../utils/MsGraphApiCall";

// Material-ui imports
import Paper from "@mui/material/Paper";
import React from "react";

const ProfileContent = () => {
    const { instance, inProgress } = useMsal();
    const [graphData, setGraphData] = useState<null|GraphData>(null);

    useEffect(() => {
        if (!graphData && inProgress === InteractionStatus.None) {
            callMsGraph().then(response => setGraphData(response)).catch((e) => {
                if (e instanceof InteractionRequiredAuthError) {
                    const graphTokenRequest : PopupRequest = {
                        scopes: ["User.Read"]
                    };
                    instance.acquireTokenRedirect({
                        ...graphTokenRequest,
                        account: instance.getActiveAccount() as AccountInfo
                    });
                }
            });
        }
    }, [inProgress, graphData, instance]);
  
    return (
        <Paper>
            { graphData ? <ProfileData graphData={graphData} /> : null }
        </Paper>
    );
};

export function Profile() {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate 
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <ProfileContent />
        </MsalAuthenticationTemplate>
      )
};