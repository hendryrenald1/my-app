const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
dotenv.config();

// Neo4j driver configuration
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();


const getAllBranches = async () => {
    try {
        const result = await session.run(
        'MATCH (b:Branch) RETURN b'
        );
        return result.records.map(record => {
        return record.get('b').properties;
        });
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw new Error("Failed to fetch branches.");
    } finally {
        await session.close();
    }
    };


module.exports = { getAllBranches };
