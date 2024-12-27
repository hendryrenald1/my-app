const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');
dotenv.config();

// Neo4j driver configuration
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

const getFamilyTree = async (personId) => {
  try {
    const result = await session.run(
      'MATCH (p:Person {id: $personId})-[:PARENT_OF]->(children) RETURN p, children ORDER BY children.name',
      { personId }
    );
    return result.records.map(record => {
      return {
        parent: record.get('p').properties,
        children: record.get('children').properties
      };
    });
  } catch (error) {
    console.error("Error fetching family tree:", error);
    throw new Error("Failed to fetch family tree.");
  } finally {
    await session.close();
  }
};

module.exports = { getFamilyTree };
