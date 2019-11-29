import React, { Component } from 'react';
import {
  Card, CardContent, Button, CircularProgress
} from '@material-ui/core'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'

import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';



class Home extends Component{
    render(){
        const spinnerStyle = makeStyles(theme => ({
            progress:{
                color: green[500],
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1,
            }
        }));

        var handleScrap = this.props.handleScrap;
        return (
              <Card className="ScraperCard">
                  <CardContent>
                    <Typography variant="h5" className="titleTypography">Pulsa el boton para comenzar a recibir datos</Typography>
                    <Button variant="contained" color="primary" onClick={handleScrap} disabled={this.props.scraperRunning}>
                        {this.props.scraperRunning && <CircularProgress size={24} className="scrapper-spinner" />}
                        
                        Scrap!
                    </Button>
                    
                    <Typography variant="subtitle2">Una vez presionado el boton, se borraran los datos existentes en la base de datos</Typography>
                  </CardContent>
                </Card>
        );
    }
}


export default Home;