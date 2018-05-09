const scores = require('./ryan_scores_1.json');
const times = Object.entries(scores.levels)
    .filter(
        ([key, val]) => (
            val.times.length === 0
        )
    )
    .map(
        ([key, val]) => (
            // val.times.map(r => [key,r.time])
            [key, val.times]
        )
    )
    .reduce(
        (acc, val) => acc.concat(val), []
    );
console.log(times);
