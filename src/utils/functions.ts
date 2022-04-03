// Clean query object to remove null or undefined values
export function cleanQuery(query: any, fields: string[] | null = null) {
    const qClone = {...query}
    Object.keys(qClone).forEach(
        (k) => {
            if (fields === null || fields.includes(k) ) {
                (qClone[k] === null || qClone[k] === undefined) && delete qClone[k]
            } else {
                delete qClone[k]
            }

        }
    )

    return qClone
}

export function setQueryValues(query: any) {
    const qClone = {...query}
    Object.keys(qClone).forEach(
        (k) => {
            if (qClone[k] === null || qClone[k] === undefined) {
                qClone[k] == "########"
            }
        }
    )
    return qClone
}