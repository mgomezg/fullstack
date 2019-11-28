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
        var handleScrap = this.props.handleScrap;
        return (
        
              <Card className="ScraperCard">
                  <CardContent>
                    <Typography variant="h5" className="titleTypography">Pulsa el boton para comenzar a recibir datos</Typography>
                    <Button variant="contained" color="primary" onClick={handleScrap} disabled={this.props.scraperRunning}>
                        Scrap!
                    </Button>
                    
                    <Typography variant="subtitle2">Actualmente no hay datos</Typography>
                  </CardContent>
                </Card>
        );
    }
}


export default Home;