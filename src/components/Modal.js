import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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

export default class CustomModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            current_shop: this.props.current_shop,
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        const current_shop = { ...this.state.current_shop, [name]: value };
        this.setState({ current_shop });
    };
    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>New Shop</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Shop Name</Label>
                            <Input 
                              type="text"
                              name="shop_name"
                              value={this.state.current_shop.shop_name}
                              onChange={this.handleChange}
                              placeholder="Enter Shop name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                            type="text"
                            name="description"
                            value={this.state.current_shop.description}
                            onChange={this.handleChange}
                            placeholder="Enter Shop description"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.current_shop)}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}