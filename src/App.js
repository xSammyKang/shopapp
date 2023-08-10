import React, { Component } from "react"
import ShopModal from "./components/Modal"; 
import ItemsModal from "./components/ItemsModal";
import RegisterModal from "./components/RegisterModal";
import LoginModal from "./components/LoginModal";
import axios from "axios";
import './App.css'

class Shop extends Component {
    constructor(props){
        super(props);
        this.state = {
            current_user: "",
            user_id: "",
            user_token: "",
            user_inventory: [],
            current_shop: {
                shop_name: "",
                est_date: "",
                description: "",
                shop_items: [],
            },
            user: {
                username: "",
                password: "",
                password2: "",
                email: "",
                first_name: "",
                last_name: "",
            },
            all_shops: [],
            modal_states: {}
        };
    }

    async componentDidMount() {
        try {
            const res = await fetch('http://localhost:8000/shops/', {
                mode: 'cors'            
            });
            const shop_state = await res.json();
            this.setState({
                all_shops: shop_state.results,
                user_token: localStorage.getItem("user_token"),
                current_user: localStorage.getItem("current_user"),
                user_id: localStorage.getItem("user_id"),
                user_inventory: JSON.parse(localStorage.getItem("user_inventory"))
            })
            for (let i = 0; i < this.state.all_shops.length; i++){
              this.setState({modal_states: {...this.state.modal_states, [this.state.all_shops[i]]:false}});
            }
          } catch (e) {
            console.log(e)
        }
    }
    createShop = () => {
      let date = new Date();
      const shop = {shop_name: "", est_date: date.toJSON(), description: ""};
      this.setState({current_shop: shop, modal: !this.state.modal});
    }

    regUser = () => {
      this.setState({user: {username: "", password: "", password2: "", email: "", first_name: "", last_name: ""}, reg_modal: !this.state.reg_modal});
    }

    toggle = () => {
      this.setState({ modal: !this.state.modal });
    };

    item_toggle = shop_name => {
      this.setState({ modal_states: {...this.state.modal_states, [shop_name]:!this.state.modal_states[shop_name]} });
    }

    reg_toggle = () => {
      this.setState({ reg_modal: !this.state.reg_modal});
    }

    login_toggle = () => {
      this.setState({ login_modal: !this.state.login_modal });
    }

    handleBuy = curr_state => {
      console.log(`item id ${curr_state.selected_item_id}, item name ${curr_state.item_name}, quant ${curr_state.selected_quantity}, username ${this.state.user_id}`)
      this.item_toggle(curr_state.shop_name);
      if (this.state.current_user) {
        axios
          .put(`http://localhost:8000/buy/${curr_state.selected_item_id}/`, {
            "id":curr_state.selected_item_id,
            "item_name": curr_state.selected_item_name,
            "available_quantity":curr_state.selected_quantity,
          }, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${this.state.user_token}`
            }
          })
          .then(() => {
            axios
              .get(`http://localhost:8000/shops/`)
              .then(response => {
                this.setState({all_shops:response.data.results})
              })
          })
          .then(() => this.updatePage())
      }
    }
    updatePage = () => {
      axios
        .get(`http://localhost:8000/users/${this.state.user_id}`)
        .then(response => {
          localStorage.setItem("user_inventory", JSON.stringify(response.data.inventory))
          this.setState({user_inventory:response.data.inventory})
        })
    }

    handleLoginSubmit = async user => {
      this.login_toggle();
      
      if (user.username) {
        await axios
          .post(`http://localhost:8000/token/login/`, {
            "username": user.username,
            "password": user.password
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then( response => 
          {
            localStorage.setItem("user_token", response.data.auth_token)
            this.setState({user_token: response.data.auth_token})
            axios
              .get(`http://localhost:8000/auth/users/me/`, {
                headers: {
                  "Authorization": `Token ${response.data.auth_token}`
                }
              })
              .then( response => {
                localStorage.setItem("current_user", response.data.username)
                localStorage.setItem("user_id", response.data.id)
                this.setState({current_user: response.data.username, user_id: response.data.id}, () => {console.log(this.state.current_user)})
                axios
                  .get(`http://localhost:8000/users/${response.data.id}`)
                  .then(async response => {
                    localStorage.setItem("user_inventory", JSON.stringify(response.data.inventory))
                    this.setState({user_inventory:response.data.inventory})
                  })
        })
          });
        
        return;
      
      }
      axios
        .post("http://localhost:8000/token/login/", user)
    };

    handleLogout = () => {
      axios
        .post("http://localhost:8000/token/logout/", this.state.user_token, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.state.user_token}`
          }
        })
        .then(() => {
          localStorage.removeItem("user_token")
          localStorage.removeItem("current_user")
          localStorage.removeItem("user_inventory")
          localStorage.removeItem("user_id")
          this.setState({
            current_user: "",
            user_id: "",
            user_token: "",
            user_inventory: []
          })
        })
      }
    
    handleSubmit = shop => {
      this.toggle();
      if (shop.shop_name) {
        axios
          .post(`http://localhost:8000/shops/`, {
            "shop_name": shop.shop_name,
            "est_date": shop.est_date,
            "description": shop.description
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        return;  
      }
      axios
        .post("http://localhost:8000/shops/", shop)
    };

    handleRegSubmit = user => {
      this.reg_toggle();
      if (user.username) {
        axios
          .post(`http://localhost:8000/register/`, {
            "username": user.username,
            "password": user.password,
            "password2": user.password2,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        return;  
      }
      axios
        .post("http://localhost:8000/register/", user)
    };

    renderShops = () => {
        return this.state.all_shops.map(shop => {
          return (
            <div className = "rowflexbox">
            <li 
            key={shop.shop_name}
            className="list-group-item d-flex justify-content-between align-items-center"
            >
              <h1 className="shop-name-list">{shop.shop_name}</h1>
            </li>
            <span 
                className={"shop_desc"}
                title='Description'
                >
                  <h6>{shop.description}</h6>
                  <font size="2" style={{fontStyle: "italic"}}>Est. {shop.est_date.substr(0, 10)}</font>
            </span>
            <div className="shop-buttons">
            <button onClick={(() => this.setState({modal_states: {...this.state.modal_states, [shop.shop_name]:!this.state.modal_states[shop.shop_name]} }))} 
                className ="shop-items-btn">{shop.shop_name} Items</button>
              <font size="2">{this.state.modal_states[shop.shop_name] ? (
              <ItemsModal
                toggle={(() => this.setState({modal_states: {...this.state.modal_states, [shop.shop_name]:!this.state.modal_states[shop.shop_name]} }))}
                onSave={this.handleBuy}
                shop_name= {shop.shop_name}
                all_items= {shop.shop_items}
              />) : null}</font>
            </div>
            </div>
      )
    }
    );
    }

    render() {
      const display_inventory = []
      if (this.state.user_inventory){
        for (let i = 0; i < this.state.user_inventory.length; i++){
          let item = this.state.user_inventory[i]
          display_inventory.push(<span className="inventory-box p-3">{item.user_quantity} {item.item_name}</span>)
        }
      }
      return (
        <main className="content">
        <h1 className="content-part-2 text-black text-uppercase text-center my-4">Shops</h1>
        <div className="guest-welcome">Welcome, {this.state.current_user ? this.state.current_user : "Guest"}</div>
        <div className="sidebar">
                <img src={require("./shop_icon.png")} alt="Shop Logo" className="logo"/>
                {/*<button onClick={this.createShop} className="add-shop-btn">Add Shop</button>*/}
                {this.state.current_user ? null : <button onClick={this.login_toggle} className="login-btn">Login</button>}
                {this.state.current_user ? null : <button onClick={this.regUser} className="reg-btn">Register</button>}
                {this.state.current_user ? <button onClick = {this.handleLogout} className="logout-btn">Logout</button> : null}
              </div>
        <div className="row">
          <div className="inner-row col-md-6 col-lg-10 mx-auto p-0">
            <div className="card p-3 ">
              <ul className="list-group list-group-flush">
                {this.renderShops()}
              </ul>
            </div>
            {this.state.current_user ? <div className="inventory-label text-black text-uppercase text-center my-4">Inventory</div> : null}
            {this.state.current_user ? <div className="display-inventory-row p-3">{display_inventory}</div> : null}
          </div>
        </div>
        {this.state.modal ? (
          <ShopModal
            current_shop={this.state.current_shop}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ): null}
        {this.state.reg_modal ? (
          <RegisterModal
            username = {this.state.user.username}
            password = {this.state.user.password}
            password2 = {this.state.user.password2}
            email = {this.state.user.email}
            first_name = {this.state.user.first_name}
            last_name = {this.state.user.last_name}
            toggle={this.reg_toggle}
            onSave={this.handleRegSubmit}
          />
        ): null}
        {this.state.login_modal ? (
          <LoginModal
            username = {this.state.user.username}
            password = {this.state.user.password}
            toggle={this.login_toggle}
            onSave={this.handleLoginSubmit}
          />
        ): null}
      </main>
      )
    }
}
export default Shop;