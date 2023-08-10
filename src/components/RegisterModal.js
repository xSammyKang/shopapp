import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";

export default class RegisterModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.username,
            password: this.props.password,
            password2: this.props.password2,
            email: this.props.email,
            first_name: this.props.first_name,
            last_name: this.props.last_name
        }
    }
    handleChange = e => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        this.setState({ ...this.state, [name]: value } );
    };
    render() {
        const { toggle, onSave } = this.props;
        console.log(this.state)
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Register</ModalHeader>
                <ModalBody onKeyDown={e => {
                    if (e.code === "Enter") {e.preventDefault(); onSave(this.state)}
                }}>
                    <Form>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input 
                              type="text"
                              name="username"
                              value={this.state.username}
                              onChange={this.handleChange}
                              placeholder="Enter username"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password (8+ alphanumeric characters, no common terms)</Label>
                            <Input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Enter password"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password2">Confirm password</Label>
                            <Input
                            type="password"
                            name="password2"
                            value={this.state.password2}
                            onChange={this.handleChange}
                            placeholder="Re-enter password"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                            type="text"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Enter email"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="first name">First name</Label>
                            <Input
                            type="text"
                            name="first_name"
                            value={this.state.first_name}
                            onChange={this.handleChange}
                            placeholder="Enter first name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="last_name">Last name</Label>
                            <Input
                            type="text"
                            name="last_name"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                            placeholder="Enter last name"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state)}>
                        Submit
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}