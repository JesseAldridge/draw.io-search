

const content_xml = fs.readFileSync('data/test-inflated.xml', 'utf8');
const graph_models = cheerio.load(content_xml);
