import stringify from 'csv-stringify';

export const createReport = async (guid) => {
  const someData = [
    {
      "Country": "Nigeria",
      "Population": "200m",
      "Continent": "Africa",
      "Official Language(s)": "English"
    },
    {
      "Country": "India",
      "Population": "1b",
      "Continent": "Asia",
      "Official Language(s)": "Hindi, English"
    },
    {
      "Country": "United States of America",
      "Population": "328m",
      "Continent": "North America",
      "Official Language": "English"
    },
    {
      "Country": "United Kingdom",
      "Population": "66m",
      "Continent": "Europe",
      "Official Language": "English"
    },
    {
      "Country": "Brazil",
      "Population": "209m",
      "Continent": "South America",
      "Official Language": "Portugese"
    }
  ]

  const data = await stringify(someData, {header: true});
  return data;
};
