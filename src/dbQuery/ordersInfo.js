const projection = { _id: true, userID: true, date: true, fileName: true, fileID: true, status: true };

function ordersInfo(db, query, options, nameMap) {
    return db
        .collection('order')
        .find(query, { projection, ...options})
        .map(({
            _id,
            userID,
            date,
            fileName,
            fileID,
            status
        }) => ({
            id: _id,
            orderedBy:  nameMap ? nameMap[userID] : userID,
            date: date.toISOString(),
            file: { name: fileName, id: fileID.toString() },
            status
        }))
        .toArray();
}

module.exports = ordersInfo;