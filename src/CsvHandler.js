import { parse } from "csv-string"


const CsvHandler = {
    
    /**
     * Returns the raw CSV content (as array of arrays) from the CSV content string.
     * @param {string} csvContent - the content of the CSV file as string
     * @returns {Array} an array of arrays containing each lines / columns of the CSV content
     */
    parseCsvFileContent(csvContent) {
        return parse(csvContent)
    },

    /**
     * Reads a CSV file and returns the content of the file as string
     * @param {Event} fileChangeEvent - the onChange event of the <input type="file">
     * @returns {Promise} a promise that resolves with the content of the selected file as string 
     * or rejects with an error, if the file cannot be read.
     */
    parseCsvFile(file) {
        const reader = new FileReader()

        return new Promise((resolve, reject) => {
            reader.onload = (() => loadEvent => {
                const csvContent = loadEvent.target.result
                resolve(this.parseCsvFileContent(csvContent))
            })(file)
            reader.onerror = (errorEvent) => {
                reject(errorEvent)
            }
            reader.readAsText(file)
        })

        
    }

}

export default CsvHandler
