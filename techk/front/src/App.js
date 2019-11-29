import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import BooksTable from './BooksTable';
import { AppBar, Grid, Toolbar, Typography, Snackbar, SnackbarContent } from '@material-ui/core';
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
    snackBarOpen: false,
    snackBarClass: '.info',
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
          th.createSnackBar('Se ha completado el proceso con éxito!','success');
        }else{
          th.createSnackBar('Ha ocurrido un error en el servidor al realizar el proceso!','danger');
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
    this.setState({
      data : [],
      dataTableSearching : true
    })
  var newdata = [];
  this.serverRequest = axios.get('/api/books/?format=json')
    .then(function(response){
      response.data.map(function(value, index){
        var item = [value.id, value.title, value.category, value.description, value.price, value.stock, value.upc, value.thumbnail];
        newdata.push(item)
        return false;
      });
    }).finally(function(){
      th.setState({
        data : newdata,
        dataTableSearching: false
      });
    })
  }

  updateWhileSearching(){
    var th = this;
    this.intervalID = setInterval(function(){

      if(!th.state.scraperRunning){
        clearInterval(th.intervalID);
        return false;
      }

      th.updateData()

    },10000);
  }

  createSnackBar(snackBarMessage, snackBarClass){
    this.setState({
      snackBarOpen: true,
      snackBarClass: snackBarClass,
      snackBarMessage: snackBarMessage, 
    });
  }
  
  closeSnackBar(){
    this.setState({ open: false });
  }

  render(){
    return (
      <Grid>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              Scraper!
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" spacing={1} className="w-100 pt-4">
          <Grid item xs={11} md={10}>
            <Home handleScrap={this.handleScrap.bind(this)} scraperRunning={this.state.scraperRunning}/>
          </Grid>
          <Grid item xs={11} md={10}>
            <BooksTable data={this.state.data} dataTableSearching={this.state.dataTableSearching}/>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.snackBarOpen}
          onClose={this.closeSnackBar}
        >
          <SnackbarContent
            className={this.state.snackBarClass}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
          />
        </Snackbar>
      </Grid>
    );
  }
  
}

export default App;