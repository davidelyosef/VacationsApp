import React, { Component } from "react";
import "./page404.css";
import { Heading } from "../heading/heading";
import { NavBar } from "../navBar/navBar";

export class Page404 extends Component {

    public render(): JSX.Element {
        return (
            <div className="page404">
                <NavBar></NavBar>

                <Heading>The page you are looking for doesn't exist!</Heading>

                <iframe width="560" height="315" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>

            </div>
        );
    }
}
