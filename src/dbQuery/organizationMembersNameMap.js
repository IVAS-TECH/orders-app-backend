function organizationMembersNameMap(db, organizationID) {
    const userCollection = db.collection('user');
    const query = { organizationID };
    const options = {
        projection: { _id: true, name: true },
        batchSize: 100
    };
    return new Promise((resolve, reject) => {
        const nameMap = { };
        try {
            const error = false;
            userCollection.find(query, options).each((err, found) => {
                if(err) {
                    error = true;
                    reject(err);
                } else if(!error) {
                    if(!found) {
                        resolve(nameMap);
                    } else {
                        nameMap[found._id] = found.name;
                    }
                }
            });
        } catch(error) {
            reject(error);
        }
    });
}

module.exports = organizationMembersNameMap;