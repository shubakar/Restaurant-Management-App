import React, { Component } from 'react';
import {Route,Switch} from "react-router-dom";

import Home from "./Components/Users/Home";
import Menu from "./Components/Users/Menu";
import MyCart from "./Components/Users/MyCart";
import MyOrder from './Components/Users/MyOrders';
import Login from "./Components/Users/Login";
import SignUp from "./Components/Users/SignUp";

import Employee from "./Components/Employee/Employee";
import EmployeeCart from "./Components/Employee/EmployeeCart";
import EmployeeOrders from "./Components/Employee/EmployeeOrders";
import EmployeeSignUp from "./Components/Employee/EmployeeSignUp";
import EmployeeLogin from "./Components/Employee/EmployeeLogin";

import AddItemToMenu from "./Components/Admin/AddItemToMenu";
import AdminMenu from "./Components/Admin/AdminMenu";
import AdminEditMenuItem from "./Components/Admin/AdminEditMenuItem";
import AdminLogin from "./Components/Admin/AdminLogin";
import Admin from "./Components/Admin/Admin";
import AdminOrders from "./Components/Admin/AdminOrders";
import AdminUserOrders from './Components/Admin/AdminUserOrders';

import Chef from "./Components/Chef/Chef";
import ChefSignUp from "./Components/Chef/ChefSignUp";
import ChefLogin from "./Components/Chef/ChefLogin";

import './App.css';

class App extends Component {
  render(){
    return(
      <Switch>
        <Route exact path="/menu" render={(routeProps)=><Menu routeProps={routeProps}/>}/>
        <Route exact path="/myorders" render={(routeProps)=><MyOrder routeProps={routeProps}/>}/>
        <Route eatct path="/mycart" render={(routeProps)=><MyCart routeProps={routeProps}/>}/>
        <Route exact path="/" render={()=><Home />}/>
        <Route exact path="/login" render={(routeProps)=><Login routeProps={routeProps}/>}/>
        <Route exact path="/signup" render={(routeProps)=><SignUp routeProps={routeProps}/>}/>

        <Route exact path="/admin/editmenuitem/:item" render={(routeProps)=><AdminEditMenuItem routeProps={routeProps}/>}/>
        <Route exact path="/admin/additemtomenu" render={(routeProps)=><AddItemToMenu routeProps={routeProps}/>}/>
        <Route exact path="/admin/menu" render={(routeProps)=><AdminMenu routeProps={routeProps}/>}/>
        <Route exact path="/admin" render={(routeProps)=><Admin routeProps={routeProps}/>}/>
        <Route exact path="/admin/orders" render={(routeProps)=><AdminOrders routeProps={routeProps}/>}/>
        <Route exact path="/admin/orders/:user" render={(routeProps)=><AdminUserOrders routeProps={routeProps}/>}/>
        <Route exact path="/admin/login" render={(routeProps)=><AdminLogin routeProps={routeProps}/>}/>

        <Route exact path="/employee" render={(routeProps)=><Employee routeProps={routeProps}/>}/>
        <Route exact path="/employee/cart" render={(routeProps)=><EmployeeCart routeProps={routeProps}/>}/>
        <Route exact path="/employee/orders" render={(routeProps)=><EmployeeOrders routeProps={routeProps}/>}/>
        <Route exact path="/employee/signup" render={(routeProps)=><EmployeeSignUp routeProps={routeProps}/>}/>
        <Route exact path="/employee/login" render={(routeProps)=><EmployeeLogin routeProps={routeProps}/>}/>
        
        <Route exact path="/chef" render={(routeProps)=><Chef routeProps={routeProps}/>}/>
        <Route exact path="/chef/signup" render={(routeProps)=><ChefSignUp routeProps={routeProps}/>}/>
        <Route exact path="/chef/login" render={(routeProps)=><ChefLogin routeProps={routeProps}/>}/>
      </Switch>
    )
  }
}

export default App;