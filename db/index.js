import fs from "fs";

export class Database {
  constructor(filename) {
    this.filename = filename;
  };

  // Fungsi untuk membaca data dari file
  _readFromFile() {
    try {
      const data = fs.readFileSync(this.filename, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    };
  };

  // Fungsi untuk menulis data ke file
  _writeToFile(data) {
    fs.writeFileSync(this.filename, JSON.stringify(data, null, 2));
  };

  // Create
  create(data) {
    data = {
      ...data,
      clicks: 0,
      created: `${new Date().toLocaleTimeString('en-US', { timezone: 'Asia/Jakarta' })}, ${new Date().toLocaleDateString('en-US', { timezone: 'Asia/Jakarta' })}`
    };

    const currentData = this._readFromFile();
    currentData.push(data);
    this._writeToFile(currentData);

    return data;
  };

  // Read
  read(query) {
    const currentData = this._readFromFile();

    if (!query) return currentData;

    const filteredData = currentData.filter(item => Object.keys(query).every(key => item[key] === query[key]));

    if (filteredData.length === 0) return false;

    return filteredData[0];
  }

  // Update
  update(query, newData) {
    let currentData = this._readFromFile();
    currentData = currentData.map(item => {
      if (Object.keys(query).every(key => item[key] === query[key])) {
        return { ...item, ...newData };
      }
      return item;
    });
    this._writeToFile(currentData);
  };

  // Delete
  delete(query) {
    const currentData = this._readFromFile();
    const updatedData = currentData.filter(item => !Object.keys(query).every(key => item[key] === query[key]));
    this._writeToFile(updatedData);
  };
};

// const db = {
//   save: async (...model) => {
//     try {
//       let datas = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));
//       let data = {
//         ...model,
//         clicks: 0,
//         created: `${new Date().toLocaleTimeString('en-US', { timezone: 'Asia/Jakarta' })}, ${new Date().toLocaleDateString('en-US', { timezone: 'Asia/Jakarta' })}`
//       };
  
//       datas.push(data);
  
//       fs.writeFileSync('db/db.json', JSON.stringify(datas));
  
//       return data;
//     } catch (error) {
//       return { error: true, message: error.message, stack: error.stack };
//     };
//   },
//   update: async () => {

//   },
//   findURL: async (long_url) => {
//     const datas = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));

//     for (let data of datas) {
//       if (long_url == data.long_url) {
//         return { status: true, ...data };
//       } else {
//         return { status: false };
//       };
//     };
//   },
//   findID: async (id) => {
//     const datas = JSON.parse(fs.readFileSync('db/db.json', 'utf-8'));

//     for (let data of datas) {
//       if (id == data.id) {
//         return { status: true, ...data };
//       } else {
//         return { status: false };
//       };
//     };
//   },
// };

// export default db;