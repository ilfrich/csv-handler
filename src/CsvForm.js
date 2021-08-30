import React from "react"
import { mixins } from "quick-n-dirty-react"
import util from "quick-n-dirty-utils"
import CsvHandler from "./CsvHandler"
import CsvVisualiser from "./CsvVisualiser"


const style = {
    columns: numberOfColumns => ({
        display: "grid",
        gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
        gridColumnGap: "2px",
        marginBottom: "2px",
    }),
    value: {
        padding: "2px 4px",
        fontFamily: "monospace",
        fontSize: "11px",
    },
    numberOfRows: {
        ...mixins.listHeader,
        ...mixins.center,
        fontStyle: "italic",
        border: "0px",
        fontWeight: "400",
    },
}


class CsvForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            rawCsv: null,
            hasHeader: false,
            csvColumns: [],
            data: [],
        }

        this.onFileChange = this.onFileChange.bind(this)
        this.setHasHeader = this.setHasHeader.bind(this)
        this.setCsvColumns = this.setCsvColumns.bind(this)
    }

    onFileChange(ev) {
        const file = ev.target.files[0]
        // first reset the components data
        this.setState({ 
            rawCsv: null,
            csvColumns: [],
        }, () => {
            // then parse the data
            CsvHandler.parseCsvFile(file)
            .then(rawCsv => {
                // set raw CSV
                this.setState({ 
                    rawCsv,
                }, () => {
                    this.setCsvColumns()
                })
            })
        })
    }

    
    setCsvColumns() {
        if (this.state.rawCsv == null || !Array.isArray(this.state.rawCsv) || this.state.rawCsv.length === 0) {
            // abort condition
            return 
        }
        if (!this.state.hasHeader) {
            // has no header, so we're just using indices
            this.setState(oldState => ({ 
                ...oldState,
                csvColumns: util.range(0, oldState.rawCsv[0].length - 1),
                data: [...oldState.rawCsv],
            }))
        } else {
            this.setState(oldState => ({
                ...oldState,
                csvColumns: oldState.rawCsv[0],
                data: [...oldState.rawCsv].slice(1),
            }))
        }
    }

    setHasHeader(ev) {
        const hasHeader = ev.target.checked
        // update hasHeader state
        this.setState({ hasHeader }, () => {
            // reset CSV columns
            this.setCsvColumns()
        })
    }


    render() {
        return (
            <div>
                <label style={mixins.label}>CSV File</label>
                <div>
                    <input type="file" accept=".csv" onChange={this.onFileChange} />
                </div>

                {this.state.rawCsv != null ? (
                    <div>
                        <div style={mixins.vSpacer(8)} />
                        <div>
                            <input 
                                type="checkbox" 
                                style={mixins.checkbox} 
                                onChange={this.setHasHeader} 
                                checked={this.state.hasHeader} 
                                id="csv-form-has-header" 
                            />
                            <label htmlFor="csv-form-has-header">Has Header</label>
                        </div>
                        <div style={mixins.vSpacer(8)} />
                        {/** show columns and preview of first 5 rows */}
                        <div style={style.columns(this.state.csvColumns.length)}>
                            {this.state.csvColumns.map(col => (
                                <div key={col} style={mixins.listHeader}>{col}</div>
                            ))}
                        </div>
                        {this.state.data.length > 0 ? this.state.data.slice(0, 5).map((row, idx) => (
                            <div key={idx} style={style.columns(row.length)}>
                                {row.map((col, colIdx) => (
                                    <div key={colIdx} style={style.value}>{col}</div>
                                ))}
                            </div>
                        )) : null}
                        {this.state.data.length > 0 ? (
                            <div style={style.numberOfRows}>{this.state.data.length} rows</div>
                        ) : null}

                        {this.props.showData !== false ? <CsvVisualiser data={this.state.data} csvColumns={this.state.csvColumns} layout={this.props.layout} /> : null}
                    </div>
                ) : null}
            </div>
        )
    }
}

export default CsvForm
