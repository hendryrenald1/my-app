const express = require("express");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const admin = require("firebase-admin");
const dotenv = require('dotenv');


dotenv.config();

// Initialize Firebase Admin SDK for verifying tokens
const serviceAccount = require("./firebase-service-account.json"); // Download this from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Neo4j connection
const driver = neo4j.driver(
   "neo4j+s://0aee5d59.databases.neo4j.io", // Replace with your Neo4j AuraDB URI
  neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD) // Replace with your credentials
);

console.log(process.env.NEO4J_PASSWORD);
const session = driver.session();

console.log('Connected to Neo4j')
const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase tokens
const authenticate = async (req, res, next) => {
  console.log('Inside Authentication')
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

// Example route: Add a family member
app.post("/add-family-member", authenticate, async (req, res) => {
  console.log(req)
  const { name, dob, gender, parents = [] } = req.body;

  try {
    const result = await session.run(
      `CREATE (n:FamilyMember {name: $name, dob: $dob, gender: $gender}) RETURN n`,
      { name, dob, gender }
    );

    const createdNode = result.records[0].get("n");
    const memberId = createdNode.identity.low; // Get Neo4j node ID

    // Link parents (if provided)
    for (const parentId of parents) {
      await session.run(
        `MATCH (p:FamilyMember), (c:FamilyMember) 
         WHERE id(p) = $parentId AND id(c) = $memberId
         CREATE (p)-[:PARENT]->(c)`,
        { parentId: parseInt(parentId), memberId }
      );
    }

    res.status(201).send({ id: memberId, message: "Family member added!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding family member");
  }
});

// Example route: Get all descendants
app.get("/descendants/:id", authenticate, async (req, res) => {
  const memberId = parseInt(req.params.id);
  console.log(memberId)

  try {
    const result = await session.run(
      `MATCH (m:FamilyMember)-[:PARENT*]->(descendant) 
       WHERE id(m) = $memberId 
       RETURN descendant`,
      { memberId }
    );

    const descendants = result.records.map((record) => record.get("descendant").properties);
    console.log(descendants);
    res.status(200).send(descendants);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving descendants");
  }
});


// Route: User registration
app.post('/register', async (req, res) => {
  const { username, password, displayName, email } = req.body;

  // if (!username || !password) {
  //   return res.status(400).json({ message: 'Username and password are required.' });
  // }

  try {
    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in Neo4j
    await session.run(
      'CREATE (u:User {displayName: $displayName, email: $email}) RETURN u',
      { username, password, displayName, email }
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (
      error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed' &&
      error.message.includes('already exists with label `User` and property `email`')
    ) {
      res.status(409).send({ error: 'User with this email already exists' });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
});


// Route to get all branches 
app.get('/branches',  async (req, res) => {
   try {
    const session = driver.session();
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * parseInt(limit, 10);
    const result = await session.run(
      `MATCH (b:Branches) 
       RETURN id(b) as id, b.name as name, b.address_line_1 as address_line_1, b.town as town, b.county as county, b.post_code as post_code 
       SKIP ${skip} LIMIT ${limit}`
    );

    const countResult = await session.run(
      `MATCH (b:Branches) 
       RETURN count(b) as totalCount`
    );

    const totalCount = countResult.records[0].get('totalCount').low;
    const branches = result.records.map(record => ({
      id: record.get('id').low,
      name: record.get('name'),
      address_line_1: record.get('address_line_1'),
      town: record.get('town'),
      county: record.get('county'),
      postcode: record.get('post_code')
    }));

    res.status(200).json({ branches, totalCount });
   } catch (error) {
    console.error("Error fetching branches:", error);
    throw new Error("Failed to fetch branches.");
} finally {
    await session.close();
}
});


// Route to check if the service is active
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Service is active' });
});



// Close session on app exit
process.on('exit', () => {
  session.close();
  driver.close();
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
