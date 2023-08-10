import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

import {
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";

export default class ItemsModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            shop_name: this.props.shop_name,
            all_items: this.props.all_items,
            selected_quantity: 1,
            selected_item_id: "",
            selected_item_name: "",
        }
    }
    render() {
        const {toggle, onSave} = this.props;
        let items = []
        if (this.state.all_items){
            for (let i = 0; i < this.state.all_items.length; i++){
                let avail = this.state.all_items[i].available_quantity
                let quantities = Array.from({length: avail}, (value, index) => index + 1)
                items.push(
                    <div className="buy-modal">
                        <div
                        key={this.state.all_items[i].item_name}
                        >
                            <font size="2" className="item-name" title={this.state.all_items[i].description}>{this.state.all_items[i].item_name}</font>
                            {avail >= 1 ? <select id="quantity-dropdown" onChange={e => this.setState({selected_quantity:e.target.value})} required>
                                {quantities.map(num => {return(
                                    <option value={num} className="quantity-option text-center">{num}</option>
                                )})}  
                            </select> : null}
                            {avail >= 1 ? <button onClick={() => {
                                avail -= this.state.selected_quantity
                                this.setState({
                                    selected_item_id:this.state.all_items[i].id, 
                                    selected_item_name:this.state.all_items[i].item_name
                                }, () => onSave(this.state))}}
                                className="buy-btn btn-success" style={{borderRadius: "3px"}}>Buy</button> : <font style={{fontWeight: 'bold'}}>Sold Out</font>}
                            <div>
                                <font size="2" style={{marginLeft: '20px', fontStyle: 'italic'}}>{this.state.all_items[i].description}</font>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>{this.state.shop_name}</ModalHeader>
                <ModalBody>
                    <div>{items}</div>
                </ModalBody>
            </Modal>
        )
    }
}