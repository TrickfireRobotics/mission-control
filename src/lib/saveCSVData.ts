export default class SaveCSVData {
  header: string[] = [];
  csvDataObjects: string[][] = [];

  constructor() {}

  setHeader(target: string[]) {
    this.header = target;
  }

  addDataEntry(dataEntry: string[]) {
    //console.log(dataEntry.toString())
    this.csvDataObjects.push(dataEntry);
  }

  saveToFile(displayName: string) {
    let csvString = '';
    csvString += this.header.toString() + '\n';

    // Fill in the values
    for (let fullEntryIndex = 0; fullEntryIndex < this.csvDataObjects.length; fullEntryIndex++) {
      //Grabs the data array entry from the list of data (csvDataObjects)
      const entryArray = this.csvDataObjects[fullEntryIndex];
      let entryString = '';

      //Builds the line
      for (let dataIndex = 0; dataIndex < entryArray.length; dataIndex++) {
        entryString += '' + entryArray[dataIndex] + ',';
      }

      entryString = entryString.substring(0, entryString.length - 1) + '\n';

      csvString += entryString;
    }

    const blob = new Blob([csvString], { type: 'text.csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    a.download =
      displayName +
      ' ' +
      (now.getHours() % 12) +
      '_' +
      ((now.getMinutes() < 10 ? '0' : '') + now.getMinutes()) +
      '_' +
      now.getSeconds() +
      '.csv';
    a.href = url;
    a.click();
  }

  _createrHeaderString() {
    const outputstr = '';
  }
}
