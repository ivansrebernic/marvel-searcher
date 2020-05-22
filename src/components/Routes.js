import React from "react";
import {
    BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import Characters from "../containers/Characters";


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