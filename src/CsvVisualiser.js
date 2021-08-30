import React from "react"
import moment from "moment"
import Plot from "react-plotly.js"
import { mixins } from "quick-n-dirty-react"
import util from "quick-n-dirty-utils"


const style = {

    columnMapping: {
        display: "grid",
        gridTemplateColumns: "250px 150px 200px",
        gridColumnGap: "5px",
        marginBottom: "8px",
    },
    mappingLabel: {
        ...mixins.right,
        padding: "7px 5px",
    },
}


const DEFAULT_DATE_FORMAT = util.DATE_FORMAT
const DEFAULT_COLUMN_MAPPING = {
    type: "value",
    format: "int",
}
const DEFAULT_LAYOUT = {
    width: 1000,
    height: 450,
}

class CsvVisualiser extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            chartData: null,
            columnMapping: {},
        }

        
        this.setColumnFormat = this.setColumnFormat.bind(this)
        this.setColumnType = this.setColumnType.bind(this)
        this.showData = this.showData.bind(this)
    }

    setColumnFormat(column) {
        return ev => {
            const format = ev.target.value
            this.setState(oldState => {
                const { columnMapping } = oldState
                columnMapping[column] = {
                    type: ["int", "float"].includes(format) ? "value" : "datetime",
                    format,
                }
                return {
                    ...oldState,
                    columnMapping,
                }
            })
        }
    }

    setColumnType(column) {
        return ev => {
            const type = ev.target.value
            this.setState(oldState => {
                const { columnMapping } = oldState
                columnMapping[column] = {
                    type,
                    format: type === "datetime" ? DEFAULT_DATE_FORMAT : "int",
                }
                return {
                    ...oldState,
                    columnMapping,
                }
            })
        }
    }


    showData() {
        this.setState({ chartData: null }, () => {
            const x = []
            const ys = {}
            const specs = {}

            // initialise y keys
            this.props.csvColumns.forEach(col => {
                const spec = this.state.columnMapping[col] || DEFAULT_COLUMN_MAPPING
                specs[col] = spec
                if (spec.type !== "datetime") {
                    ys[col] = []
                }
            })

            // process rows
            this.props.data.forEach(row => {
                this.props.csvColumns.forEach((col, colIdx) => {
                    if (specs[col].type === "datetime") {
                        // add x time
                        x.push(moment(row[colIdx], specs[col].format)._d)
                    } else if (specs[col].format === "float") {
                        ys[col].push(parseFloat(row[colIdx]))
                    } else { 
                        // integer value
                        ys[col].push(parseInt(row[colIdx], 10))
                    }

                })
            })

            // create chart data
            const charts = []
            const chartType = x.length * Object.keys(ys).length < 30 ? "bar" : "line"

            this.props.csvColumns.forEach(col => {
                if (specs[col].type === "datetime") {
                    // skip the datetime column
                    return
                }
                charts.push({
                    x, 
                    y: ys[col],
                    type: chartType,
                    name: col,
                })
            })
            this.setState({ chartData: charts })
        })
    }

    render() {
        return (
            <div>
                <h5>Column Mapping</h5>

                <div style={style.columnMapping}>
                    <div style={mixins.listHeader}>Column</div>
                    <div style={mixins.listHeader}>Type</div>
                    <div style={mixins.listHeader}>Format</div>
                </div>
                {this.props.csvColumns.map(col => (
                    <div key={col} style={style.columnMapping}>
                        <div style={style.mappingLabel}>{col}</div>
                        <div>
                            <select style={mixins.dropdown} onChange={this.setColumnType(col)} value={this.state.columnMapping[col] ? this.state.columnMapping[col].type : "value"}>
                                <option value="datetime">Date/Time</option>
                                <option value="value">Numeric Value</option>
                            </select>
                        </div>
                        <div>
                            {this.state.columnMapping[col] != null && this.state.columnMapping[col].type === "datetime" ? (
                                <input type="text" style={mixins.textInput} value={this.state.columnMapping[col].format} onChange={this.setColumnFormat(col)} />
                            ) : (
                                <select style={mixins.dropdown} onChange={this.setColumnFormat(col)} value={this.state.columnMapping[col] ? this.state.columnMapping[col].format : "int"}>
                                    <option value="int">Integer</option>
                                    <option value="float">Decimal</option>
                                </select>
                            )}
                        </div>
                    </div>  
                ))}

                <div style={mixins.buttonLine}>
                    <button style={mixins.button} type="button" onClick={this.showData}>Show</button>
                </div>

                {this.state.chartData != null ? <Plot data={this.state.chartData} layout={{ ...this.props.layout, ...DEFAULT_LAYOUT }} /> : null}
            </div>
        )

    }
}

export default CsvVisualiser
