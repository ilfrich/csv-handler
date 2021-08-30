# CSV Handler

1. [Installation](#installation)
2. [Usage](#usage)
3. [API](#api)
    1. [`CsvForm`](#csvform)
    2. [`CsvVisualiser`](#csvvisualiser)
    3. [`CsvHandler`](#csvhandler)

React components for handling in-browser display of CSV data. This package is optimised for 
 time-series CSV data and supports rendering of these time series via Plotly.

The package exposes the [`CsvForm`](#csvform), which includes a file upload form and handles 
 the parsing of CSV, shows a preview of the data and allows to render the chart of CSV data.

Additionally, the package exposes a [`CsvVisualiser`](#csvvisualiser) component, which is just
 responsible for configuring the CSV columns and rendering the content.

If you just want to parse CSV, you can use the [`CsvHandler`](#csvhandler) object, which provides 
 helper functions to parse CSV files. However, if you _only_ want to parse CSV, you may want to 
 use a more lightweight library, like `csv-string` or `csv-parser`.

## Installation

```bash
npm i -S react-csv-handler
```

## Usage


```javascript
import React from "react"
import { CsvForm } from "react-csv-handler"

const MyComponent = props => (
    <div>
        <CsvForm layout={{ width: 900, height: 300 }} />
    </div>
)
```


```javascript
import React from "react"
import { CsvHandler } from "react-csv-handler"

const MyComponent = props => {

    const selectFile = ev => {
        const file = ev.target.files[0]
        CsvHandler.parseCsvFile(file)
            .then(rawCsvData => {
                // this is an array of arrays, representing the rows with their columns
            })
    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={selectFile}>
        </div>
    )
}
```

When you select a CSV file, the content will be parsed and, unless `showData` is set to `false`
 a component will be rendered that allows you to configure the value type of each column. For 
 the date/time column, a [MomentJS format](https://momentjs.com/docs/#/parsing/string-format/) 
 needs to be specified.

## API

### `CsvForm`

- `showData` - default `true` - a boolean flag indicating whether to allow rendering the CSV data via a Plotly plot.
- `layout` - default `{ width: 1000, height: 450 }` - the [layout parameter](https://plotly.com/javascript/reference/layout/) passed into the Plotly plot

### `CsvVisualiser`

- `csvColumns` - default `[]` - a list of CSV column labels in the same order as the data is  
 provided
- `data` - an array of arrays representing the rows of the CSV content. The column values can 
 still be strings, as the `CsvVisualiser` provides functions to parse column values into dates 
 and numeric values.
- `layout` - default `{ width: 1000, height: 450 }` - the [layout parameter](https://plotly.com/javascript/reference/layout/) passed into the Plotly plot

### `CsvHandler`

- `parseCsvFile(file)` - a Promise-based function that uses a `FileReader` to read the CSV file 
 and parse its content into an array of arrays.
- `parseCsvFileContent(csvContent)` - simply a wrapper for [`csv-string.parse(..)`](https://www.npmjs.com/package/csv-string)
