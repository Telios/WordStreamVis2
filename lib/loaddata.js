const maxWidth = 2000, maxHeight = 2000, maxTop = 50;
var totalData;
let totalDataMulti = null;

function loadBlogPostData(draw, top) {
    var topics = [];
    d3.tsv(fileName, function (error, rawData) {
        if (error) throw error;
        var inputFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
        var outputFormat = d3.time.format('%b %Y');
        topics = categories;
        //Filter and take only dates in 2013

        rawData = rawData.filter(function (d) {
            var time = Date.parse(d.time);
            var startDate = inputFormat.parse('2012-12-01T00:00:00');
            var endDate = inputFormat.parse('2014-01-01T00:00:00');
            //2011 for CrooksAndLiars
            if (fileName.indexOf("Liars") >= 0) {
                startDate = inputFormat.parse('2009-12-01T00:00:00');
                endDate = inputFormat.parse('2011-01-01T00:00:00');
            } else if (fileName.indexOf("WikiNews") >= 0) {
                startDate = inputFormat.parse('2013-12-01T00:00:00');
                endDate = inputFormat.parse('2016-01-01T00:00:00');
            } else if (fileName.indexOf("Huffington") >= 0) {
                startDate = inputFormat.parse('2011-12-01T00:00:00');
                endDate = inputFormat.parse('2013-01-01T00:00:00');
            }
            return time >= startDate && time < endDate;
        });

        var data = {};
        d3.map(rawData, function (d, i) {
            var date = Date.parse(d.time);
            date = outputFormat(new Date(date));
            topics.forEach(topic => {
                if (!data[date]) data[date] = {};
                data[date][topic] = data[date][topic] ? (data[date][topic] + '|' + d[topic]) : (d[topic]);
            });
        });
        var data = d3.keys(data).map(function (date, i) {
            var words = {};
            topics.forEach(topic => {
                var raw = {};
                raw[topic] = data[date][topic].split('|');
                //Count word frequencies
                var counts = raw[topic].reduce(function (obj, word) {
                    if (!obj[word]) {
                        obj[word] = 0;
                    }
                    obj[word]++;
                    return obj;
                }, {});
                //Convert to array of objects
                words[topic] = d3.keys(counts).map(function (d) {
                    return {
                        sudden: 1,
                        text: d,
                        frequency: counts[d],
                        topic: topic,
                        id: d.replace(/[^a-zA-Z0-9]/g, '_') + "_" + topic + "_" + (i - 1)
                        //id: d.split(" ").join("_").split(".").join("_") + "_" + topic + "_" + i
                    }
                }).sort(function (a, b) {//sort the terms by frequency
                    return b.frequency - a.frequency;
                }).filter(function (d) {
                    return d.text;
                });//filter out empty words
                // words[topic] = words[topic].slice(0, Math.min(words[topic].length, 45));
            });
            return {
                date: date,
                words: words
            }
        }).sort(function (a, b) {//sort by date
            return outputFormat.parse(a.date) - outputFormat.parse(b.date);
        });
        processSudden(data);

        totalData = getTop(data, topics, maxTop).slice(1); // omit first timestep
        var resultData = getTop(JSON.parse(JSON.stringify(totalData)), topics, top);
        globalData = JSON.parse(JSON.stringify(resultData));

        // resultData = getTop(data, topics, top);
        draw(resultData);
    });
}

function loadAuthorData(draw, top) {
    var topics = categories;
    d3.tsv(fileName, function (error, rawData) {
        if (error) throw error;
        //Filter
        var startYear = 2004;
        var endYear = 2016;
        if (fileName.indexOf("Cards_Fries") >= 0 || fileName.indexOf("Cards_PC") >= 0) {
            startYear = 2005;
            endYear = 2013;
        } else if (fileName.indexOf("PopCha") >= 0) {
            startYear = 2000;
            endYear = 2016;
        } else if (fileName.indexOf("VIS") >= 0) {
            startYear = 1994;
            endYear = 2016;
        }
        rawData = rawData.filter(d => {
            return d.Year >= startYear && d.Year <= endYear;
        });
        var data = {};
        d3.map(rawData, function (d, i) {
            var year = +d["Year"];
            var topic = d["Conference"];
            if (!data[year]) data[year] = {};
            data[year][topic] = (data[year][topic]) ? ((data[year][topic]) + ";" + d["Author Names"]) : (d["Author Names"]);
        });
        var data = d3.keys(data).map(function (year, i) {
            var words = {};
            topics.forEach(topic => {
                var raw = {};
                if (!data[year][topic]) data[year][topic] = "";
                raw[topic] = data[year][topic].split(";");
                //Count word frequencies
                var counts = raw[topic].reduce(function (obj, word) {
                    if (!obj[word]) {
                        obj[word] = 0;
                    }
                    obj[word]++;
                    return obj;
                }, {});
                //Convert to array of objects
                words[topic] = d3.keys(counts).map(function (d) {
                    return {
                        sudden: 1,
                        text: d,
                        frequency: counts[d],
                        topic: topic,
                        id: d.replace(/[^a-zA-Z0-9]/g, '_') + "_" + topic + "_" + i
                    }
                }).sort(function (a, b) {//sort the terms by frequency
                    return b.frequency - a.frequency;
                }).filter(function (d) {
                    return d.text;
                })//filter out empty words

            });
            return {
                date: year,
                words: words
            }
        }).sort(function (a, b) {//sort by date
            return a.date - b.date;
        });
        processSudden(data);

        totalData = getTop(data, topics, maxTop).slice(1); // omit first timestep
        var resultData = getTop(JSON.parse(JSON.stringify(totalData)), topics, top);
        globalData = JSON.parse(JSON.stringify(resultData));
        draw(resultData);
    });
}

function loadQuantumComputing(draw, top) {
    d3.json("data/quantum.json", function (error, data) {
        console.log(data);
        const topics = categories;
        data.forEach((d, i) => {
            topics.forEach(topic => {
                d["words"][topic].forEach(word => {
                    word.id = word.text.replace(/[^a-zA-Z0-9]/g, '_') + "_" + word.topic + "_" + i;
                })
            })
        });

        totalData = getTop(data, topics, maxTop); // omit first timestep
        var resultData = getTop(JSON.parse(JSON.stringify(totalData)), topics, top);
        globalData = JSON.parse(JSON.stringify(resultData));
        draw(resultData);
    });

}

function getTop(data, topics, top) {
    data.forEach((d) => {
        topics.forEach((topic) => {
            d["words"][topic] = d["words"][topic]
                .slice(0, top);
            d["words"][topic].sort(function (a, b) {//sort the terms by frequency
                return b.sudden - a.sudden
            })
        })
    });
    return data;
}

function processSudden(data) {
    const subjects = Object.keys(data[0].words);
    subjects.forEach(topic => {
        for (let j = 1; j < data.length; j++) {
            data[j]["words"][topic] = data[j]["words"][topic].map(word => {
                let prev = 0;
                if (data[j - 1]["words"][topic].find(d => d.text === word.text)) {
                    prev = data[j - 1]["words"][topic].find(d => d.text === word.text).frequency;
                }
                return {...word, sudden: (word.frequency + 1) / (prev + 1)};
            });
        }
    });
    return data;
}

function replaceText(text) {
    return text.replace(/[^a-zA-Z0-9]/g, '_');
}

function tfidf(data) {
    var topics = d3.keys(data[0]["words"]);
    // get total frequency for each month -> tf
    var docFreq = [];
    var bags = [];
    data.forEach((month, i) => {
        docFreq[i] = 0;
        bags[i] = [];
        var words = month["words"];
        topics.forEach(topic => {
            words[topic].forEach((d) => {
                docFreq[i] += d["frequency"];
                bags[i].push(d["text"]);
            })
        })
    });

    // idf
    const N = data.length;
    var text;
    data.forEach((month, i) => {
        var words = month["words"];
        topics.forEach(topic => {
            words[topic].forEach((d) => {
                text = d["text"];
                var df = 0;
                // calculate df in bags
                bags.forEach((bag) => {
                    for (var word in bag) {
                        if (bag[word] == text) {
                            df += 1;
                            break;
                        }
                    }
                });

                var tf = d["frequency"] / docFreq[i];
                var idf = Math.log10(N / df);
                d.tf_idf = tf * idf;
            })
        })
    });
    return data;
}

function getUniqueValues(array) {
    return [...new Set(array)];
}

function orderByObjectFieldOrder(array) {
    return Object.keys(Object.fromEntries(array.map(value => [value, ""])));
}

function calculateSuddenAttentionMeasure(word, timestep, category, dataset) {
    const timesteps = dataset.getTimestepsInOrder();
    const thisFrequency = word.frequency;
    const thisTimestepIndex = timesteps.findIndex(t => t === timestep);

    if (thisTimestepIndex === 0) {
        return 1;
    } else {
        const lastTimestepIndex = thisTimestepIndex - 1;
        const lastWord = dataset.getEntriesFor(timesteps[lastTimestepIndex], word.topic).get(word.text);
        const lastFrequency = lastWord === undefined ? 0 : lastWord.frequency;
        return (thisFrequency + 1) / (lastFrequency + 1);
    }
}

function compareSuddenAttentionMeasure(word1, word2) {
    return word2.sudden - word1.sudden;
}

class Dataset {

    entryMap;
    generatorUsed;

    constructor(entryMap, generatorUsed) {
        this.entryMap = entryMap;
        this.generatorUsed = generatorUsed;
    }

    calculateMetric(metricFunction, fieldName) {
        const newTimestepMapEntries = Array.from(this.entryMap.entries()).map(timestepMapEntry => {
            const timestep = timestepMapEntry[0];
            const categoryMap = timestepMapEntry[1];

            const newCategoryMapEntries = Array.from(categoryMap.entries()).map(categoryMapEntry => {
                const category = categoryMapEntry[0];
                const wordMap = categoryMapEntry[1];

                const newWordMapEntries = Array.from(wordMap.entries()).map(word => {
                    return [
                        word[0],
                        {
                            ...word[1],
                            [fieldName]: metricFunction(word[1], timestep, category, this)
                        }
                    ]
                });
                return [category, new Map(newWordMapEntries)];
            });

            return [timestep, new Map(newCategoryMapEntries)];
        });
        return new Dataset(new Map(newTimestepMapEntries), this.generatorUsed);
    }

    filterTop(numTopWords, compareFunc) {
        const newTimestepMapEntries = Array.from(this.entryMap.entries()).map(timestepMapEntry => {
            const timestep = timestepMapEntry[0];
            const categoryMap = timestepMapEntry[1];

            const newCategoryMapEntries = Array.from(categoryMap.entries()).map(categoryMapEntry => {
                const category = categoryMapEntry[0];
                const wordMap = categoryMapEntry[1];

                const newWordMapEntries = Array.from(wordMap.entries())
                    .sort((wordEntry1, wordEntry2) => compareFunc(wordEntry1[1], wordEntry2[1]))
                    .slice(0, numTopWords);
                return [category, new Map(newWordMapEntries)];
            });

            return [timestep, new Map(newCategoryMapEntries)];
        });
        return new Dataset(new Map(newTimestepMapEntries), this.generatorUsed);
    }

    getTopWordPerTimestep(compareFunc) {
        const bestPerTimestepAndCategoryDataset = this.filterTop(1, compareFunc);
        return Object.fromEntries(Array.from(bestPerTimestepAndCategoryDataset.entryMap.entries())
            .map(timestepEntry => {
                return [
                    timestepEntry[0],
                    [].concat(...Array.from(timestepEntry[1].values()).map(wordMap => Array.from(wordMap.values())))
                        .sort(compareFunc)[0]
                ];
            }));
    }

    getEntriesFor(timestep, category) {
        return this.entryMap.get(timestep).get(category);
    }

    getTimestepsInOrder() {
        return Array.from(this.entryMap.keys());
    }

    getCategories() {
        // requires at least one timestep
        return Array.from(this.entryMap.values().next().value.keys());
    }

    getInWordstreamFormat() {

        const getWordList = (wordMap) => Array.from(wordMap.values());
        const getCategoryObject = (categoryMap) => {
            return Object.fromEntries(
                Array.from(categoryMap.entries()).map(entry => [entry[0], getWordList(entry[1])]));
        }
        const getTimestepList = (timestepMap) => {
            return Array.from(timestepMap.entries())
                .sort((entry1, entry2) => entry1[0] - entry2[0])
                .map(entry => {
                    return {
                        date: entry[0],
                        words: getCategoryObject(entry[1])
                    };
                });
        }

        return getTimestepList(this.entryMap);
    }
}

class DatasetGenerator {
    timestepAccessor; // timestep accessor function
    categoryAccessor; // category accessor function
    textAccessor; //text accessor function
    frequencyAccessor; // frequency accessor function
    idAccessor = (record) => { //id accessor function (with default)
        return this.textAccessor(record).toLowerCase().replace("-", "_").replace(" ", "_")
            + "_" + this.timestepAccessor(record);
    };

    mapRecord(record) {
        return {
            timestep: this.timestepAccessor(record),
            topic: this.categoryAccessor(record),
            text: this.textAccessor(record),
            frequency: this.frequencyAccessor(record),
            id: this.idAccessor(record)
        }
    }

    timestep(timestepAccessor) {
        this.timestepAccessor = timestepAccessor;
        return this;
    }

    category(categoryAccessor) {
        this.categoryAccessor = categoryAccessor;
        return this;
    }

    text(textAccessor) {
        this.textAccessor = textAccessor;
        return this;
    }

    frequency(frequencyAccessor) {
        this.frequencyAccessor = frequencyAccessor;
        return this;
    }

    id(idAccessor) {
        this.idAccessor = idAccessor;
        return this;
    }

    processListOfRecords(records) {
        const timesteps = getUniqueValues(records.map(record => this.timestepAccessor(record)));
        const categories = getUniqueValues(records.map(record => this.categoryAccessor(record)));

        let timestepMap = new Map();
        timesteps.forEach(timestep => {
            let categoryMap = new Map();
            categories.forEach(category => categoryMap.set(category, new Map()));
            timestepMap.set(timestep, categoryMap);
        });

        records.forEach(record => {
            let mappedRecord = this.mapRecord(record);

            const timestep = this.timestepAccessor(record);
            const category = mappedRecord.topic;
            const categoryMap = timestepMap.get(timestep);
            const wordMap = categoryMap.get(category);

            let existingWord = wordMap.get(mappedRecord.text);
            if (existingWord === undefined) {
                // word is new, add
                wordMap.set(mappedRecord.text, mappedRecord);
            } else {
                // word already exists not
                existingWord.frequency += mappedRecord.frequency;
            }
        });

        return new Dataset(timestepMap, this);
    }

    static create() {
        return new DatasetGenerator();
    }
}

function loadDatasetsForStates(rawData, selectedCountries, datasetGen, stateAccessor) {

    const states = getUniqueValues(rawData.map(entry => stateAccessor(entry)));

    /*const selectedCountriesAllowed = selectedCountries
        .map(country => (states.includes(country)) || (country === "_overall"))
        .reduce((includes1, includes2) => includes1 && includes2);
    if (!selectedCountriesAllowed) {
        throw new Error("cannot WordStream for some selected countries: " + selectedCountries);
    }*/

    let countriesWithData = selectedCountries
        .filter(countryName => (countryName === "_overall") || states.includes(countryName));
    console.log("selected countries: ", selectedCountries, "; showing only available datasets: ", countriesWithData);
    if (countriesWithData.length === 0) {
        console.log("none of the selected are available! showing _overall");
        countriesWithData.push("_overall");
    }

    return Object.fromEntries(countriesWithData
        .map(countryName => {
            return (countryName === "_overall")
                ? [countryName, rawData]
                : [countryName, rawData.filter(record => stateAccessor(record) === countryName)];
        })
        .map(entry => {
            const dataset = datasetGen
                .processListOfRecords(entry[1])
                .calculateMetric(calculateSuddenAttentionMeasure, "sudden");
            return [entry[0], dataset];
        }));
}

function getFilterFunc(datasetName = undefined) {
    if (datasetName === undefined) {
        datasetName = fileName;
    }
    const filterFuncs = {
        "Basketball": entry => entry.date < 2023,
        "UCD": entry => entry.date < 2021,
        "UCD (short)": entry => entry.date < 2020,
        "NNDSS": entry => entry.date < 2021,
        "NNDSS (short)": entry => entry.date < 2020,
    };
    return filterFuncs[datasetName];
}

function getDatasetGenerator(datasetName = undefined) {
    if (datasetName === undefined) {
        datasetName = fileName;
    }
    const datasetGenerators = {
        "Basketball": DatasetGenerator.create()
            .timestep(record => record["season_id"])
            .category(record => record["position"])
            .text(record => record["full_name"])
            .frequency(record => parseInt(record["count"])),
        "UCD": DatasetGenerator.create()
            .timestep(record => record["Year Code"])
            .category(record => REMAPPING_UCD[record["ICD-10 113 Cause List Code"]].category)
            .text(record => REMAPPING_UCD[record["ICD-10 113 Cause List Code"]].name)
            .frequency(record => parseInt(record["Deaths"])),
        "NNDSS": DatasetGenerator.create()
            .timestep(record => record["Year Code"])
            .category(record => REMAPPING_NNDSS[record["Disease Code"]].category)
            .text(record => REMAPPING_NNDSS[record["Disease Code"]].name)
            .frequency(record => parseInt(record["Case Count"]))
    };
    datasetGenerators["UCD (short)"] = datasetGenerators["UCD"];
    datasetGenerators["NNDSS (short)"] = datasetGenerators["NNDSS"];
    return datasetGenerators[datasetName];
}

function getStateAccessor(datasetName = undefined) {
    if (datasetName === undefined) {
        datasetName = fileName;
    }
    const stateAccessors = {
        "Basketball": (record) => record["state"],
        "UCD": (record) => record["State"],
        "NNDSS": (record) => record["States"],
    };
    stateAccessors["UCD (short)"] = stateAccessors["UCD"];
    stateAccessors["NNDSS (short)"] = stateAccessors["NNDSS"];
    return stateAccessors[datasetName];
}

function updateAndDraw(draw, numTopWords, filterFunc = getFilterFunc()) {
    const dataInWordStreamFormatPerCountry = Object.entries(totalDataMulti)
        .map(entry => [entry[0], entry[1].filterTop(numTopWords, compareSuddenAttentionMeasure)])
        .map(entry => [entry[0], entry[1].getInWordstreamFormat()]);

    let finalData = dataInWordStreamFormatPerCountry;
    if (filterFunc !== undefined) {
        finalData = dataInWordStreamFormatPerCountry
            .map(stateEntry =>
                [stateEntry[0], stateEntry[1].filter(entry => filterFunc(entry))]);
    }

    draw(Object.fromEntries(finalData), true);
}

function loadBasketballDataset(draw, numTopWords, selectedCountries) {
    const path = "data/basketball.json";
    d3.json(path, (error, data) => {
        if (error) {
            throw new Error("failed to retrieve basketball data from server" + error);
        }
        console.log("loaded basketball dataset", data);

        const rawData = data["per_state_counts"];

        const datasetGen = getDatasetGenerator();
        categories = getUniqueValues(rawData.map(datasetGen.categoryAccessor)).sort();
        totalDataMulti = loadDatasetsForStates(rawData, selectedCountries, datasetGen, getStateAccessor());

        updateAndDraw(draw, numTopWords);
    });
}


function loadUnderlyingCausesOfDeathDataset(draw, numTopWords, selectedCountries) {
    const path = "data/UCD_1999_2020.txt";
    d3.tsv(path, function (error, rawData) {
        console.log("loaded raw UCD data", rawData);

        const datasetGen = getDatasetGenerator();
        //categories = getUniqueValues(Object.values(REMAPPING_UCD).map(entry => entry.category));

        categories = getUniqueValues(rawData.map(record => datasetGen.categoryAccessor(record))).sort();
        totalDataMulti = loadDatasetsForStates(rawData, selectedCountries, datasetGen, getStateAccessor());

        updateAndDraw(draw, numTopWords);
    });
}

function loadDiseasesDataset(draw, numTopWords, selectedCountries) {
    const path = "data/nndss_2016_2020_clean.txt";
    d3.tsv(path, function (error, rawData) {
        console.log("loaded raw NNDSS data", rawData);

        const datasetGen = getDatasetGenerator();
        //categories = getUniqueValues(Object.values(REMAPPING_NNDSS).map(entry => entry.category));
        categories = getUniqueValues(rawData.map(record => datasetGen.categoryAccessor(record))).sort();
        totalDataMulti = loadDatasetsForStates(rawData, selectedCountries, datasetGen, getStateAccessor());

        updateAndDraw(draw, numTopWords);
    });
}


function getTotalFrequencyPerYearAndCategory(dataInWordStreamFormat) {
    return dataInWordStreamFormat
        .map(timestepEntry => timestepEntry.words)
        .map(catEntry => Object.entries(catEntry)
            .map(wordEntry => [wordEntry[0], wordEntry[1].reduce((acc, w) => acc + w.frequency, 0)]))
        .map(entries => Object.fromEntries(entries));
}