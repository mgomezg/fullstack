import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import BooksTable from './BooksTable';
import { Container, Grid } from '@material-ui/core';
import axios from 'axios'

class App extends Component {

  intervalID = 0;

  constructor(){
    super();
    this.updateData();
  }
  state = {
    data:[],
    scraperRunning: false,
    dataTableSearching: true,
  }
  

  handleScrap(){

    this.updateWhileSearching()
    var th = this;
    th.setState({
      scraperRunning : true,
      data :[],
    });
    
    this.serverRequest = axios.get('/scraper')
      .then(function(response){
        if(response.data.status === 'ok'){
          console.log('OK');
        }else{
          console.log('error');
        }
      }).catch(function (error) {
        console.log('error: ' + error);
      }).finally(function(){
        th.setState({scraperRunning:false})
        th.updateData();
      })
  }

  updateData(){
    var th = this;
    th.setState({
      data : [],
      dataTableSearching : true
    })
  var newdata = [];
  this.serverRequest = axios.get('/api/books/?format=json')
    .then(function(response){
      response.data.map(function(value, index){
        var item = [value.id, value.title, value.category, value.description, value.price, value.stock, value.upc, value.thumbnail];
        newdata.push(item)
      });
    }).finally(function(){
      th.setState({
        data : newdata,
        dataTableSearching: false
      });
    })
  }

  updateWhileSearching(){
    this.updateData()
    var th = this;
    this.intervalID = setInterval(function(){

      if(!th.state.scraperRunning){
        clearInterval(th.intervalID);
        return false;
      }

      th.updateData()

    },10000);
  }

  render(){
    return (
      <Grid container justify="center" spacing={1} className="w-100 pt-4">
        <Grid item xs={11} md={10}>
          <Home handleScrap={this.handleScrap.bind(this)} scraperRunning={this.state.scraperRunning}/>
        </Grid>
        <Grid item xs={11} md={10}>
          <BooksTable data={this.state.data} dataTableSearching={this.state.dataTableSearching}/>
        </Grid>
      </Grid>
    );
  }
  
}

export default App;