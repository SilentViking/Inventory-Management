import React, { Component } from "react";

import { Link, Route } from "react-router-dom";
import "./App.css";
const baseAPI = "http://localhost:8080";
const postEndPoint = baseAPI;
const dataDumpEndpoint = baseAPI + "/dump";
const removeEndPoint = baseAPI + "/remove";
const categoryEndPoint = baseAPI + "/category/"
const lame_and_old_request = require("request");

//variables for out and in inventory
//const total = data.database.length //DEJA TODO: Get this to work and calculate
const inNum = 43;
const outNum = 62;
// Function to loop getting inventory items from database

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { database: [] };
  }

  componentDidMount() {
    getDataDump().then(data => {
      this.setState(data);
    });
  }

  render() {
    return this.state.database.map(x => (
      <tbody className="w3-striped" key={x.ctrl_num}>
        <tr>
          <td>{x.ctrl_num}</td>
          <td>{x.type}</td>
          <td>{x.manufacturer}</td>
          <td>{x.model}</td>
          <td>{x.serial_num}</td>
          <td>{x.owner}</td>
          <td>{x.location}</td>
          <td>...more</td>
        </tr>
      </tbody>
    ));
  }
}

function getDataDump() {
  let r = new Request(dataDumpEndpoint, {
    method: "GET",
    mode: 'cors'
  });
  return fetch(r).then(res => res.json());
}


//Home Page Content
function Home() {
  return (
    <div className="main-body w3-container">
      <h1>Home</h1>
      <p>Welcome to MCNEL's Inventory Management System</p>
      <p>
        This system is designed to manage the inventory of items within MCNEL.
      </p>
      <p>Network Equipment includes ...</p>
      <p>Test tools includes ... </p>
      <p>Simulation Equipment includes ...</p>
      <p>POC: Deja Hansen</p>
    </div>
  );
}
//Function to create and list items from database
function Equipment() {
  return (
    <div className="main-body w3-container">
      <h1>Inventory</h1>
      <table className="w3-table w3-bordered w3-border w3-hoverable w3-white">
        <thead>
          <tr>
            <th>Control Number</th>
            <th>Type</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Description</th>
          </tr>
        </thead>
        <Inventory />
      </table>
    </div>
  );
}
//Calendar Page Content
function Calendar() {
  return (
    <div className="main-body w3-container">
      <h1>Calendar</h1>
      <div className="month">
        <ul>
          <li className="prev">&#10094;</li>
          <li className="next">&#10095;</li>
          <li>
            November<br></br>
            <span>2019</span>
          </li>
        </ul>
      </div>
      <ul className="weekdays">
        <li>Mon</li>
        <li>Tues</li>
        <li>Wed</li>
        <li>Thurs</li>
        <li>Fri</li>
        <li>Sat</li>
        <li>Sun</li>
      </ul>
      <ul className="days">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
      </ul>
    </div>
  );
}
// Function to create elements in the checkout page
function CheckOut() {
  return (
    <div className="main-body w3-container">
      <h1>CheckOut</h1>
    </div>
  );
}

function getCategories(){
  return getRecordsByCategory('')
}
class Manage extends React.Component {

  constructor(props){
    super(props)
    this.state = {categories:[]}
  }
  componentDidMount() { 
    getCategories().then(categories=>{
      this.setState(categories)
    })
  }


  render() {
    return (
      <div className="main-body w3-container">
        <h1>Manage</h1>
        <div className="add-items">
          <form id="items">
            <ul className="no-bullet w3-center">
              <li>
                <label form="type">Type: </label>
                <select name="category">
                  {this.state.categories.map(category=>{
                    return (<option value={category.key}>{category.name}</option>)
                  })}
                </select>
                <input type="text" id="type" name="type_name"></input>
              </li>
              <li>
                <label form="type">Manufacturer: </label>
                <input type="text" id="man" name="man_name"></input>
              </li>
              <li>
                <label form="type">Model: </label>
                <input type="text" id="model" name="model"></input>
              </li>
              <li>
                <label form="type">Serial Number: </label>
                <input type="text" id="serial" name="serial"></input>
              </li>
              <li>
                <label form="type">Owner: </label>
                <input type="text" id="owner" name="owner"></input>
              </li>
              <li>
                <label form="type">Location: </label>
                <input type="text" id="loc" name="location"></input>
              </li>
              <li>
                <label form="type">Description: </label>
                <input type="text" id="desc" name="desctription"></input>
              </li>
              <li>
                  <input id="checked_out" type="checkbox" name="checked_out" value="Check Out">Checked Out?</input>
              </li>
              <li className="w3-center">
                <button type="submit" onClick={submit}>
                  Add
              </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    );
  }
}

function submit() {
  var type = document.getElementById("type").value;
  var man = document.getElementById("man").value;
  var model = document.getElementById("model").value;
  var serial = document.getElementById("serial").value;
  var owner = document.getElementById("owner").value;
  var loc = document.getElementById("loc").value;
  var desc = document.getElementById("desc").value;
  var checked_out = document.getElementById("checked_out").checked;
  var newItem = {
    ctrl_num: "",
    type: type,
    manufacturer: man,
    model: model,
    serial_num: serial,
    owner: owner,
    location: loc,
    description: desc,
    checked_out: checked_out,
    check_out: " "
  };
  newItem = JSON.stringify(newItem);
  lame_and_old_request.post(postEndPoint, {
    body: newItem
  });
}

function getRecordsByCategory(category) {
  let r = new Request(categoryEndPoint + category, {
    method: "GET",
    mode: 'cors'
  })
  return fetch(r).then(res => {
    return res.json()
  })
}
class Tile extends React.Component {
  constructor() {
    super()
    this.state = { in: 0, out: 0 }
  }

  componentDidMount() {
    getRecordsByCategory(this.props.category).then(data => {
      let checkedOut = data.filter(record => record.checked_out).length
      let checkedIn = Math.abs(data.length - checkedOut)
      this.setState({ in: checkedIn, out: checkedOut })
    })
  }

  render() {
    return (<div className="w3-quarter" key={this.props.name}>
      <div className={`w3-container w3-${this.props.color} w3-padding-16 text-white`}>
        <div className="w3-left w3-half">
          <i className={`fa ${this.props.symbol} w3-xxxlarge`}></i>
        </div>
        <div className="w3-left">
          <h6>Devices IN: {this.state.in}</h6>
          <h6>Devices OUT: {this.state.out}</h6>
        </div>
        <div className="w3-clear w3-center">
          <h4>{this.props.name}</h4>
        </div>
      </div>
    </div>)
  }
}
// Fucntion for creating tiles elements

class Tiles extends React.Component {
  constructor(props){
    super(props)
    this.state = {categories:[]}
  }

  componentDidMount(){
    getCategories().then(d=>this.setState({categories:d}))
  }

  render() {
  return this.state.categories.map(x => (
    <Tile key={x.key} category={x.key} name={x.name} color={x.color} symbol={x.symbol} />
  ));
  }
}
// Main class for page contruction
class App extends Component {
  render() {
    return (
      <div>
        <div className="w3-bar w3-top w3-black w3-large">
          <span className="w3-bar-item w3-right">MCTSSA</span>
        </div>
        <nav className="w3-sidebar w3-collapse w3-light-gray" id="mySidebar">
          <br></br>
          <div className="w3-container">
            <h5>Dashboard</h5>
          </div>
          <div className="w3-bar-block">
            <Link to="/home" className="w3-bar-item w3-button w3-padding">
              <i className="fa fa-home fa-fw"></i> Home
            </Link>
            <Link to="/equipment" className="w3-bar-item w3-button w3-padding">
              <i className="fa fa-cubes fa-fw"></i> Equipment
            </Link>
            <Link to="/calendar" className="w3-bar-item w3-button w3-padding">
              <i className="fa fa-calendar fa-fw"></i> Calendar
            </Link>
            <Link to="/checkout" className="w3-bar-item w3-button w3-padding">
              <i className="fa fa-check-square fa-fw"></i> CheckOut{" "}
            </Link>
            <Link to="/manage" className="w3-bar-item w3-button w3-padding">
              <i className="fa fa-table fa-fw"></i> Manage
            </Link>
          </div>
        </nav>
        <div className="w3-main">
          <header className="w3-container">
            <h5>
              <b>MCNEL Inventory Management System</b>
            </h5>
          </header>
        </div>
        <div className="quick-look w3-row-padding w3-margin-bottom">
          <Tiles/ >
        </div>
        <hr></hr>
        <Route path="/home" component={Home} />
        <Route path="/equipment" component={Equipment} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/checkout" component={CheckOut} />
        <Route path="/manage" component={Manage} />
        <hr></hr>
        <br></br>
      </div>
    );
  }
}

export default App;
