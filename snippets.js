const scores = require('./ryan_scores_3.json');
const times = Object.entries(scores.levels)
    .filter(
        ([key, val]) => (
            val.times.length > 0
        )
    )
    .map(
        ([key, val]) => (
            // val.times[0].time
            [key, ...val.times.map(r => r.time)]
            // [key, val.times]
        )
    )
    // .reduce(
    //     (acc, val) => acc.concat(val),
    //     []
    // );
console.log(times);
