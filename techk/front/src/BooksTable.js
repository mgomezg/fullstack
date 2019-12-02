import React, { Component } from 'react';
import './App.css';
import MUIDataTable from "mui-datatables";
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css';

import {
    CircularProgress
  } from '@material-ui/core'
import Axios from 'axios';

class BooksTable extends Component{

    render(){
        const columns = [
            {
                name: "#",
                options:{
                    filter:false,
                    viewColumns: false,
                }
            },
            {
                name: "Nombre",
                options:{
                    filter:false
                }
            },
            {
                name: "Categoria",
                options:{
                    filter:true
                }
            },
            {
                name: "Descripcion",
                options:{
                    filter:false,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <small className="book-description">{value}</small>
                    )
                }
            },
            {
                name: "Precio (£)",
                options:{
                    filter:false
                }
            },
            {
                name: "Stock",
                options:{
                    filter:false
                }
            },
            {
                name: "UPC",
                options:{
                    filter:false
                }
            },
            {
                name: "Imagen",
                options:{
                    filter:false,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <img src={value} className="book-image" alt="imagebook"/>
                    )
                }
            },
        ];

        const options = {
            filterType: 'select',
            print: false,
            download: false,
            responsive: 'scrollMaxHeight',
            viewColumns: false,
            rowsPerPageOptions: [],
            selectableRows: 'single',
            onRowsDelete: (RowsDeleted, data) => {
                const id = RowsDeleted.data.map(d => d.dataIndex);
                var item = this.props.data[id];
                var itemId = item[0];

                this.serverRequest = Axios.delete('api/books/'+itemId)
                .then(function(response){
                  if(response.data.status === 'ok'){
                    toast.notify("Se ha borrado el libro con exito!",{position: 'top-right',});
                    return true;
                }else{
                        toast.notify("Ha ocurrido un error en el servidor.",{position: 'top-right',});
                        return false;
                    }
                }).catch(function(error){
                    toast.notify("Ha ocurrido un error al intentar eliminar el libro.",{position: 'top-right',});
                    return false;
                })
            },
        };

        return (
            <div className="bgDataTable">

                {this.props.dataTableSearching && <CircularProgress size={72} className="datatable-spinner" /> }
                <MUIDataTable className="datatable-books"
                    title={"Lista de libros"}
                    data={this.props.data}
                    columns={columns}
                    options={options}
                />
            </div>
        );
    }

}
export default BooksTable;
