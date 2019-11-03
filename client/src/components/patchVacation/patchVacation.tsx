import React, { Component } from "react";
import "./patchVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import { store } from "../../redux/store";
import { NavBar } from "../navBar/navBar";
import { ActionType } from "../../redux/actionType";
import io from 'socket.io-client';
import { disablePastDates } from "../globalFunctions";

let socket: any;

interface PatchVacationState {
    vacation: Vacation;
    user: any;
    destination: string;
    describePlace: string;
    startDate: string;
    endDate: string;
    image: string;
    price: number;
    selectedIMg: any;
}

export class PatchVacation extends Component<any, PatchVacationState> {

    public constructor() {
        super(undefined)
        this.state = {
            vacation: new Vacation(),
            user: store.getState().logged,
            destination: "",
            describePlace: "",
            image: "",
            startDate: "",
            endDate: "",
            price: 0,
            selectedIMg: null
        };
    }

    public componentWillUnmount(): void {
        if (socket) {
            socket.disconnect();
        }
    }

    public vacationsEmit(): void {
        socket.emit('admin-made-changes');
    }

    public componentDidMount(): void {
        if (this.state.user) {
            if (this.state.user && this.state.user.userName === "admin") {
                socket = io.connect("http://localhost:3001");

                const id = +this.props.match.params.vId;

                fetch("http://localhost:8080/api/vacations/" + id)
                    .then(response => response.json())
                    .then(vacation => {
                        this.setState({ vacation });

                        this.setState({ destination: vacation.destination });
                        this.setState({ describePlace: vacation.describePlace });
                        this.setState({ image: vacation.image });
                        this.setState({ price: vacation.price });
                        this.setState({ startDate: vacation.startDate });
                        this.setState({ endDate: vacation.endDate });
                    })
                    .catch(err => alert(err));
            }
            else {
                this.props.history.push("/vacations");
            }
        }
        else {
            this.props.history.push("/login");
        }

    }

    public render(): JSX.Element {
        return (
            <div className="patchVacation">
                <NavBar />

                <Heading>Edit A Vacation</Heading>

                <div className="vacationCard">
                    <label>Destination: </label>
                    <input type="text" value={this.state.destination}
                        onChange={this.updateDestinationValue}></input><br />

                    <label>Describe Place: </label><br />
                    <textarea value={this.state.describePlace}
                        onChange={this.updateDescribeValue}></textarea><br />

                    <label>Start At: </label>
                    <input type="date" min={disablePastDates()} value={this.state.startDate}
                        onChange={this.updateStartDate}></input><br />

                    <label>End's At: </label>
                    <input type="date" value={this.state.endDate} min={this.laterThanStart()}
                        onChange={this.updateEndDate}></input><br />

                    <label>Image Name: </label>
                    <input type="text" value={this.state.image}
                        onChange={this.updateImageValue}></input>
                    <input type="file" onChange={this.fileSelectHandler} accept="image/*" name="image"
                    ></input><br />

                    <label>Price: </label>
                    <input type="text" value={this.state.price}
                        onChange={this.updatePriceValue}></input><br />

                    <button type="button" onClick={this.updateVacationButton} className="btn">Update Vacation</button>
                </div>
            </div>
        )
    }
    
    private laterThanStart(): any {
        const startDate = this.state.startDate;
        if (startDate !== "") {
            return startDate;
        }
        return;
    }

    public fileSelectHandler = (e: any) => {
        console.log("img name: " + e.target.files[0].name);
        this.setState({ image : e.target.files[0].name})
        this.setState({
            selectedIMg: e.target.files[0]
        })
    }

    public updateStartDate = (e: any): void => {
        this.setState({ startDate: e.target.value });
    }
    public updateEndDate = (e: any): void => {
        this.setState({ endDate: e.target.value });
    }
    public updateDescribeValue = (e: any): void => {
        this.setState({ describePlace: e.target.value });
    }
    public updateDestinationValue = (e: any): void => {
        this.setState({ destination: e.target.value });
    }
    public updateImageValue = (e: any): void => {
        this.setState({ image: e.target.value });
    }
    public updatePriceValue = (e: any): void => {
        let price = +e.target.value;
        if (isNaN(price)) {
            price = 0;
        }
        this.setState({ price });
    }

    private updateVacationButton = (e: any) => {

        const id = +this.props.match.params.vId;
        fetch("http://localhost:8080/api/vacations/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                destination: this.state.destination,
                describePlace: this.state.describePlace,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                image: this.state.image,
                price: this.state.price
            })
        })
            .then(response => response.json())
            .then(vacation => {
                const action = { type: ActionType.updateVacation, payload: vacation };
                store.dispatch(action);
                this.vacationsEmit();

                this.props.history.push("/admin");
            })
            .catch(err => alert(err));
    }
}