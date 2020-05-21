import React from "react";
import {
    BrowserRouter as Router, Route, Switch,

    useLocation
} from "react-router-dom";
import Characters from "../containers/Characters";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Routes() {
    return (
        <Router>

            <Switch>
                {/* Using the `component` prop */}
                <Route path="/" component={Characters} />

            </Switch>
        </Router>
    )
}