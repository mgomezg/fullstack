import React, { Component } from 'react';
import {
  Card, CardContent, Button, CircularProgress
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import './App.css';



class Home extends Component{
    render(){
        return (
              <Card className="ScraperCard">
                  <CardContent>
                    {!this.props.scraperRunning && <Typography variant="h5" className="titleTypography">Pulsa el boton para comenzar a recibir datos</Typography>}
                    {this.props.scraperRunning && <Typography variant="h5" className="titleTypography">Espera mientras los datos son cargados.</Typography>}
                    <Button variant="contained" color="primary" onClick={this.props.handleScrap} disabled={this.props.scraperRunning}>
                        {this.props.scraperRunning && <CircularProgress size={24} className="scrapper-spinner" />}

                        Scrap!
                    </Button>

                    {!this.props.scraperRunning && <Typography variant="subtitle2">Una vez presionado el boton, se borraran los datos existentes en la base de datos</Typography>}
                    {this.props.scraperRunning && <Typography variant="subtitle2">Mientras que se completa el proceso, se mostrarán datos parciales cada 10 segundos.</Typography>}
                  </CardContent>
                </Card>
        );
    }
}


export default Home;
