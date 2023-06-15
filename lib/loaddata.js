const maxWidth = 2000, maxHeight = 2000, maxTop = 50;
var totalData;
function loadBlogPostData(draw, top){
    var topics = [];
    d3.tsv(fileName, function(error, rawData) {
        if (error) throw error;
        var inputFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
        var outputFormat = d3.time.format('%b %Y');
        topics = categories;
        //Filter and take only dates in 2013

        rawData = rawData.filter(function(d){
            var time = Date.parse(d.time);
            var startDate =  inputFormat.parse('2012-12-01T00:00:00');
            var endDate = inputFormat.parse('2014-01-01T00:00:00');
            //2011 for CrooksAndLiars
            if(fileName.indexOf("Liars")>=0){
                startDate = inputFormat.parse('2009-12-01T00:00:00');
                endDate = inputFormat.parse('2011-01-01T00:00:00');
            }
            else if(fileName.indexOf("WikiNews")>=0){
                startDate = inputFormat.parse('2013-12-01T00:00:00');
                endDate = inputFormat.parse('2016-01-01T00:00:00');
            }
            else if(fileName.indexOf("Huffington")>=0){
                startDate = inputFormat.parse('2011-12-01T00:00:00');
                endDate = inputFormat.parse('2013-01-01T00:00:00');
            }
            return      time  >= startDate && time < endDate;
        });

        var data = {};
        d3.map(rawData, function(d, i){
            var date = Date.parse(d.time);
            date = outputFormat(new Date(date));
            topics.forEach(topic => {
                if(!data[date]) data[date] = {};
                data[date][topic] = data[date][topic] ? (data[date][topic] + '|' +d[topic]): (d[topic]);
            });
        });
        var data = d3.keys(data).map(function(date, i){
            var words = {};
            topics.forEach(topic => {
                var raw = {};
                raw[topic] = data[date][topic].split('|');
                //Count word frequencies
                var counts = raw[topic].reduce(function(obj, word){
                    if(!obj[word]){
                        obj[word] = 0;
                    }
                    obj[word]++;
                    return obj;
                }, {});
                //Convert to array of objects
                words[topic] = d3.keys(counts).map(function(d){
                    return{
                        sudden: 1,
                        text: d,
                        frequency: counts[d],
                        topic: topic,
                        id: d.replace(/[^a-zA-Z0-9]/g,'_') + "_" + topic + "_" + (i-1)
                        //id: d.split(" ").join("_").split(".").join("_") + "_" + topic + "_" + i
                    }
                }).sort(function(a, b){//sort the terms by frequency
                    return b.frequency-a.frequency;
                }).filter(function(d){return d.text; });//filter out empty words
                // words[topic] = words[topic].slice(0, Math.min(words[topic].length, 45));
            });
            return {
                date: date,
                words: words
            }
        }).sort(function(a, b){//sort by date
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
function loadAuthorData(draw, top){
    var topics = categories;
    d3.tsv(fileName, function(error, rawData) {
        if (error) throw error;
        //Filter
        var startYear = 2004;
        var endYear = 2016;
        if(fileName.indexOf("Cards_Fries")>=0 || fileName.indexOf("Cards_PC")>=0){
            startYear = 2005;
            endYear = 2013;
        }
        else if(fileName.indexOf("PopCha")>=0){
            startYear = 2000;
            endYear = 2016;
        }
        else if(fileName.indexOf("VIS")>=0){
            startYear = 1994;
            endYear = 2016;
        }
        rawData = rawData.filter(d=>{
            return d.Year >= startYear && d.Year <= endYear;
        });
        var data={};
        d3.map(rawData, function(d, i){
            var year = +d["Year"];
            var topic = d["Conference"];
            if(!data[year]) data[year] = {};
            data[year][topic] = (data[year][topic]) ? ((data[year][topic])+";" + d["Author Names"]): (d["Author Names"]);
        });
        var data = d3.keys(data).map(function(year, i){
            var words = {};
            topics.forEach(topic => {
                var raw = {};
                if(!data[year][topic]) data[year][topic] = "";
                raw[topic] = data[year][topic].split(";");
                //Count word frequencies
                var counts = raw[topic].reduce(function(obj, word){
                    if(!obj[word]){
                        obj[word] = 0;
                    }
                    obj[word]++;
                    return obj;
                }, {});
                //Convert to array of objects
                words[topic] = d3.keys(counts).map(function(d){
                    return{
                        sudden: 1,
                        text: d,
                        frequency: counts[d],
                        topic: topic,
                        id: d.replace(/[^a-zA-Z0-9]/g,'_') + "_" + topic + "_" + i
                    }
                }).sort(function(a, b){//sort the terms by frequency
                    return b.frequency-a.frequency;
                }).filter(function(d){return d.text; })//filter out empty words

            });
            return {
                date: year,
                words: words
            }
        }).sort(function(a, b){//sort by date
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
        data.forEach((d,i) => {
            topics.forEach(topic => {
                d["words"][topic].forEach(word => {
                    word.id = word.text.replace(/[^a-zA-Z0-9]/g,'_') + "_" + word.topic + "_" + i;
                })
            })
        });

        totalData = getTop(data, topics, maxTop); // omit first timestep
        var resultData = getTop(JSON.parse(JSON.stringify(totalData)), topics, top);
        globalData = JSON.parse(JSON.stringify(resultData));
        draw(resultData);
    });

}

function getTop(data, topics, top){
    data.forEach((d) => {
        topics.forEach((topic) => {
            d["words"][topic] = d["words"][topic]
                .slice(0,top);
            d["words"][topic].sort(function(a, b){//sort the terms by frequency
                return b.sudden-a.sudden})
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
                return { ...word, sudden: (word.frequency + 1) / (prev + 1) };
            });
        }
    });
    return data;
}
function replaceText(text){
    return text.replace(/[^a-zA-Z0-9]/g,'_');
}

function tfidf(data){
    var topics = d3.keys(data[0]["words"]);
    // get total frequency for each month -> tf
    var docFreq = [];
    var bags = [];
    data.forEach((month,i) => {
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
    data.forEach((month,i) => {
        var words = month["words"];
        topics.forEach(topic => {
            words[topic].forEach((d) => {
                text = d["text"];
                var df = 0;
                // calculate df in bags
                bags.forEach((bag) => {
                    for (var word in bag){
                        if (bag[word] == text){
                            df += 1;
                            break;
                        }
                    }
                });

                var tf = d["frequency"]/docFreq[i];
                var idf = Math.log10(N/df);
                d.tf_idf = tf*idf;
            })
        })
    });
    return data;
}

function getUniqueValues(array) {
    return array.filter((value, index, array) => array.indexOf(value) === index)
}

function processRawFrequencyItems(counts, timestepFieldName, categoryFieldName, frequencyFieldName, textFieldName) {
    const seasons = getUniqueValues(counts.map(entry => entry[timestepFieldName]));
    const categories = getUniqueValues(counts.map(entry => entry[categoryFieldName]));

    const words = seasons.map((season, season_index) => {
        const seasonData = counts.filter(entry => entry[timestepFieldName] === season);
        const seasonWordsPerCategory = categories
            .map(category => [
                category,
                seasonData
                    .filter(entry => entry[categoryFieldName] === category)
                    .map(entry => {
                        return {
                            text: entry[textFieldName],
                            frequency: +entry[frequencyFieldName],
                            sudden: 1,
                            topic: category,
                            id: entry[textFieldName].toLowerCase().replace("-", "_").replace(" ", "_") + "_" + season_index
                        };
                    })
                    .sort((a, b) => b.frequency - a.frequency) // sort by frequency
            ]);
        
        return {
            date: season,
            words: Object.fromEntries(seasonWordsPerCategory)
        };
    });
    return words;
}

function loadBasketballDataset(draw, numTopWords, selectedCountries) {
    const path = "data/basketball.json";
    d3.json(path, (error, data) => {
        if (error) {
            throw new Error("failed to retrieve basketball data from server", error);
        }

        console.log("retrieved basketball dataset", data);

        const states = getUniqueValues(data.per_state_counts.map(entry => entry.state));
        
        const selectedCountriesAllowed = selectedCountries
            .map(country => (states.includes(country)) || (country === "_overall"))
            .reduce((includes1, includes2) => includes1 && includes2);
        if (!selectedCountriesAllowed) {
            throw new Error("cannot WordStream for some selected countries", selectedCountries);
        }

        const selectedPerStateData = selectedCountries
            .map(country => {
                if (country === "_overall") {
                    return data.overall_counts;
                }
                return data.per_state_counts.filter(entry => entry.state === country);
            });

        const selectedWords = selectedPerStateData
            .map(records => processRawFrequencyItems(records, "season_id", "position", "count", "full_name"));

        let selectedWordsToDraw = selectedWords.map(words => words.filter(entry => entry.date < 2006));
        selectedWordsToDraw.forEach(words => processSudden(words));
        selectedWordsToDraw = selectedWordsToDraw.map(words => getTop(words, categories, numTopWords));

        const wordsToDrawWithLabels = selectedWordsToDraw.map((words, index) => [selectedCountries[index], words]);
        const wordsToDrawObject = Object.fromEntries(wordsToDrawWithLabels);

        //let dataToDraw = words.filter(entry => entry.date < 2006);
        //processSudden(dataToDraw);
        //dataToDraw = getTop(dataToDraw, categories, numTopWords);

        totalData = wordsToDrawObject;

        draw(wordsToDrawObject, true);
    });
}


function loadUnderlyingCausesOfDeathDataset(draw, numTopWords, selectedCountries) {
    let path = "data/UCD_1999_2020.txt";

    d3.tsv(path, function(error, rawData) {
        console.log(rawData);
        
        categories = getUniqueValues(Object.values(REMAPPING_UCD).map(entry => entry.category));
        rawData = rawData.map(entry => {
            const code = entry["ICD-10 113 Cause List Code"];
            return {
                state: entry.State,
                year: entry.Year,
                deaths: entry.Deaths,
                text: REMAPPING_UCD[code].name,
                category: REMAPPING_UCD[code].category,
            };
        });

        const dataPerSelectedCountry = selectedCountries.map(countryName => {
            if (countryName === "_overall") {
                return rawData;
            } else {
                return rawData.filter(data => data.state === countryName);
            }
        });


        const words = dataPerSelectedCountry
            .map(stateData => processRawFrequencyItems(stateData, "year", "category", "deaths", "text"));
        
        //let selectedWordsToDraw = selectedWords.map(words => words.filter(entry => entry.date < 2006));
        //selectedWordsToDraw = words;

        let selectedWordsToDraw = words.map(words => words.filter(entry => entry.date < 2012));
        selectedWordsToDraw.forEach(selectedWords => processSudden(selectedWords));
        selectedWordsToDraw = selectedWordsToDraw.map(words => getTop(words, categories, numTopWords));
        
        const wordsToDrawWithLabels = selectedWordsToDraw.map((words, index) => [selectedCountries[index], words]);
        const wordsToDrawObject = Object.fromEntries(wordsToDrawWithLabels);
    
        totalData = wordsToDrawObject;

        draw(wordsToDrawObject, true);
        console.log("done");
    });
}

function loadDiseasesDataset(draw, numTopWords, selectedCountries) {
    //TODO
    
    let path = "data/nndss_2016_2020.txt";

    d3.tsv(path, function(error, rawData) {
        console.log(rawData);
        
        const mockCategories = ["Cat", "Doggo", "Hooman"];
        categories = mockCategories;
        rawData = rawData.map(entry => {
            return {
                ...entry,
                category: mockCategories[Math.floor(Math.random() * mockCategories.length)]
            };
        });

        //TODO categories: heart disease, respiratory disease, brain disease, other

        const dataPerSelectedCountry = selectedCountries.map(countryName => {
            if (countryName === "_overall") {
                return rawData;
            } else {
                return rawData.filter(data => data.State === countryName);
            }
        });


        const words = dataPerSelectedCountry
            .map(stateData => processRawFrequencyItems(stateData, "Year", "category", "Deaths", "ICD-10 113 Cause List Code"));
        
        //let selectedWordsToDraw = selectedWords.map(words => words.filter(entry => entry.date < 2006));
        //selectedWordsToDraw = words;

        let selectedWordsToDraw = words.map(words => words.filter(entry => entry.date < 2022));
        selectedWordsToDraw.forEach(selectedWords => processSudden(selectedWords));
        selectedWordsToDraw = selectedWordsToDraw.map(words => getTop(words, categories, numTopWords));
        
        const wordsToDrawWithLabels = selectedWordsToDraw.map((words, index) => [selectedCountries[index], words]);
        const wordsToDrawObject = Object.fromEntries(wordsToDrawWithLabels);
    
        totalData = wordsToDrawObject;

        draw(wordsToDrawObject, true);
    });
}