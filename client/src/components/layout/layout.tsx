import React, { Component } from "react";
import "./layout.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { VacationsPage } from "../vacationsPage/vacationsPage";
import { LoginForm } from "../loginForm/loginForm";
import { Register } from "../register/register";
import { AdminPage } from "../adminPage/adminPage";
import { AddVacation } from "../addVacation/addVacation";
import { PatchVacation } from "../patchVacation/patchVacation";
import { Page404 } from "../page404/page404";

export class Layout extends Component {

    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>

                    <Switch>
                        <Route path="/vacations" component={VacationsPage} exact />
                        <Route path="/admin" component={AdminPage} exact />
                        <Route path="/login" component={LoginForm} exact />
                        <Route path="/register" component={Register} exact />
                        <Route path="/addingVacation" component={AddVacation} exact />
                        <Route path="/admin/:vId" component={PatchVacation} exact />
                        <Redirect from="/" to="/vacations" exact />
                        <Route component={Page404} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}