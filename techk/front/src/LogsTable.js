import React, { Component } from 'react';
import './App.css';
import MUIDataTable from "mui-datatables";
import 'toasted-notes/src/styles.css';

import {
    CircularProgress
  } from '@material-ui/core'

class LogsTable extends Component{

    render(){
        const columns = [
            {
                name: "#",
                options:{
                    filter:false,
                    sort:true,
                    sortDirection: 'desc',
                }
            },
            {
                name: "Posición",
                options:{
                    filter:false,
                }
            },
            {
                name: "Mensaje",
                options:{
                    filter:true,
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
            selectableRows: 'none',
        };

        return (
            <div className="bgDataTable">
                {this.props.dataTableSearching && <CircularProgress size={72} className="datatable-spinner" /> }
                        <MUIDataTable className="datatable-books"
                            title={"Logs"}
                            data={this.props.logs}
                            columns={columns}
                            options={options}
                        />
            </div>
        );
    }

}
export default LogsTable;
