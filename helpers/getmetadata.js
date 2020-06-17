// var convert = require('xml-js');

// exports.GetMetadata = async (data) => {
//   try {
//     // newdata=[];
//     // var obj = {}
//     // for(var row in data){
//     //   prevname=row.Entity
//     //   currentname = ''
//     //   if(prevname == currentname){
//     //     obj.Property
//     //     // if(col === 'Property'){

//     //     // }
//     //     // if(col === 'Type'){

//     //     // }
//     //     // if(col === 'Nullable'){

//     //     // }
//     //     // if(col === 'Primary_Key'){
//     //     // }
//     //   }else{

//     //   }
//     //   currentname = prevname
//     // }
//     console.log(data)
//     return await convert.json2xml(data, {compact: true, ignoreComment: true, spaces: 4})
//   } catch (err) {
//     return (result = {
//       message: "Couldn't frame metadata",
//       error: err.message
//     });
//   }
// };