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
app.get('/branches', authenticate, async (req, res) => {
  try {
    const session = driver.session();
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * parseInt(limit, 10);
    const result = await session.run(

      `MATCH (b:Branches)
OPTIONAL MATCH (b)-[r:PASTOR]->(m:Member)
RETURN 
    b.branch_id as branch_id,
    b.name AS name, 
    b.address_line_1 AS address_line_1, 
    b.town AS town, 
    b.county AS county, 
    b.post_code AS post_code, 
    COALESCE(m.member_id, "N/A") AS pastor_id, 
    COALESCE(m.name, "No Pastor Assigned") AS pastor_name, 
    COALESCE(TYPE(r), "No Relationship") AS relationship
       SKIP ${skip} LIMIT ${limit}`


      // `MATCH (b:Branches) 
      //  RETURN id(b) as id, b.name as name, b.address_line_1 as address_line_1, b.town as town, b.county as county, b.post_code as post_code 
      //  SKIP ${skip} LIMIT ${limit}`
    );

    const countResult = await session.run(
      `MATCH (b:Branches) 
       RETURN count(b) as totalCount`
    );

    const totalCount = countResult.records[0].get('totalCount').low;
    const branches = result.records.map(record => ({
      branch_id: record.get('branch_id'),
      name: record.get('name'),
      address_line_1: record.get('address_line_1'),
      town: record.get('town'),
      county: record.get('county'),
      postcode: record.get('post_code'),
      pastor_id: record.get('pastor_id'),
      pastor_name: record.get('pastor_name'),
    }));

    res.status(200).json({ branches, totalCount });
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw new Error("Failed to fetch branches.");
  } finally {
    await session.close();
  }
});


// Get all members

app.get('/members', async (req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(
      `Match (m:Member) RETURN m.member_id as member_id, m.name as member_name`
    );
    const members = result.records.map(record => ({
      member_id: record.get('member_id'),
      member_name: record.get('member_name'),

    }));

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members.");
  } finally {
    await session.close();
  }
});


// Route to get a branch by ID
app.get('/branches/:id', async (req, res) => {
  const session = driver.session();

  const { id } = req.params;
  console.log('Branch ID' + id)
  try {
    const result = await session.run(
      `MATCH (b:Branches)
WHERE b.branch_id = "${id}"
OPTIONAL MATCH (b)-[r:PASTOR]->(m:Member)
RETURN 
    b.branch_id as branch_id,
    b.name AS name, 
    b.address_line_1 AS address_line_1, 
    b.town AS town, 
    b.county AS county, 
    b.post_code AS post_code, 
    COALESCE(m.member_id, "N/A") AS pastor_id, 
    COALESCE(m.name, "No Pastor Assigned") AS pastor_name, 
    COALESCE(TYPE(r), "No Relationship") AS relationship`

      //`MATCH (b:Branches) WHERE id(b) = ${id}
      //  RETURN id(b) as id, b.name as name, b.address_line_1 as address_line_1, b.town as town, b.county as county, b.post_code as post_code`  

    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const record = result.records[0];
    const branch = {
      branch_id: record.get('branch_id'),
      name: record.get('name'),
      address_line_1: record.get('address_line_1'),
      town: record.get('town'),
      county: record.get('county'),
      postcode: record.get('post_code'),
      pastor_id: record.get('pastor_id'),
      pastor_name: record.get('pastor_name'),
      relationship: record.get('relationship')
    };

    res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).send("Failed to fetch branch.");
  }
});


// Route to get Member by ID


app.get('/member/:id', async (req, res) => {
  const session = driver.session();

  const { id } = req.params;

  try {
    const result = await session.run(
      `MATCH (m:Member) where m.member_id = "${id}"
    RETURN m.member_id as member_id, m.name as member_name `

    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const record = result.records[0];
    const member = {
      member_id: record.get('member_id'),
      member_name: record.get('member_name')
    };

    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).send("Failed to fetch member.");
  }
});

// Route to update a branch by ID
app.put('/branches/:id', async (req, res) => {
  const session = driver.session();
  const { id } = req.params;
  const { name, address_line_1, town, county, postcode } = req.body;

  try {
    const result = await session.run(
      `MATCH (b:Branches) WHERE id(b) = ${id}
       SET b.name = "${name}", b.address_line_1 = "${address_line_1}", b.town = "${town}", b.county = "${county}", b.post_code = "${postcode}"
       RETURN id(b) as id, b.name as name, b.address_line_1 as address_line_1, b.town as town, b.county as county, b.post_code as postcode`
    );


    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const record = result.records[0];
    const updatedBranch = {
      id: record.get('id').low,
      name: record.get('name'),
      address_line_1: record.get('address_line_1'),
      town: record.get('town'),
      county: record.get('county'),
      postcode: record.get('postcode')
    };

    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).send("Failed to update branch.");
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
