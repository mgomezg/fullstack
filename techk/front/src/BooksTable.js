import React, { Component } from 'react';
import './App.css';
import MUIDataTable from "mui-datatables";


class BooksTable extends Component{

    render(){
        const columns = [
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
                name: "Precio",
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
                        <img src={value} className="book-image"/>
                    )
                }
            },
        ];
    
        const options = {
        filterType: 'select',
        print: false,
        download: false
        };
        return ( 
            <MUIDataTable className="datatable-books"
                title={"Books List"}
                data={this.props.data}
                columns={columns}
                options={options}
                
            />
        );
    }

}
export default BooksTable;