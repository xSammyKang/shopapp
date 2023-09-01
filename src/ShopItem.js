import React, { Component } from "react"
import Modal from "./components/Modal"; 
import axios from "axios";

class Item extends Component {
    constructor(props){
        super(props);
        this.state = {
            current_item: {
                item_name: "",
                add_date: "",
                description: "",
                available_quantity: 0,
                shop_name: "",
            },
            all_items: []
        };
    }
    async componentDidMount() {
        try {
            const res = await fetch(`http://localhost:8000/items/${this.state.current_item.shop_name}`, {
                mode: 'cors'            
            });
            const shop_state = await res.json();
            this.setState({
                all_items: shop_state.results.shop_items
            })

          } catch (e) {
            console.log(e);
        }
    }
    createItem = () => {
      let date = new Date();
      const item = {item_name: "", add_date: date.toJSON(), description: "", available_quantity: 0, shop_name: ""};
      this.setState({current_item: item, modal: !this.state.modal});
      console.log(this.state.current_item)
    }
    toggle = () => {
        this.setState({modal: !this.state.modal});
    }
    handleSubmit = item => {
        this.toggle();
        if (item.item_name) {
          axios
            .post(`http://localhost:8000/items/`, {
              "item_name": item.item_name,
              "add_date": item.add_date,
              "description": item.description,
              "available_quantity": item.available_quantity,
              "shop_name":item.shop_name
            }, {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          return;  
        }
        axios
          .post("http://localhost:8000/items/", item)
      };
      renderShopItems = () => {
        return this.state.all_items.map(item => (
            <li 
          key={item.item_name}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
            <h1>{item.item_name}</h1>
          <span 
            className={`todo-title mr-2 ${item.item_name}`}
            title='A date.'
            >
              <h3>{item.description}</h3>
              <font size="2">Added on {item.add_date}</font>
            </span>
        </li>
      ));
    }
}
export default Item