import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import BooksTable from './BooksTable';
import { Container, Grid } from '@material-ui/core';
import axios from 'axios'

class App extends Component {

  constructor(){
    super();
    this.updateData();
  }
  state = {
    data:[],
    scraperRunning: false,
    dataTableSearching: false,
  }
  

  handleScrap(){
    var th = this;
    th.setState({
      scraperRunning : true,
      data :[],
    });
    this.serverRequest = axios.get('/scraper')
      .then(function(response){
        if(response.data.status === 'ok'){
          console.log('OK');
        }
      }).catch(function (error) {
        console.log('error: ' + error);
      }).finally(function(){
        th.setState({scraperRunning:false})
        th.updateData();
      })
  }

  clearData(){
    this.setState({
      data : [],
    });
  }
  updateData(){
    var th = this;
    th.setState({
      dataTableSearching : true
    });
    var newdata = [];
    this.serverRequest = axios.get('/api/books/?format=json')
      .then(function(response){
        response.data.map(function(value, index){
          var item = [value.title, value.category, value.description, value.price, value.stock, value.upc, value.thumbnail];
          newdata.push(item)
        });
      }).finally(function(){
        th.setState({
          data : newdata,
          dataTableSearching: false
        });
      })
  }
  // setData={this.updateData.bind(this)}
  render(){
    return (
      <Grid container justify="center" spacing={1} className="w-100 pt-4">
        <Grid item xs={10} md={10}>
          <Home handleScrap={this.handleScrap.bind(this)} scraperRunning={this.state.scraperRunning}/>
        </Grid>
        <Grid item xs={10} md={10}>
          <BooksTable data={this.state.data} dataTableSearching={this.state.dataTableSearching}/>
        </Grid>
      </Grid>
    );
  }
  
}

export default App;