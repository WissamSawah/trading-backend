var stock = {
    getNewValue: function (data, newDate, yValue) {
        data.push({
            x: newDate,
            y: Math.floor(Math.random() * (yValue.max - yValue.min + 1)) + yValue.min
        })

        return data
    },
}

module.exports = stock;
