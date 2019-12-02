import React, { Component } from 'react';
import './App.css';
import ScrapBar from './ScrapBar';
import BooksTable from './BooksTable';
import LogsTable from './LogsTable';
import { AppBar, Grid, Toolbar, Typography, BottomNavigation } from '@material-ui/core';
import axios from 'axios'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css';


class App extends Component {

  intervalID = 0;
  logsIntervalID = 1;
  constructor(){
    super();
    this.updateData();
    this.updateLogs();
  }
  state = {
    data:[],
    scraperRunning: false,
    dataTableSearching: true,
    snackBarOpen: false,
    snackBarClass: '.info',
    logs: [],
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
        console.log(response.data.status);
        if(response.data.status === 'ok'){
          toast.notify("Se ha completado el proceso con exito!",{position: 'top-right',});
        }else{
          toast.notify("Ha ocurrido un error en el servidor.",{position: 'top-right',});
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

  updateLogs(){
    var th = this;

    var logsData = [];
    this.serverRequest = axios.get('/api/logs/?format=json')
      .then(function(response){
        response.data.map(function(value, index){
          var item = [value.id, value.pos, value.message, value.log_type];
          logsData.push(item)
          return false;
        });
      }).finally(function(){
        th.setState({
          logs : logsData,
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

    this.logsIntervalID = setInterval(function(){

      if(!th.state.scraperRunning){
        clearInterval(th.logsIntervalID);
        th.updateLogs()
        return false;
      }

      th.updateLogs()
    }, 4000);

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
            <ScrapBar handleScrap={this.handleScrap.bind(this)} scraperRunning={this.state.scraperRunning}/>
          </Grid>
          <Grid item xs={11} md={10}>
            <BooksTable data={this.state.data} dataTableSearching={this.state.dataTableSearching}/>
          </Grid>
          <Grid item xs={11} md={10}>
            <LogsTable logs={this.state.logs} dataTableSearching={this.state.dataTableSearching}/>
          </Grid>
        </Grid>
        <BottomNavigation className="footer">
        </BottomNavigation>
      </Grid>
    );
  }

}

export default App;
