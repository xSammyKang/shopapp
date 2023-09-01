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
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Login</ModalHeader>
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
                            <Label for="password">Password</Label>
                            <Input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Enter password"
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